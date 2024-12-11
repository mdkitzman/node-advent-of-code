import { split } from 'lodash';
import { getPuzzleInput } from '../../aocClient';
import { chunk, sum } from '../../util/arrayUtils';
import { digitCount } from '../../util/numberUtils';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(11, 2024);
  const part1Expected = 209412;
  const part2Expected = 248967696501656;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const splitNumber = (num: number, digitCount: number) => {
  let digitDivider = Math.pow(10, digitCount/2);
  return [
    Math.floor(num/digitDivider),
    num % digitDivider
  ];
}

const blinkAt = (value:number): number[] => {
  const digCount = digitCount(value);
  switch (true) {
    case value === 0:
      return [1];
    case digCount % 2 === 0:
      return splitNumber(value, digCount);
    default:
      return [value * 2024];
  }
}

const simulator = (stones:number[]) => (blinks: number) => {
  let stoneCounter = new Map<number, number>();
  stones.forEach(stone => {
    const count = stoneCounter.get(stone) || 0;
    stoneCounter.set(stone, count + 1);
  });
  for (let iBlink = 0; iBlink < blinks; iBlink++) {
    const newStoneCounter = new Map();
    stoneCounter.forEach((currentCount, stone) => {
      blinkAt(stone).forEach(newStone => {
        const addCount = newStoneCounter.get(newStone) || 0;
        newStoneCounter.set(newStone, addCount + currentCount);
      });
    });
    stoneCounter = newStoneCounter;
  }
  return [...stoneCounter.values()].reduce(sum);
}

function doPart1(input: string) {
  const stones = input.split(" ")
    .map(d => parseInt(d, 10));
  const simulate = simulator(stones);
  return simulate(25);
};

function doPart2(input: string) {
  const stones = input.split(" ")
    .map(d => parseInt(d, 10));
  const simulate = simulator(stones);
  return simulate(75);
};

main();