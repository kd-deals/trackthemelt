import fs from 'fs';
import path from 'path';
import { PRECIOUS } from './melt';

const DATA_DIR = path.join(process.cwd(), 'data');

function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  } catch {
    return fallback;
  }
}

export const GROUPS = [
  { key: 'silver', title: 'Silver Coins', blurb: '90%, 40% and 35% silver US coins.' },
  { key: 'gold', title: 'Gold Coins', blurb: 'Pre-1933 US gold, 90% fine.' },
  { key: 'bullion', title: 'Bullion Coins', blurb: 'American Eagles and Buffalos.' },
  { key: 'base', title: 'Base-Metal Coins', blurb: 'Cents, nickels and clad coinage.' },
  { key: 'world', title: 'World Coins', blurb: 'Canada, Mexico, UK, Switzerland, Netherlands and world bullion.' },
];

function groupOf(series, v) {
  if ((series.country || 'US') !== 'US') return 'world';
  if (series.category === 'bullion') return 'bullion';
  if (series.category === 'gold') return 'gold';
  if ((v.metals.XAG || 0) >= 0.3) return 'silver';
  return 'base';
}

let cache;
export function getData() {
  if (cache) return cache;
  const { metals = {} } = readJSON('metals.json', {});
  const { series: rawSeries = [] } = readJSON('coins.json', {});
  const { daily = {} } = readJSON('spot_history.json', {});
  const { releases = [] } = readJSON('mint_releases.json', {});

  const prices = Object.fromEntries(Object.entries(metals).map(([c, m]) => [c, m.price]));
  const asOf = Object.values(metals).filter((m) => m.source === 'gold-api').map((m) => m.as_of).filter(Boolean).sort().at(-1) || null;

  const series = rawSeries.map((s) => {
    const variants = s.variants.map((v) => {
      const content = {};
      for (const [c, f] of Object.entries(v.metals)) {
        const m = metals[c];
        if (m) content[c] = (v.gross_g * f) / m.grams_per_unit;
      }
      return { ...v, type: v.label.replace(/\s*\(.*\)\s*$/, ''), content, group: groupOf(s, v) };
    });
    return { ...s, country: s.country || 'US', currency: s.currency || 'USD', variants };
  });

  cache = {
    metals,
    prices,
    spot: { t: asOf, live: false, prices },
    series,
    daily,
    releases,
    baseAsOf: ['NI', 'ZN', 'MN'].map((c) => metals[c]?.as_of).filter(Boolean).sort()[0] || null,
  };
  return cache;
}

export function getSeries(slug) {
  return getData().series.find((s) => s.slug === slug) || null;
}

// Rows for the homepage tables: one per composition period, grouped by what it's worth melting for.
export function getRows() {
  const rows = [];
  for (const s of getData().series) {
    for (const v of s.variants) {
      rows.push({
        series: s.slug, seriesName: s.name, slug: v.slug, label: v.type, group: v.group, currency: s.currency,
        year_start: v.year_start, year_end: v.year_end, face: v.face, composition: v.composition,
        metals: v.metals, content: v.content,
      });
    }
  }
  return rows;
}

// Daily closes for just the metals a set of variants contain (keeps page payloads small).
export function historyFor(variants) {
  const { daily } = getData();
  const codes = new Set(variants.flatMap((v) => Object.keys(v.content)));
  return Object.fromEntries([...codes].filter((c) => daily[c]).map((c) => [c, daily[c]]));
}

export const isPrecious = (v) => PRECIOUS.some((c) => (v.metals[c] || 0) >= 0.3);
