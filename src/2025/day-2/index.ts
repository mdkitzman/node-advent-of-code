import { getPuzzleInput } from '../../aocClient.ts';
import { sum } from '../../util/arrayUtils.ts';
import { generateRange } from '../../util/numberUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(2, 2025);
  const part1Expected = 40398804950;
  const part2Expected = 65794984339;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function solve(input: string, isInvalidId: (id: string) => boolean) {
  return input
    .split(",")
    .map(range => range.split("-"))
    .map(([start, end]) => [parseInt(start, 10), parseInt(end, 10)])
    .map(([start, end]) => {
      const duplicates = [];
      for(const val of generateRange(start, end)) {
        if (isInvalidId(String(val))) {
          duplicates.push(val);
        }
      }
      return duplicates;
    })
    .flat()
    .reduce(sum, 0);
}

const isARepeatedSequence = (s: string, len: number = s.length / 2) => {
  const first = s.substring(0, len);
  return first.repeat(s.length / len) === s;
}

function doPart1(input: string) {
  return solve(input, isARepeatedSequence)
};

function doPart2(input: string) {
  return solve(input, (id) => {
    for(let seqLen = 1; seqLen <= id.length / 2; seqLen++) {
      if (isARepeatedSequence(id, seqLen)) {
        return true;
      }
    }
    return false;
  })
};

main();