import { getPuzzleInput } from '../../aocClient.ts';
import { sum } from '../../util/arrayUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(7, 2024);
  const part1Expected = 1153997401072;
  const part2Expected = 97902809384118;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

type Operand = (a:number, b:number)=>number;
const add: Operand = (a:number, b:number) => a + b;
const mul: Operand = (a:number, b:number) => a * b;
const concat: Operand = (a:number, b:number) => parseInt(`${a}${b}`, 10);

const solver = (operands: Operand[]) => {
  const solvable = (output: number, inputs: number[]): boolean => {
    if (inputs.length === 1) {
      return output === inputs[0];
    }
    if (inputs[0] > output)
      return false
    const [a, b, ...rest] = inputs;
    return operands.some(op => solvable(output, [op(a, b), ...rest]));
  };
  return solvable;
}

function doPart1(input: string) {
  const solvable = solver([add, mul]);

  return input.split("\n")
    .map(line => line.split(": "))
    .map(([left, right]) => ({
      output: parseInt(left, 10),
      inputs: right.split(" ").map(v => parseInt(v, 10))
    }))
    .filter(({output, inputs}) => solvable(output, inputs))
    .map(({output}) => output)
    .reduce(sum)
};

function doPart2(input: string) {
  const solvable = solver([add, mul, concat]);

  return input.split("\n")
    .map(line => line.split(": "))
    .map(([left, right]) => ({
      output: parseInt(left, 10),
      inputs: right.split(" ").map(v => parseInt(v, 10))
    }))
    .filter(({output, inputs}) => solvable(output, inputs))
    .map(({output}) => output)
    .reduce(sum)
};

main();