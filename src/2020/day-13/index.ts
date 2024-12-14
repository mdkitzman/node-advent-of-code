import { getPuzzleInput } from '../../aocClient';
import { multiply } from '../../util/arrayUtils';
import { absoluteModulo } from '../../util/numberUtils';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(13, 2020);
  const part1Expected = 2995;
  const part2Expected = BigInt(1012171816131114);
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const lines = input.split('\n');
  const departureTime = parseInt(lines[0], 10);

  const waitTime = (busLine:number):number => busLine - (departureTime % busLine);

  const bestLine = lines[1]
    .split(',')
    .filter(line => line !== 'x')
    .map(line => parseInt(line, 10))
    .reduce((previous, current) => 
      waitTime(previous) < waitTime(current) ? previous : current
    ,Number.MAX_SAFE_INTEGER);
  
  const time = waitTime(bestLine);
  return time * bestLine;
};

// returns x where (a * x) % b == 1
// https://rosettacode.org/wiki/Modular_inverse
const getInverse = (a:number, mod:number):number => {
  const b = a % mod;
  for (let i = 1; i < mod; i++) {
    if ((b * i) % mod === 1) {
      return i;
    }
  }
  return 1;
};

// Chinese Remainder Theorem
const crt = (busLines:number[]):BigInt => {
  // x - a (mod n)
  // x - some unknown, constant value of t
  // a - bus number MINUS offset % bus number
  // n - cycle length (= bus number)

  // to solve each row, we also need
  // N - all n's added up
  // nU = N / n
  // i - inverse modulo
  const N = busLines.reduce(multiply, 1);

  const sum = busLines.reduce((acc, cur, idx) => {
    const a = absoluteModulo(cur - idx, cur);
    const nU = N / cur;
    const inverse = getInverse(nU, cur);
    return acc + BigInt(BigInt(a) * BigInt(nU) * BigInt(inverse));
  }, 0n);

  return sum % BigInt(N);
};

function doPart2(input: string) {
  const busLines = input.split('\n')[1]
    .split(',')
    .map(bus => bus === 'x' ? 1: parseInt(bus, 10));

  return crt(busLines);
};

main();