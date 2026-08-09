// Janus Fallback Worker
// Ruta: app.janusdubber.website/*
// Si el tunel (PC local) esta caido, sirve una pagina de mantenimiento.
// Si el tunel responde, reenvia el trafico tal cual (preserva streaming).

const TUNNEL_HOST = "dc2fdc12-5440-471a-9a7b-dddb7ae98030.cfargotunnel.com";
const TIMEOUT_MS = 5000;

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JANUS - Recargando energia</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b0f19;
    color: #e8eaf2;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    text-align: center;
    padding: 20px;
  }
  .card { max-width: 520px; }
  .flame {
    font-size: 80px;
    display: inline-block;
    animation: burn 1.2s ease-in-out infinite;
  }
  @keyframes burn {
    0%, 100% { transform: scale(1) rotate(-3deg); }
    50% { transform: scale(1.15) rotate(3deg); }
  }
  .coals { font-size: 36px; margin-top: 4px; letter-spacing: 4px; }
  h1 { font-size: 26px; margin: 18px 0 10px; font-weight: 700; }
  p { font-size: 17px; line-height: 1.55; color: #aab2c5; }
  .pill {
    display: inline-block;
    margin-top: 22px;
    padding: 8px 18px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 14px;
    color: #7ee787;
  }
  .pill.loading { animation: pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
</style>
</head>
<body>
  <div class="card">
    <div class="flame">🛌</div>
    <div class="coals">⛏️ 🔥 ⛏️</div>
    <h1>La PC esta en modo siesta</h1>
    <p>Mientras tanto, el equipo de JANUS le echa carbon a la caldera.<br>Volvemos en unos minutos.</p>
    <div class="pill loading">Recargando energia...</div>
  </div>
</body>
</html>`;

const MAINTENANCE_JSON = {
  status: "maintenance",
  message: "🛌 La PC esta en modo siesta. Mientras tanto, el equipo de JANUS le echa carbon a la caldera ⛏️🔥",
};

function isMaintenanceStatus(res) {
  // Argo tunnel down: excepcion de fetch o HTTP 530/1033
  return res.status === 530 || res.status === 1033;
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const tunnelUrl = "https://" + TUNNEL_HOST + url.pathname + url.search;

  const headers = new Headers(request.headers);
  headers.set("Host", url.host);
  headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));
  headers.delete("cf-connecting-ip");
  headers.delete("cf-ray");

  let upstream;
  try {
    upstream = await fetch(tunnelUrl, {
      method: request.method,
      headers: headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    return maintenanceResponse(url);
  }

  if (isMaintenanceStatus(upstream)) {
    return maintenanceResponse(url);
  }

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.set("Access-Control-Allow-Origin", "*");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

function maintenanceResponse(url) {
  if (url.pathname.startsWith("/api/")) {
    return new Response(JSON.stringify(MAINTENANCE_JSON), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" },
    });
  }
  return new Response(MAINTENANCE_HTML, {
    status: 503,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
