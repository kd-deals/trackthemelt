import { getData, GROUPS } from '../../lib/data';
import { contentLabel } from '../../lib/melt';
import { years } from '../../lib/format';
import { SITE_URL, SITE_NAME, TTM_URL } from '../../lib/site';

export const dynamic = 'force-static';

// llms.txt: a plain-text map of the site for AI assistants (https://llmstxt.org).
export function GET() {
  const { series } = getData();
  const lines = [
    `# ${SITE_NAME}`,
    '',
    '> Live melt value of US coins: what the gold, silver, copper and nickel in a coin is worth at current spot prices. Covers pre-1965 90% silver, 40% silver, wartime nickels, Lincoln cents, nickels, clad coins, pre-1933 gold and American Eagle/Buffalo bullion.',
    '',
    'Melt value = coin weight × metal fineness × spot price, from official US Mint specifications. Gold, silver, platinum, palladium and copper use live spot prices; nickel and zinc are updated periodically. Melt value is the metal floor, not a dealer offer; collectible dates can be worth more.',
    '',
    '## Tools',
    `- [Junk silver calculator](${SITE_URL}/junk-silver-calculator/): melt value of 90% silver, Morgan/Peace dollars, 40% silver and war nickels by face value or coin count, roll presets, and a deal analyzer (multiple of face, percent of melt)`,
    `- [Scrap gold & silver calculator](${SITE_URL}/scrap-gold-silver-calculator/): scrap value of 10K–24K gold, sterling and coin silver, and platinum by weight (grams, pennyweight, troy oz), with per-gram prices`,
    `- [All coin melt values](${SITE_URL}/): every coin type on one page`,
    '',
  ];
  for (const g of GROUPS) {
    const rows = series.flatMap((s) => s.variants.filter((v) => v.group === g.key).map((v) => ({ s, v })));
    if (!rows.length) continue;
    lines.push(`## ${g.title}`);
    const seen = new Set();
    for (const { s } of rows) {
      if (seen.has(s.slug)) continue;
      seen.add(s.slug);
      const detail = s.variants.map((v) => `${v.type} ${years(v)}: ${contentLabel(v)}`).join('; ');
      lines.push(`- [${s.name} melt value](${SITE_URL}/coins/${s.slug}/): ${detail}`);
    }
    lines.push('');
  }
  lines.push('## Related', `- [TrackTheMint](${TTM_URL}/): US Mint product stock, sales and new releases`, '');
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
