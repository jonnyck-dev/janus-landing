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
├── index.html        ← Landing page (marketing + pricing)
├── style.css         ← White + gold palette (#d4a853, #f0c040)
├── app.js            ← CTA buttons → JANUS_APP_URL (/app)
├── auth.js           ← Supabase auth; CTAs usan clase .janus-cta o ids btn-nav-try/btn-hero-try
├── calculator.js     ← ROI calculator → tabla roi_leads en Supabase
├── legal.html        ← Términos, reembolsos, cancelación, promociones (Stripe compliance)
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

## Auth UI (Supabase)

- **Chip de usuario en navbar**: `#janus-nav-user` (avatar + nombre) reemplaza a `btn-nav-try` cuando hay sesión. El avatar viene de `profiles.avatar_url` (imagen de Google vía OAuth), con fallback a inicial.
- **Menú**: click en el chip → dropdown con "Mi perfil" (`janusOpenProfile`) y "Cerrar sesión" (`janusLogout`).
- **Modal de perfil**: edita `profiles.full_name`, email (vía `auth.updateUser`, requiere confirmación por correo) y contraseña (`auth.updateUser`).
- `janusRenderNav(session)` se llama en `onAuthStateChange` (SIGNED_IN/SIGNED_OUT) y al cargar la página.

## Stripe Compliance (2026-08)

- **Empresa**: `jonnyck-org` — debe aparecer en footer y legal.html. NUNCA renombrar a otra cosa.
- **Contacto**: `jonnyck.dev@icloud.com` (footer + legal.html#contacto).
- **Políticas** en `legal.html` con anchors: `#terminos`, `#reembolsos`, `#cancelacion`, `#promociones`, `#restricciones`. El footer linkea a estos anchors — mantenerlos si se edita legal.html.
- **Pricing**: 3 planes por video (Esencial $5 / Multi-Voz $25 / Global $45), hasta 40 min cada uno. Fuente de verdad: sección `#pricing` en index.html. Si cambian precios o features, actualizar también las políticas de reembolso si aplica.

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
- Tipografía: Playfair Display (headings) + Inter (body) + IBM Plex Mono (labels/eyebrows/detalles técnicos)
- NO usar emojis en títulos de sección ni como iconos de features — usar números mono (01, 02...) y `.section-eyebrow` labels
- Hero title: negro sólido con `<em>` italic dorado — NO gradient text (efecto IA genérico)
- Editor: maintain dark glassmorphism with neon accents (see `frontend/style.css`)
- Keep the 3-step flow (paste URL → click start → get dubbed video) as the core message
- Separate project from TRADUCTOR backend repo — do NOT mix backend code here
