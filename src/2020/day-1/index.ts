import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(1, 2020);
  const part1Expected = 437931;
  const part2Expected = 157667328;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const numbers = input.split('\n').map(val => parseInt(val, 10));
  let mult:number|undefined;
  for(let i = 0; mult === undefined && i < numbers.length; i++){
    for(let j = 0; mult === undefined && j < numbers.length; j++) {
      if(numbers[i] + numbers[j] === 2020) {
        mult = numbers[i] * numbers[j];
      }
    }
  }
  return mult;
};

function doPart2(input: string) {
  const numbers = input.split('\n').map(val => parseInt(val, 10));
  let mult:number|undefined;
  for(let i = 0; mult === undefined && i < numbers.length; i++){
    for(let j = 0; mult === undefined && j < numbers.length; j++) {
      for(let k = 0; mult === undefined && k < numbers.length; k++) {
        if(numbers[i] + numbers[j] + numbers[k] === 2020) {
          mult = numbers[i] * numbers[j] * numbers[k];
        }
      }
    }
  }
  return mult;
};

main();