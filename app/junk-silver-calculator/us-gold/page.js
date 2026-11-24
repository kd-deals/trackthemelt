import Header from '../../../components/Header';
import CalcTabs from '../../../components/CalcTabs';
import CountCalc from '../../../components/CountCalc';
import { getData } from '../../../lib/data';
import { usGoldCalcGroups } from '../../../lib/worldData';

export const metadata = {
  title: 'US Gold Coin Melt Calculator: $20, $10, $5 Gold and Gold Eagles',
  description: 'Melt value of pre-1933 US gold coins ($1, $2.50, $3, $5, $10, $20) and American Gold Eagles and Buffalos by coin count, at live gold spot, with a dealer-offer slider.',
  alternates: { canonical: '/junk-silver-calculator/us-gold/' },
};

export default function UsGoldPage() {
  const { spot } = getData();
  return (
    <>
      <Header active="junk" />
      <div className="wrap product">
        <h1 className="page-title">US Gold Coin Calculator</h1>
        <p className="p-summary">
          Enter how many of each coin you have. Pre-1933 US gold is 90% gold; Gold Eagles are 22-karat and hold their
          stated weight of gold. Common-date pre-1933 gold usually trades a little over melt.
        </p>
        <CalcTabs active="gold" />
        <CountCalc title="Your US Gold" groups={usGoldCalcGroups()} initial={spot} />
      </div>
    </>
  );
}
