'use client';
import { useState } from 'react';
import { useSpot } from '../lib/useSpot';
import { meltValue, contentLabel } from '../lib/melt';
import { money, dollars, times, years } from '../lib/format';

export default function SeriesCalc({ name, variants, initial }) {
  const s = useSpot(initial);
  const [qty, setQty] = useState('1');
  const n = Math.max(0, Math.floor(Number(qty) || 0));
  return (
    <section className="panel calc">
      <div className="calc-head">
        <h2>{name} Melt Value {s.live ? <span className="live-tag"><span className="live-dot" aria-hidden="true" />live</span> : null}</h2>
        <label className="qty">
          <span>Number of coins</span>
          <input type="number" inputMode="numeric" min="0" step="1" value={qty} onChange={(e) => setQty(e.target.value)} />
        </label>
      </div>
      <div className="vcards">
        {variants.map((v) => {
          const melt = meltValue(v.content, s.prices);
          return (
            <div key={v.slug} className="vcard">
              <div className="vcard-top">
                <span className="vcard-label">{v.type}</span>
                <span className="mono muted small">{years(v)}</span>
              </div>
              <div className="vcard-melt mono">{melt == null ? '—' : money(melt)}</div>
              <div className="muted small">{melt == null ? 'No tracked metal value' : <>per coin · {times(melt / v.face)} face value</>}</div>
              {melt != null && n !== 1 && (
                <div className="vcard-total">
                  <span className="muted">{n.toLocaleString('en-US')} coins</span>
                  <span className="mono">{dollars(melt * n)}</span>
                </div>
              )}
              <div className="vcard-content small">{contentLabel(v)}</div>
              {v.notes && !/No tracked/.test(v.notes) && <div className="vcard-note xsmall muted">{v.notes}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
