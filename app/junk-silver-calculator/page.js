import Header from '../../components/Header';
import JunkCalc from '../../components/JunkCalc';
import { getData } from '../../lib/data';
import { SITE_URL, SITE_NAME } from '../../lib/site';

export const metadata = {
  title: 'Junk Silver Calculator: 90%, 40%, War Nickels and Rolls',
  description: 'Melt value of junk silver by face value or coin count: pre-1965 90% silver dimes, quarters and halves, Morgan and Peace dollars, 40% Kennedy halves and Eisenhower dollars, war nickels, rolls and boxes, plus a deal analyzer for multiple of face.',
  alternates: { canonical: '/junk-silver-calculator/' },
};

export default function JunkPage() {
  const { spot, series } = getData();
  const variant = (slug) => series.flatMap((s) => s.variants).find((v) => v.slug === slug);
  const perDollar = (slug) => {
    const v = variant(slug);
    return v ? v.content.XAG / v.face : 0;
  };
  const kinds = [
    { key: '90', step: 0.05, title: '90% Silver', sub: 'Pre-1965 dimes, quarters, halves', ozPerDollar: perDollar('roosevelt-dime-silver') },
    { key: 'dollars', step: 1, title: 'Morgan & Peace Dollars', sub: '1878–1935, 90% silver', ozPerDollar: perDollar('morgan-dollar') },
    { key: '40h', step: 0.5, title: '40% Kennedy Halves', sub: '1965–1970', ozPerDollar: perDollar('kennedy-half-40') },
    { key: '40i', step: 1, title: '40% Eisenhower Dollars', sub: '1971–1976 S-mint', ozPerDollar: perDollar('eisenhower-dollar-40') },
    { key: 'war', step: 0.05, title: 'War Nickels', sub: '1942–1945, 35% silver', ozPerDollar: perDollar('jefferson-nickel-war') },
  ];
  const coins = [
    { key: 'dime', group: '90', face: 0.1, title: '90% Dimes', sub: 'Mercury, Roosevelt, Barber' },
    { key: 'quarter', group: '90', face: 0.25, title: '90% Quarters', sub: 'Washington, Standing Liberty, Barber' },
    { key: 'half', group: '90', face: 0.5, title: '90% Halves', sub: 'Kennedy 1964, Franklin, Walking Liberty' },
    { key: 'dollar', group: 'dollars', face: 1, title: 'Morgan & Peace Dollars', sub: '1878–1935' },
    { key: 'half40', group: '40h', face: 0.5, title: '40% Kennedy Halves', sub: '1965–1970' },
    { key: 'ike40', group: '40i', face: 1, title: '40% Eisenhower Dollars', sub: '1971–1976 S-mint' },
    { key: 'war', group: 'war', face: 0.05, title: 'War Nickels', sub: '1942–1945' },
  ];
  return (
    <>
      <Header active="junk" />
      <div className="wrap product">
        <h1 className="page-title">Junk Silver Calculator</h1>
        <p className="p-summary">
          Enter face value or coin counts, or add rolls with one click. Every $1 face of 90% silver holds {kinds[0].ozPerDollar.toFixed(4)} oz of
          pure silver when new; worn coins are usually traded at 0.715 oz. Morgan and Peace dollars hold more,
          {' '}{kinds[1].ozPerDollar.toFixed(4)} oz each, so they're counted separately. 40% halves hold
          {' '}{kinds[2].ozPerDollar.toFixed(4)} oz per $1 face and war nickels {kinds[4].ozPerDollar.toFixed(4)} oz.
        </p>
        <JunkCalc kinds={kinds} coins={coins} initial={spot} />
        <section className="panel p-specs prose">
          <h2>How Junk Silver Is Priced</h2>
          <p>
            "Junk" silver is circulated silver coinage with no collector premium. It trades by face value as a multiple of
            spot, so a dealer quote like "$30× face" means $30 for every $1 face value. Dealers buy below melt and sell above
            it; the dealer slider shows what a percentage-of-melt offer works out to.
          </p>
          <p>
            The deal analyzer works both ways. Enter an asking price to see the multiple of face and percent of melt you'd be
            paying, or enter a budget and a quoted multiple to see how much face value and silver it buys.
          </p>
          <p>
            Check dates before selling. Key dates and high grades, like a 1916-D Mercury dime or a better-date Morgan, can be
            worth far more than melt.
          </p>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Junk Silver Calculator',
        url: `${SITE_URL}/junk-silver-calculator/`, applicationCategory: 'FinanceApplication', operatingSystem: 'Any',
        description: 'Melt value of 90% silver, Morgan and Peace dollars, 40% silver and war nickels by face value or coin count, with roll presets and a deal analyzer.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
      }) }} />
    </>
  );
}
