export default function CalcTabs({ active }) {
  const tabs = [
    ['junk', '/junk-silver-calculator/', 'Junk Silver'],
    ['sets', '/junk-silver-calculator/proof-sets/', 'Proof & Mint Sets'],
  ];
  return (
    <nav className="calc-tabs" aria-label="Calculator">
      {tabs.map(([k, href, label]) => (
        <a key={k} href={href} className={k === active ? 'on' : ''} aria-current={k === active ? 'page' : undefined}>{label}</a>
      ))}
    </nav>
  );
}
