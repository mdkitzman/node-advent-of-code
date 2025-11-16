import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(8, 2017);
  const part1Expected = 4832;
  const part2Expected = 5443;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const forContext = (context:{[k:string]:number}) => (code:string) => {
  return Function('context', `with (context) { return ${code} }`)(context);
};

type Instruction = {
  operation: string;
  condition: string;
}

const parseInput = (input:string): Instruction[] => {
  return input
    .split('\n')
    .map(line => {
      const [op, condition] = line.split(' if ');
      return { 
        condition,
        operation: op.replace(/inc/, "+=").replace(/dec/, "-=")
      };
    });
};

function doPart1(input: string) {
  const registers:{[k:string]:number} = {};

  const evaluator = forContext(registers);
  const instructions = parseInput(input);
  // initialze all registers
  new Set<string>(instructions.map(i => [i.condition.split(' ')[0], i.operation.split(' ')[0]]).flat())
    .forEach((value) => registers[value] = 0);
  
  instructions.forEach(({operation, condition}) => {
    if(evaluator(condition))
      evaluator(operation)
  })
  const [, value] = Object.entries(registers).reduce((prev, curr) => prev[1] >= curr[1] ? prev : curr)
  return value;
};

function doPart2(input: string) {
  const registers:{[k:string]:number} = {};

  const evaluator = forContext(registers);
  const instructions = parseInput(input);
  // initialze all registers
  new Set<string>(instructions.map(i => [i.condition.split(' ')[0], i.operation.split(' ')[0]]).flat())
    .forEach((value) => registers[value] = 0);
  
  let maxValue = -Number.MAX_SAFE_INTEGER;
  instructions.forEach(({operation, condition}) => {
    if(evaluator(condition))
      evaluator(operation)
    const [registerName, value] = Object.entries(registers).reduce((prev, curr) => prev[1] >= curr[1] ? prev : curr);
    maxValue = Math.max(maxValue, value);
  });

  return maxValue;
};

main();