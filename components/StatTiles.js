'use client';
import { useSpot } from '../lib/useSpot';
import { meltValue } from '../lib/melt';
import { money, times } from '../lib/format';

export default function StatTiles({ tiles, initial }) {
  const s = useSpot(initial);
  return (
    <div className="stats">
      {tiles.map((t) => {
        const melt = meltValue(t.content, s.prices) * (t.mult || 1);
        return (
          <a key={t.label} href={t.href} className="stat stat-link">
            <div className="stat-label">{t.label}</div>
            <div className="stat-num">{money(melt)}</div>
            <div className="muted xsmall">{times(melt / t.face)} face value</div>
          </a>
        );
      })}
    </div>
  );
}
