// JANUS — Notificación por email al admin cuando un trabajo pasa a 'pending'.
// Disparado por el trigger de Supabase (pg_net) con header `Authorization: Bearer`.
// Envía vía iCloud SMTP (smtp.mail.me.com:587, STARTTLS) — sin dependencias externas.
//
// Env vars necesarias:
//   SUPABASE_WEBHOOK_SECRET    -> el secreto compartido con el trigger (Bearer)
//   ICLOUD_SMTP_USER           -> tu @icloud.com principal (ej. jonnyck.dev@icloud.com)
//   ICLOUD_SMTP_APP_PASSWORD   -> app-specific password de Apple ID
//   ICLOUD_FROM                -> remitente (support@janusdubber.website)
//   ADMIN_NOTIFY_TO            -> destinatario (admin@janusdubber.website)

const net = require('net');
const tls = require('tls');
const crypto = require('crypto');

function safeText(s, max) {
  return String(s == null ? '' : s).replace(/[\r\n]+/g, ' ').slice(0, max || 2000);
}

function verifySecret(auth, secret) {
  const expected = 'Bearer ' + secret;
  const a = Buffer.from(auth);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function b64(s) {
  return Buffer.from(s, 'utf8').toString('base64');
}

function smtpSend(host, port, user, pass, from, to, subject, text) {
  return new Promise(function (resolve, reject) {
    var sock = net.connect(port, host);
    var buf = '';
    var cmd = 0; // 0 greeting,1 ehlo,2 starttls,3 ehlo2,4 auth,5 from,6 rcpt,7 data,8 body,9 quit
    var tlsSock = null;
    var done = false;

    function current() { return tlsSock || sock; }

    function write(line) { current().write(line + '\r\n'); }

    function onData(chunk) {
      buf += chunk.toString('utf8');
      if (buf.indexOf('\r\n') === -1) return;
      handle(buf);
      buf = '';
    }

    function fail(err) {
      if (done) return;
      done = true;
      try { if (tlsSock) tlsSock.end(); } catch (e) {}
      try { sock.end(); } catch (e) {}
      reject(err);
    }

    var CMD_LABEL = ['greeting', 'ehlo', 'starttls', 'ehlo2', 'auth', 'mail-from', 'rcpt-to', 'data', 'body', 'quit'];

    function handle(response) {
      var lines = response.trim().split('\r\n');
      var last = lines[lines.length - 1];
      var code = last.slice(0, 3);
      if (code[0] === '4' || code[0] === '5') {
        fail(new Error('SMTP [' + (CMD_LABEL[cmd] || cmd) + '] ' + response.trim()));
        return;
      }

      switch (cmd) {
        case 0: cmd = 1; write('EHLO janus-landing'); break;
        case 1: cmd = 2; write('STARTTLS'); break;
        case 2:
          cmd = 3;
          sock.removeListener('data', onData);
          tlsSock = tls.connect({ socket: sock, rejectUnauthorized: true });
          tlsSock.on('data', onData);
          tlsSock.on('error', fail);
          tlsSock.on('secureConnect', function () { write('EHLO janus-landing'); });
          break;
        case 3: cmd = 4; write('AUTH PLAIN ' + b64('\0' + user + '\0' + pass)); break;
        case 4: cmd = 5; write('MAIL FROM:<' + from + '>'); break;
        case 5: cmd = 6; write('RCPT TO:<' + to + '>'); break;
        case 6: cmd = 7; write('DATA'); break;
        case 7: {
          cmd = 8;
          var body = [
            'From: ' + from,
            'To: ' + to,
            'Subject: ' + subject,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            text
          ].join('\r\n');
          // SMTP dot-stuffing: cualquier línea que empiece con '.' se duplica
          body = body.split('\r\n').map(function (l) { return l.charAt(0) === '.' ? '.' + l : l; }).join('\r\n');
          write(body + '\r\n.');
          break;
        }
        case 8: cmd = 9; write('QUIT'); break;
        case 9:
          done = true;
          try { if (tlsSock) tlsSock.end(); } catch (e) {}
          try { sock.end(); } catch (e) {}
          resolve(true);
          break;
      }
    }

    sock.on('data', onData);
    sock.on('error', fail);
    sock.on('close', function () { if (!done) fail(new Error('SMTP connection closed')); });
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const secret = process.env.SUPABASE_WEBHOOK_SECRET;
  const auth = req.headers['authorization'] || '';
  console.log('[notify-admin]', {
    hasSecret: !!secret,
    authOk: secret ? verifySecret(auth, secret) : false,
    authPrefix: String(auth).slice(0, 14)
  });
  if (!secret || !verifySecret(auth, secret)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  let payload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    res.status(400).json({ error: 'Bad JSON' });
    return;
  }

  const record = (payload && payload.record) || {};
  if (record.status !== 'pending') {
    res.status(200).json({ ok: true, ignored: true });
    return;
  }

  const url = safeText(record.video_url, 2000);
  const clientEmail = safeText(record.email, 200);
  const createdAt = record.created_at ? String(record.created_at).slice(0, 40) : '';

  const user = process.env.ICLOUD_SMTP_USER;
  const pass = process.env.ICLOUD_SMTP_APP_PASSWORD;
  const from = process.env.ICLOUD_FROM || 'support@janusdubber.website';
  const to = process.env.ADMIN_NOTIFY_TO || 'admin@janusdubber.website';
  console.log('[notify-admin] smtp config', { hasUser: !!user, hasPass: !!pass, from, to });
  if (!user || !pass) {
    res.status(500).json({ error: 'Server not configured' });
    return;
  }

  const subject = 'Nuevo video en cola - JANUS';
  const text = [
    'Nuevo video en cola de doblaje.',
    '',
    'Cliente: ' + (clientEmail || '-'),
    'Video: ' + (url || '-'),
    'Fecha: ' + (createdAt || '-'),
    '',
    'Gestionar: https://www.janusdubber.website/adminpanel'
  ].join('\n');

  try {
    await smtpSend('smtp.mail.me.com', 587, user, pass, from, to, subject, text);
    console.log('[notify-admin] email SENT to', to);
    res.status(200).json({ ok: true, sent: true });
  } catch (err) {
    console.log('[notify-admin] email FAILED:', err && err.message);
    res.status(500).json({ error: err && err.message ? err.message : 'Email failed' });
  }
};
