'use client';
import { useState } from 'react';
import { useSpot } from '../lib/useSpot';
import { dollars, times } from '../lib/format';

const WORN_90 = 0.715;   // oz per $1 face dealers use for circulated 90% (vs 0.7234 when new)

const PRESETS = [
  ['$5 dime roll', 'dime', 50],
  ['$10 quarter roll', 'quarter', 40],
  ['$10 half roll', 'half', 20],
  ['$10 40% half roll', 'half40', 20],
  ['$2 war nickel roll', 'war', 40],
  ['$250 dime box', 'dime', 2500],
  ['$500 half box', 'half', 1000],
];

// Round face value to the smallest coin in that group (e.g. $0.05 for war nickels), in whole cents.
function snap(value, step) {
  const cents = Math.max(0, Math.round((Number(value) || 0) * 100));
  const s = Math.round(step * 100);
  return (Math.max(cents ? 1 : 0, Math.round(cents / s)) * s) / 100;   // any amount counts as at least one coin
}
const count = (v) => Math.max(0, Math.floor(Number(v) || 0));
const num = (v) => Math.max(0, Number(v) || 0);

// kinds: face-value groups. coins: individual coins for count mode, each with a `group` from kinds.
export default function JunkCalc({ kinds, coins, initial }) {
  const s = useSpot(initial);
  const [mode, setMode] = useState('face');
  const [face, setFace] = useState(Object.fromEntries(kinds.map((k) => [k.key, ''])));
  const [counts, setCounts] = useState(Object.fromEntries(coins.map((c) => [c.key, ''])));
  const [worn, setWorn] = useState(false);
  const [pct, setPct] = useState(100);
  const [price, setPrice] = useState('');
  const [budget, setBudget] = useState('');
  const [mult, setMult] = useState('');
  const silver = s.prices.XAG;
  const kind = Object.fromEntries(kinds.map((k) => [k.key, k]));
  const perDollar = (group) => (group === '90' && worn ? WORN_90 : kind[group].ozPerDollar);

  const rows = mode === 'face'
    ? kinds.map((k) => ({ ...k, f: snap(face[k.key], k.step), group: k.key }))
    : coins.map((c) => ({ ...c, n: count(counts[c.key]), f: count(counts[c.key]) * c.face }));
  const lines = rows.map((r) => {
    const oz = r.f * perDollar(r.group);
    return { ...r, oz, melt: silver != null ? oz * silver : null };
  });
  const totalFace = lines.reduce((n, l) => n + l.f, 0);
  const totalOz = lines.reduce((n, l) => n + l.oz, 0);
  const totalMelt = silver != null ? totalOz * silver : null;
  const offer = totalMelt != null ? totalMelt * (pct / 100) : null;

  function addPreset(coinKey, n) {
    const c = coins.find((x) => x.key === coinKey);
    if (mode === 'count') {
      setCounts({ ...counts, [coinKey]: String(count(counts[coinKey]) + n) });
    } else {
      const k = kind[c.group];
      setFace({ ...face, [c.group]: (snap(face[c.group], k.step) + n * c.face).toFixed(2) });
    }
  }
  function clear() {
    setFace(Object.fromEntries(kinds.map((k) => [k.key, ''])));
    setCounts(Object.fromEntries(coins.map((c) => [c.key, ''])));
  }

  // Deal analyzer
  const paid = num(price);
  const meltMult90 = silver != null ? silver * perDollar('90') : null;   // 90% melt as a multiple of face
  const m = num(mult) || meltMult90;
  const buyFace = m ? Math.floor((num(budget) / m) * 20) / 20 : 0;       // whole nickels of face
  const buyOz = buyFace * perDollar('90');

  return (
    <>
      <section className="panel calc">
        <div className="calc-head">
          <h2>Your Junk Silver {s.live ? <span className="live-tag"><span className="live-dot" aria-hidden="true" />live</span> : null}</h2>
          <div className="seg" role="group" aria-label="Enter by">
            <button className={mode === 'face' ? 'on' : ''} aria-pressed={mode === 'face'} onClick={() => setMode('face')}>Face value</button>
            <button className={mode === 'count' ? 'on' : ''} aria-pressed={mode === 'count'} onClick={() => setMode('count')}>Coin count</button>
          </div>
        </div>

        <div className="presets">
          <span className="muted small">Add:</span>
          {PRESETS.map(([label, key, n]) => (
            <button key={label} className="chip" onClick={() => addPreset(key, n)}>{label}</button>
          ))}
          <button className="chip chip-clear" onClick={clear}>Clear</button>
        </div>

        <div className="junk-grid">
          {lines.map((l) => (
            <label key={l.key} className="junk-line">
              <span className="junk-name">
                <span className="pname">{l.title}</span>
                <span className="code">{l.sub}</span>
              </span>
              {mode === 'face' ? (
                <span className="junk-input">
                  <span className="muted">Face $</span>
                  <input type="number" inputMode="decimal" min="0" step={l.step} placeholder="0.00" value={face[l.key]}
                    aria-describedby={`step-${l.key}`}
                    onChange={(e) => setFace({ ...face, [l.key]: e.target.value })}
                    onBlur={() => face[l.key] !== '' && setFace({ ...face, [l.key]: l.f ? l.f.toFixed(2) : '' })} />
                  <span id={`step-${l.key}`} className="step-hint muted xsmall">{dollars(l.step)} steps</span>
                </span>
              ) : (
                <span className="junk-input">
                  <span className="muted">Coins</span>
                  <input type="number" inputMode="numeric" min="0" step="1" placeholder="0" value={counts[l.key]}
                    onChange={(e) => setCounts({ ...counts, [l.key]: e.target.value })}
                    onBlur={() => counts[l.key] !== '' && setCounts({ ...counts, [l.key]: l.n ? String(l.n) : '' })} />
                  <span className="step-hint muted xsmall">{dollars(l.f)} face</span>
                </span>
              )}
              <span className="junk-out mono">
                <span>{l.oz.toFixed(3)} oz</span>
                <span className="muted">{l.melt == null ? '—' : dollars(l.melt)}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="junk-opts">
          <label className="check">
            <input type="checkbox" checked={worn} onChange={(e) => setWorn(e.target.checked)} />
            <span>Circulated 90%: use {WORN_90} oz per $1 face (dealer standard for worn coins)</span>
          </label>
          <label className="slider">
            <span>Dealer pays <strong className="mono pct">{pct}%</strong> of melt</span>
            <input type="range" min="70" max="100" step="1" value={pct} onChange={(e) => setPct(Number(e.target.value))} />
          </label>
        </div>

        <div className="junk-total">
          <div><dt>Face value</dt><dd className="mono">{dollars(totalFace)}</dd></div>
          <div><dt>Pure silver</dt><dd className="mono">{totalOz.toFixed(3)} oz</dd></div>
          <div><dt>Melt value</dt><dd className="mono">{dollars(totalMelt)}</dd></div>
          <div><dt>Multiple of face</dt><dd className="mono">{totalFace && totalMelt != null ? times(totalMelt / totalFace) : '—'}</dd></div>
          <div><dt>Dealer offer ({pct}%)</dt><dd className="mono">{dollars(offer)}</dd></div>
        </div>
      </section>

      <section className="panel calc">
        <div className="calc-head"><h2>Deal Analyzer</h2></div>
        <div className="deal-grid">
          <div className="deal">
            <h3>Is this a good price?</h3>
            <p className="muted small">Uses the coins entered above.</p>
            <label className="junk-input">
              <span className="muted">Asking price $</span>
              <input type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            {paid > 0 && totalFace > 0 && totalMelt != null ? (
              <dl className="deal-out">
                <div><dt>Multiple of face</dt><dd className="mono">{times(paid / totalFace)}</dd></div>
                <div><dt>Percent of melt</dt><dd className={`mono ${paid <= totalMelt ? 'up' : 'down'}`}>{((paid / totalMelt) * 100).toFixed(1)}%</dd></div>
                <div><dt>Per oz of silver</dt><dd className="mono">{dollars(paid / totalOz)}</dd></div>
                <div><dt>{paid <= totalMelt ? 'Under melt by' : 'Over melt by'}</dt><dd className="mono">{dollars(Math.abs(totalMelt - paid))}</dd></div>
              </dl>
            ) : <p className="muted small deal-empty">Enter coins above and an asking price.</p>}
          </div>
          <div className="deal">
            <h3>What does my budget buy?</h3>
            <p className="muted small">90% silver at a quoted multiple of face.</p>
            <label className="junk-input">
              <span className="muted">Budget $</span>
              <input type="number" inputMode="decimal" min="0" step="1" placeholder="0" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </label>
            <label className="junk-input">
              <span className="muted">At</span>
              <input type="number" inputMode="decimal" min="0" step="0.1" placeholder={meltMult90 ? meltMult90.toFixed(1) : ''} value={mult} onChange={(e) => setMult(e.target.value)} />
              <span className="muted">× face</span>
            </label>
            {num(budget) > 0 && m ? (
              <dl className="deal-out">
                <div><dt>Face value</dt><dd className="mono">{dollars(buyFace)}</dd></div>
                <div><dt>Pure silver</dt><dd className="mono">{buyOz.toFixed(3)} oz</dd></div>
                <div><dt>Percent of melt</dt><dd className="mono">{meltMult90 ? `${((m / meltMult90) * 100).toFixed(1)}%` : '—'}</dd></div>
              </dl>
            ) : <p className="muted small deal-empty">Leave the multiple blank to use melt ({meltMult90 ? times(meltMult90) : '—'}).</p>}
          </div>
        </div>
      </section>
    </>
  );
}
