// Diwali 2026 theme. Loaded only between 9 and 23 November 2026 (IST) by the inline
// date check in partials/head.html, or with ?diwali=preview. Decorative only: nothing
// here changes content, steals focus or shifts layout.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Diya SVG ----------
  var DIYA = '<svg viewBox="0 0 64 48" aria-hidden="true" class="diya">' +
    '<circle class="diya-glow" cx="32" cy="15" r="15" fill="#fde68a" opacity=".45"/>' +
    '<g class="diya-flame"><path d="M32 4c4 6 6 9 6 13a6 6 0 0 1-12 0c0-4 2-7 6-13z" fill="#f59e0b"/><path d="M32 10c2 3 3 5 3 7a3 3 0 0 1-6 0c0-2 1-4 3-7z" fill="#fef3c7"/></g>' +
    '<path d="M6 26h52c-2 11-12 18-26 18S8 37 6 26z" fill="#c2541b"/>' +
    '<path d="M6 26h52" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M16 33h32" stroke="#fde68a" stroke-width="1.5" stroke-dasharray="2 3" stroke-linecap="round" opacity=".8"/>' +
    '</svg>';

  // ---------- Strip of diyas under the header ----------
  function fillStrip() {
    var strip = document.querySelector('.festive-strip');
    if (!strip) return;
    var count = Math.max(4, Math.min(12, Math.round(window.innerWidth / 150)));
    var html = '';
    for (var i = 0; i < count; i++) html += '<span style="--d:' + (i * 0.37 % 1.6).toFixed(2) + 's">' + DIYA + '</span>';
    strip.innerHTML = '<div class="festive-diyas">' + html + '</div>';
  }

  // ---------- Fireworks behind the first hero ----------
  function fireworks() {
    if (reduceMotion) return;
    var host = document.querySelector('.hero, .page-hero');
    if (!host) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'fireworks';
    canvas.setAttribute('aria-hidden', 'true');
    host.insertBefore(canvas, host.firstChild);
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    function size() {
      W = host.clientWidth; H = host.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener('resize', size, { passive: true });

    var COLOURS = ['#f59e0b', '#f97316', '#ef4444', '#ec4899', '#a855f7', '#0ea5e9', '#14b8a6', '#eab308'];
    var rockets = [], sparks = [];
    var visible = true, running = true, last = 0, nextLaunch = 300;
    var started = performance.now(), LIFETIME = 60000; // stop launching after a minute

    function launch() {
      // Rockets rise from the lower edge, mostly at the sides so the text stays clear
      // Wide screens: keep bursts beside the text (right of the headline). Narrow: anywhere, dimmer.
      var side = W >= 960 ? 0.56 + Math.random() * 0.4 : 0.05 + Math.random() * 0.9;
      rockets.push({ x: side * W, y: H, vx: (Math.random() - 0.5) * 0.6, vy: -(H / 120 + Math.random() * 2.2), tx: H * (0.15 + Math.random() * 0.35), c: COLOURS[(Math.random() * COLOURS.length) | 0] });
    }
    function burst(r) {
      var n = 34 + ((Math.random() * 18) | 0);
      var c2 = COLOURS[(Math.random() * COLOURS.length) | 0];
      for (var i = 0; i < n; i++) {
        var a = (Math.PI * 2 * i) / n, sp = 1.4 + Math.random() * 2.4;
        sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: i % 3 ? r.c : c2 });
      }
    }
    function frame(t) {
      if (!running) return;
      var dt = Math.min(32, t - (last || t)); last = t;
      ctx.clearRect(0, 0, W, H);
      if (t - started < LIFETIME) {
        nextLaunch -= dt;
        if (nextLaunch <= 0) { launch(); nextLaunch = 900 + Math.random() * 1500; }
      }
      ctx.globalCompositeOperation = 'source-over';
      for (var i = rockets.length - 1; i >= 0; i--) {
        var r = rockets[i];
        r.x += r.vx; r.y += r.vy; r.vy += 0.02;
        ctx.fillStyle = r.c; ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.arc(r.x, r.y, 2, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.35; ctx.fillRect(r.x - 0.75, r.y, 1.5, 14);
        if (r.y <= r.tx || r.vy >= 0) { burst(r); rockets.splice(i, 1); }
      }
      for (var j = sparks.length - 1; j >= 0; j--) {
        var s = sparks[j];
        s.x += s.vx; s.y += s.vy; s.vx *= 0.985; s.vy = s.vy * 0.985 + 0.035; s.life -= 0.012;
        if (s.life <= 0) { sparks.splice(j, 1); continue; }
        ctx.globalAlpha = Math.max(0, s.life) * (W >= 960 ? 0.9 : 0.45); ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      var done = t - started >= LIFETIME && !rockets.length && !sparks.length;
      if (done) { running = false; canvas.remove(); return; }
      if (visible && !document.hidden) requestAnimationFrame(frame);
    }
    function resume() { if (running && visible && !document.hidden) { last = 0; requestAnimationFrame(frame); } }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { var was = visible; visible = e[0].isIntersecting; if (visible && !was) resume(); }).observe(host);
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) resume(); });
    requestAnimationFrame(frame);
  }

  // ---------- Greeting: a few seconds, once per visit ----------
  var QUOTES = [
    'One diya can light a thousand more without losing its own flame. May the ideas you find here light up your next project.',
    'Diwali is the victory of light over darkness. Let clarity guide your next technology decision: see how we design, build and run systems that last.',
    'Clear out the old, welcome the new. This Diwali, retire one manual process and let good engineering carry the load.',
  ];
  function greeting() {
    try { if (sessionStorage.getItem('anidha-diwali-seen')) return; sessionStorage.setItem('anidha-diwali-seen', '1'); } catch (e) { /* storage blocked: show once per page */ }
    var quote = QUOTES[(Math.random() * QUOTES.length) | 0];
    var box = document.createElement('aside');
    box.className = 'diwali-wish';
    box.setAttribute('aria-labelledby', 'diwali-wish-title');
    box.innerHTML =
      '<div class="wish-diya">' + DIYA + '</div>' +
      '<div class="wish-body">' +
      '<p class="wish-title" id="diwali-wish-title">Happy Diwali!</p>' +
      '<p class="wish-text" role="status">Warm wishes for light, health and success from everyone at Anidha Tech Solutions.</p>' +
      '<p class="wish-quote">' + quote + '</p>' +
      '<a class="wish-link" href="/services.html">Explore our services</a>' +
      '</div>' +
      '<button class="wish-close" type="button" aria-label="Close Diwali greeting"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<span class="wish-timer" aria-hidden="true"></span>';
    document.body.appendChild(box);

    var SHOW_MS = 7000, remaining = SHOW_MS, startedAt = 0, timer = null, closed = false;
    var bar = box.querySelector('.wish-timer');
    function close() {
      if (closed) return; closed = true; clearTimeout(timer);
      box.classList.remove('is-open');
      setTimeout(function () { box.remove(); }, reduceMotion ? 0 : 300);
    }
    function run() {
      startedAt = Date.now();
      timer = setTimeout(close, remaining);
      bar.style.transition = 'transform ' + remaining + 'ms linear';
      bar.style.transform = 'scaleX(0)';
    }
    function pause() {
      if (closed || !timer) return;
      clearTimeout(timer); timer = null;
      remaining = Math.max(1500, remaining - (Date.now() - startedAt));
      var w = getComputedStyle(bar).transform; bar.style.transition = 'none'; bar.style.transform = w === 'none' ? 'scaleX(1)' : w;
    }
    function resume() { if (!closed && !timer) run(); }
    box.querySelector('.wish-close').addEventListener('click', close);
    box.addEventListener('mouseenter', pause); box.addEventListener('mouseleave', resume);
    box.addEventListener('focusin', pause); box.addEventListener('focusout', function (e) { if (!box.contains(e.relatedTarget)) resume(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    setTimeout(function () {
      box.classList.add('is-open');
      requestAnimationFrame(function () { requestAnimationFrame(run); });
    }, 1200);
  }

  function start() { fillStrip(); fireworks(); greeting(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
