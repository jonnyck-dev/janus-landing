# AGENTS.md

## Project

JANUS — Landing bilingüe **ES/EN** (estática, sin build, sin deps). 3 páginas públicas + widgets JS.
Deployed on Vercel (auto-deploy on push to `main`).
El editor de doblaje vive en **`app.janusdubber.website`** (backend FastAPI en la PC del usuario, expuesto por Cloudflare Tunnel + worker `janus-fallback` de mantenimiento). NO está en este repo.

## Deployment

- **Vercel** — auto-deploys on push to `main`
- **URL**: `www.janusdubber.website`
- Framework preset: **Other** (static)
- **App**: `app.janusdubber.website` → worker `janus-fallback.js` → Cloudflare Tunnel → PC local (FastAPI :8000)

## Architecture

```
Vercel (www.janusdubber.website — estático)
├── index.html      → Landing: hero → cómo funciona → features → pricing → .service-banner → CTA final → footer
├── agencia.html    → #managed, #loss, #research, #roi-calculator (servicio gestionado)
├── legal.html      → Términos, reembolsos, cancelación, promociones (Stripe compliance)
├── style.css       ← paleta blanco + dorado (#d4a853, #f0c040)
├── auth.css / chat-style.css / calculator.css
├── i18n.js         → Sistema de traducción ES/EN (carga PRIMERO en las 3 páginas)
├── app.js          → SOLO index.html: CTA → app.janusdubber.website + demo player + pricing flotante
├── auth.js         → Supabase auth; helper local `janusTr()` (puente a `window.janusT` de i18n)
├── calculator.js   → SOLO agencia.html: ROI calculator → tabla `roi_leads` (define su propio JANUS_APP_URL)
├── chat-app.js     → Widget de chat (PROPIO del producto — traducido ES/EN)
├── brand.js        → Resalta cada mención de "JANUS" en dorado (texto + nodos dinámicos)
├── janus-fallback.js → Worker Cloudflare: sirve mantenimiento en app.* si el tunnel/PC cae
├── supabase_schema.sql
└── assets/         → iconos (01.png–06.png, pasos_01.png–03.png), logos, demo gifs

app.janusdubber.website → worker janus-fallback → Cloudflare Tunnel → PC local (FastAPI)
```

> ⚠️ NO existen `frontend/`, `frontend_studio/` ni `vercel.json` en este repo. El editor NO se sirve aquí.

## i18n (ES/EN) — Sistema central

- `i18n.js` se carga **antes que todos los demás scripts** en las 3 páginas.
- Diccionario `es`/`en` con **paridad exacta de claves** (todo lo que existe en ES existe en EN y viceversa).
- API global: `window.janusT(key)`, `janusSetLang(lang)`, `janusDetectLang()`.
- Detección: `localStorage['janus_lang']` → `navigator.language` → **default ES**.
- Atributos en HTML: `data-i18n` (texto), `data-i18n-html` (markup), `data-i18n-ph` (placeholder), `data-i18n-aria`, `data-i18n-alt` (imágenes).
- Evento `janus:langchange` — los widgets escuchan: `auth.js` (`janusRefreshAuthStrings`), `chat-app.js`, `calculator.js`, `app.js` (demo actual).
- Meta title/description por página via `body[data-page]` (`data-page="index|agencia|legal"`).
- **Toggle de idioma**: SOLO en el **footer** (`.janus-lang-toggle` dentro de `.footer-bottom-right`), en las 3 páginas. NO hay toggle en la navbar.
- ⚠️ Los valores del diccionario se insertan con `textContent` → **NO usar entidades HTML (`&nbsp;`)** en los valores; usar el carácter real `U+00A0`.

## Pages / Rutas

- **Home (`index.html`)**: orden estricto → hero → how-it-works → features → pricing (`#pricing`, fuente de verdad de precios) → `.service-banner` (upsell → `agencia.html`) → CTA final → footer.
- **Agencia (`agencia.html`)**: navbar con SOLO "Inicio". Secciones: `#managed`, `#loss`, `#research`, `#roi-calculator`. CTA final → app.
- **Legal (`legal.html`)**: navbar con "Ver planes". Anchors: `#terminos`, `#reembolsos`, `#cancelacion`, `#promociones`, `#restricciones`.
- **Navbar / navegación**:
  - index: **sin links** (el link "Agencia" está OCULTO a propósito — el usuario lo pidió así).
  - agencia: solo "Inicio" (para volver).
  - El acceso a la página de agencia es **exclusivamente** por el botón "Más información aquí" del `.service-banner` en index (o URL directa).
- **Regla de scripts por página**: `app.js` SOLO en index (el demo player crashea si no hay `#demo-video`). `calculator.js` + `calculator.css` SOLO en agencia. `i18n.js`, `auth.js`, `chat-app.js`, `brand.js` y supabase CDN van en index y agencia; legal solo carga `i18n.js`.

## Auth UI (Supabase)

- **Chip de usuario en navbar**: `#janus-nav-user` (avatar + nombre) reemplaza a `btn-nav-try` con sesión. Avatar de `profiles.avatar_url` (Google OAuth), fallback a inicial.
- **Menú**: chip → dropdown "Mi perfil" (`janusOpenProfile`) y "Cerrar sesión" (`janusLogout`).
- **Modal de perfil**: edita `profiles.full_name`, email (`auth.updateUser`, requiere confirmación) y contraseña.
- `janusRenderNav(session)` en `onAuthStateChange` (SIGNED_IN/SIGNED_OUT) y al cargar.
- ⚠️ En `auth.js` el helper de traducción local se llama **`janusTr()`** (delega a `window.janusT`). NUNCA definir una función llamada `janusT` — sombrea el global y causa recursión infinita (RangeError).

## Stripe Compliance (2026-08)

- **Empresa**: `jonnyck-org` — debe aparecer en footer y legal.html. NUNCA renombrar.
- **Contacto**: `support@janusdubber.website` (footer + legal.html#contacto).
- **Políticas** en `legal.html` con anchors (ver arriba). El footer los enlaza — mantener si se edita legal.html.
- **Pricing**: 3 planes por video (Esencial $5 / Multi-Voz $25 / Global $45), hasta 40 min. Fuente de verdad: `#pricing` en index.html. Si cambian precios/features, revisar políticas de reembolso.

## Copy / Wording (decisiones de usuario)

- **EN**: "**Duplicate** your audience" — NUNCA "Double". Aplica a hero, meta title y tagline del footer.
- **NO usar "turnkey" / "llave en mano"** (ES y EN): usar "Gestión completa" / "Complete management" y "Más información aquí" / "More information here".
- Pricing cards **sin índices numéricos** (01/02/03 eliminados; `.price-index` no existe).

## Plan Pendiente: Separar Frontend del Backend

### Estado: ⏳ NO EJECUTADO — el editor sigue fuera de este repo

- El editor vive en `app.janusdubber.website` (subdominio) servido por worker `janus-fallback.js` + Cloudflare Tunnel a la PC local.
- `frontend/` y `frontend_studio/` **no existen** en este repo; no hay `vercel.json`.
- Si algún día se quiere servir el editor desde Vercel en `/app` y `/studio`:
  1. Copiar `Traductor/frontend/` y `Traductor/frontend_studio/` aquí.
  2. Agregar `vercel.json` con rewrites `/app/(.*)` → `/frontend/$1` y `/studio/(.*)` → `/frontend_studio/$1`.
  3. Configurar `API_BASE`/`JANUS_APP_URL` según corresponda.

## Key Facts

- `JANUS_APP_URL = 'https://app.janusdubber.website'` en `app.js` y `calculator.js` (guard `typeof JANUS_APP_URL === 'undefined'` en calculator).
- **Pricing flotante** (`app.js`): `.price-card-featured` sobresale por defecto; hover eleva la tarjeta y la del medio vuelve; al salir sobresale otra vez. Tilt sutil via CSS vars `--tilt-x`/`--tilt-y`.
- `.btn-primary` redirige a la app SOLO si es `#btn-try-now`/`#btn-nav-try`/`#btn-hero-try`/`.price-cta`. El `.btn-primary` del banner agencia apunta a `agencia.html`.
- Fonts: Playfair Display (headings) + Inter (body) + IBM Plex Mono (labels/eyebrows) desde Google Fonts CDN.
- El landing usa tema claro dorado/blanco; el editor usa dark glassmorphism (en el repo TRADUCTOR).
- Backend NO está en este repo.

## When Editing

- **Bilingüe obligatorio**: si cambias un texto visible, actualiza ES y EN en `i18n.js` (paridad de claves) y el fallback HTML en español.
- **No usar entidades HTML (`&nbsp;`)** en valores del diccionario (se insertan con textContent) — usar `\u00A0`.
- Landing: mantener paleta blanco/dorado (variables CSS en `style.css`).
- NO usar emojis en títulos de sección ni como iconos de features — las 6 feature cards usan `assets/icons/01.png`–`06.png` (PNG transparente 366×366) dentro de `.feature-icon` (120px, sin fondo).
- Hero title: negro sólido con `<em>` italic dorado — NO gradient text.
- Mantener el flujo de 3 pasos (pega URL → click comenzar → recibe video) como mensaje central.
- Toggle de idioma solo en el footer — no añadir en navbar.
- No mezclar código del backend (repo TRADUCTOR) aquí.
