// Shared content and small generated blocks used by build.mjs.

export const SITE = 'https://www.anidha.com';

// Line icons, 24×24, drawn to one stroke weight.
const I = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
export const ICONS = {
  code: I('<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>'),
  platform: I('<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>'),
  design: I('<path d="M4 20h4L19.5 8.5a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="m13.5 6.5 4 4"/>'),
  cloud: I('<path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9.5H7z"/><path d="M10 14h4M12 12v4"/>'),
  data: I('<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6"/>'),
  iot: I('<path d="M3 12h3l2-5 3 10 3-8 2 3h5"/><circle cx="12" cy="12" r="10" opacity=".35"/>'),
  quality: I('<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3z"/><path d="m9 12 2 2 4-4"/>'),
  seal: I('<circle cx="12" cy="9" r="6"/><path d="m9 14-1.5 7L12 19l4.5 2L15 14"/><path d="m9.5 9 1.7 1.7L14.5 7.5"/>'),
  building: I('<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6M8 10h.01M12 10h.01M16 10h.01"/>'),
  cloudnet: I('<path d="M7 17a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 7.5a4.5 4.5 0 0 1 .5 9.5H7z"/><path d="M12 17v4M8 21h8"/>'),
  close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
};

// Phase-tracker state glyphs (shape + text carry the state, not colour alone)
export const PHASE_DOT = {
  done: `<svg class="phase-dot dot-done" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="m7 12.5 3.2 3.2L17 9" fill="none" stroke="#05335e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  progress: `<svg class="phase-dot" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"/></svg>`,
  planned: `<svg class="phase-dot" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/></svg>`,
};

// Colour icons: a tinted tile with a two-tone drawing, one hue per practice.
const T = (bg, d) => `<svg class="cicon" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="${bg}"/><g fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;
export const COLOR_ICONS = {
  code: T('#e0efff', '<rect x="6" y="8" width="20" height="16" rx="2.5" fill="#9fd3fb" stroke="#0f6cbd"/><path d="M6 12h20" stroke="#0f6cbd"/><path d="m13 15.5-2.5 2.5 2.5 2.5M19 15.5l2.5 2.5-2.5 2.5" stroke="#0b3f78"/><circle cx="9" cy="10" r=".6" fill="#0f6cbd" stroke="none"/><circle cx="11" cy="10" r=".6" fill="#0f6cbd" stroke="none"/>'),
  platform: T('#e8e8ff', '<rect x="7" y="7" width="18" height="7" rx="2" fill="#a5b4fc" stroke="#4338ca"/><rect x="7" y="18" width="18" height="7" rx="2" fill="#c7d2fe" stroke="#4338ca"/><path d="M16 14v4" stroke="#4338ca"/><circle cx="10.5" cy="10.5" r="1" fill="#f59e0b" stroke="none"/><circle cx="10.5" cy="21.5" r="1" fill="#22c55e" stroke="none"/><path d="M14 10.5h7M14 21.5h7" stroke="#4338ca"/>'),
  design: T('#ffe4f1', '<path d="M8 24v-4L19.5 8.5a2.8 2.8 0 0 1 4 4L12 24H8z" fill="#f9a8d4" stroke="#be185d"/><path d="m17.5 10.5 4 4" stroke="#be185d"/><path d="M8 20l4 4" stroke="#be185d"/><circle cx="23" cy="23" r="2.2" fill="#f59e0b" stroke="none"/>'),
  cloud: T('#dff3ff', '<path d="M11 23a5 5 0 0 1-.7-9.95A6.5 6.5 0 0 1 22.6 12a5 5 0 0 1 .4 10H11z" fill="#9edcfb" stroke="#0369a1"/><path d="M16 15v5M13.5 17.5h5" stroke="#f59e0b" stroke-width="2.2"/>'),
  data: T('#efe7ff', '<ellipse cx="16" cy="9.5" rx="8" ry="3" fill="#ddd0fe" stroke="#6d28d9"/><path d="M8 9.5v6.5c0 1.66 3.58 3 8 3s8-1.34 8-3V9.5" fill="#c4b5fd" stroke="#6d28d9"/><path d="M8 16v6.5c0 1.66 3.58 3 8 3s8-1.34 8-3V16" fill="#a78bfa" stroke="#6d28d9"/><circle cx="21" cy="21" r="1.2" fill="#f0abfc" stroke="none"/>'),
  iot: T('#ddf7f2', '<circle cx="16" cy="16" r="10" fill="#99f6e4" stroke="#0f766e" stroke-opacity=".5"/><path d="M6 16h4l2.5-5.5 3.5 11 3.5-9 2 3.5H26" stroke="#0f766e" stroke-width="2"/><circle cx="21.5" cy="16" r="1.5" fill="#f43f5e" stroke="none"/>'),
  quality: T('#dcfce7', '<path d="M16 6 9 9v5.5c0 4.8 3 8.9 7 10.5 4-1.6 7-5.7 7-10.5V9l-7-3z" fill="#86efac" stroke="#15803d"/><path d="m12.5 15.5 2.5 2.5 4.5-4.5" stroke="#14532d" stroke-width="2.2"/>'),
  msme: T('#fff1e6', '<path d="M7 24V13l9-6 9 6v11" fill="#fdba74" stroke="#c2410c"/><path d="M13 24v-6h6v6" fill="#fff7ed" stroke="#c2410c"/><path d="M5 24h22" stroke="#c2410c"/><circle cx="16" cy="13" r="1.6" fill="#16a34a" stroke="none"/>'),
  partner: T('#fff7db', '<path d="M11 21a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 21.8 11a4.5 4.5 0 0 1 .4 9H11z" fill="#fcd34d" stroke="#b45309"/><path d="m13 16.2 2.3 2.3 4.2-4.2" stroke="#7c2d12" stroke-width="2.2"/>'),
};

export const SERVICES = [
  { slug: 'software-engineering', icon: 'code', name: 'Software engineering',
    menu: 'Web, mobile, APIs and microservices',
    line: 'Web and mobile applications, APIs and services built to be maintained, not just shipped.',
    stack: 'Java, .NET, Python, Go, Node.js, React, Next.js, Flutter' },
  { slug: 'enterprise-platforms', icon: 'platform', name: 'Enterprise platforms', capability: true,
    menu: 'SAP and Salesforce implementation and integration',
    line: 'SAP and Salesforce implementation, integration, customisation and support.',
    stack: 'SAP, Salesforce, integration middleware, REST and event-driven APIs' },
  { slug: 'product-design', icon: 'design', name: 'UI/UX and product design',
    menu: 'Research, design systems and prototypes',
    line: 'Research, interaction design, design systems and accessible interfaces that teams can build from.',
    stack: 'User research, prototyping, design systems, WCAG 2.2 accessibility' },
  { slug: 'cloud-devops', icon: 'cloud', name: 'Cloud, DevOps and platform engineering',
    menu: 'AWS, Azure, GCP, Kubernetes, CI/CD, FinOps',
    line: 'Cloud foundations, Kubernetes platforms and delivery pipelines that are secure by default and cost-aware.',
    stack: 'AWS, Azure, Google Cloud, Kubernetes, Terraform, GitHub Actions, DevSecOps, FinOps' },
  { slug: 'data-ai', icon: 'data', name: 'Data, AI and automation',
    menu: 'GenAI, MLOps, AIOps, pipelines, migration',
    line: 'Data pipelines, GenAI applications and AI-assisted operations, with human review and audit trails built in.',
    stack: 'Python, FastAPI, PostgreSQL, TimescaleDB, LLM APIs, MLOps, AIOps, database migration' },
  { slug: 'industrial-iot', icon: 'iot', name: 'Industrial IoT',
    menu: 'Sensor-to-dashboard systems and condition monitoring',
    line: 'Sensor-to-dashboard systems for condition monitoring, real-time analytics and predictive maintenance.',
    stack: 'Device ingestion, time-series data, FFT analysis, alerting, multi-tenant dashboards' },
  { slug: 'quality-managed-services', icon: 'quality', name: 'Quality engineering and managed services', capability: true,
    menu: 'Test automation, SRE, run and support',
    line: 'Test automation, site reliability engineering and ongoing run-and-support for the systems you depend on.',
    stack: 'Test automation, performance testing, SRE, observability, incident response' },
];

export const servicesMenu = () => SERVICES.map(s =>
  `              <li><a href="/services/${s.slug}.html"><b>${s.name}</b><span>${s.menu}</span></a></li>`).join('\n');

export const servicesFooter = () => SERVICES.map(s =>
  `          <li><a href="/services/${s.slug}.html">${s.name}</a></li>`).join('\n');

export const practiceList = (headingLevel = 3) => `<ul class="practice-list">
${SERVICES.map(s => `  <li><a href="/services/${s.slug}.html">${COLOR_ICONS[s.icon]}<div><h${headingLevel}>${s.name}${s.capability ? '<span class="tag">Capability</span>' : ''}</h${headingLevel}><p>${s.line}</p><p class="stack">${s.stack}</p></div></a></li>`).join('\n')}
</ul>`;

// Hero systems map. Labels are links to the practice pages.
export const sysmap = () => {
  const left = [
    { s: 'software-engineering', y: 132, l: ['Software', 'engineering'] },
    { s: 'product-design', y: 232, l: ['UI/UX and', 'product design'] },
    { s: 'data-ai', y: 332, l: ['Data, AI and', 'automation'] },
  ];
  const right = [
    { s: 'enterprise-platforms', y: 182, l: ['Enterprise', 'platforms'] },
    { s: 'cloud-devops', y: 282, l: ['Cloud and', 'DevOps'] },
    { s: 'industrial-iot', y: 382, l: ['Industrial', 'IoT'] },
  ];
  const HUE = { 'software-engineering': '#0f6cbd', 'enterprise-platforms': '#4338ca', 'product-design': '#be185d', 'cloud-devops': '#0369a1', 'data-ai': '#6d28d9', 'industrial-iot': '#0f766e', 'quality-managed-services': '#15803d' };
  let i = 0;
  const node = (n, side) => {
    const nx = side === 'l' ? 162 : 258;
    const tx = side === 'l' ? 146 : 274;
    const anchor = side === 'l' ? 'end' : 'start';
    const idx = i++;
    return `<path class="trace" pathLength="1" style="--i:${idx}" d="M210 ${n.y}H${nx}"/>
  <a href="/services/${n.s}.html" class="node" style="--i:${idx};--hue:${HUE[n.s]}" aria-label="${n.l.join(' ')}">
    <rect class="focus-ring" x="${side === 'l' ? 2 : 248}" y="${n.y - 26}" width="170" height="58" rx="6"/>
    <circle cx="${nx}" cy="${n.y}" r="7"/>
    <text x="${tx}" y="${n.y - 3}" text-anchor="${anchor}">${n.l[0]}</text>
    <text x="${tx}" y="${n.y + 15}" text-anchor="${anchor}">${n.l[1]}</text>
  </a>`;
  };
  const bottomIdx = 6;
  return `<svg class="sysmap" viewBox="0 0 420 470" role="group" aria-labelledby="sysmap-title">
  <title id="sysmap-title">Seven engineering practices connected to your business</title>
  <path class="bus" pathLength="1" d="M210 70V418"/>
  <g class="hub" aria-hidden="true">
    <rect x="105" y="18" width="210" height="52" rx="6"/>
    <text x="210" y="50" text-anchor="middle">Your business</text>
  </g>
  ${left.map(n => node(n, 'l')).join('\n  ')}
  ${right.map(n => node(n, 'r')).join('\n  ')}
  <a href="/services/quality-managed-services.html" class="node" style="--i:${bottomIdx};--hue:#15803d" aria-label="Quality engineering and managed services">
    <rect class="focus-ring" x="95" y="408" width="230" height="58" rx="6"/>
    <circle cx="210" cy="418" r="7"/>
    <text x="210" y="443" text-anchor="middle">Quality and managed services</text>
    <text class="sub" x="210" y="460" text-anchor="middle">run, support, improve</text>
  </a>
</svg>`;
};

export const phases = (dark = true) => `<ol class="phases${dark ? ' on-dark' : ''}">
  <li>${PHASE_DOT.done}<b>Phase 1: MVP</b><span>Delivered</span></li>
  <li>${PHASE_DOT.done}<b>Phase 2: Real-time</b><span>Delivered</span></li>
  <li>${PHASE_DOT.progress}<b>Phase 3: Auto-scaling</b><span>In progress</span></li>
  <li>${PHASE_DOT.planned}<b>Phase 4: Security hardening</b><span>Planned</span></li>
</ol>`;

export const recognition = () => `<section class="recognition" aria-labelledby="recognition-title">
  <div class="wrap">
    <h2 id="recognition-title" class="visually-hidden">Recognition and registrations</h2>
    <ul class="recognition-list">
      <li><img class="rec-logo" src="/assets/recognition/startup-india.png" width="292" height="64" alt="Startup India"><div><b>DPIIT-recognised startup</b><span>Startup India, Government of India. <a class="link-button" href="/assets/recognition/dpiit-certificate-masked.pdf" data-dialog="cert-dialog">View certificate (masked)</a></span></div></li>
      <li>${COLOR_ICONS.msme}<div><b>MSME registered</b><span>Udyam registration, Ministry of MSME, since 26 March 2026</span></div></li>
      <li>${COLOR_ICONS.partner}<div><b>AWS Partner Network member</b><span>Registered partner and AWS Marketplace seller</span></div></li>
    </ul>
  </div>
</section>`;

export const certDialog = () => `<dialog class="cert-dialog" id="cert-dialog" aria-labelledby="cert-dialog-title">
  <div class="dialog-head">
    <h2 id="cert-dialog-title">DPIIT certificate of recognition (masked)</h2>
    <button class="icon-btn" type="button" data-close aria-label="Close">${ICONS.close}</button>
  </div>
  <div class="dialog-body">
    <img data-src="/assets/recognition/dpiit-certificate-masked.webp" width="1600" height="1131" alt="Certificate of Recognition from the Department for Promotion of Industry and Internal Trade, Government of India, recognising Anidha Tech Solutions LLP as a startup in the IT Services industry, IT Consulting sector. Incorporated 19 February 2026; issued 30 March 2026; valid until 18 February 2036. The certificate number and QR code are masked.">
    <p>The certificate number and QR code are masked. <a href="/assets/recognition/dpiit-certificate-masked.pdf">Download the masked PDF</a>.</p>
  </div>
</dialog>`;
