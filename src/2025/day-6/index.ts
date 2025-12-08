import { getRawPuzzleInput } from '../../aocClient.ts';
import { multiply, sum, transpose } from '../../util/arrayUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getRawPuzzleInput(6, 2025);
  const part1Expected = 6172481852142;
  const part2Expected = 10188206723429;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const [operators, ...values] = input.trimEnd().split('\n')
    .map(line => line.trim())
    .map(line => line.split(/\s+/))
    .reverse();
  const numbers = transpose(values.map(vals => vals.map(Number)));
  
  const total = operators.map((op, i) => {
    switch (op) {
      case '*': return numbers[i].reduce(multiply, 1);
      case '+': return numbers[i].reduce(sum, 0);
      default: throw new Error(`Unknown operator: ${op}`);
    }
  })
  .reduce(sum, 0)

  return total;
};

function doPart2(input: string) {
  // separate the last line of operators from the rest of the input
  // there is an extra newline at the end of the input
  const [operators, ...values] = input.trimEnd().split('\n').reverse();
  const ops = operators.trim().split(/\s+/);
  
  const allCharacters: string[][] = values.reverse().map(line => line.split(''))
  const transposed = transpose(allCharacters)
    .map(row => row.join(''))        // join each row (which used to be a column) into a string, trim whitespace
    .join('\n');                     // join all rows with newlines, then split on double newlines to get original rows

  const total = transposed.split(/\n\s+\n/)
    .map(line => line.split('\n'))                    // split each row back into lines
    .map(line => line.map(val => parseInt(val, 10)))  // parse each value as a number (ignoring non-numeric values)
    .map((line, i) => {
      switch (ops[i]) {
        case '*': return line.reduce(multiply, 1);
        case '+': return line.reduce(sum, 0);
        default: throw new Error(`Unknown operator: ${ops[i]}`);
      }
    })
    .reduce(sum, 0);
  return total;
};

main();