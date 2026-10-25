// Progressive enhancement only: every link and piece of content works without this file.
(function () {
  var doc = document.documentElement;

  // Mobile navigation drawer
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
  }

  // Services menu (disclosure pattern)
  var menuButton = document.querySelector('.menu-button');
  var menu = menuButton && document.getElementById(menuButton.getAttribute('aria-controls'));
  function closeMenu(focusButton) {
    if (!menuButton || menuButton.getAttribute('aria-expanded') !== 'true') return;
    menuButton.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
    if (focusButton) menuButton.focus();
  }
  if (menuButton && menu) {
    menu.hidden = true;
    menuButton.addEventListener('click', function () {
      var open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });
    document.addEventListener('click', function (e) {
      if (!menuButton.parentNode.contains(e.target)) closeMenu(false);
    });
    menuButton.parentNode.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !menuButton.parentNode.contains(e.relatedTarget)) closeMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menuButton && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(true); return; }
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') { toggle.click(); toggle.focus(); }
  });

  // Header shadow once the page scrolls
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 4); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Copy email / phone
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        var label = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = label; }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });

  // Certificate viewer: the trigger is a link to the PDF; open it in a dialog instead
  document.querySelectorAll('[data-dialog]').forEach(function (link) {
    var dialog = document.getElementById(link.getAttribute('data-dialog'));
    if (!dialog || typeof dialog.showModal !== 'function') return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var img = dialog.querySelector('img[data-src]');
      if (img) { img.src = img.getAttribute('data-src'); img.removeAttribute('data-src'); }
      dialog.showModal();
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { dialog.close(); }); });
  });

  doc.classList.add('js-ready');
})();
