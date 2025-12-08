import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import { sum } from '../../util/arrayUtils.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(5, 2025);
  const part1Expected = 712;
  const part2Expected = 332998283036769;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const [rangeInputs, idInputs] = input.split('\n\n');
  const ranges = rangeInputs.split('\n').map(line => line.split('-').map(Number));
  const ids = idInputs.split('\n').map(Number);
  
  const rangeValidator = (ranges: number[][]) => (id: number): boolean => ranges.some(([start, end]) => id >= start && id <= end);
  const isValidId = rangeValidator(ranges);
  return ids.filter(isValidId).length;
};

function doPart2(input: string) {
  const [rangeInputs] = input.split('\n\n');
  const sortedRanges = rangeInputs
    .split('\n')
    .map(line => line.split('-').map(Number))
    .toSorted((a, b) => a[0] - b[0]);
  
  const flattened: number[][] = [];
  
  for (const candidateRange of sortedRanges) {
    if (flattened.length === 0) {
      flattened.push(candidateRange);
      continue;
    }
    
    const lastRange = flattened[flattened.length - 1];
    switch (true) {
      // This candiate range is fully after the last range and there is a gap, so we can add it as a new range
      case candidateRange[0] > lastRange[1]:
        flattened.push(candidateRange);
        continue;

      // This candiate range overlaps with the last range
      case candidateRange[0] <= lastRange[1]:
        lastRange[1] = Math.max(lastRange[1], candidateRange[1]);
        continue;
    }
  }  
  
  return flattened.map(([start, end]) => end - start + 1).reduce(sum, 0);
};

main();