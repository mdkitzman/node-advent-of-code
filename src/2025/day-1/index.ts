import { getPuzzleInput } from '../../aocClient.ts';
import { absoluteModulo } from '../../util/numberUtils.ts';

const main = async () => {
  const allInput = await getPuzzleInput(1, 2025);
  const part1Expected = 1123;
  const part2Expected = 6695;

  const [landedOnZero, passedZeroCount] = solve(allInput);
  
  const part1 = landedOnZero;
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = passedZeroCount;
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const mapToRotationValue = (line: string): number => {
  const amount = parseInt(line.slice(1), 10);
  const direction = line[0];
  // if it starts with R, it's a positive rotation, otherwise negative
  const value = direction === 'R' ? Number(amount) : -Number(amount);
  return value;
}

function solve(input: string) {
  let passedZeroCount = 0;
  let landedOnZero = 0;
  let currentPosition = 50;

  input.split('\n')
    .map(mapToRotationValue)
    .forEach(rotationAmount => {
      for (let step = 0; step < Math.abs(rotationAmount); step++) {
        currentPosition = absoluteModulo(
          currentPosition + (rotationAmount > 0 ? 1 : -1),
          100
        );
        if (currentPosition === 0) {
          passedZeroCount += 1;
        }
      }
      if (currentPosition === 0) {
        landedOnZero += 1;
      }
    });
    return [landedOnZero, passedZeroCount ];
}

main();