import { getPuzzleInput } from '../../aocClient.ts';
import { sum } from '../../util/arrayUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(4, 2017);
  const part1Expected = 383;
  const part2Expected = 265;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const isValidPassphrase = (phrase:string): boolean => {
    const words = phrase.split(' ');
    const uniqueWords = new Set(words);
    return uniqueWords.size === words.length;
  }
  
  const phrases = input.split('\n');
  const countValid = phrases
    .map(isValidPassphrase)
    .map(valid => valid ? 1 : 0)
    .reduce(sum, 0);
  return countValid;
};

function doPart2(input: string) {
  const isValidPassphrase = (phrase:string): boolean => {
    const words = phrase.split(' ')
      .map(word => Array.from(word).sort().join(''))
    const uniqueWords = new Set(words);
    return uniqueWords.size === words.length;
  }

  const phrases = input.split('\n');
  const countValid = phrases
    .map(isValidPassphrase)
    .map(valid => valid ? 1 : 0)
    .reduce(sum, 0);
  return countValid;
};

main();