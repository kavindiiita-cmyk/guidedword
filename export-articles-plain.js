const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_PATH = path.join(__dirname, 'database.db');
const OUTPUT  = path.join(__dirname, 'All_Articles_Review.doc');

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

function line(char, len) { return char.repeat(len); }

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

  let out = '';
  out += line('=', 70) + '\r\n';
  out += '  BIBLE ENCOURAGEMENT — ALL ARTICLES\r\n';
  out += line('=', 70) + '\r\n';
  out += `  Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\r\n`;
  out += `  Total: ${articles.length} articles across ${Object.keys(grouped).length} categories\r\n`;
  out += line('=', 70) + '\r\n\r\n';

  // Table of Contents
  out += 'TABLE OF CONTENTS\r\n';
  out += line('-', 40) + '\r\n';
  let num = 0;
  for (const [catKey, catData] of Object.entries(grouped)) {
    out += `\r\n  [${catData.title.toUpperCase()}]\r\n`;
    for (const a of catData.articles) {
      num++;
      out += `    ${num}. ${a.title}\r\n`;
    }
  }
  out += '\r\n' + line('=', 70) + '\r\n\r\n';

  // Articles by category
  num = 0;
  for (const [catKey, catData] of Object.entries(grouped)) {
    out += line('*', 70) + '\r\n';
    out += `  CATEGORY: ${catData.title.toUpperCase()}  (${catData.articles.length} articles)\r\n`;
    out += line('*', 70) + '\r\n\r\n';

    for (const a of catData.articles) {
      num++;
      out += line('-', 70) + '\r\n';
      out += `ARTICLE ${num}: ${a.title}\r\n`;
      out += line('-', 70) + '\r\n';
      out += `Slug:             /article/${a.slug}\r\n`;
      out += `SEO Title:        ${a.meta_title}\r\n`;
      out += `SEO Description:  ${a.meta_description}\r\n`;
      out += '\r\n';

      out += '--- STORY CONTEXT ---\r\n\r\n';
      out += a.story_context + '\r\n\r\n';

      out += '--- FEATURED VERSE ---\r\n\r\n';
      out += `  ${a.verse_reference}\r\n`;
      out += `  "${a.verse_text}"\r\n\r\n`;

      out += '--- REFLECTION ---\r\n\r\n';
      out += a.reflection_text + '\r\n\r\n';

      out += '--- QUIZ ---\r\n\r\n';
      out += `Q: ${a.quiz_question}\r\n\r\n`;
      out += `  A) ${a.option_a}\r\n`;
      out += `  B) ${a.option_b}\r\n`;
      out += `  C) ${a.option_c}\r\n`;
      out += `  D) ${a.option_d}\r\n\r\n`;
      out += `  Correct Answer: ${a.correct_option}\r\n`;
      out += `  Explanation: ${a.quiz_explanation}\r\n`;
      out += '\r\n' + line('=', 70) + '\r\n\r\n';
    }
  }

  out += '\r\n[END OF DOCUMENT]\r\n';

  fs.writeFileSync(OUTPUT, out, 'utf8');
  const size = fs.statSync(OUTPUT).size;
  console.log(`Done! ${articles.length} articles exported to: ${OUTPUT}`);
  console.log(`File size: ${(size / 1024).toFixed(1)} KB`);
})();
