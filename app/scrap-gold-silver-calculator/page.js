import Header from '../../components/Header';
import ScrapCalc, { ScrapPriceTable } from '../../components/ScrapCalc';
import { getData } from '../../lib/data';
import { shortDate } from '../../lib/format';
import { SITE_URL, SITE_NAME } from '../../lib/site';

export const metadata = {
  title: 'Scrap Gold & Sterling Silver Calculator: 10K, 14K, 18K Price per Gram',
  description: 'Scrap value of 10K, 14K, 18K, 22K and 24K gold, sterling and coin silver, and platinum by weight in grams, pennyweight or troy ounces, at live spot, with a buyer-payout slider.',
  alternates: { canonical: '/scrap-gold-silver-calculator/' },
};

export default function ScrapPage() {
  const { spot } = getData();
  return (
    <>
      <Header active="scrap" />
      <div className="wrap product">
        <h1 className="page-title">Scrap Gold & Silver Calculator</h1>
        <p className="p-summary">
          Weigh your jewelry, flatware or dental gold and enter the weight next to its purity. Values use live spot prices;
          the slider shows what a buyer paying a percentage of melt would offer. Most gold buyers pay 70–90% of melt.
        </p>
        <ScrapCalc initial={spot} />
        <section className="panel p-specs gap-top">
          <h2>Scrap Value per Gram Today</h2>
          <ScrapPriceTable initial={spot} />
          <p className="muted xsmall">Full melt value at live spot{spot.t ? ` (shown at the ${shortDate(spot.t)} close until live prices load)` : ''}. Buyers pay less than this.</p>
        </section>
        <section className="panel p-specs prose">
          <h2>How Scrap Value Is Calculated</h2>
          <p>
            Karat is parts of gold out of 24, so 14K is 14/24 = 58.3% gold and 18K is 75%. Scrap value is the weight × that
            purity × the spot price. Sterling silver is 92.5% silver; older US "coin silver" flatware is usually 90%.
          </p>
          <p>
            Jewelers weigh in grams or pennyweight (dwt): 1 dwt = 1.555 g, and 20 dwt = 1 troy ounce. Remove stones and
            weighted handles first: knife handles and candlesticks marked "weighted" are mostly filler, not silver.
          </p>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Scrap Gold & Silver Calculator',
        url: `${SITE_URL}/scrap-gold-silver-calculator/`, applicationCategory: 'FinanceApplication', operatingSystem: 'Any',
        description: 'Scrap value of karat gold, sterling silver and platinum by weight at live spot prices.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
      }) }} />
    </>
  );
}
