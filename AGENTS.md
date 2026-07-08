# AGENTS.md

## Project

JANUS — Frontend (landing + editor apps). Static HTML/CSS/JS — no build, no deps.
Deployed on Vercel. Backend runs on user's local machine, exposed via Cloudflare Tunnel.

## Deployment

- **Vercel** — auto-deploys on push to `main`
- **URL**: `janus-landing-red.vercel.app`
- Framework preset: **Other** (static)

## Architecture

```
Vercel (janus-landing-red.vercel.app)
├── /              → Landing page (index.html + style.css + app.js)
├── /app           → Editor de doblaje (frontend/index.html + app.js)
└── /studio        → Studio editor (frontend_studio/index.html + app.js)
         │
         │  API calls via fetch() → Cloudflare Tunnel
         ▼
User's PC (localhost:8000) — FastAPI backend
```

```
janus-landing/
├── index.html        ← Landing page (marketing)
├── style.css         ← White + gold palette (#d4a853, #f0c040)
├── app.js            ← CTA buttons → JANUS_APP_URL (/app)
├── assets/           ← Images, demo gifs
├── frontend/
│   ├── index.html    ← Editor de doblaje
│   ├── app.js        ← (from Traductor repo)
│   └── style.css     ← Dark glassmorphism theme
├── frontend_studio/
│   ├── index.html    ← Studio editor standalone
│   ├── app.js        ← (from Traductor repo)
│   └── style.css     ← Shared dark theme
└── vercel.json       ← Rewrites for /app and /studio
```

## Plan Pendiente: Separar Frontend del Backend

### Estado: ⏳ PLANEADO — pendiente de ejecución

### Objetivo
Mover `frontend/` y `frontend_studio/` del repo `TRADUCTOR` al repo `janus-landing` para que Vercel sirva todo el frontend. El backend FastAPI solo sirve APIs en `localhost:8000`, expuesto por Cloudflare Tunnel.

### Pasos

**1. Backend (TRADUCTOR) — Permisos CORS**
- Agregar `CORSMiddleware` en `main.py` permitiendo `https://janus-landing-red.vercel.app`
- Asegurar que `/cache/*` y `/api/stream/*` tengan headers CORS

**2. Copiar frontend al landing**
- Copiar `Traductor/frontend/` → `janus-landing/frontend/`
- Copiar `Traductor/frontend_studio/` → `janus-landing/frontend_studio/`

**3. Configurar API_BASE en frontend**
- Agregar `const API_BASE = 'TUNNEL_URL'` al inicio de ambos `app.js`
- Reemplazar todas las URLs hardcodeadas:
  - `fetch('/api/...')` → `fetch(API_BASE + '/api/...')`
  - `` fetch(`/api/...) `` → `` fetch(`${API_BASE}/api/...) ``
  - `` videoPlayer.src = `/api/stream/...` `` → `` `${API_BASE}/api/stream/...` ``
  - `` src="/cache/..." `` → `` `${API_BASE}/cache/..." ``

**4. Agregar vercel.json**
```json
{
  "rewrites": [
    { "source": "/app/(.*)", "destination": "/frontend/$1" },
    { "source": "/studio/(.*)", "destination": "/frontend_studio/$1" }
  ]
}
```

**5. Actualizar landing app.js**
- Cambiar `JANUS_APP_URL` del tunnel URL a `'https://janus-landing-red.vercel.app/app'`
- Ahora los botones "Probar ahora" abren el editor en el mismo dominio

### URLs a reemplazar (por archivo)

**`frontend/app.js`** (~35 URLs): Patrones con fetch, template literals, xhr, videoPlayer.src
**`frontend_studio/app.js`** (~30 URLs): Patrones con fetch, template literals, videoPlayer.src
**`frontend/index.html`**: `src="/cache/..."` en elementos estáticos (si existen)

### Notas técnicas

- **Streaming**: `/api/stream/{task_id}` con Range requests (206 Partial Content) funciona a través de CORS sin cambios adicionales
- **Archivos estáticos**: `/cache/*` montado como `StaticFiles` en FastAPI; CORS middleware agrega headers automáticamente
- **Tunnel URL**: No es fija (cambia al reiniciar cloudflared). Debe actualizarse en `API_BASE` cuando cambie
- **Alternativa futura**: Usar Cloudflare Tunnel con nombre fijo (DNS record) para evitar URL variables

## Key Facts

- `JANUS_APP_URL` in `app.js` apunta a `/app` en el mismo dominio (Vercel)
- El frontend se comunica con el backend via `API_BASE` apuntando al tunnel
- La URL del tunnel cambia al reiniciar cloudflared — actualizar `API_BASE`
- All `.btn-primary` elements redirect to the app
- Fonts: Playfair Display (headings) + Inter (body) from Google Fonts CDN (landing)
- Fonts: Outfit + Plus Jakarta Sans from Google Fonts CDN (editor/studio)
- El editor usa tema oscuro glassmorphism; el landing usa tema claro dorado/blanco
- Proyectos separados: este repo NO contiene el backend

## When Editing

- Landing: maintain white/gold color scheme (see CSS variables in `style.css`)
- Editor: maintain dark glassmorphism with neon accents (see `frontend/style.css`)
- Keep the 3-step flow (paste URL → click start → get dubbed video) as the core message
- Separate project from TRADUCTOR backend repo — do NOT mix backend code here
