// Raster assets and share images. Needs dev dependencies (sharp, playwright) and Chromium.
//   node build/assets.mjs            brand icons (favicon, touch icon, logo PNG)
//   node build/assets.mjs --og       Open Graph share images, one per page "og" key
//   node build/assets.mjs --techelevate      re-capture the TechElevate screenshot
//   node build/assets.mjs --cert <masked.pdf> rebuild the raster-only certificate
// Outputs go to site/assets/; run `npm run build` afterwards to copy them into docs/.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = path.join(ROOT, 'site/assets');
const args = process.argv.slice(2);
const mark = fs.readFileSync(path.join(A, 'brand/anidha-mark.svg'));

async function chromium() {
  const { chromium } = await import('playwright');
  const exe = process.env.CHROMIUM_PATH;
  return chromium.launch(exe ? { executablePath: exe } : {});
}

// ---------- brand icons ----------
async function brand() {
  const onWhite = async (size, pad) => sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: await sharp(mark, { density: 600 }).resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: '#ffffff00' }).png().toBuffer(), gravity: 'center' }])
    .png().toBuffer();
  fs.writeFileSync(path.join(A, 'brand/apple-touch-icon.png'), await onWhite(180, 14));
  fs.writeFileSync(path.join(A, 'brand/anidha-logo-512.png'), await onWhite(512, 32));
  // favicon.ico with embedded PNGs (16, 32, 48)
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => sharp(mark, { density: 300 }).resize(s, s, { fit: 'contain', background: '#ffffff00' }).png().toBuffer()));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((s, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(s, e); header.writeUInt8(s, e + 1); header.writeUInt8(0, e + 2); header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(pngs[i].length, e + 8); header.writeUInt32LE(offset, e + 12);
    offset += pngs[i].length;
  });
  fs.writeFileSync(path.join(A, 'favicon.ico'), Buffer.concat([header, ...pngs]));
  console.log('brand icons written');
}

// ---------- certificate: raster only, so nothing hidden can be copied out ----------
async function cert(src) {
  if (!src || !fs.existsSync(src)) throw new Error('Pass the masked certificate PDF: --cert <file.pdf>');
  const tmp = fs.mkdtempSync(path.join(ROOT, '.cert-'));
  try {
    execFileSync('pdftoppm', ['-r', '200', '-png', '-singlefile', src, path.join(tmp, 'page')]);
    const png = path.join(tmp, 'page.png');
    const out = path.join(A, 'recognition');
    await sharp(png).resize({ width: 1600 }).webp({ quality: 80 }).toFile(path.join(out, 'dpiit-certificate-masked.webp'));
    const jpg = await sharp(png).resize({ width: 2000 }).jpeg({ quality: 82 }).toBuffer();
    // Image-only PDF: one page, one image, no text layer.
    const b = await chromium();
    const p = await b.newPage();
    await p.setContent(`<html><body style="margin:0"><img src="data:image/jpeg;base64,${jpg.toString('base64')}" style="width:100%;display:block"></body></html>`);
    await p.pdf({ path: path.join(out, 'dpiit-certificate-masked.pdf'), width: '297mm', height: '210mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    await b.close();
    console.log('certificate raster written');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// ---------- TechElevate screenshot (public landing page only) ----------
async function techelevate() {
  const b = await chromium();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await p.goto('https://techelevate.anidha.com/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const buf = await p.screenshot();
  await b.close();
  const out = path.join(A, 'products');
  for (const w of [960, 1440]) {
    await sharp(buf).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(out, `techelevate-${w}.webp`));
    await sharp(buf).resize({ width: w }).avif({ quality: 55 }).toFile(path.join(out, `techelevate-${w}.avif`));
  }
  console.log('TechElevate screenshots written');
}

// ---------- Open Graph images ----------
async function og() {
  const pagesDir = path.join(ROOT, 'site/pages');
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const seen = new Map([['default', { title: 'Software, platforms, cloud and AI, engineered by senior teams', kicker: 'Anidha Tech Solutions' }]]);
  for (const f of walk(pagesDir).filter((x) => x.endsWith('.html'))) {
    const fm = JSON.parse(fs.readFileSync(f, 'utf8').match(/^<!--(\{[\s\S]*?\})-->/)[1]);
    if (!fm.og || seen.has(fm.og)) continue;
    const title = fm.og === 'home' ? 'Software, platforms, cloud and AI, engineered by senior teams' : fm.title.replace(/^Case study: /, '');
    const kicker = fm.layout === 'article' ? 'Insights' : fm.service ? 'Services' : fm.caseStudy ? 'Case study' : 'Anidha Tech Solutions';
    seen.set(fm.og, { title, kicker });
  }
  const font = pathToFileURL(path.join(A, 'fonts/instrument-sans-latin-wdth-wght.woff2')).href;
  const logo = `data:image/svg+xml;base64,${mark.toString('base64')}`;
  const b = await chromium();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  fs.mkdirSync(path.join(A, 'og'), { recursive: true });
  for (const [key, { title, kicker }] of seen) {
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    await p.setContent(`<!doctype html><html><head><style>
      @font-face{font-family:IS;src:url(${font}) format("woff2");font-weight:400 700;font-stretch:75% 100%}
      body{margin:0;width:1200px;height:630px;font-family:IS,sans-serif;background:#f6f8fb;color:#05335e;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;padding:64px 72px;position:relative;overflow:hidden}
      .top{display:flex;align-items:center;gap:20px}.top img{width:64px}
      .name b{display:block;font-size:30px;letter-spacing:.16em;font-stretch:80%}.name span{font-size:17px;color:#4a5a70}
      .k{font-size:24px;color:#0f6cbd;font-weight:600;margin-bottom:16px}
      h1{margin:0;font-size:${title.length > 60 ? 58 : 70}px;line-height:1.02;font-weight:600;font-stretch:76%;letter-spacing:-.02em;max-width:930px}
      .foot{display:flex;justify-content:space-between;font-size:22px;color:#4a5a70;border-top:2px solid #d5dde8;padding-top:20px}
      .line{position:absolute;right:72px;top:64px;width:2px;height:150px;background:#0f6cbd}.dot{position:absolute;right:65px;top:214px;width:16px;height:16px;border-radius:50%;border:3px solid #0f6cbd;background:#fff}
    </style></head><body>
      <div class="top"><img src="${logo}"><div class="name"><b>ANIDHA</b><span>Tech Solutions LLP</span></div></div>
      <div><div class="k">${esc(kicker)}</div><h1>${esc(title)}</h1></div>
      <div class="foot"><span>www.anidha.com</span><span>Hyderabad, India</span></div>
      <div class="line"></div><div class="dot"></div>
    </body></html>`, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const buf = await p.screenshot({ type: 'png' });
    await sharp(buf).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(A, 'og', `${key}.png`));
  }
  await b.close();
  console.log(`${seen.size} share images written`);
}

if (args.includes('--og')) await og();
else if (args.includes('--techelevate')) await techelevate();
else if (args.includes('--cert')) await cert(args[args.indexOf('--cert') + 1]);
else await brand();
