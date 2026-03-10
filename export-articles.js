const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_PATH = path.join(__dirname, 'database.db');
const OUTPUT  = path.join(__dirname, 'All_Articles_Review.doc');

// Category mapping (mirrors server.js)
const categoryConfig = {
  anxiety:  { title: 'Build Resilience', slugs: ['david-fear', 'jesus-calming-storm', 'paul-prison-peace', 'elijah-exhaustion'] },
  peace:    { title: 'Find Peace', slugs: ['peaceful-sleep', 'anxiety-at-night', 'rest-mind-wont-stop', 'psalms-nighttime-comfort'] },
  strength: { title: 'Strength in Hard Times', slugs: ['strength-difficult-times', 'strength-hard-work', 'strength-when-weak', 'strength-during-uncertainty'] },
  healing:  { title: 'Healing & Comfort', slugs: ['healing-and-comfort', 'emotional-healing', 'strength-during-illness', 'recovery-after-difficulty'] }
};

function getCategoryForSlug(slug) {
  for (const [cat, cfg] of Object.entries(categoryConfig)) {
    if (cfg.slugs.includes(slug)) return { key: cat, title: cfg.title };
  }
  return { key: 'uncategorized', title: 'Uncategorized' };
}

(async () => {
  const SQL = await initSqlJs();
  const db = new SQL.Database(fs.readFileSync(DB_PATH));
  const rows = db.exec('SELECT * FROM articles ORDER BY id');
  db.close();

  if (!rows.length || !rows[0].values.length) {
    console.error('No articles found.');
    process.exit(1);
  }

  const columns = rows[0].columns;
  const articles = rows[0].values.map(row => {
    const obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });

  // Group by category
  const grouped = {};
  for (const a of articles) {
    const cat = getCategoryForSlug(a.slug);
    if (!grouped[cat.key]) grouped[cat.key] = { title: cat.title, articles: [] };
    grouped[cat.key].articles.push(a);
  }

  // Build HTML document (Word-compatible)
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #222; line-height: 1.7; max-width: 800px; margin: 0 auto; padding: 40px; }
  h1 { font-size: 28px; color: #1f3c88; border-bottom: 3px solid #1f3c88; padding-bottom: 10px; margin-top: 50px; }
  h2 { font-size: 22px; color: #1f3c88; margin-top: 40px; }
  h3 { font-size: 14px; color: #888; margin-bottom: 5px; font-weight: normal; }
  .meta { color: #666; font-size: 13px; margin-bottom: 15px; }
  .section-label { font-weight: bold; color: #1f3c88; font-size: 14px; margin-top: 20px; margin-bottom: 5px; }
  .verse-box { background: #f5f0e8; border-left: 4px solid #d4a017; padding: 12px 16px; margin: 15px 0; font-style: italic; }
  .quiz-box { background: #f0f4ff; border: 1px solid #ccc; border-radius: 6px; padding: 15px; margin: 15px 0; }
  .quiz-box .q { font-weight: bold; margin-bottom: 8px; }
  .quiz-box .opt { margin: 3px 0; }
  .quiz-box .correct { color: green; font-weight: bold; }
  .quiz-box .explain { margin-top: 10px; color: #555; font-style: italic; }
  .divider { border: none; border-top: 2px dashed #ddd; margin: 40px 0; }
  .cat-header { font-size: 32px; color: #fff; background: #1f3c88; padding: 15px 20px; margin-top: 60px; page-break-before: always; }
  .toc { margin: 20px 0; }
  .toc a { color: #1f3c88; text-decoration: none; display: block; padding: 3px 0; }
  .toc-cat { font-weight: bold; font-size: 16px; margin-top: 12px; }
</style>
</head>
<body>

<h1 style="font-size: 36px; text-align: center; border: none;">Bible Encouragement — All Articles</h1>
<p style="text-align: center; color: #666;">Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
<p style="text-align: center; color: #666;">Total Articles: ${articles.length} across ${Object.keys(grouped).length} categories</p>

<h2>Table of Contents</h2>
<div class="toc">`;

  // TOC
  let articleNum = 0;
  for (const [catKey, catData] of Object.entries(grouped)) {
    html += `<div class="toc-cat">${catData.title} (${catData.articles.length} articles)</div>`;
    for (const a of catData.articles) {
      articleNum++;
      html += `<a href="#article-${a.slug}">${articleNum}. ${a.title}</a>`;
    }
  }
  html += `</div>`;

  // Articles by category
  articleNum = 0;
  for (const [catKey, catData] of Object.entries(grouped)) {
    html += `<div class="cat-header">${catData.title}</div>`;

    for (const a of catData.articles) {
      articleNum++;
      html += `
<div id="article-${a.slug}">
  <h2>${articleNum}. ${a.title}</h2>
  <h3>Slug: /article/${a.slug}</h3>
  <div class="meta">
    <strong>SEO Title:</strong> ${a.meta_title}<br>
    <strong>SEO Description:</strong> ${a.meta_description}
  </div>

  <div class="section-label">Story Context / Empathy Section</div>
  <p>${a.story_context}</p>

  <div class="section-label">Featured Verse</div>
  <div class="verse-box">
    <strong>${a.verse_reference}</strong><br>
    "${a.verse_text}"
  </div>

  <div class="section-label">Reflection</div>
  <p>${a.reflection_text}</p>

  <div class="section-label">Quiz</div>
  <div class="quiz-box">
    <div class="q">${a.quiz_question}</div>
    <div class="opt ${a.correct_option === 'A' ? 'correct' : ''}">A) ${a.option_a}</div>
    <div class="opt ${a.correct_option === 'B' ? 'correct' : ''}">B) ${a.option_b}</div>
    <div class="opt ${a.correct_option === 'C' ? 'correct' : ''}">C) ${a.option_c}</div>
    <div class="opt ${a.correct_option === 'D' ? 'correct' : ''}">D) ${a.option_d}</div>
    <div class="explain"><strong>Answer: ${a.correct_option}</strong> — ${a.quiz_explanation}</div>
  </div>
</div>
<hr class="divider">`;
    }
  }

  html += `
</body>
</html>`;

  fs.writeFileSync(OUTPUT, html, 'utf8');
  const size = fs.statSync(OUTPUT).size;
  console.log(`✓ Exported ${articles.length} articles to: ${OUTPUT}`);
  console.log(`  File size: ${(size / 1024).toFixed(1)} KB`);
})();
