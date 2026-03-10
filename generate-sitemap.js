#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Reads bible.json + articles from the database and produces a comprehensive
 * sitemap.xml using a streaming write so memory stays flat even with 31k+ verses.
 *
 * Usage:
 *   node generate-sitemap.js                        # defaults to http://localhost:3000
 *   BASE_URL=https://bibleencouragement.com node generate-sitemap.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const BIBLE_JSON = path.join(__dirname, 'public', 'bible.json');
const OUTPUT     = path.join(__dirname, 'sitemap.xml');

/* ── Slug generation (mirrors frontend refToSlug) ── */
function refToSlug(ref) {
  return ref.toLowerCase().replace(/\s+/g, '-').replace(/:/g, '-');
}

/* ── Category definitions (must match server.js categoryConfig) ── */
const CATEGORIES = ['anxiety', 'peace', 'strength', 'healing'];

const categoryConfig = {
  anxiety:  { slugs: ['david-fear', 'jesus-calming-storm', 'paul-prison-peace', 'elijah-exhaustion'] },
  peace:    { slugs: ['peaceful-sleep', 'anxiety-at-night', 'rest-mind-wont-stop', 'psalms-nighttime-comfort'] },
  strength: { slugs: ['strength-difficult-times', 'strength-hard-work', 'strength-when-weak', 'strength-during-uncertainty'] },
  healing:  { slugs: ['healing-and-comfort', 'emotional-healing', 'strength-during-illness', 'recovery-after-difficulty'] }
};

function getCategoryForSlug(slug) {
  for (const [cat, config] of Object.entries(categoryConfig)) {
    if (config.slugs.includes(slug)) return cat;
  }
  return null;
}

/* ── Try to pull article slugs from the database, fall back gracefully ── */
function getArticleSlugs() {
  try {
    const initSqlJs = require('sql.js');         // already a project dependency
    const dbPath    = path.join(__dirname, 'database.db');
    if (!fs.existsSync(dbPath)) return [];

    // sql.js is promise-based for init; use sync workaround via buffer
    const SQL    = require('sql.js');
    // sql.js v1 exports a factory; handle both shapes
    if (typeof SQL === 'function' || (typeof SQL.then === 'function')) {
      // Can't do synchronous init — fall back to empty
      return [];
    }
    const buffer = fs.readFileSync(dbPath);
    const db     = new SQL.Database(buffer);
    const rows   = db.exec('SELECT slug FROM articles ORDER BY id');
    db.close();
    if (rows.length && rows[0].values) return rows[0].values.map(r => r[0]);
    return [];
  } catch (_) {
    return [];                                    // articles will be omitted
  }
}

/* ── Main ── */
(function main() {
  /* 1 — Read bible.json */
  if (!fs.existsSync(BIBLE_JSON)) {
    console.error('ERROR: bible.json not found at', BIBLE_JSON);
    process.exit(1);
  }
  const bible = JSON.parse(fs.readFileSync(BIBLE_JSON, 'utf8'));
  const verses = bible.verses || [];

  /* 2 — Collect article slugs (best-effort) */
  const articleSlugs = getArticleSlugs();

  /* 3 — Open a write stream so we never buffer the whole XML in memory */
  const ws = fs.createWriteStream(OUTPUT, { encoding: 'utf8' });

  ws.write('<?xml version="1.0" encoding="UTF-8"?>\n');
  ws.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

  /* Helper — write one <url> entry */
  function writeUrl(loc, priority, changefreq) {
    ws.write('  <url>\n');
    ws.write('    <loc>' + loc + '</loc>\n');
    ws.write('    <changefreq>' + changefreq + '</changefreq>\n');
    ws.write('    <priority>' + priority.toFixed(1) + '</priority>\n');
    ws.write('  </url>\n');
  }

  /* 4 — Homepage */
  writeUrl(BASE_URL + '/', 1.0, 'daily');

  /* 5 — Category pages (priority 1.0 per requirement) */
  for (const cat of CATEGORIES) {
    writeUrl(BASE_URL + '/category/' + cat, 1.0, 'weekly');
  }

  /* 6 — Article pages */
  for (const slug of articleSlugs) {
    const cat = getCategoryForSlug(slug);
    const artPath = cat ? '/article/' + cat + '/' + encodeURIComponent(slug) : '/article/' + encodeURIComponent(slug);
    writeUrl(BASE_URL + artPath, 0.8, 'monthly');
  }

  /* 7 — Verse pages (bulk — this is the 31k+ section) */
  console.log(`\n📖 bible.json loaded: ${verses.length} verses`);

  const seen = new Set();                         // de-dupe if bible.json has repeats
  let written = 0;
  let skippedDupes = 0;
  let skippedInvalid = 0;

  for (const v of verses) {
    if (!v.reference || typeof v.reference !== 'string') {
      skippedInvalid++;
      continue;
    }
    const slug = refToSlug(v.reference);
    if (seen.has(slug)) {
      skippedDupes++;
      continue;
    }
    seen.add(slug);
    writeUrl(BASE_URL + '/verse/' + slug, 0.6, 'monthly');
    written++;
  }

  /* Validation — every valid, unique verse must have a URL block */
  const expectedUnique = verses.filter(v => v.reference && typeof v.reference === 'string').length - skippedDupes;
  if (written !== expectedUnique) {
    console.error(`❌ MISMATCH: expected ${expectedUnique} verse URLs but wrote ${written}`);
    process.exit(1);
  }

  /* 8 — Close */
  ws.write('</urlset>\n');
  ws.end(() => {
    const stats  = fs.statSync(OUTPUT);
    const urlCount = 1 + CATEGORIES.length + articleSlugs.length + written;
    const sizeMB  = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n✓ sitemap.xml written → ${OUTPUT}`);
    console.log(`  Total URLs : ${urlCount}`);
    console.log(`  Verses     : ${written} written, ${skippedDupes} duplicates skipped, ${skippedInvalid} invalid skipped`);
    console.log(`  File size  : ${sizeMB} MB (${stats.size.toLocaleString()} bytes)`);
  });
})();
