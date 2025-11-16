import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import { knotNumbers, knotHash } from '../../util/hash.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(10, 2017);
  const part1Expected = 6952;
  const part2Expected = "28e7c4360520718a5dc811d3942cf1fd";
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const data = input.split(",").map(d => parseInt(d, 10));
  const [numbers] = knotNumbers(data);
  const result = numbers[0] * numbers[1];
  return result;
};

function doPart2(input: string) {
  return knotHash(input);
};

main();