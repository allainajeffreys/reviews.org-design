/* ============================================================
   Reviews.org Style Guide — render specimens from token data
   ============================================================ */
(function () {
  'use strict';

  /* ---------- raw DESIGN.md → source view + copy/download ---------- */
  var raw = (document.getElementById('design-md-src') || {}).textContent || '';
  raw = raw.replace(/^\s+|\s+$/g, '');

  // line-numbered render
  var srcBody = document.getElementById('srcBody');
  if (srcBody) {
    var lines = raw.split('\n');
    var w = String(lines.length).length;
    srcBody.textContent = '';
    lines.forEach(function (line, i) {
      var n = document.createElement('span');
      n.className = 'ln';
      n.textContent = String(i + 1).padStart(w, ' ') + '  ';
      srcBody.appendChild(n);
      srcBody.appendChild(document.createTextNode(line + '\n'));
    });
  }

  function flash(btn, ok) {
    var t = btn.textContent;
    btn.textContent = ok || 'Copied!';
    setTimeout(function () { btn.textContent = t; }, 1300);
  }
  function copyMd(btn) {
    navigator.clipboard && navigator.clipboard.writeText(raw).then(function () { flash(btn); });
  }
  function dlMd() {
    var blob = new Blob([raw], { type: 'text/markdown' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'REV_DESIGN.md';
    document.body.appendChild(a); a.click(); a.remove();
  }
  ['copyMd', 'copyMd2'].forEach(function (id) {
    var b = document.getElementById(id); if (b) b.addEventListener('click', function () { copyMd(b); });
  });
  ['dlMd', 'dlMd2'].forEach(function (id) {
    var b = document.getElementById(id); if (b) b.addEventListener('click', dlMd);
  });

  /* ---------- voice dials ---------- */
  var voice = [
    { l: 'Funny', r: 'Serious', pos: 25, txt: 'Lighthearted and entertaining — everyday language and cultural markers diffuse technical topics.' },
    { l: 'Formal', r: 'Casual', pos: 90, txt: 'Highly conversational. Idioms, casual syntax, and contractions are authorized across all surfaces.' },
    { l: 'Respectful', r: 'Irreverent', pos: 55, txt: 'Laid back yet solution-oriented. Friendly sass never disrupts a clear answer.' },
    { l: 'Matter-of-fact', r: 'Enthusiastic', pos: 28, txt: 'Energetic, clear, and opinionated. Take a definitive stand — skip the passive balancing loops.' }
  ];
  var dials = document.getElementById('dials');
  if (dials) voice.forEach(function (d) {
    var el = document.createElement('div');
    el.className = 'dial';
    el.innerHTML =
      '<div class="row"><span class="l">' + d.l + '</span><span class="r">' + d.r + '</span></div>' +
      '<div class="track"><span class="fill" style="left:calc(' + d.pos + '% - 7px)"></span></div>' +
      '<p>' + d.txt + '</p>';
    dials.appendChild(el);
  });

  /* ---------- color ramps ---------- */
  var ramps = [
    { name: 'Brand blue — chrome, links, focus', prefix: 'blue', steps: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { name: 'Accent red — CTAs, brand mark', prefix: 'ared', steps: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { name: 'Gray — surfaces, text, dividers', prefix: 'gray', steps: ['050', '100', '150', '200', '250', '300', '350', '400', '450', '500', '550'] },
    { name: 'Red — errors & alerts', prefix: 'red', steps: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { name: 'Green — success & pros', prefix: 'green', steps: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { name: 'Yellow — ratings & stars', prefix: 'yellow', steps: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] }
  ];
  function readVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function lum(hex) {
    var c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(function (x) { return x + x; }).join('');
    var r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  function copyText(txt, node) {
    navigator.clipboard && navigator.clipboard.writeText(txt).then(function () {
      node.classList.add('copied');
      setTimeout(function () { node.classList.remove('copied'); }, 900);
    });
  }
  var rampsEl = document.getElementById('ramps');
  if (rampsEl) ramps.forEach(function (rp) {
    var wrap = document.createElement('div');
    wrap.className = 'ramp';
    var row = '<div class="ramp-row' + (rp.steps.length > 9 ? ' g11' : '') + '">';
    rp.steps.forEach(function (s) {
      var v = '--' + rp.prefix + '-' + s;
      var hex = readVar(v);
      var dark = lum(hex) < 0.58;
      row += '<div class="swatch" data-hex="' + hex + '" style="background:' + hex + ';color:' + (dark ? '#fff' : '#0E0D0E') + '">' +
        '<span class="step">' + s + '</span><span class="hex">' + hex.toUpperCase() + '</span></div>';
    });
    row += '</div>';
    wrap.innerHTML = '<h4>' + rp.name + '</h4>' + row;
    rampsEl.appendChild(wrap);
  });

  /* ---------- semantic roles ---------- */
  var roles = [
    ['text.heading', '--text-heading'], ['text.body', '--text-body'], ['text.body-alt', '--text-body-alt'],
    ['text.muted', '--text-muted'], ['text.link', '--text-link'], ['text.link-hover', '--text-link-hover'],
    ['text.error', '--text-error'], ['text.success', '--text-success'],
    ['bg.default', '--bg-default'], ['bg.muted', '--bg-muted'], ['bg.brand', '--bg-brand'], ['bg.strong', '--bg-strong'],
    ['button.primary', '--btn-primary'], ['button.primary-hover', '--btn-primary-hover'],
    ['button.primary-active', '--btn-primary-active'], ['button.secondary-hover', '--btn-secondary-hover'],
    ['border.default', '--border-default'], ['border.muted', '--border-muted'],
    ['border.brand', '--border-brand'], ['border.error', '--border-error']
  ];
  var rolesEl = document.getElementById('roles');
  if (rolesEl) {
    rolesEl.className = 'roles';
    roles.forEach(function (r) {
      var hex = readVar(r[1]);
      var el = document.createElement('div');
      el.className = 'role';
      el.setAttribute('data-hex', hex);
      el.innerHTML = '<span class="chip" style="background:' + hex + '"></span>' +
        '<span><span class="name">' + r[0] + '</span><br><span class="val">' + hex.toUpperCase() + '</span></span>';
      rolesEl.appendChild(el);
    });
  }

  /* click-to-copy for swatches + roles */
  document.addEventListener('click', function (e) {
    var s = e.target.closest('.swatch,.role');
    if (s && s.getAttribute('data-hex')) copyText(s.getAttribute('data-hex'), s);
  });

  /* ---------- type scale ---------- */
  var sizes = [
    ['display-1', 64], ['display-2', 56], ['h1', 48], ['h2', 40], ['h3', 32],
    ['h4', 28], ['h5', 24], ['body-2xl', 20], ['body-lg', 18], ['body-default', 16],
    ['body-sm', 14], ['eyebrow / label', 12]
  ];
  var tsEl = document.getElementById('typescale');
  if (tsEl) sizes.forEach(function (s) {
    var cap = Math.min(s[1], 52);
    var row = document.createElement('div');
    row.className = 'ts-row';
    row.innerHTML = '<span class="ts-meta">' + s[0] + ' · ' + s[1] + 'px</span>' +
      '<span class="ts-sample" style="font-size:' + cap + 'px">Honest, helpful reviews</span>';
    tsEl.appendChild(row);
  });

  /* ---------- spacing scale ---------- */
  var spaces = [
    ['1', 4], ['2', 8], ['3', 12], ['4', 16], ['5', 20], ['6', 24],
    ['8', 32], ['10', 40], ['12', 48], ['16', 64], ['20', 80], ['24', 96]
  ];
  var spEl = document.getElementById('spacescale');
  if (spEl) spaces.forEach(function (s) {
    var row = document.createElement('div');
    row.className = 'space-row';
    row.innerHTML = '<span class="lab">space-' + s[0] + ' · ' + s[1] + 'px</span>' +
      '<span class="bar" style="width:' + s[1] + 'px"></span>';
    spEl.appendChild(row);
  });

  /* ---------- accordion ---------- */
  var acc = document.getElementById('acc');
  if (acc) acc.addEventListener('click', function (e) {
    var hd = e.target.closest('.hd'); if (!hd) return;
    var item = hd.closest('.item');
    item.classList.toggle('open');
  });

  /* ---------- filter chips ---------- */
  document.querySelectorAll('#chip .rev-chip').forEach(function (c) {
    c.addEventListener('click', function () { c.classList.toggle('sel'); });
  });

  /* ---------- scrollspy ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.sidenav a'));
  var map = {};
  navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        navLinks.forEach(function (a) { a.classList.remove('active'); });
        var a = map[en.target.id]; if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-90px 0px -70% 0px' });
  document.querySelectorAll('section[id]').forEach(function (s) { obs.observe(s); });
})();
