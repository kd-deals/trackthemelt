'use client';
import { useState } from 'react';
import { useSpot } from '../lib/useSpot';
import { dollars } from '../lib/format';
import { SET_GROUPS, ALL_SETS } from '../lib/sets';

const count = (v) => Math.max(0, Math.floor(Number(v) || 0));

export default function SetCalc({ initial }) {
  const s = useSpot(initial);
  const [qty, setQty] = useState(Object.fromEntries(ALL_SETS.map((x) => [x.key, ''])));
  const [pct, setPct] = useState(100);
  const silver = s.prices.XAG;

  const totalSets = ALL_SETS.reduce((n, x) => n + count(qty[x.key]), 0);
  const totalOz = ALL_SETS.reduce((n, x) => n + count(qty[x.key]) * x.oz, 0);
  const totalMelt = silver != null ? totalOz * silver : null;

  return (
    <section className="panel calc">
      <div className="calc-head">
        <h2>Your Sets {s.live ? <span className="live-tag"><span className="live-dot" aria-hidden="true" />live</span> : null}</h2>
        <button className="chip chip-clear" onClick={() => setQty(Object.fromEntries(ALL_SETS.map((x) => [x.key, ''])))}>Clear</button>
      </div>
      {SET_GROUPS.map((g) => (
        <div key={g.title} className="set-group">
          <h3 className="set-group-title">{g.title}</h3>
          {g.sets.map((x) => {
            const n = count(qty[x.key]);
            const melt = silver != null ? x.oz * silver : null;
            return (
              <label key={x.key} className="junk-line set-line">
                <span className="junk-name">
                  <span className="pname">{x.title} <span className="mono set-years">{x.years}</span></span>
                  <span className="code">{x.contents}</span>
                  {x.note && <span className="code muted">{x.note}</span>}
                </span>
                <span className="junk-input">
                  <span className="muted">Sets</span>
                  <input type="number" inputMode="numeric" min="0" step="1" placeholder="0" value={qty[x.key]}
                    onChange={(e) => setQty({ ...qty, [x.key]: e.target.value })} />
                  <span className="step-hint muted xsmall">{dollars(melt)} each</span>
                </span>
                <span className="junk-out mono">
                  <span>{(x.oz * (n || 1)).toFixed(4)} oz{n ? '' : ' each'}</span>
                  <span className="muted">{n && melt != null ? dollars(melt * n) : '—'}</span>
                </span>
              </label>
            );
          })}
        </div>
      ))}
      <p className="muted small set-clad">Standard clad proof and mint sets (1971–1991 and every non-silver set since) contain no silver; their value is collector premium only.</p>
      <div className="junk-opts">
        <label className="slider">
          <span>Dealer pays <strong className="mono pct">{pct}%</strong> of melt</span>
          <input type="range" min="50" max="100" step="1" value={pct} onChange={(e) => setPct(Number(e.target.value))} />
        </label>
      </div>
      <div className="junk-total">
        <div><dt>Sets</dt><dd className="mono">{totalSets}</dd></div>
        <div><dt>Pure silver</dt><dd className="mono">{totalOz.toFixed(3)} oz</dd></div>
        <div><dt>Melt value</dt><dd className="mono">{dollars(totalMelt)}</dd></div>
        <div><dt>Dealer offer ({pct}%)</dt><dd className="mono">{dollars(totalMelt == null ? null : totalMelt * (pct / 100))}</dd></div>
      </div>
    </section>
  );
}
