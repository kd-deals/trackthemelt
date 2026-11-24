'use client';
import { useSpot } from '../lib/useSpot';
import { dollars } from '../lib/format';
import TimeAgo from './TimeAgo';

const LABELS = [['XAU', 'Gold', '/oz'], ['XAG', 'Silver', '/oz'], ['XPT', 'Platinum', '/oz'], ['XPD', 'Palladium', '/oz'], ['HG', 'Copper', '/lb']];

// Change vs the last completed UTC daily close. Before live prices load, shows the last day's move instead.
function Change({ now, base }) {
  if (now == null || !base) return null;
  const diff = now - base;
  const pct = (diff / base) * 100;
  const flat = Math.abs(pct) < 0.005;
  const dir = flat ? 'flat' : diff > 0 ? 'up' : 'down';
  const sign = flat ? '' : diff > 0 ? '+' : '−';
  const amt = Math.abs(diff);
  return (
    <span className={`spot-chg ${dir}`} title={`${sign}$${amt.toFixed(amt < 10 ? 4 : 2)} since prior close`}>
      <span aria-hidden="true">{flat ? '–' : diff > 0 ? '▲' : '▼'}</span>
      {flat ? '0.00%' : `${Math.abs(pct).toFixed(2)}%`}
      <span className="sr-only">{flat ? ' unchanged' : diff > 0 ? ' up' : ' down'}</span>
    </span>
  );
}

export default function SpotStrip({ initial, closes = {} }) {
  const s = useSpot(initial);
  return (
    <div className="spot-strip bar" aria-label="Metal spot prices">
      {LABELS.map(([k, label, unit]) => s.prices[k] != null && (
        <span key={k} className="spot-item">
          <span className="muted">{label}</span> <span className="mono">{dollars(s.prices[k])}</span>
          <span className="muted xsmall">{unit}</span>
          <Change now={s.prices[k]} base={s.live ? closes[k]?.[1] : closes[k]?.[0]} />
        </span>
      ))}
      <span className="spot-meta muted xsmall">
        {s.live ? <><span className="live-dot" aria-hidden="true" />Live spot · </> : 'Spot as of '}<TimeAgo iso={s.t} />
      </span>
    </div>
  );
}
