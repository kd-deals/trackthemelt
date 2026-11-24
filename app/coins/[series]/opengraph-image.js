import { ogImage, OG_SIZE } from '../../../lib/og';
import { getData, getSeries } from '../../../lib/data';
import { contentLabel } from '../../../lib/melt';
import { years } from '../../../lib/format';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Coin melt value';

export function generateStaticParams() {
  return getData().series.map((s) => ({ series: s.slug }));
}

export default async function Image({ params }) {
  const { series } = await params;
  const s = getSeries(series);
  // Metal content per type (stable, unlike a dollar value baked in at build time).
  const lines = s.variants.slice(0, 3).map((v) => `${v.type} (${years(v)}): ${contentLabel(v)}`);
  if (s.variants.length > 3) lines.push(`+ ${s.variants.length - 3} more types`);
  return ogImage({ title: s.name, lines });
}
