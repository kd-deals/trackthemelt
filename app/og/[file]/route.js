// Link-preview images as real .png files (/og/home.png, /og/<series>.png) so every
// crawler gets a proper extension and image/png content type from the static host.
import { ogImage } from '../../../lib/og';
import { getData, getSeries } from '../../../lib/data';
import { contentLabel } from '../../../lib/melt';
import { years } from '../../../lib/format';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ file: 'home.png' }, ...getData().series.map((s) => ({ file: `${s.slug}.png` }))];
}

export async function GET(_req, { params }) {
  const { file } = await params;
  const slug = file.replace(/\.png$/, '');
  if (slug === 'home') {
    return ogImage({
      kicker: 'Coin Melt Value Calculator',
      title: 'What is the metal in your coins worth?',
      lines: ['Junk silver, US gold, bullion, proof sets and world coins'],
    });
  }
  const s = getSeries(slug);
  const lines = s.variants.slice(0, 3).map((v) => `${v.type} (${years(v)}): ${contentLabel(v)}`);
  if (s.variants.length > 3) lines.push(`+ ${s.variants.length - 3} more types`);
  return ogImage({ title: s.name, lines });
}
