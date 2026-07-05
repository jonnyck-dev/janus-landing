# AGENTS.md

## Project

Static landing page for JANUS (video dubbing service). Pure HTML/CSS/JS — no build, no deps.

## Deployment

- **Vercel** — auto-deploys on push to `main`
- **URL**: `janus-landing-red.vercel.app`
- Framework preset: **Other** (static)

## Architecture

```
janus-landing/
  index.html   ← single-page site
  style.css    ← white + gold palette (#d4a853, #f0c040)
  app.js       ← all "Probar ahora" buttons → JANUS_APP_URL (opens in new tab)
  assets/      ← hero-demo.gif (not yet added)
```

## Key Facts

- `JANUS_APP_URL` in `app.js` points to a Cloudflare quick tunnel URL (`*.trycloudflare.com`)
- The tunnel URL changes every time cloudflared restarts
- All `.btn-primary` elements redirect to the app — no `href="#cta"` scroll behavior
- Fonts: Playfair Display (headings) + Inter (body) from Google Fonts CDN

## When Editing

- Maintain white/gold color scheme (see CSS variables in `style.css`)
- Keep the 3-step flow (paste URL → click start → get dubbed video) as the core message
- Separate project from TRADUCTOR — do NOT mix repos
