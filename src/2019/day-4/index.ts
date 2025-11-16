import { isEqual } from 'lodash-es';
import { chunk, allTrue } from './../../util/arrayUtils.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const main = async () => {
  const input = await getPuzzleInput(4, 2019);
  doPart1(input); // 1178
  doPart2(input); // 763
};

function doPart1(input: string) {
  const [min, max] = input.split('-').map(val => parseInt(val, 10));

  const ruleset: ((pw: number[])=>boolean)[] = [
    has2adjacentDigits,
    digitsIncrease
  ];

  const count = countValidPasswords([min, max], ruleset);
  console.log(`The number of valid passwords is ${count}`);
};

function doPart2(input: string) {
  const [min, max] = input.split('-').map(val => parseInt(val, 10));

  const ruleset: ((pw: number[])=>boolean)[] = [
    has2adjacentDigits,
    digitsIncrease,
    hasAtLeast1Pair
  ];

  const count = countValidPasswords([min, max], ruleset);
  console.log(`The number of valid passwords is ${count}`);
};

function countValidPasswords([min, max]: number[], ruleset: ((pw: number[])=>boolean)[]) {
  let counter = 0;
  for(let val = min; val <= max; val++) {
    const pw = val.toString(10).split('').map(v => parseInt(v, 10));
    if( ruleset.map(rule => rule(pw)).reduce(allTrue) )
      counter++;
  }
  return counter;
}

function getPairs(pw: number[]): Set<number> {
  return new Set([
      ...chunk(pw, 2),
      ...chunk(pw.slice(1), 2)
    ]
    .filter(chunk => chunk.length === 2)
    .filter(([left, right]) => left === right)
    .map(chunk => chunk[0]));
}

function has2adjacentDigits(pw: number[]): boolean {
  return getPairs(pw).size > 0;
}

function digitsIncrease(pw: number[]): boolean {
  const sorted = [...pw];
  sorted.sort();
  return isEqual(sorted, pw);
}

function hasAtLeast1Pair(pw: number[]):boolean {
  let hasAtLeast1Pair = false;
  const unique = new Set(pw);
  for(const duplicated of unique.values()) {
    const count = pw.filter(val => val === duplicated).length;
    hasAtLeast1Pair ||= count === 2;
  }
  return hasAtLeast1Pair;
}

main();