import Header from '../../../components/Header';
import CalcTabs from '../../../components/CalcTabs';
import SetCalc from '../../../components/SetCalc';
import { getData } from '../../../lib/data';
import { ALL_SETS } from '../../../lib/sets';
import { SITE_URL, SITE_NAME, TTM_URL } from '../../../lib/site';

export const metadata = {
  title: 'Silver Proof Set Melt Value Calculator: Proof, Mint & Limited Edition Sets',
  description: 'Silver content and live melt value of US proof and mint sets: 1936–1964 proof sets, 40% SMS and bicentennial sets, 90% and .999 silver proof sets, quarter sets and Limited Edition sets with Silver Eagles.',
  alternates: { canonical: '/junk-silver-calculator/proof-sets/' },
};

export default function SetsPage() {
  const { spot } = getData();
  return (
    <>
      <Header active="junk" />
      <div className="wrap product">
        <h1 className="page-title">Proof & Mint Set Melt Calculator</h1>
        <p className="p-summary">
          Enter how many of each set you have. Silver content is calculated from US Mint coin specifications: 90% silver
          sets through 2018, .999 fine silver from 2019. Clad coins in each set are not counted.
        </p>
        <CalcTabs active="sets" />
        <SetCalc initial={spot} />
        <section className="panel p-specs gap-top set-table">
          <h2>Silver Content by Set</h2>
          <div className="spec-scroll">
            <table className="spec-table">
              <thead><tr><th scope="col">Set</th><th scope="col">Years</th><th scope="col">Silver coins</th><th scope="col">Pure silver</th></tr></thead>
              <tbody>
                {ALL_SETS.map((x) => (
                  <tr key={x.key}><th scope="row">{x.title}</th><td className="mono">{x.years}</td><td>{x.contents}</td><td className="mono">{x.oz.toFixed(4)} oz</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Since 2019 the Mint strikes silver dimes, quarters and halves in .999 fine silver, slightly heavier than the old
            90% coins, so a 2019 silver proof set holds more silver than a 2018 set with the same coins. Many modern sets
            sell above melt to collectors; check current-year mintages and sell-outs on <a href={TTM_URL}>TrackTheMint</a>.
          </p>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Silver Proof Set Melt Calculator',
        url: `${SITE_URL}/junk-silver-calculator/proof-sets/`, applicationCategory: 'FinanceApplication', operatingSystem: 'Any',
        description: 'Silver content and melt value of US proof, mint and Limited Edition silver proof sets.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
      }) }} />
    </>
  );
}
