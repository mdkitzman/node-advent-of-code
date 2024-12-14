import { getPuzzleInput } from '../../aocClient';
import { sum } from '../../util/arrayUtils';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(2, 2020);
  const part1Expected = 445;
  const part2Expected = 491;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const getConfigs = (input:string) => {
  const splitter = /([0-9]+)-([0-9]+) ([a-z]): (.+)/;
  const configs = input
    .split('\n')
    .map(line => line.match(splitter))
    .filter(matches => matches !== null)
    .map(matches => ({low: parseInt(matches![1], 10), high:parseInt(matches![2], 10), letter:matches![3], password: matches![4]}))
  return configs;
}

function doPart1(input: string) {
  const correct = getConfigs(input)
    .map(config => {
      const count = config.password.split('').filter(ch => ch === config.letter).length;
      return (config.low <= count) && (count <= config.high) ? 1 : 0;
    })
    .reduce(sum, 0)
  return correct;
};

function doPart2(input: string) {
  const correct = getConfigs(input)
    .map(config => {
      return config.password.split('')
        .filter((_, index) => index+1 === config.low || index+1 === config.high)
        .filter(ch => ch === config.letter)
        .length === 1
        ? 1 : 0;
    })
    .reduce(sum, 0);
  return correct;
};

main();