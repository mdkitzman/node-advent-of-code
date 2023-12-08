import fs  from 'fs';
import timeFn from '../../util/timeFn';
import { handScore, handScoreWild } from "./cards";
import { sum } from '../../util/arrayUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  
  timedPart1(allInput);
  timedPart2(allInput);
};

function doTheThing(input:string, strengthFn:(hand:string)=>number) {
  return input
    .split("\n")
    .map(line => line.split(" "))
    .sort((handAndBetA, handAndBetB) => {
      const handA = strengthFn(handAndBetA[0]);
      const handB = strengthFn(handAndBetB[0]);
      return handA - handB;
    })
    .map(([,betStr], i) => parseInt(betStr, 10) * (i+1))
    .reduce(sum);
}

function doPart1(input: string) {
  const part1 = doTheThing(input, handScore);
  console.log(part1);
};

function doPart2(input: string) {
  const part2 = doTheThing(input, handScoreWild);
  console.log(part2); // 246213569 too high
};

main();