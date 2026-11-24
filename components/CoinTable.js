'use client';
import { useSpot } from '../lib/useSpot';
import { meltValue, contentLabel } from '../lib/melt';
import { money, times, years } from '../lib/format';

export default function CoinTable({ id, title, blurb, rows, initial }) {
  const s = useSpot(initial);
  return (
    <section id={id} className="panel group">
      <div className="group-head">
        <h2>{title}</h2>
        <span className="muted">{blurb}</span>
      </div>
      <div className="mt-head">
        <span>Coin</span><span>Years</span><span>Metal content</span><span className="r">Melt value</span><span className="r">× face</span>
      </div>
      {rows.map((r) => {
        const melt = meltValue(r.content, s.prices);
        return (
          <a key={r.slug} href={`/coins/${r.series}/`} className="mt-row">
            <span className="mt-name">
              <span className="pname">{r.seriesName}</span>
              <span className="code">{r.label}</span>
            </span>
            <span className="mt-years mono" data-label="Years">{years(r)}</span>
            <span className="mt-content" data-label="Contains">{contentLabel(r)}</span>
            <span className="mt-melt mono r">{melt == null ? '—' : money(melt)}</span>
            <span className="mt-x mono r muted">{melt == null || r.currency !== 'USD' || !r.face ? '—' : times(melt / r.face)}</span>
          </a>
        );
      })}
    </section>
  );
}
