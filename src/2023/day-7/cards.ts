import { countBy, memoize } from "lodash";
import { isEqual } from "lodash";
import { leftpad } from '../../util/stringUtils.ts';
import { max } from '../../util/arrayUtils.ts';
import wildPermutations from '../../util/permutation.ts';

type HandTest = (hand:string)=>boolean;

const valueMap = memoize((cards:string) => cards.split("").map((card, i) => ({[card]: i+2})).reduce((acc, cur) => ({ ...acc, ...cur})));
const numericCards = memoize((cards:string) => (hand:string): number[] => hand.split("").map(card => valueMap(cards)[card] || 0));
const numericCardValue = memoize((cards:string) => (hand:string) => parseInt(numericCards(cards)(hand).map(String).map(v => leftpad(v, 2)).join(''), 10));

const handValue = {
  "fiveOfAKind": 10*10_00_00_00_00_00,
  "fourOfAKind": 9 *10_00_00_00_00_00,
  "fullHouse":   8 *10_00_00_00_00_00,
  "threeOfAKind":7 *10_00_00_00_00_00,
  "twoPair":     6 *10_00_00_00_00_00,
  "onePair":     5 *10_00_00_00_00_00,
  "highCard":    4 *10_00_00_00_00_00,
}

const handTests: HandTest[] = [
  function fiveOfAKind(hand:string) {
    return Object.keys(countBy(hand.split(""))).length === 1;
  },
  function fourOfAKind(hand:string) {
    const cardCounts = countBy(hand.split(""));
    return Object.keys(cardCounts).length === 2 &&
      isEqual(Object.values(cardCounts).sort(), [1,4]);
  },
  function fullHouse(hand:string) {
    const cardCounts = countBy(hand.split(""));
    return Object.keys(cardCounts).length === 2 &&
      isEqual(Object.values(cardCounts).sort(), [2,3]);
  },
  function threeOfAKind(hand:string) {
    const cardCounts = countBy(hand.split(""));
    return Object.keys(cardCounts).length === 3 &&
      isEqual(Object.values(cardCounts).sort(), [1,1,3]);
  },
  function twoPair(hand:string) {
    const cardCounts = countBy(hand.split(""));
    return Object.keys(cardCounts).length === 3 &&
      isEqual(Object.values(cardCounts).sort(), [1,2,2]);
  },
  function onePair(hand:string) {
    const cardCounts = countBy(hand.split(""));
    return Object.keys(cardCounts).length === 4 &&
      isEqual(Object.values(cardCounts).sort(), [1,1,1,2]);
  },
  function highCard(hand:string) {
    return true;
  }
];

export const handScore = (cards:string) => (hand:string): number => {
  const handTest = handTests.find(test => test(hand));
  
  return handValue[handTest!.name] + numericCardValue(cards)(hand);
}

const wildPermutator = wildPermutations("23456789TQKA", "J");
export const handScoreWild = (cards:string) => (hand:string): number => {
  const scorer = handScore(cards);
  let maxScore = 0;
  for (const h of wildPermutator(hand)) {
    maxScore = max(scorer(h!), maxScore);
  }
  return maxScore;
}