import fs  from 'fs';
import timeFn from '../../util/timeFn';
import { handStrength, handStrengthWild } from "./cards";
import { sum } from '../../util/arrayUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  
  timedPart1(allInput);
  timedPart2(allInput);
};



function doPart1(input: string) {
  const part1 = input
    .split("\n")
    .map(line => line.split(" "))
    .sort((handAndBetA, handAndBetB) => {
      const handA = handStrength(handAndBetA[0]);
      const handB = handStrength(handAndBetB[0]);
      return handA - handB;
    })
    .map(([,betStr], i) => parseInt(betStr, 10) * (i+1))
    .reduce(sum);

  console.log(part1);
};

function doPart2(input: string) {
  handStrengthWild("KKJJ3");
};

main();