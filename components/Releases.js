import { getData } from '../lib/data';
import { price, shortDate } from '../lib/format';
import { TTM_URL } from '../lib/site';

const CLS = { Available: 'b-avail', Backorder: 'b-back', 'Sold out': 'b-sold', Upcoming: 'b-up', Unavailable: 'b-unav' };

export default function Releases() {
  const { releases } = getData();
  if (!releases.length) return null;
  return (
    <aside className="panel changes">
      <div className="changes-head">
        <h2>Latest US Mint Releases</h2>
        <p className="muted small">Stock and sales from TrackTheMint</p>
      </div>
      {releases.map((r) => (
        <a key={r.sku} href={r.url} className="rel">
          {r.image && <img src={r.image} alt="" width="48" height="48" loading="lazy" className="rel-img" />}
          <span className="rel-text">
            <span className="change-name">{r.name}</span>
            <span className="rel-meta">
              <span className={`badge sm ${CLS[r.status] || 'b-unav'}`}>{r.status}</span>
              <span className="muted xsmall">{shortDate(r.release_date)} · {price(r.price_cents)}</span>
            </span>
          </span>
        </a>
      ))}
      <a href={TTM_URL} className="change-all">All Mint products on TrackTheMint →</a>
    </aside>
  );
}
