/* ============================================================
   Reviews.org Style Guide — render specimens from token data
   ============================================================ */
(function () {
  'use strict';

  /* ---------- copy-confirmation toast ---------- */
  var toastEl, toastTimer;
  function showToast(value, kind) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'copy-toast';
      document.body.appendChild(toastEl);
    }
    if (kind === 'download') {
      toastEl.innerHTML = 'Downloading <b>' + value + '</b>…';
    } else if (kind === 'file') {
      toastEl.innerHTML = 'Filename <b>' + value + '</b> has been copied!';
    } else {
      toastEl.innerHTML = 'Hexcode <b>' + value.toUpperCase() + '</b> has been copied!';
    }
    // restart the animation cleanly
    toastEl.classList.remove('show');
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

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
  function legacyCopy(txt) {
    try {
      var ta = document.createElement('textarea');
      ta.value = txt;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, txt.length);
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }
  function copyText(txt, node) {
    // visual + toast feedback always fires, regardless of clipboard permission
    function feedback() {
      node.classList.add('copied');
      setTimeout(function () { node.classList.remove('copied'); }, 900);
      showToast(txt);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(feedback, function () {
        legacyCopy(txt); feedback();
      });
    } else {
      legacyCopy(txt); feedback();
    }
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
    var fn = e.target.closest('.logo-meta .fn');
    if (fn && fn.getAttribute('data-file')) copyFile(fn.getAttribute('data-file'));
  });

  function copyFile(name) {
    // download the actual SVG asset rather than copying its name
    var url = 'assets/' + name;
    function trigger(href, revoke) {
      var a = document.createElement('a');
      a.href = href;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      if (revoke) setTimeout(function () { URL.revokeObjectURL(href); }, 1000);
      showToast(name, 'download');
    }
    fetch(url).then(function (r) {
      if (!r.ok) throw new Error('fetch failed');
      return r.blob();
    }).then(function (blob) {
      trigger(URL.createObjectURL(blob), true);
    }).catch(function () {
      trigger(url, false); // fallback: direct link
    });
  }

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

  /* ---------- nav search ---------- */
  (function () {
    var input = document.getElementById('searchInput');
    var box = document.getElementById('searchResults');
    if (!input || !box) return;

    // keyword synonyms to widen matching beyond the visible title
    var KW = {
      overview: 'intro start design.md stitch tokens machine readable summary',
      logo: 'brand mark wordmark icon doodle favicon avatar svg png download',
      voice: 'tone writing copy style dials funny casual sass enthusiastic',
      scannability: 'mobile readability words sentences bullets contrast',
      color: 'colours palette hex swatch ramp primitive semantic role blue red navy gray green yellow',
      type: 'typography font fonts typeface work sans rubik caveat weight scale heading body specimen',
      spacing: 'space gap padding margin grid 4px rhythm',
      radii: 'radius corners border width rounded',
      shadows: 'shadow elevation depth focus ring',
      buttons: 'button cta primary secondary text action',
      accordion: 'accordion expand collapse faq disclosure',
      dropdown: 'dropdown select menu field error',
      chip: 'filter chip pill tag toggle',
      label: 'label header badge tag status',
      separator: 'separator divider rule line hr',
      lists: 'list bullet pro con spec comparison',
      callout: 'callout box card grid feature vertical',
      source: 'design.md source raw yaml markdown agent lint download export'
    };

    // build index from sidenav anchors: title + group heading
    var index = [];
    var links = document.querySelectorAll('.sidenav a[href^="#"]');
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      // nearest preceding .grp label
      var group = 'Section', n = a.previousElementSibling;
      while (n) { if (n.classList && n.classList.contains('grp')) { group = n.textContent; break; } n = n.previousElementSibling; }
      index.push({ id: id, title: a.textContent.replace(/\s+/g, ' ').trim(), group: group, kw: KW[id] || '' });
    });

    var results = [], active = -1;

    function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function highlight(title, q) {
      if (!q) return title;
      var re = new RegExp('(' + esc(q) + ')', 'ig');
      return title.replace(re, '<mark>$1</mark>');
    }

    function render(q) {
      box.innerHTML = '';
      if (results.length === 0) {
        box.innerHTML = '<div class="none">No match for <b>“' + q.replace(/</g, '&lt;') + '”</b>. Try “color”, “buttons”, or “font”.</div>';
        box.classList.add('open'); input.setAttribute('aria-expanded', 'true');
        return;
      }
      results.forEach(function (r, i) {
        var b = document.createElement('button');
        b.className = 'sr' + (i === active ? ' active' : '');
        b.setAttribute('role', 'option');
        b.dataset.id = r.id;
        b.innerHTML = '<span class="t">' + highlight(r.title, q) + '</span><span class="g">' + r.group + '</span>';
        b.addEventListener('mouseenter', function () { active = i; paintActive(); });
        b.addEventListener('click', function () { go(r.id); });
        box.appendChild(b);
      });
      box.classList.add('open'); input.setAttribute('aria-expanded', 'true');
    }

    function paintActive() {
      var items = box.querySelectorAll('.sr');
      items.forEach(function (el, i) { el.classList.toggle('active', i === active); });
    }

    function search(q) {
      q = q.trim().toLowerCase();
      if (!q) { close(); return; }
      var scored = [];
      index.forEach(function (r) {
        var t = r.title.toLowerCase();
        var s = -1;
        if (t.indexOf(q) === 0) s = 0;            // title prefix — best
        else if (t.indexOf(q) > -1) s = 1;        // title contains
        else if (r.kw.indexOf(q) > -1) s = 2;     // keyword match
        if (s > -1) scored.push({ r: r, s: s });
      });
      scored.sort(function (a, b) { return a.s - b.s; });
      results = scored.map(function (x) { return x.r; });
      active = results.length ? 0 : -1;
      render(q);
    }

    function go(id) {
      close();
      input.value = '';
      var el = document.getElementById(id);
      if (el) {
        history.replaceState(null, '', '#' + id);
        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 84, behavior: 'smooth' });
        el.style.transition = 'none';
      }
      input.blur();
    }

    function close() { box.classList.remove('open'); input.setAttribute('aria-expanded', 'false'); }

    input.addEventListener('input', function () { search(input.value); });
    input.addEventListener('focus', function () { if (input.value.trim()) search(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (results.length) { active = (active + 1) % results.length; paintActive(); } }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (results.length) { active = (active - 1 + results.length) % results.length; paintActive(); } }
      else if (e.key === 'Enter') { e.preventDefault(); if (active > -1 && results[active]) go(results[active].id); }
      else if (e.key === 'Escape') { close(); input.blur(); }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#navSearch')) close();
    });
  })();
})();
