import Header from '../../components/Header';
import WorldCards from '../../components/WorldCards';
import { getData } from '../../lib/data';
import { worldCards } from '../../lib/worldData';

export const metadata = {
  title: 'World Coin Melt Values: Canadian, Mexican, British, Swiss & Dutch Silver',
  description: 'Live melt value of world silver and gold coins: Canadian 80% and 50% silver, Mexican pesos and Centenarios, British sterling and sovereigns, Swiss francs, Dutch guilders and world bullion coins.',
  alternates: { canonical: '/world/' },
};

export default function World() {
  const { spot } = getData();
  return (
    <>
      <Header active="world" />
      <div className="wrap product">
        <h1 className="page-title">World Coin Melt Values</h1>
        <p className="p-summary">
          Silver and gold coins from outside the US, by country. Values update live with spot. To add up a pile of mixed
          world coins, use the <a href="/junk-silver-calculator/world-coins/">world coins calculator</a>.
        </p>
        <WorldCards cards={worldCards()} initial={spot} />
      </div>
    </>
  );
}
