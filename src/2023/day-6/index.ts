import fs  from 'fs';
import timeFn from '../../util/timeFn';
import { zip } from 'lodash';
import { findFactorPairs, generateRange } from '../../util/numberUtils';
import { multiply, sum } from '../../util/arrayUtils';
import { parseAllNumbers, parseNumber } from '../../util/stringUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  
  timedPart1(allInput);
  timedPart2(allInput);
};

function doPart1(input: string) {
  const [times, distances] = input.split('\n').map(parseAllNumbers);
  
  const total = zip(times, distances)
    .map(([time, distance]) => findWinnerCount(time!, distance!))
    .reduce(multiply)
  
    console.log(total); // 211904
};

function doPart2(input: string) {
  const [time, distance] = input.split('\n').map(parseNumber);
  const winnerCount = findWinnerCount(time!, distance!);
  console.log(winnerCount); // 43364472
};

function findWinnerCount(time:number, distance: number) {
  let winnerCount = 0;
  for(const hold of generateRange(1, Math.ceil(time/2))) {
    if (hold * (time-hold) > distance)
      winnerCount+=2;
  }
  return winnerCount;
}

main();