import timeFn from '../../util/timeFn.ts';
import { allTrue, pairwise } from '../../util/arrayUtils.ts';
import { inRange } from '../../util/numberUtils.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(2, 2024);
  const part1Expected = 549;
  const part2Expected = 589;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const getReports = (input: string) => input.split("\n").map(line => line.split(" ").map(d => parseInt(d, 10)));

const toDiffs = (report: number[]) => pairwise(report).map(([a,b]) => a-b)

const allSameSign = (diffs: number[]) => {
  return pairwise(diffs)
    .map(([diff1, diff2]) => (diff1 ^ diff2) >= 0)
    .reduce(allTrue);
};

const allBetween1and3 = (diffs: number[]) => diffs.map(Math.abs).every(inRange(1, 3));

const isSafeReport = (report: number[]) => {
  const diffs = toDiffs(report);
  return allBetween1and3(diffs) && allSameSign(diffs);
}

function doPart1(input: string) {
  return getReports(input)
    .map(isSafeReport)
    .filter(safe => !!safe)
    .length;
};

const isTolerantlySafeReport = (report: number[]) => {
  if(isSafeReport(report))
    return true;

  return report
    .map((_, index) => report.toSpliced(index, 1))
    .map(isSafeReport)
    .some(isSafe => isSafe);
}

function doPart2(input: string) {
  return getReports(input)
    .map(isTolerantlySafeReport)
    .filter(safe => !!safe)
    .length;
};

main();