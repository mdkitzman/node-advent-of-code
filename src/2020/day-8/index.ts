import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { cloneDeep } from 'lodash';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(8, 2020);
  const part1Expected = 1137;
  const part2Expected = 1125;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

type instruction = [string, number, number];
enum ExitCode { OK, LOOP };

const execute = (instructions:instruction[]):[ExitCode, number] => {
  const seen = new Set();
  const seenKey = (instruction:instruction):string => `${instruction[2]} - ${instruction[0]}:${instruction[1]}`;
  let iInstruction = 0;
  let accumulator = 0;

  do {
    const instruction = instructions[iInstruction % instructions.length];
    if (seen.has(seenKey(instruction))){
      return [ExitCode.LOOP, accumulator];
    }

    seen.add(seenKey(instruction));
    switch(instruction[0]) {
      case 'acc':
        accumulator += instruction[1];
        iInstruction++;
        break;
      case 'jmp':
        iInstruction += instruction[1];
        break;
      case 'nop':
      default:
        iInstruction++;
        break;
    }
    if(iInstruction === instructions.length)
      return [ExitCode.OK, accumulator];

  } while(true);
}

function doPart1(input: string) {
  const instructions:instruction[] = input.split('\n').map(line => line.split(' ')).map(([opp, num], index) => [opp, parseInt(num, 10), index]);
  const [_, accumulator] = execute(instructions);
  return accumulator;
};

function doPart2(input: string) {
  const instructions:instruction[] = input.split('\n').map(line => line.split(' ')).map(([opp, num], index) => [opp, parseInt(num, 10), index]);
  const numInstructions = instructions.length;

  let accumulator:number = 0;
  for(let iInstruction = 0; iInstruction < numInstructions; iInstruction++) {
    if(instructions[iInstruction][0] === 'acc')
      continue;
    const copy = cloneDeep(instructions);
    copy[iInstruction][0] = copy[iInstruction][0] === 'jmp' ? 'nop' : 'jmp';
    let [exit, acc] = execute(copy);
    if(exit === ExitCode.OK){
      accumulator = acc;
      break;
    }
  }
  return accumulator;
};

main();