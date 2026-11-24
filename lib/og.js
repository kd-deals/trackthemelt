import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

const Logo = () => (
  <svg width="72" height="72" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="21" fill="none" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="5" />
    <circle cx="32" cy="32" r="21" fill="none" stroke="#B87333" strokeWidth="5" strokeLinecap="round" strokeDasharray="99 132" transform="rotate(-90 32 32)" />
    <path d="M32 20c4.6 6 7.5 10.3 7.5 13.7a7.5 7.5 0 0 1-15 0C24.5 30.3 27.4 26 32 20z" fill="#FFFFFF" />
  </svg>
);

// Branded 1200x630 card: title, optional subtitle lines, site name.
export function ogImage({ title, lines = [], kicker = 'Melt Value' }) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: '#0F1B2D', color: '#fff', padding: '64px 72px', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Logo />
          <div style={{ fontSize: 36, fontWeight: 700 }}>Track The Melt</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, color: '#D9A066', fontWeight: 600, marginBottom: 12 }}>{kicker}</div>
          <div style={{ fontSize: title.length > 34 ? 60 : 76, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
          {lines.map((l) => (
            <div key={l} style={{ fontSize: 32, color: '#C9D2DE', marginTop: 14 }}>{l}</div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#8FA0B5',
          borderTop: '2px solid #33445C', paddingTop: 22 }}>
          <span>Live spot prices · US & world coins</span>
          <span>trackthemelt.com</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
