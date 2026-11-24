import { getData } from '../lib/data';
import { SITE_URL } from '../lib/site';
import { worldPages } from '../lib/worldData';

export const dynamic = 'force-static';

export default function sitemap() {
  const { series, spot } = getData();
  const lastModified = spot.t || undefined;
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/junk-silver-calculator/`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/junk-silver-calculator/us-gold/`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/junk-silver-calculator/world-coins/`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/world/`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    ...worldPages().map((c) => ({ url: `${SITE_URL}/world/${c.key}/`, lastModified, changeFrequency: 'daily', priority: 0.8 })),
    { url: `${SITE_URL}/junk-silver-calculator/proof-sets/`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/scrap-gold-silver-calculator/`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    ...series.map((s) => ({ url: `${SITE_URL}/coins/${s.slug}/`, lastModified, changeFrequency: 'daily', priority: 0.8 })),
    { url: `${SITE_URL}/about/`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
