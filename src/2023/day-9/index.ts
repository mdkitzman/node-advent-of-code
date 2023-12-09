import fs  from 'fs';
import timeFn from '../../util/timeFn';
import { sum, windowed } from '../../util/arrayUtils';
import { lcm } from '../../util/numberUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  
  timedPart1(allInput);
  timedPart2(allInput);
};

const determineNextTailValue = determineNextValue.bind(null, "tail");
const determineNextHeadValue = determineNextValue.bind(null, "head");

const sumPredictedValues = (input:string, predicter: (history:number[])=>number):number => {
  return input
    .split("\n")
    .map(line => line.split(" ").map(s => parseInt(s, 10)))
    .map(predicter)
    .reduce(sum);
}

function doPart1(input: string) {
  const part1 = sumPredictedValues(input, determineNextTailValue);
  console.log(part1);
};

function doPart2(input: string) {
  const part2 = sumPredictedValues(input, determineNextHeadValue);
  console.log(part2);
};

function determineNextValue(side: "tail" | "head", history:number[]):number {
  if (history.every(v => v === 0)) {
    return 0;
  }
  const diffDir = side === "tail" ? ([a,b]: number[]):number => b-a : ([a,b]: number[]):number => a-b
  const differences = windowed(2, history).map(diffDir);
  const nextValue = determineNextValue(side, differences);
  const [lastValue] = side === "tail" ? history.slice(-1) : history;
  return lastValue + nextValue;
}

main();