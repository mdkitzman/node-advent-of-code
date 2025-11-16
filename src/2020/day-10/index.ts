import { getPuzzleInput } from '../../aocClient.ts';
import { sum } from '../../util/arrayUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(10, 2020);
  const part1Expected = 1755;
  const part2Expected = 4049565169664;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const adapters = input.split('\n').map(line => parseInt(line, 10)).sort((a, b) => a - b);
  
  const diffs = adapters.map((jolt, index, arr) => index > 0 ? jolt - arr[index-1] : jolt)
  diffs.push(3);
  
  const ones = diffs.filter(diff => diff === 1).length;
  const threes = diffs.filter(diff => diff === 3).length;

  return ones * threes;
};

type AdapterSum = {
  adapter:number,
  sum:number
}

function doPart2(input: string) {
  const adapters = input.split('\n').map(line => parseInt(line, 10)).sort((a, b) => a - b);
  
  const sums:AdapterSum[]  = [{
    adapter:0,
    sum:1
  }];

  // Thanks to mastermatt
  for (const curAdapter of adapters) {
    const prevSums = sums
      // look back three previous adapters
      .slice(-3) 
      // take only entries that have a diff of 3 or less
      .filter((pair) => pair.adapter >= curAdapter - 3) 
      // get the previous sums
      .map(pair => pair.sum);                         
    // sum it up for the current adapter
    sums.push({
      adapter: curAdapter, 
      sum: prevSums.reduce(sum, 0)
    });
  }
  
  const combos = sums.pop()!.sum;
  return combos;
};

main();