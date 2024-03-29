import fs  from 'fs';
import timeFn from '../../util/timeFn';
import { sum, windowed } from '../../util/arrayUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  const part1Expected = 1974913025;
  const part2Expected = 884;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
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
  return sumPredictedValues(input, determineNextTailValue);  
};

function doPart2(input: string) {
  return sumPredictedValues(input, determineNextHeadValue);
};

function determineNextValue(side: "tail" | "head", history:number[]):number {
  if (history.every(v => v === 0)) {
    return 0;
  }
  const difference = side === "tail"
    ? ([a,b]: number[]):number => b - a
    : ([a,b]: number[]):number => a - b
  const differences = windowed(2, history).map(difference);
  const nextValue = determineNextValue(side, differences);
  const [lastValue] = side === "tail" ? history.slice(-1) : history;
  return lastValue + nextValue;
}

main();