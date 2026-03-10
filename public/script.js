document.addEventListener('DOMContentLoaded', () => {

  /* === Analytics Tracking Module === */
  function trackEvent(eventName, params) {
    if (typeof params === 'undefined') params = {};
    /* GA4 via gtag (when script is loaded) */
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
    /* Console log in dev for debugging */
    if (window.location.hostname === 'localhost') {
      console.log('[Analytics]', eventName, params);
    }
  }

  /* Scroll-depth tracking (25/50/75/100%) */
  (function () {
    var fired = {};
    var thresholds = [25, 50, 75, 100];
    window.addEventListener('scroll', function () {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      var pct = Math.round((window.scrollY / docH) * 100);
      thresholds.forEach(function (t) {
        if (pct >= t && !fired[t]) {
          fired[t] = true;
          trackEvent('scroll_depth', { depth: t, page: window.location.pathname });
        }
      });
    }, { passive: true });
  })();

  /* Engaged-time tracking (30s, 60s, 120s) */
  (function () {
    var milestones = [30, 60, 120];
    var idx = 0;
    var elapsed = 0;
    var interval = setInterval(function () {
      if (document.hidden) return;
      elapsed++;
      if (idx < milestones.length && elapsed >= milestones[idx]) {
        trackEvent('engaged_time', { seconds: milestones[idx], page: window.location.pathname });
        idx++;
        if (idx >= milestones.length) clearInterval(interval);
      }
    }, 1000);
  })();

  /* Category card click tracking */
  document.querySelectorAll('.topic-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var label = card.querySelector('.topic-card-label');
      trackEvent('category_click', {
        category: label ? label.textContent.trim() : card.getAttribute('href')
      });
    });
  });

  /* === Hamburger Menu === */
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('mainNav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* === Verse of the Day === */
  const votdText = document.getElementById('votdText');
  const votdRef = document.getElementById('votdRef');
  const shareBtn = document.getElementById('shareBtn');
  const discoverBtn = document.getElementById('discoverBtn');

  let verses = [];
  let currentIdx = 0;
  let current = { text: 'Be still, and know that I am God.', reference: 'Psalm 46:10' };

  /* Convert a reference like "Psalm 56:3" → "psalms-56-3", "1 Kings 19:12" → "1-kings-19-12" */
  function refToSlug(ref) {
    return ref.toLowerCase().replace(/\s+/g, '-').replace(/:/g, '-');
  }

  /* Reverse: "psalms-56-3" → find index in verses array */
  function findVerseBySlug(slug) {
    return verses.findIndex(v => refToSlug(v.reference) === slug);
  }

  /* Update browser URL without reload */
  function syncUrl(verse) {
    const slug = refToSlug(verse.reference);
    const newPath = '/verse/' + slug;
    if (window.location.pathname !== newPath) {
      history.pushState({ slug: slug }, '', newPath);
    }
  }

  /* Dynamic SEO: update title + meta description */
  function updateMeta(verse, ref) {
    document.title = ref + ' — Bible Encouragement';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', '\u201C' + verse + '\u201D \u2014 ' + ref + '. Find comfort and guidance in God\u2019s Word at Bible Encouragement.');
    }
  }

  function renderVerse(v, animate) {
    if (animate) {
      votdText.classList.add('fade');
      votdRef.classList.add('fade');
      setTimeout(() => {
        votdText.textContent = '\u201C' + v.text + '\u201D';
        votdRef.textContent = '\u2014 ' + v.reference;
        votdText.classList.remove('fade');
        votdRef.classList.remove('fade');
      }, 400);
    } else {
      votdText.textContent = '\u201C' + v.text + '\u201D';
      votdRef.textContent = '\u2014 ' + v.reference;
    }
    updateMeta(v.text, v.reference);
  }

  /* Set current verse and index together */
  function setCurrent(idx) {
    currentIdx = idx;
    current = verses[idx];
  }

  async function loadBibleData() {
    try {
      const resp = await fetch('/bible.json');
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.verses && data.verses.length) {
        verses = data.verses;

        /* Check if URL has a /verse/:slug deep link */
        const pathMatch = window.location.pathname.match(/^\/verse\/(.+)$/);
        if (pathMatch) {
          const idx = findVerseBySlug(pathMatch[1]);
          if (idx !== -1) {
            setCurrent(idx);
            renderVerse(current, false);
            return;
          }
        }

        /* Default: verse of the day */
        const now = new Date();
        const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
        setCurrent(dayOfYear % verses.length);
        renderVerse(current, false);
      }
    } catch (_) {}
  }

  loadBibleData();

  /* Handle browser back/forward */
  window.addEventListener('popstate', (e) => {
    if (!verses.length) return;
    if (e.state && e.state.slug) {
      const idx = findVerseBySlug(e.state.slug);
      if (idx !== -1) { setCurrent(idx); renderVerse(current, true); }
    }
  });

  /* Discover More — random verse */
  if (discoverBtn) {
    discoverBtn.addEventListener('click', () => {
      if (verses.length < 2) return;
      let nextIdx;
      do { nextIdx = Math.floor(Math.random() * verses.length); }
      while (nextIdx === currentIdx && verses.length > 1);
      setCurrent(nextIdx);
      renderVerse(current, true);
      syncUrl(current);
      trackEvent('discover_more_clicked', { reference: current.reference });
    });
  }

  /* Share Verse — generate ornate gold-framed image + Web Share API */
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const slug = refToSlug(current.reference);
      const shareUrl = window.location.origin + '/verse/' + slug + '?utm_source=share_verse';
      const caption = '\u201C' + current.text + '\u201D \u2014 ' + current.reference
        + '. I found this on Bible Encouragement. Get your daily guidance here: ' + shareUrl;

      /* === IMMEDIATE clipboard copy (before any async work) === */
      const ta = document.createElement('textarea');
      ta.value = caption;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);

      /* Always show toast immediately so desktop users get instant feedback */
      showToast('Inspirational link copied!');

      trackEvent('verse_shared', { reference: current.reference, method: 'clipboard' });

      /* === Try native share only on mobile devices === */
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile && navigator.share) {
        try {
          /* Generate image on canvas */
          let shareFile = null;
          const canvas = document.getElementById('shareCanvas');
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const W = 1080, H = 1080;

            /* Background — warm parchment */
            const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
            bgGrad.addColorStop(0, '#fdfaf3');
            bgGrad.addColorStop(0.5, '#f5edd8');
            bgGrad.addColorStop(1, '#ece3cc');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            /* Subtle linen texture */
            ctx.globalAlpha = 0.03;
            for (let y = 0; y < H; y += 4) {
              ctx.fillStyle = y % 8 === 0 ? '#000' : '#fff';
              ctx.fillRect(0, y, W, 2);
            }
            ctx.globalAlpha = 1;

            /* === Ornate gold frame ("Last Supper" style) === */
            const F = 36;

            ctx.strokeStyle = '#3b2714';
            ctx.lineWidth = 6;
            ctx.strokeRect(18, 18, W - 36, H - 36);

            const goldGrad = ctx.createLinearGradient(0, 0, W, H);
            goldGrad.addColorStop(0, '#D4AF37');
            goldGrad.addColorStop(0.3, '#F5D060');
            goldGrad.addColorStop(0.5, '#D4AF37');
            goldGrad.addColorStop(0.7, '#C49B2A');
            goldGrad.addColorStop(1, '#F5D060');
            ctx.strokeStyle = goldGrad;
            ctx.lineWidth = F;
            ctx.strokeRect(F, F, W - F * 2, H - F * 2);

            ctx.strokeStyle = 'rgba(255,235,170,0.6)';
            ctx.lineWidth = 2;
            ctx.strokeRect(F + F / 2 + 1, F + F / 2 + 1, W - (F + F / 2 + 1) * 2, H - (F + F / 2 + 1) * 2);

            ctx.strokeStyle = 'rgba(140,110,20,0.4)';
            ctx.lineWidth = 2;
            ctx.strokeRect(F - F / 2, F - F / 2, W - (F - F / 2) * 2, H - (F - F / 2) * 2);

            const corners = [[F, F], [W - F, F], [F, H - F], [W - F, H - F]];
            corners.forEach(([cx, cy]) => {
              ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.fillStyle = '#C49B2A'; ctx.fill();
              ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fillStyle = '#F5D060'; ctx.fill();
              ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fillStyle = '#3b2714'; ctx.fill();
              ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fillStyle = '#D4AF37'; ctx.fill();
            });

            for (let x = F + 60; x < W - F - 40; x += 50) {
              [F, H - F].forEach(py => { ctx.beginPath(); ctx.arc(x, py, 5, 0, Math.PI * 2); ctx.fillStyle = '#C49B2A'; ctx.fill(); });
            }
            for (let y = F + 60; y < H - F - 40; y += 50) {
              [F, W - F].forEach(px => { ctx.beginPath(); ctx.arc(px, y, 5, 0, Math.PI * 2); ctx.fillStyle = '#C49B2A'; ctx.fill(); });
            }

            ctx.fillStyle = '#D4AF37';
            const crossX = W / 2, crossY = F + 50;
            ctx.fillRect(crossX - 2, crossY - 14, 4, 28);
            ctx.fillRect(crossX - 10, crossY - 4, 20, 4);

            /* Verse text — max 2 lines */
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#2a1a0a';
            ctx.font = 'italic 48px "Playfair Display", Georgia, serif';
            const maxTextW = W - 200;
            const words = current.text.split(' ');
            const lines = [];
            let line = '\u201C';
            words.forEach(w => {
              const test = line + w + ' ';
              if (ctx.measureText(test).width > maxTextW && line.length > 1) { lines.push(line.trim()); line = w + ' '; }
              else { line = test; }
            });
            lines.push(line.trim() + '\u201D');
            if (lines.length > 2) { lines[1] = lines[1].replace(/\s*\u201D$/, '') + '\u2026\u201D'; lines.length = 2; }
            const lineH = 66;
            const totalTextH = lines.length * lineH;
            const textStartY = (H / 2) - (totalTextH / 2) - 30;
            lines.forEach((l, i) => { ctx.fillText(l, W / 2, textStartY + i * lineH); });

            ctx.font = '600 36px "Playfair Display", Georgia, serif';
            ctx.fillStyle = '#9B7B2A';
            ctx.fillText('\u2014 ' + current.reference, W / 2, textStartY + totalTextH + 36);

            ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillStyle = '#8a7a60';
            ctx.fillText('BibleEncouragement.com', W / 2, H - 80);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            if (blob) shareFile = new File([blob], 'verse-' + current.reference.replace(/\s+/g, '-') + '.png', { type: 'image/png' });
          }

          const shareData = { title: current.reference + ' \u2014 Bible Encouragement', text: caption };
          if (shareFile && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
            shareData.files = [shareFile];
          }
          await navigator.share(shareData);
        } catch (_) {
          /* Native share failed or cancelled — toast already shown */
        }
      }
    });
  }

  function showToast(msg) {
    let toast = document.getElementById('shareToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'shareToast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.remove('toast-show');
    void toast.offsetWidth; /* force reflow */
    toast.classList.add('toast-show');
    setTimeout(() => { toast.classList.remove('toast-show'); }, 3000);
  }
  

  /* === Prayer Request Wall === */
  const askBtn = document.getElementById('askPrayerBtn');
  const prayOthersBtn = document.getElementById('prayOthersBtn');
  const modal = document.getElementById('prayerModal');
  const modalClose = document.getElementById('modalClose');
  const prayerForm = document.getElementById('prayerForm');
  const prayerList = document.getElementById('prayerList');

  if (askBtn && modal) {
    askBtn.addEventListener('click', () => {
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
    });
    if (modalClose) modalClose.addEventListener('click', () => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) { modal.hidden = true; modal.setAttribute('aria-hidden', 'true'); }
    });
  }

  if (prayOthersBtn) {
    prayOthersBtn.addEventListener('click', () => {
      const section = document.getElementById('prayer');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (prayerForm) {
    prayerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = prayerForm.querySelector('#prayerName').value.trim();
      const text = prayerForm.querySelector('#prayerText').value.trim();
      if (!name || !text) return;

      try {
        const resp = await fetch('/api/prayers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, text })
        });
        if (!resp.ok) return;
        const p = await resp.json();
        const initial = p.name.charAt(0).toUpperCase();
        const card = document.createElement('div');
        card.className = 'prayer-card';
        card.dataset.id = p.id;
        card.innerHTML = `
          <div class="prayer-avatar">${initial}</div>
          <div class="prayer-content">
            <strong>${esc(p.name)}:</strong>
            <p>${esc(p.request_text)}</p>
          </div>
          <div class="prayer-right">
            <button class="pray-btn" type="button" data-id="${p.id}">Pray</button>
            <span class="prayer-count-label">0 Prayed</span>
          </div>`;
        if (prayerList) prayerList.prepend(card);
        prayerForm.reset();
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        trackEvent('prayer_submitted', {});
      } catch (_) {}
    });
  }

  /* Pray button delegation */
  if (prayerList) {
    prayerList.addEventListener('click', async (e) => {
      const btn = e.target.closest('.pray-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      btn.disabled = true;
      btn.textContent = 'Prayed \u2764';
      trackEvent('prayer_prayed', { prayer_id: id });
      try {
        const resp = await fetch('/api/prayers/' + id + '/pray', { method: 'POST' });
        if (resp.ok) {
          const data = await resp.json();
          const label = btn.parentElement.querySelector('.prayer-count-label');
          if (label) label.textContent = data.pray_count + ' Prayed';
          const counter = document.getElementById('prayerCount');
          if (counter) counter.textContent = parseInt(counter.textContent || '0', 10) + 1;
        }
      } catch (_) {}
    });
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /* === Quiz === */
  const options = document.querySelector('.quiz-options');
  if (!options) return;

  const correct = options.dataset.correct;
  const result = document.querySelector('.quiz-result');
  const resultText = document.querySelector('.quiz-result-text');
  const buttons = options.querySelectorAll('.quiz-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.disabled = true;
        b.classList.remove('quiz-selected');
      });

      const chosen = btn.dataset.option;
      btn.classList.add('quiz-selected');

      if (chosen === correct) {
        btn.classList.add('quiz-correct');
        resultText.textContent = 'That\u2019s right!';
        resultText.className = 'quiz-result-text correct';
      } else {
        btn.classList.add('quiz-wrong');
        buttons.forEach(b => {
          if (b.dataset.option === correct) b.classList.add('quiz-correct');
        });
        resultText.textContent = 'Not quite \u2014 but that\u2019s okay.';
        resultText.className = 'quiz-result-text wrong';
      }

      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      trackEvent('quiz_answered', { correct: chosen === correct });
    });
  });
});
