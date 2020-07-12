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
