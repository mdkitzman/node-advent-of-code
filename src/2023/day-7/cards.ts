import { countBy } from "lodash";
import { isEqual } from "lodash";
import { leftpad } from "../../util/stringUtils";
import { max } from "../../util/arrayUtils";

type HandTest = (hand:string)=>boolean;

const cards = "23456789TJQKA";
const cardsNoWild = cards.split("").filter(c => c !== "J");

const valueMap = cards.split("").map((card, i) => ({[card]: i+2})).reduce((acc, cur) => ({ ...acc, ...cur}));
const numericCards = (hand:string): number[] => hand.split("").map(card => valueMap[card] || 0);
const numericCardValue = (hand:string) => parseInt(numericCards(hand).map(String).map(v => leftpad(v, 2)).join(''), 10);

const handValue = {
  "fiveOfAKind": 10*100000000000,
  "fourOfAKind": 9 *100000000000,
  "fullHouse":   8 *100000000000,
  "threeOfAKind":7 *100000000000,
  "twoPair":     6 *100000000000,
  "onePair":     5 *100000000000,
  "highCard":    4 *100000000000,
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

export const handScore = (hand:string): number => {
  const handTest = handTests.find(test => test(hand));
  
  return handValue[handTest!.name] + numericCardValue(hand);
}

export const handScoreWild = (hand:string): number => {
 
  const makeHands = (hand:string[], start = 0):string[][] => {
    const hands: string[][] = [];
    for(let iCard = start; iCard < hand.length; iCard++) {
      if (hand[iCard] !== "J") 
        continue;
      const newHands = cardsNoWild.map(card => {
        const newHand = [...hand];
        newHand.splice(iCard, 1, card);
        return newHand;
      })
      .map(newHand => makeHands(newHand, iCard+1))
      .flat();
      for(const h of newHands){
        hands.push(h);
      }
    }
    return [hand, ...hands];
  }
  const hands = makeHands(hand.split(""));
  return hands.map(hand => handScore(hand.join(''))).reduce(max)
}