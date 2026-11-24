import Header from '../../components/Header';
import ContactForm from '../../components/ContactForm';
import { SITE_NAME, TTM_URL } from '../../lib/site';

export const metadata = {
  title: 'About, FAQ & Contact',
  description: `How ${SITE_NAME} calculates coin melt values, where the prices come from, common questions, and how to reach us.`,
  alternates: { canonical: '/about/' },
};

const FAQ = [
  {
    q: 'What is melt value?',
    a: 'Melt value is what the metal in a coin is worth at current spot prices: the coin\'s weight × the share of each metal × that metal\'s price. It ignores face value and collector value.',
  },
  {
    q: 'Where do the prices come from and how often do they update?',
    a: 'Gold, silver, platinum, palladium and copper are live spot prices from gold-api.com and refresh in your browser about once a minute. Nickel and zinc are the London Metal Exchange (LME) cash settlement prices, updated once a day on trading days. Manganese, which is only in wartime nickels, has no free daily price and is updated by hand.',
  },
  {
    q: 'Why won\'t a dealer pay melt value?',
    a: 'Melt value is the metal floor, not an offer. Dealers buying common silver coins usually pay a percentage of melt that moves with demand, and refiners charge fees. Collectible dates and high-grade coins can be worth well over melt.',
  },
  {
    q: 'Which US coins contain silver?',
    a: 'Dimes, quarters and half dollars dated 1964 and earlier are 90% silver, as are Morgan and Peace dollars. Kennedy halves dated 1965–1970 are 40% silver, as are Eisenhower dollars made for collectors. Wartime nickels from 1942–1945 with a large mint mark above Monticello are 35% silver.',
  },
  {
    q: 'How do I tell a copper 1982 penny from a zinc one?',
    a: 'Weigh it. The cent changed from 95% copper to copper-plated zinc partway through 1982, and both kinds carry the date. Copper cents weigh about 3.1 g and zinc cents about 2.5 g.',
  },
  {
    q: 'Is it legal to melt pennies and nickels?',
    a: 'Federal regulation (31 CFR Part 82) generally prohibits melting or treating US one-cent and five-cent coins and limits exporting them. Silver and gold coins are not covered by that rule.',
  },
  {
    q: 'Does the calculator include proof sets and world coins?',
    a: 'Yes. The junk silver calculator has tabs for US gold, world coins and proof & mint sets, and the World section lists silver and gold coins by country.',
  },
];

export default function About() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap product">
        <h1 className="page-title">About {SITE_NAME}</h1>
        <section className="panel p-specs prose">
          <p>
            {SITE_NAME} shows what the metal in coins is worth at current spot prices: pre-1965 silver, 40% silver,
            wartime nickels, pennies and nickels, US gold, American Eagles, proof sets and common world silver and gold.
          </p>
          <h2>How Melt Value Is Calculated</h2>
          <p>
            Each coin's melt value is its weight × the share of each metal × that metal's spot price, using the coin's
            official specifications. Melt value is not a dealer offer.
          </p>
          <h2>Sister Site</h2>
          <p>
            For current US Mint products, sell-outs and new releases, see <a href={TTM_URL}>TrackTheMint</a>.
          </p>
        </section>

        <section className="panel p-specs prose" id="faq">
          <h2>Frequently Asked Questions</h2>
          {FAQ.map((f) => (
            <div key={f.q} className="faq">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>

        <section className="panel p-specs prose" id="contact">
          <h2>Contact</h2>
          <p>Spot a wrong spec, want a coin added or found a bug? Send a note.</p>
          <ContactForm />
        </section>
      </div>
    </>
  );
}
