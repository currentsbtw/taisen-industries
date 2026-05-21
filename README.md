# Taisen Industries

Corporate landing page for **Taisen Industries LLC** at [taisenindustries.com](https://taisenindustries.com).

## What this is

A static single-page site (no build step, no JavaScript) served via GitHub Pages with a custom domain. Exists to satisfy the Apple Developer Program's requirement that the organization behind a developer account has a verifiable web presence.

## Local development

Open `index.html` directly in a browser. No server needed.

## Deployment

- **Hosting:** GitHub Pages, `main` branch, root directory
- **Custom domain:** `taisenindustries.com` (apex + `www` redirect)
- **HTTPS:** Auto-provisioned by GitHub (Let's Encrypt)

### DNS records (set at domain registrar)

Apex (`@`) — A records to GitHub's four IPs:

| Type | Host | Value             |
|------|------|-------------------|
| A    | @    | 185.199.108.153   |
| A    | @    | 185.199.109.153   |
| A    | @    | 185.199.110.153   |
| A    | @    | 185.199.111.153   |

`www` subdomain — CNAME to GitHub Pages host:

| Type  | Host | Value                       |
|-------|------|-----------------------------|
| CNAME | www  | currentsbtw.github.io.      |

## Files

- `index.html` — the page
- `styles.css` — all styling
- `favicon.svg` — crimson dot logo
- `CNAME` — custom domain configuration
- `.nojekyll` — skip Jekyll processing
- `docs/superpowers/` — design spec and implementation plan

## License

© 2024–2026 Taisen Industries LLC. All rights reserved.
