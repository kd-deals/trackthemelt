import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import SeriesCalc from '../../../components/SeriesCalc';
import MeltChart from '../../../components/MeltChart';
import { getData, getSeries, historyFor, GROUPS } from '../../../lib/data';
import { meltValue, contentLabel, PRECIOUS, METAL_NAME } from '../../../lib/melt';
import { money, dollars, times, years, shortDate, oz } from '../../../lib/format';
import { SITE_URL, TTM_URL } from '../../../lib/site';
import { countryByName } from '../../../lib/world';

export const dynamicParams = false;

export function generateStaticParams() {
  return getData().series.map((s) => ({ series: s.slug }));
}

// The variant worth the most in metal leads the summary.
function lead(s, prices) {
  return [...s.variants]
    .map((v) => ({ v, melt: meltValue(v.content, prices) }))
    .filter((x) => x.melt != null)
    .sort((a, b) => b.melt - a.melt)[0] || null;
}

function mainMetal(v) {
  return PRECIOUS.filter((c) => (v.metals[c] || 0) >= 0.1).sort((a, b) => v.content[b] - v.content[a])[0] || null;
}

function summary(s, prices, asOf) {
  const top = lead(s, prices);
  if (!top) return `${s.name} melt value at current spot prices.`;
  const { v, melt } = top;
  const m = mainMetal(v);
  if (!m && s.variants.length > 1) {
    const parts = s.variants.map((x) => {
      const mv = meltValue(x.content, prices);
      return `${x.type} (${years(x)}) ${mv == null ? 'no tracked metal value' : money(mv)}`;
    });
    return `${s.name} melt value${asOf ? ` at the ${shortDate(asOf)} spot price` : ''}: ${parts.join('; ')}.`;
  }
  const when = asOf ? ` at the ${shortDate(asOf)} spot price` : '';
  const usd = s.currency === 'USD' && v.face > 0;
  let text = m
    ? `A ${years(v)} ${s.name} (${v.type.toLowerCase()}) contains ${oz(v.content[m])} troy oz of pure ${METAL_NAME[m]}, worth ${money(melt)}${when}${usd ? `, or ${times(melt / v.face)} face value` : ''}.`
    : `A ${years(v)} ${s.name} contains ${v.composition.toLowerCase()}, worth ${money(melt)} in metal${when}${usd ? `, or ${times(melt / v.face)} face value` : ''}.`;
  const others = s.variants.filter((x) => x !== v);
  if (m && others.length) {
    const base = others.filter((x) => !mainMetal(x));
    if (base.length) text += ` ${base.map((x) => years(x)).join(' and ')} ${s.name}s are not ${METAL_NAME[m]} and are worth far less in metal.`;
  }
  return text;
}

function faqs(s, prices) {
  const out = [];
  const precious = s.variants.filter((v) => mainMetal(v));
  const base = s.variants.filter((v) => !mainMetal(v));
  if (precious.length && base.length) {
    const m = METAL_NAME[mainMetal(precious[0])];
    out.push({
      q: `Which ${s.name}s are ${m}?`,
      a: `${precious.map((v) => `${years(v)} (${v.composition})`).join('; ')}. ${base.map((v) => `${years(v)} ${s.name}s are ${v.composition.toLowerCase()}`).join('; ')}.`,
    });
  }
  for (const v of precious) {
    const m = mainMetal(v);
    const melt = meltValue(v.content, prices);
    out.push({
      q: `How much ${METAL_NAME[m]} is in a ${years(v)} ${s.name}?`,
      a: `${oz(v.content[m])} troy ounces of pure ${METAL_NAME[m]} (${v.gross_g} g total weight, ${v.composition}). At current spot that is worth about ${money(melt)}.`,
    });
  }
  const notes = s.variants.filter((v) => v.notes && !/not valued|No tracked/i.test(v.notes));
  if (notes.length) {
    out.push({ q: `What should I know about ${s.name} dates?`, a: [...new Set(notes.map((v) => v.notes))].join('. ') + '.' });
  }
  if (['cent', 'nickel'].includes(s.category)) {
    out.push({
      q: `Is it legal to melt ${s.name}s?`,
      a: 'Melting or exporting US cents and nickels in bulk is prohibited by federal regulation (31 CFR Part 82), with small exceptions. Melt value here is informational.',
    });
  }
  out.push({
    q: 'Is melt value what a dealer will pay?',
    a: 'Usually not exactly. Dealers typically pay a percentage of melt for common-date coins, and scarce dates or high grades can be worth well over melt. Melt value is a floor for what the metal is worth.',
  });
  return out;
}

// Search phrasing per series ("how much is a silver quarter worth").
const ASK = {
  'lincoln-cent': 'a Copper Penny', 'jefferson-nickel': 'a War Nickel',
  'barber-dime': 'a Silver Dime', 'mercury-dime': 'a Silver Dime', 'roosevelt-dime': 'a Silver Dime',
  'barber-quarter': 'a Silver Quarter', 'standing-liberty-quarter': 'a Silver Quarter', 'washington-quarter': 'a Silver Quarter',
  'barber-half': 'a Silver Half Dollar', 'walking-liberty-half': 'a Silver Half Dollar', 'franklin-half': 'a Silver Half Dollar',
  'kennedy-half': 'a Silver Kennedy Half', 'morgan-dollar': 'a Morgan Silver Dollar', 'peace-dollar': 'a Peace Silver Dollar',
  'eisenhower-dollar': 'a Silver Ike Dollar', 'double-eagle': 'a $20 Gold Coin', 'eagle': 'a $10 Gold Coin',
  'half-eagle': 'a $5 Gold Coin', 'quarter-eagle': 'a $2.50 Gold Coin', 'american-silver-eagle': 'a Silver Eagle',
};

export async function generateMetadata({ params }) {
  const { series } = await params;
  const s = getSeries(series);
  if (!s) return {};
  const { prices, spot } = getData();
  const desc = summary(s, prices, spot.t);
  const title = `${s.name} Melt Value: How Much Is ${ASK[s.slug] || 'It'} Worth?`;
  return {
    title: { absolute: title },   // keyword question in full; skip the site-name suffix
    description: desc,
    alternates: { canonical: `/coins/${s.slug}/` },
    openGraph: { title, description: desc, url: `/coins/${s.slug}/`, images: [{ url: `/og/${s.slug}.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [`/og/${s.slug}.png`] },
  };
}

export default async function SeriesPage({ params }) {
  const { series } = await params;
  const s = getSeries(series);
  if (!s) notFound();
  const { prices, spot, series: all, baseAsOf } = getData();
  const group = s.variants.find((v) => v.group !== 'base')?.group || 'base';
  const isWorld = group === 'world' || group === 'world-bullion';
  const ctry = group === 'world' ? countryByName(s.country) : null;
  const groupInfo = isWorld
    ? { title: ctry ? ctry.title : 'World Bullion Coins', href: `/world/${ctry ? ctry.key : 'bullion'}/` }
    : { ...GROUPS.find((g) => g.key === group), href: `/#${group}` };
  const related = all.filter((x) => x.slug !== s.slug && x.variants.some((v) => v.group === group)
    && (!ctry || x.country === s.country)).slice(0, 8);
  const qa = faqs(s, prices);
  const hasPrecious = s.variants.some((v) => mainMetal(v));
  const usesBase = s.variants.some((v) => ['NI', 'ZN', 'MN'].some((c) => v.content[c]));
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Coin Melt Values', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: groupInfo.title, item: `${SITE_URL}${groupInfo.href}` },
      { '@type': 'ListItem', position: 3, name: s.name, item: `${SITE_URL}/coins/${s.slug}/` },
    ],
  };

  return (
    <>
      <Header active={isWorld ? 'world' : group} />
      <div className="wrap product">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href="/">Coin Melt Values</a><span aria-hidden="true">/</span>
          <a href={groupInfo.href}>{groupInfo.title}</a><span aria-hidden="true">/</span>
          <span>{s.name}</span>
        </nav>
        <h1 className="page-title">{s.name} Melt Value</h1>
        <p className="p-summary">{summary(s, prices, spot.t)}</p>

        <SeriesCalc name={s.name} variants={s.variants} currency={s.currency} initial={spot} />
        <MeltChart variants={s.variants} history={historyFor(s.variants)} prices={prices} />

        <div className="p-bottom">
          <section className="panel p-specs">
            <h2>Specifications</h2>
            <div className="spec-scroll">
              <table className="spec-table">
                <thead>
                  <tr><th scope="col">Type</th><th scope="col">Years</th><th scope="col">Weight</th><th scope="col">Composition</th>{hasPrecious && <th scope="col">Metal content</th>}</tr>
                </thead>
                <tbody>
                  {s.variants.map((v) => (
                    <tr key={v.slug}>
                      <th scope="row">{v.type}</th>
                      <td className="mono">{years(v)}</td>
                      <td className="mono">{v.gross_g} g</td>
                      <td>{v.composition}</td>
                      {hasPrecious && <td>{mainMetal(v) ? contentLabel(v) : '—'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {usesBase && (
              <p className="muted xsmall">Nickel, zinc and manganese valued at {baseAsOf ? `prices as of ${shortDate(baseAsOf)}` : 'recent prices'}; copper and precious metals at live spot.</p>
            )}
          </section>

          <section className="panel p-specs">
            <h2>Questions</h2>
            {qa.map((f) => (
              <div key={f.q} className="faq">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>
        </div>

        {(group === 'bullion' || group === 'gold') && (
          <a href={TTM_URL} className="panel ttm-cta">
            <span className="side-cta-title">Current US Mint Gold and Silver Products</span>
            <span className="muted small">Stock, sales and Mint prices versus melt on TrackTheMint →</span>
          </a>
        )}

        {related.length > 0 && (
          <section className="more">
            <div className="more-head"><h2>Other {groupInfo.title}</h2><a href={groupInfo.href}>All {groupInfo.title.toLowerCase()} →</a></div>
            <div className="more-grid">
              {related.map((r) => (
                <a key={r.slug} href={`/coins/${r.slug}/`} className="more-card">
                  <span className="more-text">
                    <span className="more-name">{r.name}</span>
                    <span className="muted xsmall mono">{years({ year_start: Math.min(...r.variants.map((v) => v.year_start)), year_end: r.variants.some((v) => v.year_end == null) ? null : Math.max(...r.variants.map((v) => v.year_end)) })}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
    </>
  );
}
