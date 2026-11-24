// US proof and mint sets that contain silver. Coin specs are US Mint figures; content is pure troy oz.
const OZT = 31.1034768;
const ag = (grams, fine) => (grams * fine) / OZT;

export const COIN = {
  d90: ag(2.5, 0.9), q90: ag(6.25, 0.9), h90: ag(12.5, 0.9),
  q40: ag(5.75, 0.4), h40: ag(11.5, 0.4), i40: ag(24.59, 0.4),
  d999: ag(2.537, 0.999), q999: ag(6.343, 0.999), h999: ag(12.685, 0.999),
  ase: 1,   // proof Silver Eagle: 1 troy oz of silver
};

const S = (key, title, years, contents, coins, note) => ({
  key, title, years, contents, note,
  oz: Object.entries(coins).reduce((n, [c, k]) => n + COIN[c] * k, 0),
});

export const SET_GROUPS = [
  {
    title: 'Classic Proof & Mint Sets',
    sets: [
      S('proof-1936-1964', 'Proof set', '1936–1964', 'Dime, quarter, half (90%)', { d90: 1, q90: 1, h90: 1 }, 'The 1942 set with the silver war nickel adds 0.0563 oz'),
      S('mint-1959-1964', 'Mint set', '1959–1964', 'P and D dime, quarter, half (90%)', { d90: 2, q90: 2, h90: 2 }, 'One of each coin; 1947–1958 sets had two of each'),
      S('sms-1965-1967', 'Special Mint Set', '1965–1967', '40% Kennedy half', { h40: 1 }),
      S('proof-mint-1968-1970', 'Proof or mint set', '1968–1970', '40% Kennedy half', { h40: 1 }),
      S('bicentennial-1976', 'Bicentennial 3-coin silver set', '1976', '40% quarter, half, dollar', { q40: 1, h40: 1, i40: 1 }, 'Proof or uncirculated'),
    ],
  },
  {
    title: 'Double Mint Sets (two of each coin)',
    sets: [
      S('double-1947-1948', 'Double mint set', '1947–1948', '6 dimes, 6 quarters, 4 halves (90%)', { d90: 6, q90: 6, h90: 4 }, 'P, D and S dimes and quarters; P and D halves'),
      S('double-1949', 'Double mint set', '1949', '6 dimes, 4 quarters, 6 halves (90%)', { d90: 6, q90: 4, h90: 6 }, 'No 1949-S quarter'),
      S('double-1951-1954', 'Double mint set', '1951–1954', '6 dimes, 6 quarters, 6 halves (90%)', { d90: 6, q90: 6, h90: 6 }, 'No 1950 mint set was issued'),
      S('double-1955', 'Double mint set', '1955', '6 dimes, 4 quarters, 2 halves (90%)', { d90: 6, q90: 4, h90: 2 }),
      S('double-1956', 'Double mint set', '1956', '4 dimes, 4 quarters, 2 halves (90%)', { d90: 4, q90: 4, h90: 2 }),
      S('double-1957-1958', 'Double mint set', '1957–1958', '4 dimes, 4 quarters, 4 halves (90%)', { d90: 4, q90: 4, h90: 4 }),
    ],
  },
  {
    title: 'Silver Proof Sets',
    sets: [
      S('silver-proof-1992-1998', 'Silver proof set', '1992–1998', 'Dime, quarter, half (90%)', { d90: 1, q90: 1, h90: 1 }),
      S('silver-proof-1999-2008', 'Silver proof set', '1999–2008', 'Dime, half, 5 State quarters (90%)', { d90: 1, h90: 1, q90: 5 }),
      S('silver-proof-2009', 'Silver proof set', '2009', 'Dime, half, 6 DC & Territories quarters (90%)', { d90: 1, h90: 1, q90: 6 }),
      S('silver-proof-2010-2018', 'Silver proof set', '2010–2018', 'Dime, half, 5 National Park quarters (90%)', { d90: 1, h90: 1, q90: 5 }),
      S('silver-proof-2019-2020', 'Silver proof set', '2019–2020', 'Dime, half, 5 National Park quarters (.999)', { d999: 1, h999: 1, q999: 5 }),
      S('silver-proof-2021', 'Silver proof set', '2021', 'Dime, half, 2 quarters (.999)', { d999: 1, h999: 1, q999: 2 }, 'Tuskegee Airmen and Crossing the Delaware quarters'),
      S('silver-proof-2022-2025', 'Silver proof set', '2022–2025', 'Dime, half, 5 American Women quarters (.999)', { d999: 1, h999: 1, q999: 5 }),
    ],
  },
  {
    title: 'Quarter & Limited Edition Sets',
    sets: [
      S('quarters-90', 'Silver quarters proof set', '1999–2018', '5 quarters (90%)', { q90: 5 }, '2009 set has 6 quarters (1.0851 oz)'),
      S('quarters-999', 'Silver quarters proof set', '2019–2020, 2022–2025', '5 quarters (.999)', { q999: 5 }, '2021 set has 2 quarters (0.4075 oz)'),
      S('le-2012-2018', 'Limited Edition silver proof set', '2012–2018', 'Dime, half, 5 quarters (90%) + proof Silver Eagle', { d90: 1, h90: 1, q90: 5, ase: 1 }),
      S('le-2019', 'Limited Edition silver proof set', '2019–2020, 2022–2024', 'Dime, half, 5 quarters (.999) + proof Silver Eagle', { d999: 1, h999: 1, q999: 5, ase: 1 }),
      S('le-2021', 'Limited Edition silver proof set', '2021', 'Dime, half, 2 quarters (.999) + 2 proof Silver Eagles', { d999: 1, h999: 1, q999: 2, ase: 2 }),
    ],
  },
];

export const ALL_SETS = SET_GROUPS.flatMap((g) => g.sets);
