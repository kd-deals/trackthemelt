'use client';
import { useState } from 'react';
import { useSpot } from '../lib/useSpot';
import { dollars, times } from '../lib/format';

const WORN_90 = 0.715;   // oz per $1 face dealers use for circulated 90% (vs 0.7234 when new)

export default function JunkCalc({ kinds, initial }) {
  const s = useSpot(initial);
  const [face, setFace] = useState(Object.fromEntries(kinds.map((k) => [k.key, ''])));
  const [worn, setWorn] = useState(false);
  const [pct, setPct] = useState(100);
  const silver = s.prices.XAG;

  const lines = kinds.map((k) => {
    const f = Math.max(0, Number(face[k.key]) || 0);
    const perDollar = k.key === '90' && worn ? WORN_90 : k.ozPerDollar;
    const oz = f * perDollar;
    return { ...k, f, perDollar, oz, melt: silver != null ? oz * silver : null };
  });
  const totalFace = lines.reduce((n, l) => n + l.f, 0);
  const totalOz = lines.reduce((n, l) => n + l.oz, 0);
  const totalMelt = silver != null ? totalOz * silver : null;
  const offer = totalMelt != null ? totalMelt * (pct / 100) : null;

  return (
    <section className="panel calc">
      <div className="calc-head">
        <h2>Your junk silver {s.live ? <span className="live-tag"><span className="live-dot" aria-hidden="true" />live</span> : null}</h2>
        <span className="muted small">Silver {dollars(silver)}/oz</span>
      </div>
      <div className="junk-grid">
        {lines.map((l) => (
          <label key={l.key} className="junk-line">
            <span className="junk-name">
              <span className="pname">{l.title}</span>
              <span className="code">{l.sub}</span>
            </span>
            <span className="junk-input">
              <span className="muted">Face $</span>
              <input type="number" inputMode="decimal" min="0" step="0.05" placeholder="0.00" value={face[l.key]}
                onChange={(e) => setFace({ ...face, [l.key]: e.target.value })} />
            </span>
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
  );
}
