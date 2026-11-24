import Header from '../../../components/Header';
import CalcTabs from '../../../components/CalcTabs';
import CountCalc from '../../../components/CountCalc';
import { getData } from '../../../lib/data';
import { worldCalcGroups } from '../../../lib/worldData';

export const metadata = {
  title: 'World Silver & Gold Coin Melt Calculator',
  description: 'Add up the melt value of Canadian, Mexican, British, Swiss and Dutch silver and gold coins and world bullion by coin count, at live spot.',
  alternates: { canonical: '/junk-silver-calculator/world-coins/' },
};

export default function WorldCalcPage() {
  const { spot } = getData();
  return (
    <>
      <Header active="junk" />
      <div className="wrap product">
        <h1 className="page-title">World Coin Calculator</h1>
        <p className="p-summary">
          Enter how many of each coin you have. Values are in US dollars at live spot. See each <a href="/world/">country's page</a> for
          how to tell silver dates from base-metal ones.
        </p>
        <CalcTabs active="world" />
        <CountCalc title="Your World Coins" groups={worldCalcGroups()} initial={spot} />
      </div>
    </>
  );
}
