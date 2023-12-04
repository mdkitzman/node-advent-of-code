import fs  from 'fs';
import { intersection } from 'lodash';
import { sum } from '../../util/arrayUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput);
  doPart2(allInput);
};

const findMatches = ([winners, myNumbers]: string[][]) => intersection(winners, myNumbers)
const getScratchCards = (input: string) => {
  return input
    .split("\n")
    .map(line => /Card\s+\d+: ([\s\d]+) \| ([\s\d]+)/.exec(line)!)
    .map(([,leftNumbers,rightNumbers]) => ([leftNumbers.trim().split(/\s+/), rightNumbers.trim().split(/\s+/)]))
    .map(findMatches)
}


function doPart1(input: string) {
  const totalPoints = getScratchCards(input)
    .filter(matches => matches.length > 0)
    .map(function calculatePoints(matches) {
      return Math.pow(2, matches.length - 1)
    })    
    .reduce(sum);
    
  console.log(totalPoints);
};

function doPart2(input: string) {
  const cardCounter:number[] = new Array(input.split('\n').length).fill(1);
  getScratchCards(input)
    .forEach((matches, iCard) => {
      for(let i = 0; i<matches.length; i++)
        cardCounter[i+iCard+1] += cardCounter[iCard];  
    })

  console.log(cardCounter.reduce(sum))
};

main();