import { getPuzzleInput } from '../../aocClient.ts';
import { absoluteModulo } from '../../util/numberUtils.ts';

const main = async () => {
  const allInput = await getPuzzleInput(1, 2025);
  const part1Expected = 1123;
  const part2Expected = null;

  const [landedOnZero, passedZeroCount] = solve(allInput);
  
  const part1 = landedOnZero;
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = passedZeroCount;
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const mapToRotationValue = (line: string): number => {
  const [,op, val] = line.match(/(R|L)(\d+)/) || [];
  const value = op === 'R' ? Number(val) : -Number(val);
  return value;
}

function solve(input: string) {
  let passedZeroCount = 0;
  let landedOnZero = 0;
  input.split('\n')
    .map(mapToRotationValue)
    .reduce((acc, curr) => {
      passedZeroCount += Math.floor((acc + Math.abs(curr)) / 100);
      const next = absoluteModulo(acc + curr, 100);
      if (next === 0) landedOnZero++;
      return next;
    }, 50);
    return [landedOnZero, passedZeroCount ];
}

main();