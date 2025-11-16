import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import crypto from 'crypto';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(6, 2017);
  const part1Expected = 11137;
  const part2Expected = 1037;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const hash = (input:number[]):string => crypto.createHash('sha256').update(Buffer.from(input)).digest('hex');

const maxPos = (input:number[]):[number, number] => {
  const max = Math.max(...input);
  const index = input.findIndex(val => val === max);
  return [index, max];
}

const redistribute = (input:number[]) => {
  const [iMaxVal, value] = maxPos(input);
  input[iMaxVal] = 0;
  for(
    let iDist = 0, iPos = (iMaxVal+1) % input.length;
    iDist < value;
    iDist++, iPos = (iPos + 1) % input.length
  ) {
    input[iPos] = input[iPos] + 1;
  }
};

function doPart1(data: string) {
  const input = data.split(/\s/).map(d => parseInt(d, 10));
  const seen = new Set();
  seen.add(hash(input));

  while (true) {
    redistribute(input);
    const stateHash = hash(input);
    if(seen.has(stateHash))
      break;
    seen.add(stateHash);
  } 
  return seen.size;
};

function doPart2(data: string) {
  const input = data.split(/\s/).map(d => parseInt(d, 10));
  let repeatIndex = -1;
  const seen:string[] = []
  seen.push(hash(input));

  while (true) {
    redistribute(input);
    const stateHash = hash(input);
    if((repeatIndex = seen.findIndex(hash => hash === stateHash)) !== -1 )
      break;
    seen.push(stateHash);
  } 
  const cycleLength = seen.length - repeatIndex;
  return cycleLength;
};

main();