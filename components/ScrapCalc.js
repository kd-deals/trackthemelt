'use client';
import { useState } from 'react';
import { useSpot } from '../lib/useSpot';
import { dollars } from '../lib/format';

const OZT = 31.1034768;
const UNITS = { g: { label: 'Grams', short: 'g', grams: 1 }, dwt: { label: 'Pennyweight', short: 'dwt', grams: 1.55517384 }, ozt: { label: 'Troy oz', short: 'ozt', grams: OZT } };

export const PURITIES = [
  { key: '10k', metal: 'XAU', title: '10K Gold', sub: '41.7% gold', fine: 10 / 24 },
  { key: '14k', metal: 'XAU', title: '14K Gold', sub: '58.3% gold', fine: 14 / 24 },
  { key: '18k', metal: 'XAU', title: '18K Gold', sub: '75% gold', fine: 18 / 24 },
  { key: '22k', metal: 'XAU', title: '22K Gold', sub: '91.7% gold', fine: 22 / 24 },
  { key: '24k', metal: 'XAU', title: '24K Gold', sub: '99.9% gold', fine: 0.999 },
  { key: '925', metal: 'XAG', title: 'Sterling Silver', sub: '.925 silver', fine: 0.925 },
  { key: '900', metal: 'XAG', title: 'Coin Silver', sub: '.900 silver', fine: 0.9 },
  { key: '999', metal: 'XAG', title: 'Fine Silver', sub: '.999 silver', fine: 0.999 },
  { key: 'pt950', metal: 'XPT', title: 'Platinum 950', sub: '95% platinum', fine: 0.95 },
];

export function ScrapPriceTable({ initial }) {
  const s = useSpot(initial);
  return (
    <div className="spec-scroll">
      <table className="spec-table">
        <thead>
          <tr><th scope="col">Purity</th><th scope="col">Per gram</th><th scope="col">Per dwt</th><th scope="col">Per troy oz</th></tr>
        </thead>
        <tbody>
          {PURITIES.map((p) => {
            const perG = s.prices[p.metal] != null ? (s.prices[p.metal] * p.fine) / OZT : null;
            return (
              <tr key={p.key}>
                <th scope="row">{p.title}</th>
                <td className="mono">{dollars(perG)}</td>
                <td className="mono">{perG == null ? '—' : dollars(perG * UNITS.dwt.grams)}</td>
                <td className="mono">{perG == null ? '—' : dollars(perG * OZT)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ScrapCalc({ initial }) {
  const s = useSpot(initial);
  const [unit, setUnit] = useState('g');
  const [w, setW] = useState(Object.fromEntries(PURITIES.map((p) => [p.key, ''])));
  const [pct, setPct] = useState(100);
  const u = UNITS[unit];

  const lines = PURITIES.map((p) => {
    const grams = Math.max(0, Number(w[p.key]) || 0) * u.grams;
    const pureOz = (grams * p.fine) / OZT;
    const spot = s.prices[p.metal];
    return { ...p, grams, pureOz, value: spot != null ? pureOz * spot : null };
  });
  const sum = (metal) => lines.filter((l) => !metal || l.metal === metal).reduce((n, l) => n + (l.value || 0), 0);
  const total = sum();
  const oz = (metal) => lines.filter((l) => l.metal === metal).reduce((n, l) => n + l.pureOz, 0);

  return (
    <section className="panel calc">
      <div className="calc-head">
        <h2>Your Scrap {s.live ? <span className="live-tag"><span className="live-dot" aria-hidden="true" />live</span> : null}</h2>
        <div className="seg" role="group" aria-label="Weight unit">
          {Object.entries(UNITS).map(([k, x]) => (
            <button key={k} className={unit === k ? 'on' : ''} aria-pressed={unit === k} onClick={() => setUnit(k)}>{x.label}</button>
          ))}
        </div>
      </div>
      <div className="junk-grid">
        {lines.map((l) => (
          <label key={l.key} className="junk-line">
            <span className="junk-name">
              <span className="pname">{l.title}</span>
              <span className="code">{l.sub}</span>
            </span>
            <span className="junk-input">
              <span className="muted">Weight</span>
              <input type="number" inputMode="decimal" min="0" step="0.01" placeholder="0" value={w[l.key]}
                onChange={(e) => setW({ ...w, [l.key]: e.target.value })} />
              <span className="step-hint muted xsmall">{u.short}</span>
            </span>
            <span className="junk-out mono">
              <span>{l.pureOz.toFixed(3)} oz pure</span>
              <span className="muted">{l.value == null ? '—' : dollars(l.value)}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="junk-opts">
        <label className="slider">
          <span>Buyer pays <strong className="mono pct">{pct}%</strong> of melt</span>
          <input type="range" min="50" max="100" step="1" value={pct} onChange={(e) => setPct(Number(e.target.value))} />
        </label>
      </div>
      <div className="junk-total">
        <div><dt>Pure gold</dt><dd className="mono">{oz('XAU').toFixed(3)} oz</dd></div>
        <div><dt>Pure silver</dt><dd className="mono">{oz('XAG').toFixed(3)} oz</dd></div>
        <div><dt>Melt value</dt><dd className="mono">{dollars(total)}</dd></div>
        <div><dt>Offer ({pct}%)</dt><dd className="mono">{dollars(total * (pct / 100))}</dd></div>
      </div>
    </section>
  );
}
