import { sum, chunk } from '../../util/arrayUtils.ts';
import { alphabet, ALPHABET, cut } from '../../util/stringUtils.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const letterValue: Record<string, number> = Object.fromEntries((alphabet+ALPHABET).split('').map((ltr, i) => [ltr, i+1]));
const cutInHalf = (str:string) => cut(str, str.length/2);

const main = async () => {
  const allInput = await getPuzzleInput(3, 2022);
  doPart1(allInput); // 7716
  doPart2(allInput); // 2973
};

const findCommon = (strings: string[]): number => {
  const [first, ...rest] = strings;
  const matchingLetter = first
    .split('')
    .find(ltr => rest.map(str => str.indexOf(ltr)).every(val => val >= 0));
  return matchingLetter
    ? letterValue[matchingLetter]
    : 0;
}

function doPart1(input: string) {
  const total = input
    .split('\n')
    .map(cutInHalf)
    .map(findCommon)
    .reduce(sum);
  console.log(total);
};

function doPart2(input: string) {
  const lines = input.split('\n');
  const groups = chunk(lines, 3);

  const total = groups
    .map(findCommon)
    .reduce(sum);
  console.log(total);
};

main();