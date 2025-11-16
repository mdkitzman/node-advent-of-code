import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import { sum } from '../../util/arrayUtils.ts';
import { leftpad } from '../../util/stringUtils.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(14, 2020);
  const part1Expected = 9967721333886;
  const part2Expected = null;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  let mask:string[] = [];
  let memory:{[k:number]:number} = {};
  const memInstRegex = /mem\[(\d+)\] = (\d+)/;

  input.split('\n')
    .forEach(instruction => {
      if(instruction.startsWith('mask')) {
        mask = instruction.split(' = ')[1].split('');
      } else {
        const [_, memIndexStr, valueStr] = memInstRegex.exec(instruction) || [];
        const memIndex = parseInt(memIndexStr, 10);
        const value = parseInt(valueStr, 10);
        const strValueBin = leftpad(value.toString(2), 36)
          .split('')
          .map((iVal, index) => mask[index] === 'X' ? iVal : mask[index])
          .join('');
        memory[memIndex] = parseInt(strValueBin, 2);
      }
    });
  
  const total = Object.values(memory).reduce(sum, 0);

  return total;
};

function doPart2(input: string) {
  let mask:string[] = [];
  let memory:{[k:number]:number} = {};
  const memInstRegex = /mem\[(\d+)\] = (\d+)/;

  input.split('\n')
    .forEach(instruction => {
      if(instruction.startsWith('mask')) {
        mask = instruction.split(' = ')[1].split('');
      } else {
        const [_, memIndexStr, addrStr] = memInstRegex.exec(instruction) || [];
        const memIndex = parseInt(memIndexStr, 10);
        
        const strValueBin = leftpad(memIndex.toString(2), 36)
          .split('')
          .map((iVal, index) => {
            switch (mask[index]) {
              case '0': return iVal;
              default: return mask[index];
            }
          })
          .join('');
        
        const addr = parseInt(addrStr, 10);
        memory[memIndex] = parseInt(strValueBin, 2);
      }
    });
  
  const total = Object.values(memory).reduce(sum, 0);

  return total;
};

main();