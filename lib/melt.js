// Shared by server and browser. `content` = units of each metal in one coin
// (troy oz for gold/silver/platinum/palladium, lb for base metals), precomputed at build time.

export const PRECIOUS = ['XAU', 'XAG', 'XPT', 'XPD'];
export const METAL_NAME = {
  XAU: 'gold', XAG: 'silver', XPT: 'platinum', XPD: 'palladium',
  HG: 'copper', NI: 'nickel', ZN: 'zinc', MN: 'manganese',
};

export function meltValue(content, prices) {
  const codes = Object.keys(content || {});
  if (!codes.length) return null;
  let total = 0;
  for (const c of codes) {
    if (prices[c] == null) continue;   // missing a base-metal price: value the rest
    total += content[c] * prices[c];
  }
  return total;
}

// Label for what makes the coin worth melting: "0.7234 oz silver", or the composition for base metals.
export function contentLabel(v) {
  const p = PRECIOUS.filter((c) => v.content[c] >= 0.0001 && v.metals[c] >= 0.1);
  if (!p.length) return v.composition;
  return p.map((c) => `${v.content[c].toFixed(v.content[c] >= 0.1 ? 4 : 5)} oz ${METAL_NAME[c]}`).join(' + ');
}
