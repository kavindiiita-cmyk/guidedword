const express = require('express');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

async function start() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'database.db');
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  // Create prayer_requests table if not exists
  db.run(`CREATE TABLE IF NOT EXISTS prayer_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    request_text TEXT NOT NULL,
    pray_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
  function saveDb() { fs.writeFileSync(dbPath, Buffer.from(db.export())); }
  saveDb();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

  // Cache-bust hash: changes every server restart so browsers fetch fresh assets
  const CACHE_BUST = Date.now().toString(36);

  const homeTemplate = fs.readFileSync(path.join(__dirname, 'views', 'home.html'), 'utf8');
  const articleTemplate = fs.readFileSync(path.join(__dirname, 'views', 'article.html'), 'utf8');

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function queryAll(sql, params) {
    const stmt = db.prepare(sql);
    if (params) stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  }

  function queryOne(sql, params) {
    const stmt = db.prepare(sql);
    if (params) stmt.bind(params);
    const row = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    return row;
  }

  // Dynamic calming SVG images
  const gradients = {
    hero: [
      ['#6B8FB3', '#8BACC7', '#C9A66B'],
      ['#7A9CB8', '#A8C0D6', '#D4B896'],
      ['#5E8AA8', '#93B5CB', '#BFA76E'],
      ['#8498A8', '#A3BDCF', '#C4A870'],
      ['#6A7F9A', '#9CB3C8', '#D1B885'],
      ['#748FAD', '#89A8C1', '#C2A462'],
      ['#5C7D9B', '#8EAEC5', '#CBB07A'],
      ['#7B94AD', '#A1BDD5', '#D0B48E']
    ],
    verse: [
      ['#A8C0D6', '#D4C5A0', '#B8CFC4'],
      ['#B0C8D8', '#CCBF98', '#A9C5B8'],
      ['#9FB8CE', '#DCCAA8', '#C0D4C9'],
      ['#A3BCCE', '#D8C8A4', '#B5CFBF'],
      ['#AECAD9', '#D0C19E', '#BCD1C6'],
      ['#A5BFD2', '#D6C7A2', '#B3CCC0'],
      ['#ADC5D5', '#CEBE9A', '#C2D6CB'],
      ['#A0B9CC', '#DACCA6', '#BAD0C3']
    ],
    divider: [
      ['#C4B097', '#8BACC7', '#B5C9A8'],
      ['#CBBA9F', '#93B4CD', '#BDCEA8'],
      ['#BEAA91', '#84A6C1', '#AECDA2'],
      ['#C8B69B', '#8FB0C9', '#B9CCA6'],
      ['#C0AE95', '#87A9C3', '#B2CBA4'],
      ['#CDB99D', '#91B2CB', '#BFD0AA'],
      ['#C2B299', '#8DAEC5', '#B6CDA6'],
      ['#C6B49D', '#85A7BF', '#B0C8A2']
    ]
  };

  app.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const match = filename.match(/^(.+)-(hero|verse|divider)\.jpg$/);
    if (!match) return res.status(404).end();

    const slug = match[1];
    const type = match[2];

    const article = queryOne('SELECT verse_reference FROM articles WHERE slug = ?', [slug]);
    if (!article) return res.status(404).end();

    // Pick a gradient based on slug hash
    let hash = 0;
    for (let i = 0; i < slug.length; i++) hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
    const idx = Math.abs(hash) % 8;
    const colors = gradients[type][idx];

    const ref = escapeHtml(article.verse_reference);
    const w = 1600, h = 900;

    // Nature-inspired decorative elements per type
    let decoration = '';
    if (type === 'hero') {
      // Soft mountain silhouettes + sun glow
      decoration = `
        <ellipse cx="${w * 0.8}" cy="${h * 0.2}" rx="180" ry="180" fill="${colors[2]}" opacity="0.15"/>
        <path d="M0 ${h * 0.65} Q${w * 0.15} ${h * 0.4} ${w * 0.35} ${h * 0.55} Q${w * 0.5} ${h * 0.68} ${w * 0.65} ${h * 0.5} Q${w * 0.8} ${h * 0.35} ${w} ${h * 0.55} V${h} H0 Z" fill="${colors[1]}" opacity="0.25"/>
        <path d="M0 ${h * 0.75} Q${w * 0.25} ${h * 0.55} ${w * 0.5} ${h * 0.65} Q${w * 0.75} ${h * 0.75} ${w} ${h * 0.6} V${h} H0 Z" fill="${colors[0]}" opacity="0.2"/>
      `;
    } else if (type === 'verse') {
      // Gentle ripples (still water)
      let ripples = '';
      for (let i = 0; i < 5; i++) {
        const y = h * 0.5 + i * 45;
        ripples += `<ellipse cx="${w * 0.5}" cy="${y}" rx="${300 + i * 80}" ry="${8 + i * 3}" fill="white" opacity="${0.08 - i * 0.012}"/>`;
      }
      decoration = `
        <ellipse cx="${w * 0.5}" cy="${h * 0.25}" rx="250" ry="250" fill="${colors[1]}" opacity="0.12"/>
        ${ripples}
      `;
    } else {
      // Rolling hills
      decoration = `
        <ellipse cx="${w * 0.2}" cy="${h * 0.15}" rx="140" ry="140" fill="${colors[2]}" opacity="0.12"/>
        <path d="M0 ${h * 0.7} Q${w * 0.2} ${h * 0.5} ${w * 0.4} ${h * 0.6} Q${w * 0.6} ${h * 0.7} ${w * 0.8} ${h * 0.55} Q${w * 0.9} ${h * 0.5} ${w} ${h * 0.6} V${h} H0 Z" fill="${colors[0]}" opacity="0.18"/>
        <path d="M0 ${h * 0.8} Q${w * 0.3} ${h * 0.65} ${w * 0.6} ${h * 0.72} Q${w * 0.85} ${h * 0.78} ${w} ${h * 0.68} V${h} H0 Z" fill="${colors[1]}" opacity="0.15"/>
      `;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="50%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${decoration}
  <text x="${w * 0.5}" y="${h * 0.48}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="42" font-weight="600" fill="white" opacity="0.9">${ref}</text>
  <text x="${w * 0.5}" y="${h * 0.56}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="20" fill="white" opacity="0.5">Bible Encouragement</text>
</svg>`;

    res.set({
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=604800'
    });
    res.send(svg);
  });

  // Prayer API
  app.get('/api/prayers', (req, res) => {
    const prayers = queryAll("SELECT id, name, request_text, pray_count, created_at FROM prayer_requests WHERE created_at >= datetime('now', '-7 days') ORDER BY id DESC LIMIT 20");
    res.json(prayers);
  });

  app.post('/api/prayers', (req, res) => {
    const name = String(req.body.name || '').trim().slice(0, 30);
    const text = String(req.body.text || '').trim().slice(0, 200);
    if (!name || !text) return res.status(400).json({ error: 'Name and text required' });
    db.run('INSERT INTO prayer_requests (name, request_text) VALUES (?, ?)', [name, text]);
    saveDb();
    const row = queryOne('SELECT id, name, request_text, pray_count, created_at FROM prayer_requests ORDER BY id DESC LIMIT 1');
    res.json(row);
  });

  app.post('/api/prayers/:id/pray', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    db.run('UPDATE prayer_requests SET pray_count = pray_count + 1 WHERE id = ?', [id]);
    saveDb();
    const row = queryOne('SELECT pray_count FROM prayer_requests WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json({ pray_count: row.pray_count });
  });

  function buildPrayerHtml() {
    const prayers = queryAll("SELECT id, name, request_text, pray_count FROM prayer_requests WHERE created_at >= datetime('now', '-7 days') ORDER BY id DESC LIMIT 10");
    if (!prayers.length) return '<p style="text-align:center;color:#5c5c5c;font-size:0.9375rem;">No prayer requests yet. Be the first to ask for prayer.</p>';
    return prayers.map(p => {
      const initial = escapeHtml(p.name.charAt(0));
      return `
      <div class="prayer-card" data-id="${p.id}">
        <div class="prayer-avatar">${initial}</div>
        <div class="prayer-content">
          <strong>${escapeHtml(p.name)}:</strong>
          <p>${escapeHtml(p.request_text)}</p>
        </div>
        <div class="prayer-right">
          <button class="pray-btn" type="button" data-id="${p.id}">Pray</button>
          <span class="prayer-count-label">${p.pray_count} Prayed</span>
        </div>
      </div>`;
    }).join('');
  }

  function getTodayPrayerCount() {
    const row = queryOne("SELECT COALESCE(SUM(pray_count), 0) as total FROM prayer_requests WHERE created_at >= datetime('now', '-1 day')");
    return row ? row.total : 0;
  }

  // Base URL helper (change for production)
  const BASE_URL = process.env.BASE_URL || 'https://theguidedword.org';

  // Homepage
  app.get('/', (req, res) => {
    const html = homeTemplate
      .replace(/{{cache_bust}}/g, CACHE_BUST)
      .replace(/{{base_url}}/g, BASE_URL)
      .replace(/{{canonical_url}}/g, BASE_URL + '/')
      .replace('{{prayer_html}}', buildPrayerHtml())
      .replace('{{prayer_count}}', String(getTodayPrayerCount()));
    res.send(html);
  });

  // Verse deep-link — serves the same homepage but lets client-side JS pick up the slug
  app.get('/verse/:slug', (req, res) => {
    const slug = req.params.slug;
    const html = homeTemplate
      .replace(/{{cache_bust}}/g, CACHE_BUST)
      .replace(/{{base_url}}/g, BASE_URL)
      .replace(/{{canonical_url}}/g, BASE_URL + '/verse/' + encodeURIComponent(slug))
      .replace('{{prayer_html}}', buildPrayerHtml())
      .replace('{{prayer_count}}', String(getTodayPrayerCount()));
    res.send(html);
  });

  // Friendly category aliases
  app.get('/build-resilience', (req, res) => res.redirect(301, '/category/anxiety'));
  app.get('/find-peace', (req, res) => res.redirect(301, '/category/peace'));
  app.get('/strength-hard-times', (req, res) => res.redirect(301, '/category/strength'));
  app.get('/life-guidance', (req, res) => res.redirect(301, '/category/healing'));

  // Category pages
  const categoryConfig = {
    anxiety: {
      title: 'Build Resilience',
      desc: 'Bible verses for anxiety, fear &amp; worry',
      slugs: ['david-fear', 'jesus-calming-storm', 'paul-prison-peace', 'elijah-exhaustion']
    },
    peace: {
      title: 'Find Peace',
      desc: 'Scripture for stress, calm &amp; stillness',
      slugs: ['peaceful-sleep', 'anxiety-at-night', 'rest-mind-wont-stop', 'psalms-nighttime-comfort']
    },
    strength: {
      title: 'Strength in Hard Times',
      desc: 'Verses for difficult seasons &amp; perseverance',
      slugs: ['strength-difficult-times', 'strength-hard-work', 'strength-when-weak', 'strength-during-uncertainty']
    },
    healing: {
      title: 'Healing &amp; Comfort',
      desc: 'Bible verses for pain, illness &amp; recovery',
      slugs: ['healing-and-comfort', 'emotional-healing', 'strength-during-illness', 'recovery-after-difficulty']
    }
  };

  // Category URL mapping for internal links
  const categoryUrlMap = {
    anxiety: { path: '/category/anxiety', friendly: '/build-resilience', title: 'Build Resilience' },
    peace: { path: '/category/peace', friendly: '/find-peace', title: 'Find Peace' },
    strength: { path: '/category/strength', friendly: '/strength-hard-times', title: 'Strength in Hard Times' },
    healing: { path: '/category/healing', friendly: '/life-guidance', title: 'Healing &amp; Comfort' }
  };

  app.get('/category/:cat', (req, res) => {
    const cat = req.params.cat;
    const config = categoryConfig[cat];
    if (!config) return res.status(404).send('<h1>Category not found</h1>');

    const placeholders = config.slugs.map(() => '?').join(',');
    const articles = queryAll(
      `SELECT slug, title, meta_description, verse_reference FROM articles WHERE slug IN (${placeholders}) ORDER BY id`,
      config.slugs
    );

    let cards = '';
    for (const a of articles) {
      cards += `
        <a href="${articleUrl(a.slug)}" class="card">
          <div class="card-body">
            <span class="card-tag">${escapeHtml(a.verse_reference)}</span>
            <h2 class="card-title">${escapeHtml(a.title)}</h2>
            <p class="card-desc">${escapeHtml(a.meta_description)}</p>
            <span class="card-link">Read More &rarr;</span>
          </div>
        </a>`;
    }

    // Internal links to other categories
    let internalLinks = '<nav class="internal-links" aria-label="Explore more topics"><h3>Explore More Topics</h3><ul>';
    for (const [key, info] of Object.entries(categoryUrlMap)) {
      if (key !== cat) {
        internalLinks += `<li><a href="${info.path}">${info.title}</a></li>`;
      }
    }
    internalLinks += '</ul></nav>';

    // Breadcrumb items for JSON-LD
    const breadcrumbLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL + "/" },
        { "@type": "ListItem", "position": 2, "name": config.title.replace(/&amp;/g, '&') }
      ]
    });

    // Article schema for category
    const articleLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "headline": config.title.replace(/&amp;/g, '&'),
      "description": config.desc.replace(/&amp;/g, '&'),
      "author": { "@type": "Organization", "name": "Bible Encouragement" },
      "publisher": { "@type": "Organization", "name": "Bible Encouragement", "logo": { "@type": "ImageObject", "url": BASE_URL + "/images/og-default.jpg" } },
      "datePublished": "2026-01-01",
      "mainEntityOfPage": BASE_URL + "/category/" + cat
    });

    const canonicalUrl = BASE_URL + '/category/' + cat;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title} — Bible Encouragement</title>
  <meta name="description" content="${config.desc}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${config.title} — Bible Encouragement">
  <meta property="og:description" content="${config.desc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${BASE_URL}/images/og-default.jpg">
  <meta property="og:site_name" content="Bible Encouragement">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${config.title} — Bible Encouragement">
  <meta name="twitter:description" content="${config.desc}">
  <meta name="twitter:image" content="${BASE_URL}/images/og-default.jpg">
  <link rel="stylesheet" href="/styles.css?v=${CACHE_BUST}">
  <script type="application/ld+json">${breadcrumbLd}</script>
  <script type="application/ld+json">${articleLd}</script>
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="logo">Bible Encouragement</a>
    </div>
  </header>
  <section class="category-header">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> &rsaquo; <span>${config.title}</span></nav>
      <h1>${config.title}</h1>
      <p>${config.desc}</p>
    </div>
  </section>
  <main class="category-articles">
    <div class="container">
      <div class="card-grid">${cards}</div>
      ${internalLinks}
    </div>
  </main>
  <footer class="site-footer">
    <div class="container"><p>&copy; 2026 Bible Encouragement. Built with care and faith.</p></div>
  </footer>
  <script src="/script.js?v=${CACHE_BUST}" defer></script>
</body>
</html>`;
    res.send(html);
  });

  // Article page
  // Determine category for an article slug
  function getCategoryForSlug(slug) {
    for (const [cat, config] of Object.entries(categoryConfig)) {
      if (config.slugs.includes(slug)) return cat;
    }
    return null;
  }

  // Build article URL: /article/<category>/<slug>
  function articleUrl(slug) {
    const cat = getCategoryForSlug(slug);
    return cat ? '/article/' + cat + '/' + slug : '/article/' + slug;
  }

  app.get('/article/:category/:slug', (req, res) => {
    const slug = req.params.slug;
    const article = queryOne('SELECT * FROM articles WHERE slug = ?', [slug]);

    if (!article) {
      return res.status(404).send('<h1>Article not found</h1>');
    }

    // Only show related articles from the SAME category
    const articleCatKey = getCategoryForSlug(article.slug);
    const sameCategorySlugs = articleCatKey && categoryConfig[articleCatKey]
      ? categoryConfig[articleCatKey].slugs.filter(s => s !== article.slug)
      : [];

    let relatedHtml = '';
    if (sameCategorySlugs.length) {
      const placeholders = sameCategorySlugs.map(() => '?').join(',');
      const relatedArticles = queryAll(
        `SELECT slug, title, verse_reference FROM articles WHERE slug IN (${placeholders}) ORDER BY id`,
        sameCategorySlugs
      );
      for (const r of relatedArticles) {
        relatedHtml += `
        <a href="${articleUrl(r.slug)}" class="related-card">
          <span class="related-tag">${escapeHtml(r.verse_reference)}</span>
          <span class="related-title">${escapeHtml(r.title)}</span>
        </a>`;
      }
    }

    // Nav pills — only show articles from the same category
    let navPills = '';
    const catSlugsForNav = articleCatKey && categoryConfig[articleCatKey]
      ? categoryConfig[articleCatKey].slugs
      : [];
    if (catSlugsForNav.length) {
      const ph = catSlugsForNav.map(() => '?').join(',');
      const navArticles = queryAll(`SELECT slug, verse_reference FROM articles WHERE slug IN (${ph}) ORDER BY id`, catSlugsForNav);
      for (const n of navArticles) {
        const active = n.slug === article.slug ? ' pill-active' : '';
        navPills += `<a href="${articleUrl(n.slug)}" class="pill${active}">${escapeHtml(n.verse_reference)}</a>`;
      }
    }

    // Reuse articleCatKey from related-articles block above
    const catInfo = articleCatKey && categoryUrlMap[articleCatKey] ? categoryUrlMap[articleCatKey] : { title: 'Articles', path: '/' };

    // Hero image per category (shared across all articles in the same category)
    const categoryHeroMap = {
      anxiety:  '/images/card-calm-soul.jpg',
      peace:    '/images/card-finding-peace.jpg',
      strength: '/images/card-strength.jpg',
      healing:  '/images/card-healing.jpg'
    };
    const heroImage = (articleCatKey && categoryHeroMap[articleCatKey]) || '/images/' + article.slug + '-hero.jpg';

    const html = articleTemplate
      .replace(/{{cache_bust}}/g, CACHE_BUST)
      .replace(/{{base_url}}/g, BASE_URL)
      .replace(/{{canonical_url}}/g, BASE_URL + articleUrl(article.slug))
      .replace(/{{hero_image}}/g, heroImage)
      .replace(/{{category_title}}/g, catInfo.title)
      .replace(/{{category_url}}/g, BASE_URL + catInfo.path)
      .replace(/\{\{meta_title\}\}/g, escapeHtml(article.meta_title))
      .replace(/\{\{meta_description\}\}/g, escapeHtml(article.meta_description))
      .replace('{{nav_pills}}', navPills)
      .replace('{{title}}', escapeHtml(article.title))
      .replace(/\{\{verse_reference\}\}/g, escapeHtml(article.verse_reference))
      .replace('{{story_context}}', escapeHtml(article.story_context))
      .replace('{{verse_text}}', escapeHtml(article.verse_text))
      .replace('{{reflection_text}}', escapeHtml(article.reflection_text))
      .replace('{{quiz_question}}', escapeHtml(article.quiz_question))
      .replace('{{option_a}}', escapeHtml(article.option_a))
      .replace('{{option_b}}', escapeHtml(article.option_b))
      .replace('{{option_c}}', escapeHtml(article.option_c))
      .replace('{{option_d}}', escapeHtml(article.option_d))
      .replace('{{correct_option}}', escapeHtml(article.correct_option))
      .replace('{{quiz_explanation}}', escapeHtml(article.quiz_explanation))
      .replace('{{related_articles}}', relatedHtml)
      .replace(/\{\{slug\}\}/g, escapeHtml(article.slug));

    res.send(html);
  });

  // Robots.txt — dynamic so BASE_URL is correct
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml`);
  });

  // OG default image (simple SVG)
  app.get('/images/og-default.jpg', (req, res) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#1f3c88"/>
  <text x="600" y="280" text-anchor="middle" font-family="Georgia,serif" font-size="56" font-weight="700" fill="#fff">Bible Encouragement</text>
  <text x="600" y="360" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="26" fill="#ccc">Find Comfort and Guidance in God's Word</text>
</svg>`;
    res.set({ 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=604800' });
    res.send(svg);
  });

  // Dynamic sitemap
  app.get('/sitemap.xml', (req, res) => {
    const articles = queryAll('SELECT slug FROM articles ORDER BY id');

    let urls = `  <url><loc>${BASE_URL}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>\n`;

    // Category pages
    for (const cat of Object.keys(categoryConfig)) {
      urls += `  <url><loc>${BASE_URL}/category/${cat}</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>\n`;
    }

    // Article pages
    for (const a of articles) {
      const cat = getCategoryForSlug(a.slug);
      const artPath = cat ? `/article/${cat}/${a.slug}` : `/article/${a.slug}`;
      urls += `  <url><loc>${BASE_URL}${artPath}</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>\n`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>`;

    res.type('application/xml');
    res.send(xml);
  });

  app.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
  });
}

start().catch(err => { console.error(err); process.exit(1); });
