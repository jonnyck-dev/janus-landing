// JANUS — Webhook de Lemon Squeezy (Vercel Serverless Function).
//
// FLUJO: Lemon Squeezy manda el evento de pago aqui -> se crea/encuentra el
// usuario en Supabase (email sin confirmar) -> se inserta el credito.
// Asi el pago -> credito funciona en la nube de Vercel, SIN depender de tu PC.
//
// Configuracion:
//  1. En Vercel (Project -> Settings -> Environment Variables):
//       SUPABASE_URL                 (ej. https://xxxx.supabase.co)
//       SUPABASE_SERVICE_ROLE_KEY    (la service key, nunca la anon)
//       LEMONSQUEEZY_WEBHOOK_SECRET  (Signing secret del webhook en LS)
//  2. En Lemon Squeezy (Settings -> Webhooks):
//       URL: https://www.janusdubber.website/api/lemon-webhook
//       Eventos: order_created
//  3. Rellena VARIANT_ID_MAP con los ids de variante de tus 3 productos.

const crypto = require('crypto');

// Deshabilitar el body parser de Vercel: necesitamos el body CRUDO para
// verificar la firma HMAC (re-stringify de req.body rompe la firma).
module.exports.config = { api: { bodyParser: false } };

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Lee el body crudo desde el stream (correcto para la verificación de firma)
  const raw = await getRawBody(req);
  const signature = req.headers['x-signature'] || '';
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!secret || !raw || !verifySignature(raw, signature, secret)) {
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }

  let event;
  try { event = JSON.parse(raw); }
  catch (e) { res.status(400).json({ error: 'Bad JSON' }); return; }

  const eventName = event.meta && event.meta.event_name;
  if (eventName !== 'order_created' && eventName !== 'order_refunded') {
    res.status(200).json({ received: eventName });
    return;
  }

  const a = (event.data && event.data.attributes) || {};
  const email = a.customer_email;
  const name = a.customer_name || null;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    res.status(500).json({ error: 'Server not configured' });
    return;
  }

  try {
    if (eventName === 'order_refunded') {
      // Revoca los créditos activos del cliente (marca como used).
      const userId = await findUser(supabaseUrl, serviceKey, email);
      if (userId) await revokeCredits(supabaseUrl, serviceKey, userId);
      res.status(200).json({ ok: true, revoked: !!userId });
      return;
    }

    const variantId = a.first_order_item && a.first_order_item.variant_id;
    const plan = VARIANT_ID_MAP[String(variantId)];

    if (!email || !plan) {
      res.status(200).json({ received: true, ignored: true, email: email, variant: variantId });
      return;
    }

    const userId = await ensureUser(supabaseUrl, serviceKey, email, name);
    await grantCredit(supabaseUrl, serviceKey, userId, plan);
    await releasePendingJobs(supabaseUrl, serviceKey, userId);
    res.status(200).json({ ok: true, userId: userId, plan: plan });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}

// Mapea el id de variante de Lemon Squeezy a tu plan.
const VARIANT_ID_MAP = {
  '2005128': 'essential',    // Pase Esencial
  '2005144': 'multivoice',   // Pase Multi-Voz
  '2005148': 'global',       // Pase Global
};

async function getRawBody(req) {
  // 1) Leer del stream (correcto; el body parser está deshabilitado)
  try {
    const body = await new Promise(function (resolve) {
      var chunks = [];
      var got = false;
      req.on('data', function (c) { got = true; chunks.push(Buffer.from(c)); });
      req.on('end', function () { resolve(got ? Buffer.concat(chunks).toString('utf8') : null); });
      req.on('error', function () { resolve(null); });
    });
    if (body) return body;
  } catch (e) {}
  // 2) Fallback: req.body si viene como string crudo
  if (typeof req.body === 'string') return req.body;
  // 3) Último recurso: re-stringify (puede fallar la firma, pero intenta)
  if (req.body) return JSON.stringify(req.body);
  return null;
}

function verifySignature(raw, signature, secret) {
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(raw).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function findUser(base, key, email) {
  if (!email) return null;
  const listRes = await fetch(base + '/auth/v1/admin/users?email=' + encodeURIComponent(email), {
    headers: authHeaders(key),
  });
  const list = await listRes.json();
  if (list.users && list.users.length) return list.users[0].id;
  return null;
}

async function ensureUser(base, key, email, name) {
  const existing = await findUser(base, key, email);
  if (existing) return existing;
  const createRes = await fetch(base + '/auth/v1/admin/users', {
    method: 'POST',
    headers: { ...authHeaders(key), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      email_confirm: false,
      user_metadata: name ? { full_name: name } : {},
    }),
  });
  const created = await createRes.json();
  if (created.id) return created.id;
  throw new Error('No se pudo crear el usuario: ' + JSON.stringify(created));
}

async function grantCredit(base, key, userId, plan) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const res = await fetch(base + '/rest/v1/user_credits', {
    method: 'POST',
    headers: {
      ...authHeaders(key),
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      user_id: userId,
      plan: plan,
      status: 'available',
      expires_at: expires,
    }),
  });
  if (!res.ok) throw new Error('Fallo al insertar el credito: ' + res.status);
}

async function revokeCredits(base, key, userId) {
  const res = await fetch(base + '/rest/v1/user_credits?user_id=eq.' + userId + '&status=eq.available', {
    method: 'PATCH',
    headers: {
      ...authHeaders(key),
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      status: 'expired',
      used_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error('Fallo al revocar creditos: ' + res.status);
}

// Después de un pago confirmado, pasa los trabajos "esperando pago"
// del usuario a "en cola" para que aparezcan en el panel del admin.
async function releasePendingJobs(base, key, userId) {
  const res = await fetch(base + '/rest/v1/dub_jobs?user_id=eq.' + userId + '&status=eq.pending_payment', {
    method: 'PATCH',
    headers: {
      ...authHeaders(key),
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      status: 'pending',
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error('Fallo al liberar trabajos pendientes: ' + res.status);
}

function authHeaders(key) {
  return { apikey: key, Authorization: 'Bearer ' + key };
}
