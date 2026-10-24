// Static site build: site/ → docs/. Node built-ins only, so it runs anywhere (including CI).
//   node build/build.mjs
// Share images and raster assets are produced separately by build/assets.mjs.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as C from './content.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'site');
const OUT = path.join(ROOT, 'docs');
const KEEP = new Set(['CNAME']); // never deleted or rewritten
const YEAR = new Date().getFullYear();

const read = (p) => fs.readFileSync(p, 'utf8');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
  const p = path.join(dir, d.name);
  return d.isDirectory() ? walk(p) : [p];
});
const write = (rel, data) => {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data);
};

// ---------- clean output (keep CNAME) ----------
for (const entry of fs.readdirSync(OUT)) {
  if (!KEEP.has(entry)) fs.rmSync(path.join(OUT, entry), { recursive: true, force: true });
}

// ---------- static assets ----------
const css = read(path.join(SRC, 'styles/site.css'));
const minCss = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/:\s+/g, ':').replace(/;}/g, '}').trim();
const js = read(path.join(SRC, 'scripts/site.js'));
write('assets/site.css', minCss);
write('assets/site.js', js);
for (const f of walk(path.join(SRC, 'assets'))) {
  const rel = path.relative(path.join(SRC, 'assets'), f);
  if (rel === 'favicon.ico') { write('favicon.ico', fs.readFileSync(f)); continue; }
  write(path.join('assets', rel), fs.readFileSync(f));
}
write('.nojekyll', '');
// Files kept at their original public URLs (e.g. /images/anidha.png is linked from elsewhere)
const STATIC = path.join(SRC, 'static');
if (fs.existsSync(STATIC)) for (const f of walk(STATIC)) write(path.relative(STATIC, f), fs.readFileSync(f));

// ---------- templating ----------
const partials = Object.fromEntries(fs.readdirSync(path.join(SRC, 'partials')).map((f) => [f.replace('.html', ''), read(path.join(SRC, 'partials', f))]));
const blocks = {
  practiceList: () => C.practiceList(3),
  practiceListH2: () => C.practiceList(2),
  sysmap: C.sysmap,
  phases: () => C.phases(true),
  phasesLight: () => C.phases(false),
  recognition: C.recognition,
  certDialog: C.certDialog,
};
const render = (tpl, vars) => tpl
  .replace(/\{\{icon:([a-z]+)\}\}/g, (_, n) => C.ICONS[n] ?? '')
  .replace(/\{\{\{block:([A-Za-z0-9]+)\}\}\}/g, (_, n) => (blocks[n] ? blocks[n](vars) : ''))
  .replace(/\{\{\{([A-Za-z_]+)\}\}\}/g, (_, k) => vars[k] ?? '')
  .replace(/\{\{([A-Za-z_]+)\}\}/g, (_, k) => esc(vars[k]));

// ---------- pages ----------
const pages = walk(path.join(SRC, 'pages')).filter((f) => f.endsWith('.html')).map((file) => {
  const raw = read(file);
  const m = raw.match(/^<!--(\{[\s\S]*?\})-->\n?/);
  if (!m) throw new Error(`Missing front matter: ${file}`);
  return { ...JSON.parse(m[1]), body: raw.slice(m[0].length), file };
});

const outFile = (p) => (p.endsWith('/') ? `${p}index.html` : p).replace(/^\//, '');
const ORG = {
  '@type': 'Organization', '@id': `${C.SITE}/#organization`,
  name: 'Anidha Tech Solutions LLP', alternateName: 'Anidha Tech Solutions',
  url: `${C.SITE}/`, logo: `${C.SITE}/assets/brand/anidha-logo-512.png`,
  email: 'contact@anidha.com', telephone: '+91-77998-32255', foundingDate: '2026-02-19',
  address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressRegion: 'Telangana', addressCountry: 'IN' },
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: 'contact@anidha.com', telephone: '+91-77998-32255', areaServed: ['IN', 'AE', 'SA', 'US'], availableLanguage: ['en'] }],
  sameAs: ['https://www.linkedin.com/company/anidha-tech-solutions', 'https://x.com/AnidhaTech', 'https://www.instagram.com/anidha_tech/', 'https://www.facebook.com/profile.php?id=61584986135273', 'https://github.com/anidhatech'],
};

const articles = pages.filter((p) => p.layout === 'article').sort((a, b) => b.date.localeCompare(a.date));
const fmtDate = (d) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
blocks.articleList = () => `<ul class="article-list">\n${articles.map((a) => `  <li><a href="${a.path}"><div><time datetime="${a.date}">${fmtDate(a.date)}</time><br><span class="cat">${esc(a.category)} · ${a.minutes} min read</span></div><div><h2>${esc(a.title)}</h2><p>${esc(a.description)}</p></div></a></li>`).join('\n')}\n</ul>`;
blocks.articleListShort = () => `<ul class="article-list">\n${articles.slice(0, 3).map((a) => `  <li><a href="${a.path}"><div><time datetime="${a.date}">${fmtDate(a.date)}</time></div><div><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p></div></a></li>`).join('\n')}\n</ul>`;

const CTA_DEFAULT = {
  ctaTitle: 'Tell us what you are building',
  ctaText: 'Email or call us with a short description of the problem. A senior engineer aims to reply within one working day with questions or a suggested next step.',
};

const sitemap = [];
for (const page of pages) {
  const canonical = `${C.SITE}${page.path}`;
  const crumbs = page.breadcrumb ? [['Home', '/'], ...page.breadcrumb] : null;
  const graph = [ORG];
  if (page.path === '/') graph.push({ '@type': 'WebSite', '@id': `${C.SITE}/#website`, url: `${C.SITE}/`, name: 'Anidha Tech Solutions', publisher: { '@id': ORG['@id'] }, inLanguage: 'en-GB' });
  if (crumbs) graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(href ? { item: `${C.SITE}${href}` } : { item: canonical }) })) });
  if (page.service) graph.push({ '@type': 'Service', name: page.service, serviceType: page.service, description: page.description, provider: { '@id': ORG['@id'] }, areaServed: ['IN', 'AE', 'SA', 'US'], url: canonical });
  if (page.layout === 'article' || page.caseStudy) graph.push({ '@type': 'Article', headline: page.title, description: page.description, ...(page.date ? { datePublished: page.date } : {}), author: { '@id': ORG['@id'] }, publisher: { '@id': ORG['@id'] }, mainEntityOfPage: canonical, image: `${C.SITE}/assets/og/${page.og || 'default'}.png`, inLanguage: 'en-GB' });

  const ogImage = `${C.SITE}/assets/og/${page.og || 'default'}.png`;
  const vars = {
    ...CTA_DEFAULT, ...page,
    fullTitle: page.path === '/' ? page.title : `${page.title} | Anidha Tech Solutions`,
    ogTitle: page.title, ogType: page.layout === 'article' ? 'article' : 'website',
    canonical, ogImage, year: YEAR,
    cssHash: hash(minCss), jsHash: hash(js),
    robots: page.noindex ? '<meta name="robots" content="noindex, follow">' : '',
    jsonld: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c'),
    servicesMenu: C.servicesMenu(), servicesFooter: C.servicesFooter(),
  };
  // current-section markers in the main nav
  const section = page.section || '';
  for (const s of ['industries', 'products', 'work', 'about', 'blog', 'careers', 'contact']) {
    vars[`cur_${s}`] = section === s ? ` aria-current="${page.path === `/${s}.html` || page.path === `/${s}/` ? 'page' : 'true'}"` : '';
  }
  vars.currentServices = section === 'services' ? 'data-current="true"' : '';

  const breadcrumbHtml = crumbs ? `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${crumbs.map(([n, h], i) => (i === crumbs.length - 1 ? `<li><span aria-current="page">${esc(n)}</span></li>` : `<li><a href="${h}">${esc(n)}</a></li>`)).join('')}</ol></nav>` : '';
  vars.breadcrumbHtml = breadcrumbHtml;
  let body = render(page.body, vars);
  if (page.layout === 'article') {
    body = `<article>
<header class="page-hero">
  <div class="wrap">
    ${breadcrumbHtml}
    <h1>${esc(page.title)}</h1>
    <p class="lead">${esc(page.description)}</p>
    <p class="article-meta"><time datetime="${page.date}">${fmtDate(page.date)}</time> · ${esc(page.category)} · ${page.minutes} min read · Anidha Tech Solutions</p>
  </div>
</header>
<div class="section"><div class="wrap"><div class="prose">
${body}
</div></div></div>
</article>`;
  }

  if (page.layout === 'redirect') {
    write(outFile(page.path), `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>${esc(page.title)}</title><link rel="canonical" href="${C.SITE}${page.to}"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0; url=${page.to}"></head><body><p>This page has moved to <a href="${page.to}">${esc(page.title)}</a>.</p></body></html>\n`);
    continue;
  }

  const cta = page.cta === false ? '' : render(partials.cta, vars);
  const html = render(partials.head, vars) + render(partials.header, vars) + `<main id="main">\n${body}\n` + render(partials.footer, { ...vars, cta });
  write(outFile(page.path), html.replace(/\n{3,}/g, '\n\n'));
  if (!page.noindex) sitemap.push({ loc: canonical, lastmod: page.updated || page.date || new Date().toISOString().slice(0, 10) });
}

// ---------- sitemap, robots ----------
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.sort((a, b) => a.loc.localeCompare(b.loc)).map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${C.SITE}/sitemap.xml\n`);

console.log(`Built ${pages.length} pages into docs/ (${sitemap.length} in sitemap, CSS ${(minCss.length / 1024).toFixed(1)} KB)`);
