import { ogImage, OG_SIZE } from '../lib/og';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Track The Melt: coin melt value calculator';

export default function Image() {
  return ogImage({
    kicker: 'Coin Melt Value Calculator',
    title: 'What is the metal in your coins worth?',
    lines: ['Junk silver, US gold, bullion, proof sets and world coins'],
  });
}
