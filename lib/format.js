const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const nf = new Intl.NumberFormat('en-US');
const TZ = 'America/Chicago';

export const num = (n) => (n == null ? '—' : nf.format(n));
export const price = (cents) => (cents == null ? '—' : usd.format(cents / 100));

// Melt values in dollars: fractions of a cent matter for base-metal coins.
export function money(v) {
  if (v == null || Number.isNaN(v)) return '—';
  if (Math.abs(v) < 1) return `$${v.toFixed(4)}`;
  return usd.format(v);
}
export const dollars = (v) => (v == null ? '—' : usd.format(v));
export const dollars0 = (v) => (v == null ? '—' : usd0.format(v));

export function times(v) {
  if (v == null || !Number.isFinite(v)) return '—';
  return `${v >= 10 ? v.toFixed(1) : v.toFixed(2)}×`;
}

// Troy ounces: whole-ounce bullion within 0.3% shows as 1.00 / 2.00; otherwise 4 decimals (5 under 0.1)
// with trailing zeros dropped, keeping at least 2 (0.1808, 0.04205, 1.2057, 0.715 → 0.715).
export function oz(v) {
  const whole = Math.round(v);
  if (whole >= 1 && Math.abs(v - whole) / whole <= 0.003) return whole.toFixed(2);
  const s = v.toFixed(v >= 0.1 ? 4 : 5).replace(/0+$/, '');
  const dp = (s.split('.')[1] || '').length;
  return dp < 2 ? v.toFixed(2) : s;
}

export function years(v) {
  if (v.year_end == null) return `${v.year_start}–present`;
  return v.year_start === v.year_end ? String(v.year_start) : `${v.year_start}–${v.year_end}`;
}

export function shortDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric', year: 'numeric' });
}
export function monthDay(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric' });
}
export function dateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    timeZone: TZ, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export function relative(iso, now = Date.now()) {
  if (!iso) return '';
  const m = Math.max(0, Math.round((now - Date.parse(iso)) / 60000));
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}
