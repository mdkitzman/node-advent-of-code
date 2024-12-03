import { getPuzzleInput } from '../../aocClient';
import { sum } from '../../util/arrayUtils';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(3, 2024);
  const part1Expected = 164_730_528;
  const part2Expected = 70_478_672;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const total = [...input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)]
    .map(([,a,b]) => parseInt(a, 10) * parseInt(b, 10))
    .reduce(sum)
  
  return total;
};

function doPart2(input: string) {
  const reg = /do\(\)|don\'t\(\)|mul\((\d{1,3}),(\d{1,3})\)/g;
  let doMath = true;
  let total = 0;
  let opCode;
  while ((opCode = reg.exec(input)) != null) {
    const [match, a, b] = opCode;
    switch(match) {
      case "do()":
        doMath = true;
        break;
      case "don't()":
        doMath = false;
        break;
      default:
        if(doMath) {
          total += parseInt(a, 10) * parseInt(b, 10);
        }
        break;
    }
  }
  return total;
};

main();