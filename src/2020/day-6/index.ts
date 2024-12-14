import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { bitAnd, sum } from '../../util/arrayUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(6, 2020);
  const part1Expected = 6297;
  const part2Expected = 3158;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const count = input.split(/\s\s/g)
    .map(group => 
      new Set(group.split('\n').flat().map(ch => ch.split('')).flat()).size
    ).reduce(sum, 0);
  return count;
};

function doPart2(input: string) {
  const _a = 'a'.charCodeAt(0);
  const toBit = (ltr:string):number => 1 << (ltr.charCodeAt(0) - _a);

  const count = input.split(/\s\s/g)
    .map(group => {
      // Map to a bit flag and bitwise and them together
      const num = group.split('\n')
        .map(line => line.split('').map(toBit).reduce(sum, 0))
        .reduce(bitAnd);
      // count the 1s
      const count = num.toString(2).split('')
        .filter(ch => ch === '1')
        .map(ch => parseInt(ch, 10))
        .reduce(sum, 0);
      return count;
    })
    .reduce(sum, 0);
  return count;
};

main();