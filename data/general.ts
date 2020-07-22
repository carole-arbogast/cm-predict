import range from "lodash/range";

export const bonusInfo = [
  { name: "tomb", bonus: 1.6 },
  { name: "night", bonus: 2 },
  { name: "lighthouse", bonus: 5 },
  { name: "tent", bonus: 1 },
  { name: "devastation", bonus: -10 },
  { name: "hood", bonus: 0 },
];

const rangesList = [
  { range: [1], bonus: -4 },
  { range: [2], bonus: 1 },
  { range: [3], bonus: 5 },
  { range: [4], bonus: 9 },
  { range: range(5, 12), bonus: 11 },
  { range: [12], bonus: 12 },
  { range: [13], bonus: 12.4 },
  { range: [14], bonus: 13 },
  { range: [15], bonus: 14 },
  { range: range(16, 29), bonus: 15 },
];

export const distanceInfo = Array(28)
  .fill(null)
  .map((e, i) => {
    const matchingRange = rangesList.find((e) => e.range.includes(i + 1));
    return { km: i + 1, bonus: matchingRange.bonus };
  });

export const hiddenCampers = {
  0: 0,
  1: 0,
  2: -2,
  3: -6,
  4: -10,
  5: -14,
  6: -20,
};

export const previousNights = [
  {
    nb: 1,
    noob: -4,
    cp: -2,
  },
  {
    nb: 2,
    noob: -9,
    cp: -4,
  },
  {
    nb: 3,
    noob: -13,
    cp: -8,
  },
  {
    nb: 4,
    noob: -16,
    cp: -10,
  },
  {
    nb: 5,
    noob: -26,
    cp: -12,
  },
  {
    nb: 6,
    noob: -36,
    cp: -16,
  },
  {
    nb: 7,
    noob: -50,
    cp: -26,
  },
  {
    nb: 8,
    noob: null,
    cp: -36,
  },
];

export const scoreDisplays = [
  {
    range: [-Infinity, 2],
    display:
      "Vous estimez que vos chances de survie ici sont quasi nulles… Autant gober du cyanure tout de suite.",
    code: "poison",
    color: "#f5211d",
  },
  {
    range: [2, 6],
    display:
      "Vous estimez que vos chances de survie ici sont très faibles. Peut-être que vous aimez jouer à pile ou face ?",
    code: "reallyLow",
    color: "#dc6724",
  },
  {
    range: [6, 10],
    display: "Vous estimez que vos chances de survie ici sont faibles. Difficile à dire.",
    code: "low",
    color: "#fca934",
  },
  {
    range: [10, 13],
    display:
      "Vous estimez que vos chances de survie ici sont limitées, bien que ça puisse se tenter. Mais un accident est vite arrivé…",
    code: "limited",
    color: "#fcd077",
  },
  {
    range: [13, 16],
    display:
      "Vous estimez que vos chances de survie ici sont à peu près satisfaisantes, pour peu qu'aucun imprévu ne vous tombe dessus.",
    code: "satisfactory",
    color: "#e0dd72",
  },
  {
    range: [16, 18.9],
    display:
      "Vous estimez que vos chances de survie ici sont correctes : il ne vous reste plus qu'à croiser les doigts !",
    code: "decent",
    color: "#ccdb7f",
  },
  {
    range: [18, 20],
    display:
      "Vous estimez que vos chances de survie ici sont élevées : vous devriez pouvoir passer la nuit ici. (Ermite)",
    code: "high",
    color: "#c7dc61",
  },
  {
    range: [20, Infinity],
    display:
      "Vous estimez que vos chances de survie ici sont optimales : Personne ne vous verrait même en vous pointant du doigt. (Ermite)",
    code: "optimal",
    color: "#9ecb29",
  },
];
