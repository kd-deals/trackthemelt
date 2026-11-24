import Header from '../../components/Header';
import JunkCalc from '../../components/JunkCalc';
import { getData } from '../../lib/data';
import { SITE_URL, SITE_NAME } from '../../lib/site';

export const metadata = {
  title: 'Junk Silver Calculator: 90%, 40% and War Nickels',
  description: 'Melt value of junk silver by face value: pre-1965 90% silver dimes, quarters and halves, Morgan and Peace dollars, 40% Kennedy halves and Eisenhower dollars, and wartime nickels, at live silver spot.',
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
  return (
    <>
      <Header active="junk" />
      <div className="wrap product">
        <h1 className="page-title">Junk Silver Calculator</h1>
        <p className="p-summary">
          Enter the face value of each kind of coin. Every $1 face of 90% silver holds {kinds[0].ozPerDollar.toFixed(4)} oz of
          pure silver when new; worn coins are usually traded at 0.715 oz. Morgan and Peace dollars hold more,
          {' '}{kinds[1].ozPerDollar.toFixed(4)} oz each, so they're counted separately. 40% halves hold
          {' '}{kinds[2].ozPerDollar.toFixed(4)} oz per $1 face and war nickels {kinds[4].ozPerDollar.toFixed(4)} oz.
        </p>
        <JunkCalc kinds={kinds} initial={spot} />
        <section className="panel p-specs prose">
          <h2>How Junk Silver Is Priced</h2>
          <p>
            "Junk" silver is circulated silver coinage with no collector premium. It trades by face value as a multiple of
            spot, so a dealer quote like "$30× face" means $30 for every $1 face value. Dealers buy below melt and sell above
            it; the dealer slider shows what a percentage-of-melt offer works out to.
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
        description: 'Melt value of 90% silver, Morgan and Peace dollars, 40% silver and war nickels by face value, at live silver spot.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
      }) }} />
    </>
  );
}
