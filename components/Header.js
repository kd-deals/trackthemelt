import { SITE_NAME, TTM_URL } from '../lib/site';
import { getData, lastCloses } from '../lib/data';
import SpotStrip from './SpotStrip';

export function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="25" stroke="currentColor" strokeOpacity="0.18" strokeWidth="6" />
      <circle cx="32" cy="32" r="25" stroke="#B87333" strokeWidth="6" strokeLinecap="round"
        strokeDasharray="117.8 157.1" transform="rotate(-90 32 32)" />
      <path d="M32 18c5.5 7.2 9 12.3 9 16.4A9 9 0 0 1 23 34.4C23 30.3 26.5 25.2 32 18z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header({ active }) {
  const nav = [
    ['silver', '/#silver', 'Silver'],
    ['gold', '/#gold', 'Gold'],
    ['bullion', '/#bullion', 'Bullion'],
    ['base', '/#base', 'Pennies & Nickels'],
    ['world', '/world/', 'World'],
    ['junk', '/junk-silver-calculator/', 'Junk Silver Calculator'],
    ['scrap', '/scrap-gold-silver-calculator/', 'Scrap Gold & Silver'],
  ];
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a href="/" className="brand"><Logo />{SITE_NAME}</a>
        <nav aria-label="Primary" className="primary-nav">
          {nav.map(([k, href, label]) => (
            <a key={k} href={href} className={k === active ? 'on' : ''}>{label}</a>
          ))}
          <a href={TTM_URL}>New Mint Releases ↗</a>
        </nav>
      </div>
      <div className="spot-bar">
        <div className="wrap"><SpotStrip initial={getData().spot} closes={lastCloses()} /></div>
      </div>
    </header>
  );
}
