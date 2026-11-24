// Country pages for world coins. `country` matches melt_series.country.
export const WORLD_BULLION = new Set([
  'silver-maple-leaf', 'gold-maple-leaf', 'silver-libertad', 'silver-britannia',
  'krugerrand', 'gold-philharmonic', 'silver-philharmonic',
]);

export const COUNTRIES = [
  {
    key: 'canada', country: 'Canada', adj: 'Canadian', title: 'Canadian Silver Coins',
    guide: [
      'Dimes, quarters and 50-cent pieces dated 1920–1966 are 80% silver, and so is every circulating silver dollar from 1935 to 1967.',
      'Partway through 1967 the dime and quarter dropped to 50% silver, and the two look and weigh the same. 1967 50-cent pieces and dollars are still 80%.',
      '1968 dimes and quarters are either 50% silver or nickel: nickel coins stick to a magnet, silver ones don\'t. 1968 and later 50-cent pieces and dollars are nickel.',
      'Coins dated 1919 or earlier are 92.5% sterling silver.',
    ],
  },
  {
    key: 'mexico', country: 'Mexico', adj: 'Mexican', title: 'Mexican Silver & Gold Coins',
    guide: [
      'Mexican silver coins state their fineness on the coin, such as "0.720" or "LEY 900", along with the weight in grams.',
      'The 1920–1945 "cap and rays" peso is 72% silver. The large 10 pesos of 1955–1960 is 90% silver.',
      'The gold 2 pesos and 50 pesos (Centenario) are .900 gold. Most on the market are restrikes dated 1945 and 1947, with the same gold content as the originals.',
    ],
  },
  {
    key: 'uk', country: 'UK', adj: 'British', title: 'British Silver & Gold Coins',
    guide: [
      'British silver coins dated 1919 and earlier are sterling, 92.5% silver. Those dated 1920–1946 are 50% silver.',
      'Coins dated 1947 and later are copper-nickel with no silver. 1920 sixpences were struck in both alloys.',
      'A full gold sovereign is 22-karat gold and has held 0.2354 oz of gold since 1817.',
    ],
  },
  {
    key: 'switzerland', country: 'Switzerland', adj: 'Swiss', title: 'Swiss Silver & Gold Coins',
    guide: [
      '½, 1 and 2 franc coins dated 1967 and earlier are 83.5% silver. The 5 francs is 83.5% silver for 1931–1967 and 1969.',
      'Most 1968 and later coins are copper-nickel. The 20 francs "Vreneli" is 90% gold.',
    ],
  },
  {
    key: 'netherlands', country: 'Netherlands', adj: 'Dutch', title: 'Dutch Silver Coins',
    guide: [
      'Guilders dated 1922–1945 (10 g) and 1954–1967 (6.5 g) are 72% silver, as are 2½ gulden dated 1929–1940 (25 g) and 1959–1966 (15 g).',
      'Later guilders and 2½ gulden are nickel.',
    ],
  },
];

export const BULLION_PAGE = {
  key: 'bullion', title: 'World Bullion Coins',
  guide: [
    'Modern 1 oz bullion coins contain one troy ounce of metal whatever their fineness. 22-karat coins like the Krugerrand weigh more so they hold the same ounce of gold.',
    'Bullion coins trade on metal content, usually a few percent over melt when buying and near melt when selling.',
  ],
};

export const countryByName = (name) => COUNTRIES.find((c) => c.country === name);
