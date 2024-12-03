import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(1, 2017);
  const part1Expected = 1047;
  const part2Expected = 982;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const matchingPairsSum = (value: string, pairDistance: number): number => {
  return Array.from(value)
    .filter((num, index) => num === value[(pairDistance + index) % value.length])
    .map(num => parseInt(num, 10))
    .reduce((prev, cur) => prev + cur, 0);
};

function doPart1(input: string) {
  return matchingPairsSum(input, 1);
};

function doPart2(input: string) {
  return matchingPairsSum(input, input.length/2);
};

main();