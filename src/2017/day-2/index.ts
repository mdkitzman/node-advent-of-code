import { getPuzzleInput } from '../../aocClient.ts';
import { sum } from '../../util/arrayUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(2, 2017);
  const part1Expected = 36766;
  const part2Expected = 261;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

type Spreadsheet = number[][];

const findRowMinMax = (rowData:number[]): number[] => rowData
  .map(val => [val, val])
  .reduce((prev, cur) => [Math.min(prev[0], cur[0]), Math.max(prev[1], cur[1])]);

const findRowDivisors = (rowData:number[]): number[] => rowData
  .map((val1, index1) => {
    const factorsOfVal1 = rowData.filter((val2, index2) => index1 != index2 && val1 % val2 === 0);
    return [val1, ...factorsOfVal1];
  })
  .filter(entries => entries.length > 1)
  .flat();

const subtractMinMax = ([min, max]: number[]): number => Math.abs(max - min);
const divide = ([val1, val2]: number[]):number => val1 / val2;

const calcChecksum = (data: Spreadsheet): number => data
  .map(findRowMinMax)
  .map(subtractMinMax)
  .reduce(sum, 0); 

const calcDivsorSum = (data: Spreadsheet): number => data
  .map(findRowDivisors)
  .map(divide)
  .reduce(sum, 0);

function doPart1(input: string) {
  const sheet: Spreadsheet = input.split("\n")
    .map(line => line.split(/\s/).map(d => parseInt(d, 10)));
  return calcChecksum(sheet);
};

function doPart2(input: string) {
  const sheet: Spreadsheet = input.split("\n")
    .map(line => line.split(/\s/).map(d => parseInt(d, 10)));
  return calcDivsorSum(sheet);
};

main();