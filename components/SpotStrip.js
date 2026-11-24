'use client';
import { useSpot } from '../lib/useSpot';
import { dollars } from '../lib/format';
import TimeAgo from './TimeAgo';

const LABELS = [['XAU', 'Gold', '/oz'], ['XAG', 'Silver', '/oz'], ['XPT', 'Platinum', '/oz'], ['XPD', 'Palladium', '/oz'], ['HG', 'Copper', '/lb']];

export default function SpotStrip({ initial }) {
  const s = useSpot(initial);
  return (
    <div className="spot-strip bar" aria-label="Metal spot prices">
      {LABELS.map(([k, label, unit]) => s.prices[k] != null && (
        <span key={k} className="spot-item">
          <span className="muted">{label}</span> <span className="mono">{dollars(s.prices[k])}</span>
          <span className="muted xsmall">{unit}</span>
        </span>
      ))}
      <span className="spot-meta muted xsmall">
        {s.live ? <><span className="live-dot" aria-hidden="true" />Live spot · </> : 'Spot as of '}<TimeAgo iso={s.t} />
      </span>
    </div>
  );
}
