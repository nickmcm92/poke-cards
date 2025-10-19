```markdown
# poke-cards

Vite + React project configured to deploy to GitHub Pages.

Live site (after deploy):
https://nickmcm92.github.io/poke-cards/

Deployment options:
- GitHub Actions (recommended): workflow at .github/workflows/deploy.yml builds and publishes ./dist to gh-pages.
- Local: `npm run predeploy` then `npm run deploy` (requires gh-pages package and push permissions).

Notes:
- The Vite base is set to `/poke-cards/`. Do not change unless you're hosting at a different path.
- For a user/organization site (username.github.io), set base to `/` and configure Pages accordingly.

Getting started:
1. Install deps: `npm install`
2. Dev server: `npm run dev`
3. Build: `npm run build`
4. Preview build locally: `npm run preview`
```