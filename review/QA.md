# QA report: anidha.com v2

Run on 24 Oct 2026 against the built `docs/` folder, served locally. The baseline is the live site at the same date.

## Lighthouse 12.2.1 (mobile preset)

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| **Before:** live home page | 61 | 93 | 96 | 100 | 4.1 s | 0 | 850 ms |
| Home | 100 | 100 | 100 | 100 | 1.5 s | 0 | 80 ms |
| Service: Cloud and DevOps | 100 | 100 | 100 | 100 | 1.5 s | 0 | 0 ms |
| Case study | 100 | 100 | 100 | 100 | 1.6 s | 0 | 0 ms |
| Article: AIOps | 100 | 100 | 100 | 100 | 1.6 s | 0 | 0 ms |
| Contact | 100 | 100 | 100 | 100 | 1.4 s | 0 | 0 ms |
| Products | 100 | 100 | 100 | 100 | 1.7 s | 0 | 0 ms |
| About | 100 | 100 | 100 | 100 | 1.6 s | 0 | 0 ms |

The new pages were measured locally, with no CDN latency. Expect slightly higher LCP in production; re-run
Lighthouse on the live URL after merge.

## Accessibility (axe-core 4.10.3)

- WCAG 2.0/2.1/2.2 A and AA plus best-practice rules, on all 26 pages at 1280 px and 375 px: **0 violations**.
  Two issues found on the first pass were fixed: the "Live" badge contrast (4.36:1, teal darkened to pass) and
  a nested `aside` landmark in articles.
- Keyboard, checked by script:
  - The skip link is the first tab stop.
  - The Services menu opens with Enter, moves focus into its links and closes with Escape, returning focus to the button.
  - The certificate dialog opens, traps focus and closes with Escape.
  - The mobile drawer works.
- Visible 2 px focus ring on every interactive element; `prefers-reduced-motion` disables the hero drawing.
- Phase states use shape and text as well as colour.
- Touch targets: buttons and nav items are at least 44 px; footer link lists are 40 px; inline text links follow the WCAG 2.5.8 inline exception.

## Site checks (`npm run check`)

- 27 HTML files: no broken internal links, srcsets or share images.
- Every image has alt text and width and height.
- Every page has a unique title and description, exactly one `h1`, a canonical URL and valid JSON-LD.
- Banned content scan: no old phone number, "Bangalore", Cloudflare email artefact, unsourced metric,
  partner-implying label, client name, dev URL or hidden product.
- Every URL of the previous site still resolves. `/solutions.html` redirects to `/services.html`.
- No console errors on any page.

## Viewports reviewed

375, 768, 1280 and 1920 px. Screenshots are in `review/screenshots/`.

## Design self-critique

- **Works:**
  - The condensed headline type and the systems map give the page a recognisable signature without decoration.
  - The phase tracker makes delivery status honest at a glance.
  - Every section ends in a next step.
- **Watch:**
  - The home page is long (8 sections). If analytics are added later, check scroll depth and consider moving "Technologies" to the Services page.
  - The products section has one live product. As others launch, give each its own feature panel rather than adding rows.
  - The case-study illustration is a redraw. Once the client approves, a sanitised real screenshot would add credibility.
