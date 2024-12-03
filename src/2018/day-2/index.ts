import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import lodash from 'lodash';
import Iter from 'es-iter';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(2, 2018);
  const part1Expected = 6150;
  const part2Expected = "rteotyxzbodglnpkudawhijsc";
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const wordWithNLetters = (n: number, word: string): boolean => {
    return Object.values(lodash.countBy(word.split(''))).some(count => count === n);
  }

  const words = input.split('\n');
  const twos = words
    .filter(word => wordWithNLetters(2, word))
    .length;
  const threes = words
    .filter(word => wordWithNLetters(3, word))
    .length;
  const checksum = twos * threes;
  return checksum;
};

function doPart2(input: string) {
  const similarLetters = (str1, str2) => {
    const similar:string[] = [];
    for(let i = 0; i < str1.length; i++) {
      if(str1[i] === str2[i]){
        similar.push(str1[i]);
      }
    }
    return similar.join('');
  }

  const words = input.split('\n')
  const wordPairs: [string, string][] = new Iter(words).combinations(2).toArray();
  const [word1, word2] = wordPairs.find((([str1, str2]) => {
    const word = similarLetters(str1, str2);
    return str1.length - word.length === 1
  })) || [];
  const word = similarLetters(word1, word2);
  return word;
};

main();