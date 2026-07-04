# AGENTS.md

## Project Overview
Static landing page for JANUS (video dubbing service). Pure HTML/CSS/JS — no build process, no dependencies.

## Key Facts
- **Deployment**: Vercel (static site, auto-deploys on push to `main`)
- **Structure**: Single-page site with `index.html`, `style.css`, `app.js`
- **Assets**: `assets/` folder is for the hero demo GIF (not yet added)
- **Separate from**: Main TRADUCTOR project (different repo, different purpose)

## Important Notes
- The "Probar ahora" button in `app.js` currently has a placeholder alert — needs to be updated with the actual Cloudflare tunnel URL when available
- No `package.json` — this is intentional, it's a static site
- No build/test/lint commands — just edit files and push
- Fonts loaded from Google Fonts CDN (Playfair Display + Inter)

## When Editing
- Maintain the white/gold color scheme (see CSS variables in `style.css`)
- Keep the 3-step flow (paste URL → click start → get dubbed video) as the core message
- The demo GIF will go in `assets/hero-demo.gif` when recorded
