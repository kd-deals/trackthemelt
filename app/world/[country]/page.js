import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import CoinTable from '../../../components/CoinTable';
import { getData, getRows } from '../../../lib/data';
import { worldPages, worldSeries } from '../../../lib/worldData';
import { SITE_URL, SITE_NAME } from '../../../lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return worldPages().map((c) => ({ country: c.key }));
}

function pageFor(key) {
  return worldPages().find((c) => c.key === key) || null;
}

export async function generateMetadata({ params }) {
  const { country } = await params;
  const c = pageFor(country);
  if (!c) return {};
  const title = `${c.title} Melt Value`;
  const description = `Live melt value and silver or gold content of ${c.title.toLowerCase()}: ${worldSeries(c.key).map((s) => s.name).join(', ')}.`;
  return { title, description, alternates: { canonical: `/world/${c.key}/` }, openGraph: { siteName: SITE_NAME, type: 'website', title, description, url: `/world/${c.key}/`, images: [{ url: '/og/home.png', width: 1200, height: 630 }] } };
}

export default async function CountryPage({ params }) {
  const { country } = await params;
  const c = pageFor(country);
  if (!c) notFound();
  const { spot } = getData();
  const slugs = new Set(worldSeries(c.key).map((s) => s.slug));
  const rows = getRows().filter((r) => slugs.has(r.series));
  const crumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'World Coins', item: `${SITE_URL}/world/` },
      { '@type': 'ListItem', position: 2, name: c.title, item: `${SITE_URL}/world/${c.key}/` },
    ],
  };
  return (
    <>
      <Header active="world" />
      <div className="wrap product">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href="/world/">World Coins</a><span aria-hidden="true">/</span><span>{c.title}</span>
        </nav>
        <h1 className="page-title">{c.title} Melt Value</h1>
        <div className="world-guide">
          {c.guide.map((g) => <p key={g}>{g}</p>)}
        </div>
        <CoinTable id={c.key} title={c.title} blurb="Live melt value per coin" rows={rows} initial={spot} hideFace />
        <p className="muted small">Adding up a mix? Use the <a href="/junk-silver-calculator/world-coins/">world coins calculator</a>.</p>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
    </>
  );
}
