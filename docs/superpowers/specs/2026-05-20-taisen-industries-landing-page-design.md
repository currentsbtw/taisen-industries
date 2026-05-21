# Taisen Industries — Landing Page Design

**Date:** 2026-05-20
**Status:** Design approved; awaiting written-spec review before implementation planning
**Author:** Ace (with Claude)

## Purpose

A minimal, professional single-page corporate site for **Taisen Industries LLC** at `taisenindustries.com`, hosted on GitHub Pages.

The page exists to satisfy the Apple Developer Program's requirement that the organization behind the developer account has a verifiable web presence. It must read as a legitimate business to a human reviewer — clear identity, clear contact, real address — while leaving room for Taisen Industries to grow into a holding company across multiple ventures.

The page is **pure corporate**: no product marketing, no fake metrics, no Adaptus mention. It identifies the LLC, states what it does in the most generic durable terms ("holdings and applied research"), and provides legal contact information.

## Non-goals

- Not a marketing page for any product
- Not a portfolio / case-studies site
- No CMS, no build step, no JavaScript
- No analytics, no third-party trackers
- No sign-up, login, or interactive functionality
- No multi-page navigation

## Architecture

### Hosting

- **Platform:** GitHub Pages, project repository (not user-level)
- **Repository:** `currentsbtw/taisen-industries` (public)
- **Branch / source:** `main`, root directory
- **Custom domain:** `taisenindustries.com` (apex + `www` subdomain)
- **HTTPS:** Enforced via GitHub-provisioned Let's Encrypt certificate
- **Build step:** None — static files served directly

### File layout (repo root)

```
taisen-industries/
  index.html        # the page (semantic HTML)
  styles.css        # all styling (CSS custom properties, no preprocessor)
  favicon.svg       # crimson dot logo mark
  CNAME             # contains: taisenindustries.com
  .nojekyll         # skip Jekyll processing
  README.md         # project description + DNS setup notes
  docs/
    superpowers/
      specs/
        2026-05-20-taisen-industries-landing-page-design.md   # this file
      plans/
        # populated by writing-plans skill in the next step
```

### DNS (configured at the domain registrar)

| Type  | Host  | Value                                                                   |
|-------|-------|-------------------------------------------------------------------------|
| A     | `@`   | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| CNAME | `www` | `currentsbtw.github.io.`                                                |

DNS configuration is **outside the scope of the code repo** but is part of the deployment checklist.

## Visual design

### Inspiration

Dark, atmospheric, minimal modern web design — near-black background with diffuse colored gradient blooms, thin oversized typography, hairline-bordered elements, sparse content. (Reference: DeFi PPA Studio composite provided by user.)

### Palette (CSS custom properties)

| Token              | Value                                                  | Used for                            |
|--------------------|--------------------------------------------------------|-------------------------------------|
| `--bg`             | `#0A0A0B`                                              | Page background                     |
| `--bg-panel`       | `#111114`                                              | Card fills (used sparingly)         |
| `--text`           | `#F4F4F5`                                              | Primary text                        |
| `--text-muted`     | `#71717A`                                              | Meta labels, secondary text         |
| `--hairline`       | `rgba(255, 255, 255, 0.08)`                            | 1px borders, separators             |
| `--crimson`        | `#B91C1C`                                              | Accent (logo mark, focus rings)     |
| `--crimson-glow`   | `radial-gradient(circle, rgba(185,28,28,0.35) 0%, transparent 60%)` | Atmospheric bloom behind hero |

Contrast: `--text-muted` (`#71717A`) on `--bg` (`#0A0A0B`) measures ~4.6:1, passes WCAG AA for normal text.

### Typography

- **Font family:** `Inter` (Google Fonts), with system fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`
- **Weights loaded:** 200 (extra-light), 400 (regular)
- **Headline (company name):** Inter 200, `clamp(48px, 8vw, 96px)`, letter-spacing `-0.02em`
- **Tagline:** Inter 200, `clamp(20px, 3vw, 28px)`, color `--text-muted`
- **Body paragraph:** Inter 400, 16px, line-height 1.6
- **Meta labels:** Inter 400, 11px, uppercase, letter-spacing `+0.1em`, color `--text-muted`
- **Buttons:** Inter 400, 14px

### Layout

Single page, three vertically-stacked blocks:

1. **`<header>`** — Logo mark (small filled crimson dot + "Taisen Industries" wordmark) on left, "Contact" mailto link on right. Padding 24px, hairline-bottom optional.
2. **`<main>` hero** — `min-height: 100vh` minus header, flex column centered. Contains the crimson radial bloom (positioned absolute behind text, `~80vw` wide, low opacity, `filter: blur(60px)`).
3. **`<footer>`** — Hairline-top separator, legal info in muted text.

Content column max-width: `720px`, horizontally centered, side padding `24px` (mobile) → `48px` (desktop).

### Responsive

- **Desktop (≥768px):** column ~720px, generous vertical padding, hero type at upper end of `clamp()` ranges
- **Mobile (<768px):** full-width column with 24px gutters, headline scales down via `clamp()`, meta-label row stacks vertically, footer fields stack
- Pure CSS responsive; no JS, no media-query breakpoints beyond what `clamp()` implies

## Content (exact copy)

```
[header]
● Taisen Industries                                            Contact

[hero — vertically centered within viewport]

                       · est. 2024 ·

                    Taisen Industries
                Holdings and applied research.

       Taisen Industries is a holding company for
       technology ventures and applied research.

                   [ Contact ]   ( Learn more ↓ )

       · Sacramento, California ·          · LLC ·

[footer]
Taisen Industries LLC
2108 N St Ste N · Sacramento, CA 95816
info@taisenindustries.com

© 2024–2026  Taisen Industries LLC
```

### Copy notes

- **Header `Contact`** is `<a href="mailto:info@taisenindustries.com">Contact</a>` — opens the user's mail client.
- **Hero `[ Contact ]` button** is the same mailto.
- **Hero `( Learn more ↓ )` button** anchors to `#footer`. Smooth scroll via CSS `scroll-behavior: smooth` on `<html>`.
- **Meta labels** (`· est. 2024 ·`, `· Sacramento, California ·`, `· LLC ·`) echo the reference image's small annotation labels. They're decorative meta — fine print, not interactive.
- **Footer address line** uses middle-dot separators to keep the line tight.

### Email obfuscation decision

The address `info@taisenindustries.com` appears as plain text in the HTML. **Rationale:** the deliverability vs. anti-scraping trade-off favors plain text for a legitimacy-signaling page — Apple reviewers should see a working contact, and modern mail providers handle inbound spam well. If spam becomes a problem post-launch, swap to `data-email` + JS reveal, or use a contact form via Formspree/Resend.

## Components

### `<header>`

```html
<header>
  <a href="#" class="brand">
    <span class="logo-mark" aria-hidden="true"></span>
    <span class="brand-name">Taisen Industries</span>
  </a>
  <a href="mailto:info@taisenindustries.com" class="nav-contact">Contact</a>
</header>
```

- `.logo-mark` is a 10px crimson filled circle, vertical-aligned with the wordmark.
- `.nav-contact` is a plain text link, no button styling.

### `<main>` hero

```html
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
```

- `.glow` is an absolutely-positioned div with the crimson radial gradient + blur, `z-index: -1`.
- Buttons are real `<a>` tags; `.btn-primary` is filled crimson, `.btn-ghost` is outlined hairline.

### `<footer>`

```html
<footer id="footer">
  <p class="legal-name">Taisen Industries LLC</p>
  <p class="legal-address">2108 N St Ste N · Sacramento, CA 95816</p>
  <p class="legal-email"><a href="mailto:info@taisenindustries.com">info@taisenindustries.com</a></p>
  <p class="copyright">© 2024–2026  Taisen Industries LLC</p>
</footer>
```

- Hairline top border, padding 48px top / 24px bottom.
- All text uses `--text-muted` color.
- Email link is the only interactive element; other lines are plain `<p>`.

### `favicon.svg`

10×10 crimson filled circle on transparent background. SVG (not ICO) so it scales cleanly on retina and tab indicators.

## Accessibility

- Semantic HTML: one `<h1>` (company name), `<header>`, `<main>`, `<footer>` landmarks
- All interactive elements are real anchor tags with `href`
- Decorative elements (logo dot, glow div) have `aria-hidden="true"`
- Focus states: 2px crimson outline at `outline-offset: 4px`, never `outline: none` without replacement
- Color contrast meets WCAG AA for all text
- `prefers-reduced-motion`: respected — no animations to disable, but `scroll-behavior: smooth` falls back to auto when reduced motion is preferred
- Page is keyboard-navigable: Tab → Contact (header) → Contact (hero) → Learn more → Email link (footer)

## SEO / meta tags

Minimal set in `<head>`:

```html
<title>Taisen Industries</title>
<meta name="description" content="Taisen Industries is a holding company for technology ventures and applied research, based in Sacramento, California.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:title" content="Taisen Industries">
<meta property="og:description" content="A holding company for technology ventures and applied research.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://taisenindustries.com">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
```

No Twitter card variants (covered by OG fallback). No structured data (overkill for one corporate page).

## Verification checklist

Before declaring the work complete:

- [ ] `index.html` opens correctly when double-clicked locally (file:// protocol — must not depend on a server)
- [ ] All paths are root-relative (`/favicon.svg`, `/styles.css`), no absolute or `./` paths
- [ ] No console errors / warnings in browser DevTools
- [ ] Lighthouse accessibility score ≥ 95 (informational, not a blocker)
- [ ] Renders correctly on mobile (Chrome DevTools mobile emulation, then real device after deploy)
- [ ] All three buttons/links work: header Contact (mailto), hero Contact (mailto), hero Learn more (anchors to footer)
- [ ] Footer email link is clickable (mailto)
- [ ] Page push to GitHub triggers Pages build successfully
- [ ] `taisenindustries.com` resolves to the page (after DNS propagates)
- [ ] `https://taisenindustries.com` serves the page with a valid cert (within 24h of DNS setup)
- [ ] `www.taisenindustries.com` redirects to apex

## Out of scope (deferred)

- Privacy policy page (not required for Apple LLC verification; can be added later if any Taisen-owned product needs to host one here)
- Analytics (none — keeping the page tracker-free is consistent with the "real corporate site" minimalism)
- Contact form (mailto is sufficient for a holding company)
- Multiple languages
- Dark/light mode toggle (page is dark-only by design)
- Blog, news, or "ventures" listing
- Any JavaScript

## Risks and open questions

1. **Apple reviewer expectations.** Apple's stated requirement is vague ("website needed"). If a reviewer rejects this as too minimal, the fastest fixes are: add a brief "What we do" section, add a privacy policy page, or add a "Ventures" page listing Adaptus. Defer those changes until rejection actually happens.
2. **DNS propagation lag.** GitHub Pages cert provisioning waits for DNS to resolve correctly. If Ace points the domain on day 0 but the cert doesn't appear within 24h, recheck DNS at registrar — most failures are typos in A records.
3. **Spam to `info@taisenindustries.com`.** Plain-text email in HTML is the standard convention for legitimacy but invites scraper spam. Monitor inbox volume; obfuscate with JS reveal if it becomes a problem.
