# Taisen Industries Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a minimal corporate landing page for Taisen Industries LLC at `taisenindustries.com`, hosted on GitHub Pages, satisfying Apple Developer Program's web-presence requirement.

**Architecture:** Single static page (no build step, no JavaScript), hand-written `index.html` + `styles.css` + `favicon.svg`, served from a GitHub Pages project repo with a custom domain. Dark atmospheric aesthetic with deep crimson accent glow.

**Tech Stack:** HTML5, CSS3 (custom properties, clamp, radial gradients, flexbox), Inter font via Google Fonts CDN, GitHub Pages hosting, custom DNS at domain registrar.

**Spec:** `docs/superpowers/specs/2026-05-20-taisen-industries-landing-page-design.md`

**Working directory:** `C:\Users\acevi\Development\taisen-industries\` (already initialized as git repo with initial spec commit `9ee787f`)

---

## Task 1: Repo skeleton files

Create the small fixed-content files that don't depend on the page content: README, GitHub Pages config files, and a minimal `.gitignore`.

**Files:**
- Create: `C:\Users\acevi\Development\taisen-industries\README.md`
- Create: `C:\Users\acevi\Development\taisen-industries\.nojekyll`
- Create: `C:\Users\acevi\Development\taisen-industries\CNAME`
- Create: `C:\Users\acevi\Development\taisen-industries\.gitignore`

- [ ] **Step 1: Write `README.md`**

```markdown
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
```

- [ ] **Step 2: Write `.nojekyll`** (empty file)

The file must exist but have no content. In PowerShell:

```powershell
New-Item -ItemType File -Path "C:\Users\acevi\Development\taisen-industries\.nojekyll" -Force
```

- [ ] **Step 3: Write `CNAME`** (one line, no trailing newline ideal but tolerated)

```
taisenindustries.com
```

- [ ] **Step 4: Write `.gitignore`**

```
# OS noise
.DS_Store
Thumbs.db

# Editor noise
.vscode/
.idea/
*.swp
*.swo
*~

# Local-only
.env
.env.local
```

- [ ] **Step 5: Verify all four files exist**

Run:
```powershell
Get-ChildItem C:\Users\acevi\Development\taisen-industries -Force -File | Where-Object { $_.Name -in @('README.md', '.nojekyll', 'CNAME', '.gitignore') } | Select-Object Name, Length
```

Expected output: four rows showing all four files (`.nojekyll` may have Length 0, the others non-zero).

- [ ] **Step 6: Commit**

```bash
cd /c/Users/acevi/Development/taisen-industries
git -c user.email="acevisai.zero@gmail.com" -c user.name="Ace Visai" add README.md .nojekyll CNAME .gitignore
git -c user.email="acevisai.zero@gmail.com" -c user.name="Ace Visai" commit -m "chore: add repo skeleton (README, CNAME, .nojekyll, .gitignore)"
```

---

## Task 2: Favicon

A 32×32 SVG with a centered crimson filled circle. Matches the logo mark used in the header.

**Files:**
- Create: `C:\Users\acevi\Development\taisen-industries\favicon.svg`

- [ ] **Step 1: Write `favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="10" fill="#B91C1C"/>
</svg>
```

- [ ] **Step 2: Verify the SVG renders**

Open `C:\Users\acevi\Development\taisen-industries\favicon.svg` directly in a browser. Expected: a small crimson circle centered on a transparent background. No XML parse errors.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/acevi/Development/taisen-industries
git -c user.email="acevisai.zero@gmail.com" -c user.name="Ace Visai" add favicon.svg
git -c user.email="acevisai.zero@gmail.com" -c user.name="Ace Visai" commit -m "feat: add crimson dot favicon"
```

---

## Task 3: HTML

Write the complete `index.html` with semantic structure, the final copy from the spec, all `<head>` meta tags, and links to the stylesheet and Google Fonts.

**Files:**
- Create: `C:\Users\acevi\Development\taisen-industries\index.html`

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Taisen Industries</title>
  <meta name="description" content="Taisen Industries is a holding company for technology ventures and applied research, based in Sacramento, California.">
  <meta property="og:title" content="Taisen Industries">
  <meta property="og:description" content="A holding company for technology ventures and applied research.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://taisenindustries.com">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400&display=swap">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header>
    <a href="#" class="brand">
      <span class="logo-mark" aria-hidden="true"></span>
      <span class="brand-name">Taisen Industries</span>
    </a>
    <a href="mailto:info@taisenindustries.com" class="nav-contact">Contact</a>
  </header>

  <main>
    <div class="glow" aria-hidden="true"></div>
    <p class="meta-top">· est. 2024 ·</p>
    <h1>Taisen Industries</h1>
    <p class="tagline">Holdings and applied research.</p>
    <p class="body">Taisen Industries is a holding company for technology ventures and applied research.</p>
    <div class="ctas">
      <a href="mailto:info@taisenindustries.com" class="btn btn-primary">Contact</a>
      <a href="#footer" class="btn btn-ghost">Learn more ↓</a>
    </div>
    <div class="meta-bottom">
      <span>· Sacramento, California ·</span>
      <span>· LLC ·</span>
    </div>
  </main>

  <footer id="footer">
    <p class="legal-name">Taisen Industries LLC</p>
    <p class="legal-address">2108 N St Ste N · Sacramento, CA 95816</p>
    <p class="legal-email"><a href="mailto:info@taisenindustries.com">info@taisenindustries.com</a></p>
    <p class="copyright">© 2024–2026  Taisen Industries LLC</p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify HTML renders (unstyled)**

Open `C:\Users\acevi\Development\taisen-industries\index.html` directly in a browser (double-click, or `file:///C:/Users/acevi/Development/taisen-industries/index.html`).

Expected: all text content visible, in default browser styling (no dark theme yet — `styles.css` doesn't exist, so the page is plain white with black serif text). All copy from the spec should be present and in the right order:

1. Header: `● Taisen Industries` (unstyled bullet may show) and `Contact` link
2. `· est. 2024 ·`
3. Large heading: `Taisen Industries`
4. `Holdings and applied research.`
5. The body paragraph
6. Two CTAs: `Contact` and `Learn more ↓`
7. `· Sacramento, California ·` and `· LLC ·`
8. Footer with company name, address, email link, copyright

No console errors except the missing `/styles.css` 404. The Google Fonts stylesheet should load successfully (verify in DevTools Network tab).

- [ ] **Step 3: Verify all links resolve**

In the browser, click each link in turn:
- Header `Contact` → opens default mail client with `info@taisenindustries.com`
- Hero `Contact` → same
- Hero `Learn more ↓` → page scrolls to footer (instant scroll since no smooth-scroll CSS yet)
- Footer email link → opens mail client

All four interactions work. No JavaScript errors.

- [ ] **Step 4: Commit**

```bash
cd /c/Users/acevi/Development/taisen-industries
git -c user.email="acevisai.zero@gmail.com" -c user.name="Ace Visai" add index.html
git -c user.email="acevisai.zero@gmail.com" -c user.name="Ace Visai" commit -m "feat: add semantic HTML structure with final copy"
```

---

## Task 4: CSS

Write the complete `styles.css` — custom properties, reset, base typography, header, hero with crimson glow, footer, responsive breakpoint, focus styles, and reduced-motion handling.

**Files:**
- Create: `C:\Users\acevi\Development\taisen-industries\styles.css`

- [ ] **Step 1: Write `styles.css`**

```css
/* ============================================
   Custom properties
   ============================================ */
:root {
  --bg: #0A0A0B;
  --bg-panel: #111114;
  --text: #F4F4F5;
  --text-muted: #71717A;
  --hairline: rgba(255, 255, 255, 0.08);
  --crimson: #B91C1C;
  --crimson-hover: #DC2626;

  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
}

/* ============================================
   Reset
   ============================================ */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body,
h1,
p {
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ============================================
   Base
   ============================================ */
body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* ============================================
   Header
   ============================================ */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 400;
  font-size: 14px;
}

.logo-mark {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: var(--crimson);
  border-radius: 50%;
}

.brand-name {
  letter-spacing: -0.01em;
}

.nav-contact {
  font-size: 14px;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.nav-contact:hover {
  color: var(--text);
}

/* ============================================
   Hero (main)
   ============================================ */
main {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 64px 24px;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

.glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  max-width: 1000px;
  height: 600px;
  background: radial-gradient(circle, rgba(185, 28, 28, 0.35) 0%, transparent 60%);
  filter: blur(60px);
  z-index: -1;
  pointer-events: none;
}

.meta-top,
.meta-bottom span {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.meta-top {
  margin-bottom: 48px;
}

h1 {
  font-weight: 200;
  font-size: clamp(48px, 8vw, 96px);
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  line-height: 1.05;
}

.tagline {
  font-weight: 200;
  font-size: clamp(20px, 3vw, 28px);
  color: var(--text-muted);
  margin-bottom: 32px;
}

.body {
  max-width: 480px;
  margin-bottom: 48px;
  color: var(--text-muted);
}

.ctas {
  display: flex;
  gap: 16px;
  margin-bottom: 64px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  font-size: 14px;
  border-radius: 100px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--crimson);
  color: var(--text);
}

.btn-primary:hover {
  background-color: var(--crimson-hover);
}

.btn-ghost {
  border-color: var(--hairline);
  color: var(--text-muted);
}

.btn-ghost:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text);
}

.meta-bottom {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  justify-content: center;
}

/* ============================================
   Footer
   ============================================ */
footer {
  border-top: 1px solid var(--hairline);
  padding: 48px 24px 24px;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

footer p {
  margin-bottom: 4px;
}

footer .legal-name {
  color: var(--text);
  margin-bottom: 8px;
}

footer .copyright {
  margin-top: 24px;
  font-size: 12px;
}

footer a {
  color: var(--text-muted);
  transition: color 0.2s ease;
}

footer a:hover {
  color: var(--text);
}

/* ============================================
   Focus
   ============================================ */
a:focus-visible {
  outline: 2px solid var(--crimson);
  outline-offset: 4px;
  border-radius: 4px;
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 640px) {
  header {
    padding: 20px;
  }

  main {
    padding: 48px 24px;
  }

  .meta-top {
    margin-bottom: 32px;
  }

  .meta-bottom {
    flex-direction: column;
    gap: 12px;
  }

  .ctas {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    text-align: center;
  }

  footer {
    padding: 32px 20px 20px;
  }
}

/* ============================================
   Reduced motion
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .nav-contact,
  .btn,
  footer a {
    transition: none;
  }
}
```

- [ ] **Step 2: Verify the page in desktop view**

Open `C:\Users\acevi\Development\taisen-industries\index.html` in a browser (or refresh if already open).

Expected:
- Background is near-black (`#0A0A0B`)
- White Inter text, thin weight on the headline
- Crimson glow visible behind the hero — a soft, diffuse red bloom centered on the page
- Header at top: small crimson dot + "Taisen Industries" wordmark on left, "Contact" link on right
- Hero centered vertically and horizontally: meta label "· EST. 2024 ·" (uppercase, small, muted), large thin "Taisen Industries" headline, "Holdings and applied research." subtitle in muted color, body paragraph, two pill buttons (one filled crimson labeled "Contact", one outlined labeled "Learn more ↓"), then two meta labels "· SACRAMENTO, CALIFORNIA ·" and "· LLC ·" side by side
- Footer at bottom with hairline top border: white "Taisen Industries LLC", then muted address, email (underlined or styled as link), and a muted "© 2024–2026" line

No console errors. Inter font loaded (verify in DevTools: page should not be using a serif fallback).

- [ ] **Step 3: Verify hover states**

Hover each link:
- Header "Contact" → text color brightens from muted gray to white
- Hero "Contact" button → background brightens from `#B91C1C` to `#DC2626`
- Hero "Learn more ↓" button → border brightens, text color brightens to white
- Footer email link → text color brightens to white

- [ ] **Step 4: Verify mobile view in DevTools**

In Chrome DevTools, toggle the device toolbar (Cmd/Ctrl+Shift+M). Pick iPhone 14 Pro or similar (390×844).

Expected:
- Headline scales down to ~48px (lower end of clamp range)
- Buttons stack vertically and become full-width
- Meta labels at bottom stack vertically with smaller gap
- Footer padding tighter, still readable
- No horizontal scroll
- Glow still visible but proportionally smaller

- [ ] **Step 5: Verify focus styles**

Click somewhere neutral on the page, then press Tab repeatedly. Each interactive link should show a 2px crimson outline with a 4px offset:
1. Brand wordmark (`href="#"`)
2. Header Contact
3. Hero Contact button
4. Hero Learn more button
5. Footer email link

- [ ] **Step 6: Verify "Learn more ↓" smooth scrolls**

Scroll to the top of the page. Click "Learn more ↓". The page should smoothly scroll down to the footer (not jump).

- [ ] **Step 7: Commit**

```bash
cd /c/Users/acevi/Development/taisen-industries
git -c user.email="acevisai.zero@gmail.com" -c user.name="Ace Visai" add styles.css
git -c user.email="acevisai.zero@gmail.com" -c user.name="Ace Visai" commit -m "feat: add full stylesheet (dark theme, crimson glow, responsive)"
```

---

## Task 5: Local verification

Run the full pre-deploy checklist from the spec to confirm the page is ready to ship.

**Files:**
- No file changes; verification only.

- [ ] **Step 1: Verify page loads via `file://` protocol**

Double-click `C:\Users\acevi\Development\taisen-industries\index.html` (not via a local server). Page must render correctly. This catches absolute-path bugs that only manifest off a server.

If the favicon, stylesheet, or fonts don't load over `file://` because the paths start with `/`, that's expected — the deploy will fix it (the deployed page is served from the root of `taisenindustries.com`, where `/styles.css` resolves correctly). The acceptance criterion here is: **the page is recognizable** (correct copy, correct overall layout, even if fonts default to system fallback). If the page is unrecognizable over `file://`, investigate before deploying.

- [ ] **Step 2: Run Chrome DevTools Lighthouse audit**

In Chrome, open DevTools → Lighthouse → check "Accessibility" and "Best Practices" → click "Analyze page load". (Optionally also Performance and SEO.)

Expected:
- Accessibility: ≥95
- Best Practices: ≥90

If Accessibility is below 95, read the report and fix issues before continuing. Common fixes: missing `lang` on `<html>` (already there), missing alt text (no images, n/a), low contrast (check `--text-muted` against `--bg`).

- [ ] **Step 3: Verify no console errors**

DevTools → Console. Reload the page. Expected: zero errors, zero warnings. (`file://` may produce a `favicon` or CORS warning for Google Fonts — that's acceptable and will not appear on the deployed site.)

- [ ] **Step 4: Verify on a real mobile device (optional but recommended)**

If you can host the directory locally (e.g., `python -m http.server 8080` in the repo root), open `http://<your-LAN-IP>:8080` on your phone. Verify:
- Layout matches the DevTools mobile preview
- Tap targets work (Contact opens mail app, Learn more scrolls to footer)
- No horizontal scroll
- Glow looks right on a real screen (some screens render gradients differently than desktop monitors)

This step can be skipped — production verification (Task 9) covers real-device testing too.

- [ ] **Step 5: Final visual check against the spec**

Open the spec at `docs/superpowers/specs/2026-05-20-taisen-industries-landing-page-design.md` side-by-side with the rendered page. Check each item:
- Copy matches exactly (Section 3 of spec)
- All visual elements present (header, hero, footer)
- Color palette matches (`--text-muted` on `--bg` should look dim but readable)
- Typography is Inter thin for the headline

- [ ] **Step 6: Git status check**

```bash
cd /c/Users/acevi/Development/taisen-industries
git status
git log --oneline
```

Expected: working tree clean, four commits in log:
1. spec commit (`9ee787f`)
2. repo skeleton
3. favicon
4. HTML
5. CSS

(If anything is uncommitted, commit it before moving on.)

---

## Task 6: Create GitHub repo and push

Create `currentsbtw/taisen-industries` on GitHub and push the local repo to it.

**Files:**
- No file changes; remote setup only.

- [ ] **Step 1: Check `gh` CLI availability**

```bash
gh --version
gh auth status
```

If `gh` is not installed or you're not authenticated, either install via `winget install GitHub.cli` then run `gh auth login`, OR use the GitHub web UI fallback in Step 3.

- [ ] **Step 2: Create the repo via `gh` CLI**

```bash
cd /c/Users/acevi/Development/taisen-industries
gh repo create currentsbtw/taisen-industries --public --source=. --description "Corporate landing page for Taisen Industries LLC at taisenindustries.com" --push
```

Flags:
- `--public` — required for free GitHub Pages
- `--source=.` — use current directory
- `--push` — push existing commits immediately

Expected output: confirmation that the repo was created, remote `origin` added, and `main` branch pushed.

- [ ] **Step 3: Fallback if `gh` is unavailable**

In the GitHub web UI:
1. Go to https://github.com/new
2. Owner: `currentsbtw`
3. Repository name: `taisen-industries`
4. Description: "Corporate landing page for Taisen Industries LLC at taisenindustries.com"
5. Public
6. Do NOT initialize with README, .gitignore, or license (we already have them)
7. Click "Create repository"

Then locally:

```bash
cd /c/Users/acevi/Development/taisen-industries
git remote add origin https://github.com/currentsbtw/taisen-industries.git
git -c user.email="acevisai.zero@gmail.com" -c user.name="Ace Visai" push -u origin main
```

You may be prompted for GitHub credentials. Use a Personal Access Token (https://github.com/settings/tokens) as the password.

- [ ] **Step 4: Verify the push**

```bash
cd /c/Users/acevi/Development/taisen-industries
git log --oneline origin/main
```

Expected: same 5 commits visible on the remote.

Browse to https://github.com/currentsbtw/taisen-industries and confirm `index.html`, `styles.css`, `favicon.svg`, `CNAME`, `.nojekyll`, `README.md`, and `docs/` are all present.

---

## Task 7: Enable GitHub Pages with custom domain

Configure the repo to serve via GitHub Pages and set the custom domain to `taisenindustries.com`.

**Files:**
- No file changes; repo settings only.

- [ ] **Step 1: Open Pages settings**

Navigate to https://github.com/currentsbtw/taisen-industries/settings/pages

- [ ] **Step 2: Configure source**

Under "Build and deployment":
- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/ (root)`

Click "Save".

GitHub will start the first Pages build. Within ~1 minute, the top of the Pages settings page will show a green "Your site is live at https://currentsbtw.github.io/taisen-industries/" message.

- [ ] **Step 3: Verify the default Pages URL works**

Open https://currentsbtw.github.io/taisen-industries/ in a browser.

Expected: the dark landing page renders correctly. Fonts load. Glow visible.

Known issue: links to `/favicon.svg`, `/styles.css`, `/` (the brand link), and `mailto:` should work. The footer anchor `#footer` should work. The `Learn more ↓` smooth scroll should work.

- [ ] **Step 4: Set the custom domain**

Still on the Pages settings page, under "Custom domain":
- Enter: `taisenindustries.com`
- Click "Save"

GitHub will run a DNS check. It will fail initially because DNS records haven't been set yet (that's Task 8). The warning is expected and not a blocker.

The `CNAME` file in the repo will be automatically updated by GitHub to contain `taisenindustries.com` (matching what we already committed). If a duplicate commit appears in the history named "Create CNAME", that's GitHub doing the right thing.

- [ ] **Step 5: Do NOT enable "Enforce HTTPS" yet**

The "Enforce HTTPS" checkbox will be greyed out until DNS resolves and Let's Encrypt provisions a cert. That happens in Task 9. Leave it alone for now.

---

## Task 8: Configure DNS at the domain registrar

Set the DNS records so `taisenindustries.com` resolves to GitHub Pages. **This step is performed at the domain registrar (where the user purchased `taisenindustries.com`), not in code.**

**Files:**
- No file changes; user must edit DNS records in the registrar's control panel.

- [ ] **Step 1: Log in to the registrar**

Open the registrar's DNS management page for `taisenindustries.com`. (Common registrars: Cloudflare, Namecheap, GoDaddy, Google Domains/Squarespace.)

- [ ] **Step 2: Remove any existing A or CNAME records for `@` and `www`**

Existing records pointing to a parking page or different host will conflict. Delete them. If unsure which to keep, take a screenshot first as a backup.

- [ ] **Step 3: Add four A records for the apex (`@`)**

| Type | Host | Value             | TTL  |
|------|------|-------------------|------|
| A    | @    | 185.199.108.153   | 3600 |
| A    | @    | 185.199.109.153   | 3600 |
| A    | @    | 185.199.110.153   | 3600 |
| A    | @    | 185.199.111.153   | 3600 |

Some registrars use `@` for the apex, others use the bare domain (`taisenindustries.com`) or leave the host field blank — they all mean the same thing.

- [ ] **Step 4: Add one CNAME record for `www`**

| Type  | Host | Value                       | TTL  |
|-------|------|-----------------------------|------|
| CNAME | www  | currentsbtw.github.io.      | 3600 |

The trailing dot in `currentsbtw.github.io.` is correct for some DNS UIs; others reject it. If the UI complains, omit the dot.

- [ ] **Step 5: Save changes**

Apply the DNS changes. Propagation usually takes 5–30 minutes but can take up to 24 hours.

- [ ] **Step 6: Verify DNS propagation**

After ~10 minutes, check that the records resolve:

```bash
nslookup taisenindustries.com
nslookup www.taisenindustries.com
```

Expected: `taisenindustries.com` resolves to one or more of `185.199.108.153`–`.111.153`. `www.taisenindustries.com` resolves to `currentsbtw.github.io` (CNAME) and ultimately the same IPs.

If you see the old parking-page IPs, wait longer and re-check. If after 1 hour the records still haven't propagated, double-check the registrar UI for typos.

---

## Task 9: Production verification

Confirm the live site at `taisenindustries.com` works correctly and meets the spec's success criteria.

**Files:**
- No file changes; production verification only.

- [ ] **Step 1: Verify HTTP works**

Open `http://taisenindustries.com` in a browser. Expected: the landing page renders (may auto-redirect to HTTPS once Pages provisions the cert).

- [ ] **Step 2: Re-check GitHub Pages settings**

Go back to https://github.com/currentsbtw/taisen-industries/settings/pages

The DNS check under "Custom domain" should now show a green checkmark. If it still shows a warning, wait longer for DNS propagation, then re-save the custom domain field (this re-runs the check).

- [ ] **Step 3: Wait for Let's Encrypt cert**

GitHub provisions the TLS cert automatically once DNS resolves. This usually completes within 15 minutes but can take up to 24 hours. You'll know it's done when the "Enforce HTTPS" checkbox becomes clickable.

- [ ] **Step 4: Enable "Enforce HTTPS"**

Once the checkbox is enabled, check it. This makes `http://` requests redirect to `https://`.

- [ ] **Step 5: Verify HTTPS**

Open `https://taisenindustries.com` in a fresh browser tab/window (clear cache if needed). Expected:
- Page loads with a valid TLS cert (no browser warning)
- Cert issuer: "Let's Encrypt"
- Padlock icon shown in the URL bar

- [ ] **Step 6: Verify `www` redirect**

Open `https://www.taisenindustries.com` in a browser. Expected: redirects to `https://taisenindustries.com` (apex). The `CNAME` file tells GitHub to canonicalize to the apex automatically.

- [ ] **Step 7: Verify on a real mobile device**

Open `https://taisenindustries.com` on a phone (different network if possible — to bypass any cached DNS on your home network).

Expected: same dark page, mobile layout from the responsive CSS, all buttons tappable, mail links open the mail app.

- [ ] **Step 8: Run final Lighthouse audit on production URL**

In Chrome DevTools on `https://taisenindustries.com`:
- Lighthouse → Mobile → Accessibility, Best Practices, SEO, Performance
- Expected scores: Accessibility ≥95, Best Practices ≥90, SEO ≥90, Performance ≥95

If any score is below threshold, read the report and address the issues. Common production-only issues: SEO needs a `<meta name="description">` (already present), Performance may flag the Google Fonts blocking the render (acceptable trade-off for the design).

- [ ] **Step 9: Verify the Apple Developer Program reviewer experience**

Open `https://taisenindustries.com` in an incognito window, on a fresh device if possible. Look at it as a stranger would:
- Does the page convey "this is a real company"?
- Is the contact info findable in under 5 seconds?
- Is the legal entity name and address clearly stated?

If yes to all three, you're done.

- [ ] **Step 10: Optional — record the live URL for your Apple Developer Program submission**

Save `https://taisenindustries.com` in whatever form you'll submit to Apple (D-U-N-S record, App Store Connect "Marketing URL" field, etc.).

---

## Done

The page is live, on HTTPS, at the custom domain, with the LLC's contact and legal info visible. Apple's web-presence requirement is satisfied.

Future enhancements (deferred — do not implement now):
- Add `/privacy` page if any Taisen-owned product needs to use `taisenindustries.com/privacy` as its App Store Privacy Policy URL
- Add a `/ventures` listing once Taisen owns more than one entity
- Add analytics if traffic patterns become interesting
- Migrate to a static site generator (Eleventy, Astro) if the site grows beyond a few pages
