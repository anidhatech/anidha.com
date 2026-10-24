# anidha.com

Source for [www.anidha.com](https://www.anidha.com), the website of Anidha Tech Solutions LLP.

GitHub Pages serves the `docs/` folder of the `main` branch. There is no server: every page is a
static file. `docs/` is **generated**, so edit the sources in `site/` and rebuild. Do not edit `docs/` by hand,
except `docs/CNAME`, which the build never touches.

## Layout

```
site/
  pages/           one HTML file per page; JSON front matter at the top sets title, URL, breadcrumb, etc.
  partials/        head, header, footer and the contact band shared by every page
  styles/site.css  design tokens and all styles (no framework)
  scripts/site.js  small progressive-enhancement script (menu, copy buttons, certificate viewer)
  assets/          fonts, logo, images, share images (copied to docs/assets/)
  static/          files kept at legacy public URLs (e.g. /images/anidha.png)
build/
  build.mjs        site/ → docs/  (Node built-ins only)
  content.mjs      shared content: the services list, icons, systems map, phase tracker, recognition strip
  assets.mjs       raster work: favicons, share images, screenshots, certificate (needs dev dependencies)
  check.mjs        checks the built site: links, alt text, metadata, banned claims, legacy URLs
docs/              built output, served by GitHub Pages
```

## Rebuild

Requires Node 20 or later.

```bash
npm install            # dev dependencies (sharp, playwright, axe-core) — only needed for assets
npm run build          # regenerate docs/ from site/
npm run check          # verify the result
npm run preview        # or: python3 -m http.server 4321 --directory docs
```

`npm run build` uses only Node built-ins, so it also runs in CI. It also copies `docs/` to `public/` (git-ignored) because the legacy workflow uploads that folder.

### When you change…

| Change | Do |
|---|---|
| Page copy | Edit `site/pages/…`, then `npm run build` |
| A new page | Add a file under `site/pages/` with front matter (copy an existing page), then build. It joins the sitemap automatically. |
| Services list, product rows, phase status | `build/content.mjs` (and the matching page), then build |
| Page titles (share images) | `npm run og` (needs Chromium: `npx playwright install chromium`), then build |
| TechElevate screenshot | `node build/assets.mjs --techelevate`, then build |
| Certificate | `node build/assets.mjs --cert <masked.pdf>`. Produces a raster-only image and PDF with no text layer, so nothing hidden under a mask can be copied out. |
| Logo or favicon | Replace `site/assets/brand/anidha-mark.svg`, run `npm run assets`, then build |

### Front matter keys

`title`, `description` (unique per page), `path` (public URL), `section` (highlights the nav item),
`breadcrumb`, `og` (share image name), `service` (adds Service JSON-LD), `caseStudy`, `layout`
(`article` or `redirect` with `to`), `cta: false` (hides the contact band), `noindex`.

## Content rules

- Publish only claims we can substantiate. No unsourced metrics, logos, testimonials or client counts.
- Client names, logos and outcome figures need the client's written approval. The case study is
  anonymised until then. `npm run check` also fails if any term listed in `docs-internal/banned-terms.txt` (git-ignored, kept locally because this repo is public) appears on the site.
- Practices we have not yet delivered as Anidha are labelled "Capability".
- Contact details: contact@anidha.com, +91 77998 32255 (`tel:+917799832255`), Hyderabad. Email
  links are wrapped in `<!--email_off-->` so Cloudflare does not rewrite them.
- British/Indian-English spelling; sentence-case headings; every button is a verb phrase.

The `.github/workflows/ci-cd.yml` workflow predates this site and deploys to S3. It is not used by
GitHub Pages.
