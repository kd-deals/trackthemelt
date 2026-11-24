'use client';
import { useMemo, useState } from 'react';
import { money } from '../lib/format';

const W = 800;
const H = 240;
const TOP = 10;
const BOTTOM = 230;
const RANGES = [['30', '30 days', 30], ['365', '1 year', 365], ['1825', '5 years', 1825], ['all', 'All', null]];

// Daily melt value of one coin: each metal's daily close (carried forward over gaps),
// metals without history (nickel, zinc, manganese) held at their current price.
function buildSeries(content, history, prices) {
  const codes = Object.keys(content);
  const withHist = codes.filter((c) => history[c]?.length);
  if (!withHist.length) return [];
  const days = [...new Set(withHist.flatMap((c) => history[c].map((p) => p[0])))].sort();
  const idx = Object.fromEntries(withHist.map((c) => [c, 0]));
  const last = {};
  const out = [];
  for (const d of days) {
    for (const c of withHist) {
      const h = history[c];
      while (idx[c] < h.length && h[idx[c]][0] <= d) last[c] = h[idx[c]++][1];
    }
    if (withHist.some((c) => last[c] == null)) continue;   // wait until every tracked metal has a price
    let v = 0;
    for (const c of codes) v += content[c] * (last[c] ?? prices[c] ?? 0);
    out.push({ d, v });
  }
  return out;
}

const label = (d, opts) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', ...opts });

export default function MeltChart({ variants, history, prices }) {
  const charted = variants.filter((v) => Object.keys(v.content).some((c) => history[c]?.length));
  const [sel, setSel] = useState(charted[0]?.slug);
  const [range, setRange] = useState('365');
  const [hover, setHover] = useState(null);
  const v = charted.find((x) => x.slug === sel) || charted[0];

  const all = useMemo(() => (v ? buildSeries(v.content, history, prices) : []), [v, history, prices]);
  const days = RANGES.find((r) => r[0] === range)[2];
  const pts = days ? all.slice(-days) : all;

  if (!charted.length) return null;

  const vals = pts.map((p) => p.v);
  const hi = Math.max(...vals);
  const lo = Math.min(...vals);
  const pad = Math.max((hi - lo) * 0.1, hi * 0.005, 0.0001);
  const ymin = Math.max(0, lo - pad);
  const ymax = hi + pad;
  const x = (i) => (pts.length < 2 ? 0 : (i / (pts.length - 1)) * W);
  const y = (val) => BOTTOM - ((val - ymin) / (ymax - ymin)) * (BOTTOM - TOP);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const first = pts[0];
  const end = pts.at(-1);
  const change = first && end && first.v ? (end.v - first.v) / first.v : null;
  const shown = hover != null ? pts[hover] : end;
  const long = pts.length > 120;
  const ticks = pts.length >= 2 ? [0, 0.25, 0.5, 0.75, 1].map((f) => label(pts[Math.round(f * (pts.length - 1))].d, long ? { month: 'short', year: '2-digit' } : { month: 'short', day: 'numeric' })) : [];

  function onMove(e) {
    if (pts.length < 2) return;
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (pts.length - 1));
    setHover(Math.min(pts.length - 1, Math.max(0, i)));
  }

  return (
    <section className="panel chart-panel">
      <div className="chart-head">
        <h2>Melt value history</h2>
        <div className="chart-controls">
          {charted.length > 1 && (
            <select value={v.slug} onChange={(e) => setSel(e.target.value)} aria-label="Coin type">
              {charted.map((c) => <option key={c.slug} value={c.slug}>{c.type} ({c.year_end === c.year_start ? c.year_start : `${c.year_start}–${c.year_end ?? 'present'}`})</option>)}
            </select>
          )}
          <div className="seg">
            {RANGES.map(([k, text]) => (
              <button key={k} className={range === k ? 'on' : ''} aria-pressed={range === k} onClick={() => setRange(k)}>{text}</button>
            ))}
          </div>
        </div>
      </div>

      {pts.length < 2 ? (
        <p className="chart-empty">Not enough price history yet. The chart fills in as daily spot prices are recorded.</p>
      ) : (
        <>
          <div className="chart-readout">
            <span className="mono big">{money(shown.v)}</span>
            <span className="muted small">{label(shown.d, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {hover == null && change != null && (
              <span className={`mono small ${change >= 0 ? 'up' : 'down'}`}>{change >= 0 ? '+' : '−'}{Math.abs(change * 100).toFixed(1)}%</span>
            )}
          </div>
          <div className="chart-body">
            <div className="y-labels mono" style={{ height: H }}>
              <span>{money(ymax)}</span><span>{money((ymax + ymin) / 2)}</span><span>{money(ymin)}</span>
            </div>
            <div className="chart-plot">
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H}
                onMouseMove={onMove} onMouseLeave={() => setHover(null)}
                role="img" aria-label={`Melt value of one ${v.type} coin over time, now ${money(end.v)}`}>
                {[TOP, (TOP + BOTTOM) / 2].map((yy) => (
                  <line key={yy} x1="0" x2={W} y1={yy} y2={yy} className="gridline" vectorEffect="non-scaling-stroke" />
                ))}
                <line x1="0" x2={W} y1={BOTTOM} y2={BOTTOM} className="baseline" vectorEffect="non-scaling-stroke" />
                <path d={d} className="melt-line" vectorEffect="non-scaling-stroke" />
                {hover != null && (
                  <line x1={x(hover)} x2={x(hover)} y1={TOP} y2={BOTTOM} className="hover-line" vectorEffect="non-scaling-stroke" />
                )}
              </svg>
              <div className="x-labels">{ticks.map((t, i) => <span key={i}>{t}</span>)}</div>
            </div>
          </div>
          <p className="chart-note">Melt value of one coin at each day's closing spot price (UTC).</p>
        </>
      )}
    </section>
  );
}
