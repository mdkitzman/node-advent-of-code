import fs  from 'fs';
import { intersection } from 'lodash';
import { sum } from '../../util/arrayUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput);
  doPart2(allInput);
};

const getScratchCards = (input: string) => {
  return input
    .split("\n")
    .map(line => line.split(":").map(s => s.trim()))
    .map(([,numbers]) => numbers.split("|").map(s => s.trim()))
}

const calculatePoints = ([winners, myNumbers]: string[]): number => {
  const matches = intersection(winners.split(/\s+/), myNumbers.split(' '));
  return matches.length === 0
    ? 0
    : Math.pow(2, matches.length - 1)
}

function doPart1(input: string) {
  const totalPoints = getScratchCards(input)
    .map(calculatePoints)    
    .reduce(sum);
    
  console.log(totalPoints);
};

function doPart2(input: string) {
  const scratchCards = getScratchCards(input)
  const cardCounter = new Array(scratchCards.length).fill(1);

  scratchCards.forEach(([winners, myNumbers], iCard, arr) => {
    const matches = intersection(winners.split(/\s+/), myNumbers.split(' '));
    for(let i = 0; i<matches.length; i++)
      cardCounter[i+iCard+1] += cardCounter[iCard];
  });

  console.log(cardCounter.reduce(sum))
};

main();