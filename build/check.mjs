// Static checks on the built site in docs/: links, images, metadata and banned content.
//   node build/check.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(OUT);
const html = files.filter((f) => f.endsWith('.html'));
const problems = [];
const titles = new Map();
const descs = new Map();

// Content that must never appear on the site
const BANNED = [
  [/98855|9885543960|43960/, 'old phone number'],
  [/Bangalore|Bengaluru/i, 'wrong city'],
  [/email-protection|\[email&#160;protected\]|\[email protected\]/, 'Cloudflare email artefact'],
  [/98%|99\.99%|99\.9%|60% |10x |85%|Certified Partner|Technology Partners/, 'unsubstantiated claim'],
  [/cdn\.tailwindcss\.com|unsplash\.com|font-awesome/, 'external dependency'],
];
// Names that must not be published (unapproved clients, hidden products) are kept out of this
// public repository: one term per line in docs-internal/banned-terms.txt (git-ignored).
const PRIVATE = path.join(ROOT, 'docs-internal/banned-terms.txt');
if (fs.existsSync(PRIVATE)) {
  for (const term of fs.readFileSync(PRIVATE, 'utf8').split('\n').map((t) => t.trim()).filter((t) => t && !t.startsWith('#'))) {
    BANNED.push([new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), 'private term from docs-internal/banned-terms.txt']);
  }
} else {
  console.log('Note: docs-internal/banned-terms.txt not found; private-term scan skipped.');
}

const exists = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  const p = path.join(OUT, clean);
  if (clean.endsWith('/')) return fs.existsSync(path.join(p, 'index.html'));
  return fs.existsSync(p);
};

for (const f of html) {
  const rel = '/' + path.relative(OUT, f).replace(/\\/g, '/');
  const s = fs.readFileSync(f, 'utf8');
  const isRedirect = /http-equiv="refresh"/.test(s);
  for (const [re, label] of BANNED) if (re.test(s)) problems.push(`${rel}: ${label} (${s.match(re)[0]})`);
  for (const m of s.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(u)) continue;
    if (!u.startsWith('/')) { problems.push(`${rel}: relative URL ${u}`); continue; }
    if (!exists(u)) problems.push(`${rel}: broken link ${u}`);
  }
  for (const m of s.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) {
    const u = part.trim().split(/\s+/)[0];
    if (u.startsWith('/') && !exists(u)) problems.push(`${rel}: broken srcset ${u}`);
  }
  for (const m of s.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt="/.test(tag)) problems.push(`${rel}: img without alt ${tag.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) problems.push(`${rel}: img without width/height ${tag.slice(0, 80)}`);
  }
  if (isRedirect) continue;
  const title = s.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = s.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!title) problems.push(`${rel}: missing title`);
  if (!desc) problems.push(`${rel}: missing description`);
  if (titles.has(title)) problems.push(`${rel}: duplicate title with ${titles.get(title)}`); else titles.set(title, rel);
  if (descs.has(desc)) problems.push(`${rel}: duplicate description with ${descs.get(desc)}`); else descs.set(desc, rel);
  if ((s.match(/<h1[\s>]/g) || []).length !== 1) problems.push(`${rel}: expected exactly one h1`);
  if (!/<link rel="canonical" href="https:\/\/www\.anidha\.com\//.test(s)) problems.push(`${rel}: missing canonical`);
  const og = s.match(/<meta property="og:image" content="https:\/\/www\.anidha\.com([^"]+)"/)?.[1];
  if (!og || !exists(og)) problems.push(`${rel}: missing og:image file ${og}`);
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { problems.push(`${rel}: invalid JSON-LD`); }
  }
}
if (!fs.existsSync(path.join(OUT, 'CNAME'))) problems.push('docs/CNAME missing');

// Every URL of the previous site must still resolve
for (const u of ['/', '/index.html', '/services.html', '/solutions.html', '/industries.html', '/about.html', '/contact.html', '/blog/', '/blog/index.html',
  '/blog/articles/building-resilient-cicd.html', '/blog/articles/future-intelligent-automation.html', '/blog/articles/getting-started-aiops.html',
  '/blog/articles/industrial-iot-sensors-insights.html', '/blog/articles/mlops-production-lessons.html', '/blog/articles/multi-cloud-strategy.html',
  '/blog/articles/zero-database-migrations.html', '/favicon.ico', '/robots.txt', '/sitemap.xml', '/careers.html', '/privacy.html', '/404.html', '/images/anidha.png', '/images/favicon-32x32.png', '/images/apple-touch-icon.png']) {
  if (!exists(u)) problems.push(`legacy URL no longer resolves: ${u}`);
}

console.log(`${html.length} HTML files, ${files.length} files checked`);
if (problems.length) { console.log(problems.join('\n')); process.exit(1); }
console.log('All checks passed');
