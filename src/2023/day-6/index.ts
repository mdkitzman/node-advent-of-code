import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import timeFn from '../../util/timeFn.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { zip } from 'lodash-es';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { generateRange, quadratic } from '../../util/numberUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { multiply, sum } from '../../util/arrayUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { parseAllNumbers, parseNumber } from '../../util/stringUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    .map(([time, distance]) => quadratic(time!, distance!))
    .reduce(multiply)
  
    console.log(total); // 211904
};

function doPart2(input: string) {
  const [time, distance] = input.split('\n').map(parseNumber);
  const winnerCount = quadratic(time!, distance!);
  console.log(winnerCount); // 43364472
};

// 'ol brute-force method.  Used this in place of the `quadratic` call
function findWinnerCount(time:number, distance: number) {
  let winnerCount = 0;
  for(const hold of generateRange(1, Math.ceil(time/2))) {
    if (hold * (time-hold) > distance)
      winnerCount+=2;
  }
  return winnerCount;
}

main();