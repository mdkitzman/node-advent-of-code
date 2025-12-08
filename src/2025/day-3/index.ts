import { getPuzzleInput } from '../../aocClient.ts';
import { sum } from '../../util/arrayUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(3, 2025);
  const part1Expected = 17278;
  const part2Expected = 171528556468625;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

/**
 * Find the largest number that can be formed from the given bank of digits
 * and desired digit size by recursively finding the maximum significant digit
 * in the bank ignoring the last `digitSize` digits of the bank, and then
 * finding the next significant digits in the remaining bank to the right of that
 * found digit.
 */
const maxJoltage = (bank: number[], digitSize: number): number[] => {
  if (digitSize > bank.length) {
    throw new Error('Not enough digits in bank');
  }
  if (digitSize === 0) {
    return [];
  }
  const space = bank.slice(0, bank.length - digitSize + 1);
  let significantDigit = Math.max(...space);
  const iLeft = bank.findIndex(val => val === significantDigit);
  
  return [significantDigit, ...maxJoltage(bank.slice(iLeft+1), digitSize - 1)];
}

function doPart1(input: string) {
  return input.split("\n")
    .map(line => line.split('').map(Number))
    .map(bank => maxJoltage(bank, 2).join(''))
    .map(strNum => Number(strNum))
    .reduce(sum, 0);
};

function doPart2(input: string) {
  return input.split("\n")
    .map(line => line.split('').map(Number))
    .map(bank => maxJoltage(bank, 12).join(''))
    .map(strNum => Number(strNum))
    .reduce(sum, 0);
};

main();