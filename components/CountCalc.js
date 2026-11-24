'use client';
import { useState } from 'react';
import { useSpot } from '../lib/useSpot';
import { meltValue } from '../lib/melt';
import { dollars, money, years } from '../lib/format';

const count = (v) => Math.max(0, Math.floor(Number(v) || 0));

// Melt by coin count. groups: [{ title, rows: [{ key, name, label, year_start, year_end, content, href }] }]
export default function CountCalc({ title, groups, initial }) {
  const s = useSpot(initial);
  const all = groups.flatMap((g) => g.rows);
  const empty = () => Object.fromEntries(all.map((r) => [r.key, '']));
  const [qty, setQty] = useState(empty);
  const [pct, setPct] = useState(100);

  let melt = 0; let gold = 0; let silver = 0; let coins = 0;
  for (const r of all) {
    const n = count(qty[r.key]);
    if (!n) continue;
    coins += n;
    melt += (meltValue(r.content, s.prices) || 0) * n;
    gold += (r.content.XAU || 0) * n;
    silver += (r.content.XAG || 0) * n;
  }

  return (
    <section className="panel calc">
      <div className="calc-head">
        <h2>{title} {s.live ? <span className="live-tag"><span className="live-dot" aria-hidden="true" />live</span> : null}</h2>
        <button className="chip chip-clear" onClick={() => setQty(empty())}>Clear</button>
      </div>
      {groups.map((g) => (
        <div key={g.title} className="set-group">
          <h3 className="set-group-title">{g.title}</h3>
          {g.rows.map((r) => {
            const each = meltValue(r.content, s.prices);
            const n = count(qty[r.key]);
            return (
              <label key={r.key} className="junk-line set-line">
                <span className="junk-name">
                  <span className="pname">{r.name} <span className="mono set-years">{years(r)}</span></span>
                  <span className="code">{r.label}{r.contentLabel ? ` · ${r.contentLabel}` : ''}</span>
                </span>
                <span className="junk-input">
                  <span className="muted">Coins</span>
                  <input type="number" inputMode="numeric" min="0" step="1" placeholder="0" value={qty[r.key]}
                    onChange={(e) => setQty({ ...qty, [r.key]: e.target.value })} />
                  <span className="step-hint muted xsmall">{money(each)} each</span>
                </span>
                <span className="junk-out mono">
                  <span>{n ? `× ${n}` : ''}</span>
                  <span className="muted">{n && each != null ? dollars(each * n) : '—'}</span>
                </span>
              </label>
            );
          })}
        </div>
      ))}
      <div className="junk-opts">
        <label className="slider">
          <span>Dealer pays <strong className="mono pct">{pct}%</strong> of melt</span>
          <input type="range" min="50" max="100" step="1" value={pct} onChange={(e) => setPct(Number(e.target.value))} />
        </label>
      </div>
      <div className="junk-total">
        <div><dt>Coins</dt><dd className="mono">{coins}</dd></div>
        <div><dt>Pure gold</dt><dd className="mono">{gold.toFixed(4)} oz</dd></div>
        <div><dt>Pure silver</dt><dd className="mono">{silver.toFixed(3)} oz</dd></div>
        <div><dt>Melt value</dt><dd className="mono">{dollars(melt)}</dd></div>
        <div><dt>Dealer offer ({pct}%)</dt><dd className="mono">{dollars(melt * (pct / 100))}</dd></div>
      </div>
    </section>
  );
}
