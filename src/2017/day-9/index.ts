import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import {sum} from '../../util/arrayUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(9, 2017);
  const part1Expected = 9662;
  const part2Expected = 4903;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const scoreRow = (line:string):number[] => {
  let wasBang = false;
  const removeBangs = (char:string):boolean => {
    if(wasBang) {
      wasBang = false;
      return false;
    }
  
    if(char === '!'){
      wasBang = true;
      return false;
    }
    return true;
  };
  
  let inGarbage = false;
  let garbageCount = 0;
  const removeGarbage = (char:string):boolean => {
    if(inGarbage) {
      if (char === '>') {
        inGarbage = false;
      } else {
        garbageCount++;
      }
      return false;
    } else if (char === '<') {
      inGarbage = true;
      return false;
    }
    return true;
  };
  
  const removeCommas = (char:string):boolean => char !== ',';
  
  const scoreClean = (line:string):number => {
    let score = 0;
    const curlyStack:string[] = [];
    line.split('').forEach(char => {
      if(char === '{') {
        curlyStack.push(char);
      } else {
        score += curlyStack.length;
        curlyStack.pop();
      }
    });
    return score;
  }

  const cleanLine = line.split('')
    .filter(removeBangs)
    .filter(removeGarbage)
    .filter(removeCommas)
    .reduce((prev, cur) => prev + cur, '');

  return [scoreClean(cleanLine), garbageCount];
}

function doPart1(input: string) {
  const score = input.split('\n')
    .map(scoreRow)
    .map(scoreAndGarbage => scoreAndGarbage[0])
    .reduce(sum, 0);
  return score;
};

function doPart2(input: string) {
  const gCount = input.split('\n')
    .map(scoreRow)
    .map(scoreAndGarbage => scoreAndGarbage[1])
    .reduce(sum, 0);
  return gCount;
};

main();