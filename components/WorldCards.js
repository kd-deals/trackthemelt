'use client';
import { useSpot } from '../lib/useSpot';
import { meltValue } from '../lib/melt';
import { money, years } from '../lib/format';

export default function WorldCards({ cards, initial }) {
  const s = useSpot(initial);
  return (
    <div className="world-cards">
      {cards.map((c) => (
        <div key={c.key} className="panel world-card">
          <a href={c.href} className="world-card-title">{c.title}</a>
          <ul>
            {c.rows.map((r) => {
              const melt = meltValue(r.content, s.prices);
              return (
                <li key={r.slug}>
                  <a href={r.href}>
                    <span className="wc-name">{r.name}<span className="code"> {r.label} · {years(r)}</span></span>
                    <span className="mono">{money(melt)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <a href={c.href} className="change-all">See all {c.count} coins →</a>
        </div>
      ))}
    </div>
  );
}
