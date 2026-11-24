import { getData, calcRow } from './data';
import { contentLabel } from './melt';
import { COUNTRIES, BULLION_PAGE, WORLD_BULLION } from './world';

const row = (s, v) => ({ ...calcRow(s, v), contentLabel: contentLabel(v) });
// "Canadian Silver Dime" -> "Dime" inside the Canadian card
const short = (name, adj) => (adj ? name.replace(new RegExp(`^${adj} (Silver )?`), '') : name);

export function worldSeries(countryKey) {
  const { series } = getData();
  if (countryKey === 'bullion') return series.filter((s) => WORLD_BULLION.has(s.slug));
  const c = COUNTRIES.find((x) => x.key === countryKey);
  return c ? series.filter((s) => s.country === c.country && !WORLD_BULLION.has(s.slug)) : [];
}

export function worldPages() {
  return [...COUNTRIES, BULLION_PAGE].filter((c) => worldSeries(c.key).length);
}

export function worldCards() {
  return worldPages().map((c) => {
    const ss = worldSeries(c.key);
    const variants = ss.flatMap((s) => s.variants.map((v) => ({ s, v })));
    return {
      key: c.key, title: c.title, href: `/world/${c.key}/`, count: variants.length,
      rows: ss.slice(0, 4).map((s) => ({ ...row(s, s.variants[0]), name: short(s.name, c.adj) })),
    };
  });
}

export function worldCalcGroups() {
  return worldPages().map((c) => ({
    title: c.key === 'bullion' ? 'World Bullion' : c.key === 'uk' ? 'United Kingdom' : c.country,
    rows: worldSeries(c.key).flatMap((s) => s.variants.map((v) => row(s, v))),
  }));
}

export function usGoldCalcGroups() {
  const { series } = getData();
  const pick = (cat) => series.filter((s) => s.country === 'US' && s.category === cat)
    .flatMap((s) => s.variants.filter((v) => (v.metals.XAU || 0) >= 0.3).map((v) => row(s, v)));
  return [
    { title: 'Pre-1933 US Gold', rows: pick('gold') },
    { title: 'Gold Eagles & Buffalos', rows: pick('bullion') },
  ];
}
