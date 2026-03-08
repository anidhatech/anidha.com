#!/usr/bin/env node

/**
 * Sitemap Generator for Anidha Tech Solutions LLP
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://anidha.com';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Priority mapping
const PRIORITIES = {
  '/': 1.0,
  '/services.html': 0.9,
  '/solutions.html': 0.9,
  '/case-studies.html': 0.8,
  '/about.html': 0.7,
  '/contact.html': 0.6,
  '/blog/': 0.9,
};

function createUrlset() {
  const urlset = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static pages
  let sitemap = urlset;
  for (const [page, priority] of Object.entries(PRIORITIES)) {
    const changefreq = priority >= 0.9 ? 'weekly' : 'monthly';
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${BASE_URL}${page}</loc>\n`;
    sitemap += `    <priority>${priority}</priority>\n`;
    sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
    sitemap += `  </url>\n`;
  }

  // Add blog posts (if any)
  const blogDir = path.join(PUBLIC_DIR, 'blog', 'articles');
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir);
    files.forEach(filename => {
      if (filename.endsWith('.html')) {
        const slug = filename.replace('.html', '');
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${BASE_URL}/blog/articles/${slug}</loc>\n`;
        sitemap += `    <priority>0.7</priority>\n`;
        sitemap += `    <changefreq>weekly</changefreq>\n`;
        sitemap += `  </url>\n`;
      }
    });
  }

  sitemap += '</urlset>';
  return sitemap;
}

function main() {
  const sitemap = createUrlset();
  const outputPath = path.join(PUBLIC_DIR, 'sitemap.xml');

  fs.writeFileSync(outputPath, sitemap, 'utf8');
  console.log(`Sitemap generated: ${outputPath}`);
}

if (require.main === module) {
  main();
}

module.exports = { createUrlset };
