# Handover: anidha.com v2

## What changed
- **Repositioning:** from a DevOps/AIOps consultancy to a technology-agnostic engineering partner with seven
  practices organised by outcome.
- **New pages:**
  - Services hub plus one page per practice
  - Products
  - Work, with the industrial IoT case study
  - Careers
  - Privacy notice
  - 404 page
- **Rewritten:** Home, Industries, About, Contact.
- **Restyled:** Insights; the 7 articles keep their URLs.
- **New stack:** hand-written CSS from design tokens, a self-hosted variable font and about 2 KB of JS. No Tailwind CDN,
  Font Awesome or hot-linked images. A small Node build produces `docs/` (see `README.md`).
- **SEO:**
  - Canonical `www` URLs, plus Open Graph and Twitter tags with a generated share image per page.
  - JSON-LD: Organization, WebSite, BreadcrumbList, Service and Article.
  - `sitemap.xml`, a corrected `robots.txt` and a 404 page.

## Removed, and why
| Removed | Reason |
|---|---|
| 98% "automation success", 60% "cost reduction", 10x, 99.9%, 85%, 50%, "up to 90%" MTTD/MTTR, 35/40/25/20%, 80%, 99.99% | No source. Replaced with facts we can show (practices, products, delivery phases). |
| "Technology Partners" strip, "AWS Certified Partners", "Platform Experts" | Implied formal partnerships. Now "Technologies we work with"; AWS Partner Network membership is stated as text. |
| HIPAA, high-frequency trading and RBI/SEBI claims on Industries | Not delivered. Industries now separate proof from capability. |
| Contact form | It posted to an endpoint that does not exist and still told visitors their message was sent. Replaced with email and phone. |
| Old phone number 98855 43960 (header) | Wrong. Every page now uses +91 77998 32255. |
| `DPIIT-Statup-India-Cert-Masked.pdf` | The certificate number was recoverable from its text layer. Replaced with a raster-only image and PDF. |
| Unsplash images, 7 unused 2–3 MB PNGs, `header-test.txt`, `components/header.html` loader | Broken, unused or slow. |
| `public/`, `scripts/`, committed `node_modules/`, `.DS_Store` | Stale copies and tooling not used by Pages. |

## Approvals and assets still needed
- [x] **Case-study client:** MVS ACMEI approved for naming and logo (owner confirmation, 25 Oct 2026). Engagement title: AWS Migration & Full-Stack Enhancement, Enterprise IoT Data Sync & Analytics Platform.
- [ ] **Outcome figures** for the case study, once measured in service.
- [ ] **Git history:** the old certificate PDF (with the extractable number) remains in history. Purging needs a force-push to `main` by an owner.
- [ ] **Masked Udyam certificate**, if you want a "view certificate" link like DPIIT. The current site shows text only.
- [ ] **Leadership:** names, photos and bios when ready (About currently states industry experience only).
- [ ] **AWS Partner badge artwork:** only if Badge manager grants one.
- [ ] **Product launches:** move each product from "In development" to a full panel when it launches.
- [ ] **After merge:** re-run Lighthouse on https://www.anidha.com and submit `sitemap.xml` in Google Search Console.
- [ ] **Credentials:** rotate the client dev-environment password that was shared during discovery.
