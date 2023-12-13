import fs  from 'fs';
import timeFn from '../../util/timeFn';
import { sum } from '../../util/arrayUtils';
import { zip } from 'lodash';
import permutationScope from './permutation';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const permuator = permutationScope(".#", "?");
const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  const part1Expected = 6958;
  const part2Expected = null;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  // Don't even bother.  Its so slow
  //const part2 = timedPart2(allInput);
  //console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const part1 = input.split("\n")
    .map(line => line.split(" "))
    .map(([springConfig, exp]) => {
      const isValidSpring = expectation(exp.split(",").map(c => parseInt(c, 10)));
      let count = 0;
      for(const p of permuator(springConfig)) {
        if(isValidSpring(p!)) {
          count++;
        }
      }
      return count
    })
    .reduce(sum);
  
  return part1;
};

function doPart2(input: string) {
  const part2 = input.split("\n")
    .map(line => line.split(" "))
    .map(([springConfig, exp]) => [unfold(springConfig, "?"), unfold(exp, ",")])
    .map(([springConfig, exp]) => {
      const isValidSpring = expectation(exp.split(",").map(c => parseInt(c, 10)));
      let count = 0;
      for(const p of permuator(springConfig)) {
        if(isValidSpring(p!)) {
          count++;
        }
      }
      return count
    })
    .reduce(sum);
  
  return part2;
};

function unfold(line:string, join:string) {
  return new Array(5).fill(line).join(join);
}

function expectation(badSprings: number[]) {
  return function test(springs: string) {
    const groups = springs.replaceAll(/\.+/g, " ").trim().split(" ");
    if (groups.length !== badSprings.length)
      return false;
    return zip(badSprings, groups)
      .every(([expectedLen, springSpan]) => expectedLen && expectedLen > 0 && expectedLen === springSpan?.length)
  }
}

main();