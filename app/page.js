import Header from '../components/Header';
import CoinTable from '../components/CoinTable';
import StatTiles from '../components/StatTiles';
import Releases from '../components/Releases';
import { getData, getRows, GROUPS } from '../lib/data';
import { SITE_URL, SITE_NAME, TTM_URL } from '../lib/site';

export const metadata = { alternates: { canonical: '/' } };

export default function Home() {
  const { spot } = getData();
  const rows = getRows();
  const by = (slug) => rows.find((r) => r.slug === slug);
  const tile = (slug, label, href, mult = 1) => {
    const r = by(slug);
    return r && { label, href, content: r.content, face: r.face * mult, mult };
  };
  const tiles = [
    tile('roosevelt-dime-silver', 'Silver dime (pre-1965)', '/coins/roosevelt-dime/'),
    tile('washington-quarter-silver', 'Silver quarter (pre-1965)', '/coins/washington-quarter/'),
    tile('morgan-dollar', 'Morgan / Peace dollar', '/coins/morgan-dollar/'),
    tile('roosevelt-dime-silver', '$1 face of 90% silver', '/junk-silver-calculator/', 10),
  ].filter(Boolean);
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME,
        description: 'Live melt value of US coins at current gold, silver and copper spot prices.', inLanguage: 'en-US' },
      { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: SITE_NAME, url: `${SITE_URL}/`, logo: `${SITE_URL}/icon.svg`, sameAs: [TTM_URL] },
      { '@type': 'ItemList', name: 'US coin melt values',
        itemListElement: getData().series.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: `${x.name} melt value`, url: `${SITE_URL}/coins/${x.slug}/` })) },
    ],
  };

  return (
    <>
      <Header />
      <div className="wrap intro">
        <h1>US Coin Melt Values</h1>
        <p className="lede">What the metal in US coins is worth at today's spot price. Values update live as spot moves.</p>
        <StatTiles tiles={tiles} initial={spot} />
      </div>

      <div className="wrap layout">
        <main className="main-col">
          {GROUPS.map((g) => (
            <CoinTable key={g.key} id={g.key} title={g.title} blurb={g.blurb}
              rows={rows.filter((r) => r.group === g.key)} initial={spot} />
          ))}
        </main>
        <div className="side-col">
          <a href="/junk-silver-calculator/" className="panel side-cta">
            <span className="side-cta-title">Junk Silver Calculator</span>
            <span className="muted small">Enter face value of 90%, 40% or war-nickel silver and see melt value and what a dealer might pay.</span>
          </a>
          <Releases />
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
