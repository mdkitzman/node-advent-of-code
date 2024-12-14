import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { anyTrue, sum } from '../../util/arrayUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(9, 2020);
  const part1Expected = 3199139634;
  const part2Expected = 438559930;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const hasSum = (haystack:number[], needle:number):boolean => 
  haystack.map(num => haystack.indexOf(needle - num) > -1).reduce(anyTrue, false);

const invalidNum = (numbers:number[], preamble:number):[number, number] => {
  let iNeedle = preamble;
  
  while(true) {
    const haystack = numbers.slice(iNeedle - preamble, iNeedle);
    if(!hasSum(haystack, numbers[iNeedle]))
      break;
    iNeedle++;
  }
  return [iNeedle, numbers[iNeedle]];
}

function doPart1(input: string) {
  const numbers = input.split('\n').map(num => parseInt(num, 10));
  const [iNeedle] = invalidNum(numbers, 25);
  return numbers[iNeedle];
};

function doPart2(input: string) {
  const numbers = input.split('\n').map(num => parseInt(num, 10));
  const [iNeedle, invalidValue] = invalidNum(numbers, 25);

  const considerations = numbers.splice(0, iNeedle);
  let sumRange:number|undefined;
  for(let windowSize = 2; sumRange == undefined && windowSize < considerations.length; windowSize++) {
    for(let iWindow = 0; sumRange == undefined && iWindow + windowSize < considerations.length; iWindow++) {
      const window = considerations.slice(iWindow, iWindow +windowSize);
      const total = window.reduce(sum, 0);
      if(total === invalidValue) {
        sumRange = Math.min(...window) + Math.max(...window);
      }
    }
  }
  return sumRange;
};

main();