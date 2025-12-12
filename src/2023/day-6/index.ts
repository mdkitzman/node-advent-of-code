import { multiply, zip } from "lodash-es";
import { getPuzzleInput } from "../../aocClient.ts";
import { generateRange, quadratic } from "../../util/numberUtils.ts";
import timeFn from "../../util/timeFn.ts";
import { parseAllNumbers, parseNumber } from "../../util/stringUtils.ts";

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(6, 2023);
  
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