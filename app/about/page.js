import Header from '../../components/Header';
import { SITE_NAME, TTM_URL } from '../../lib/site';

export const metadata = {
  title: 'About',
  description: `How ${SITE_NAME} calculates coin melt values.`,
  alternates: { canonical: '/about/' },
};

export default function About() {
  return (
    <>
      <Header />
      <div className="wrap product">
        <h1 className="page-title">About {SITE_NAME}</h1>
        <section className="panel p-specs prose">
          <p>
            {SITE_NAME} shows what the metal in US coins is worth at current spot prices: pre-1965 silver, 40% silver,
            wartime nickels, pennies and nickels, pre-1933 gold and modern American Eagle bullion.
          </p>
          <h2>How Melt Value Is Calculated</h2>
          <p>
            Each coin's melt value is its weight × the share of each metal × that metal's spot price, using the coin's
            official specifications. Gold, silver, platinum, palladium and copper are live spot prices that refresh in your
            browser about once a minute. Nickel, zinc and manganese are updated periodically.
          </p>
          <p>
            Melt value is not a dealer offer. Dealers usually pay a percentage of melt for common coins, and collectible
            dates can be worth much more. Melting or exporting US cents and nickels in bulk is restricted by federal
            regulation.
          </p>
          <h2>Sister Site</h2>
          <p>
            For current US Mint products, sell-outs and new releases, see <a href={TTM_URL}>TrackTheMint</a>.
          </p>
        </section>
      </div>
    </>
  );
}
