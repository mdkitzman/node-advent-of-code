import { getPuzzleInput } from '../../aocClient';
import { infiniteLoop, sum } from '../../util/arrayUtils';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(1, 2018);
  const part1Expected = 479;
  const part2Expected = 66105;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  return input
    .split('\n')
    .map(val => parseInt(val, 10))
    .reduce(sum, 0);
};

function doPart2(input: string) {
  const numbers = input.split('\n').map(val => parseInt(val, 10));
  const seen = new Set<number>();
  let frequency = 0;
  for (const val of infiniteLoop(numbers)) {
    frequency += val;
    if (seen.has(frequency))
      break;
    seen.add(frequency);
  }
  return frequency;
};

main();