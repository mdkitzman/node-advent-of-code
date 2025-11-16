import { sum } from '../../util/arrayUtils.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const main = async () => {
  const allInput = await getPuzzleInput(1, 2022);
  doPart1(allInput); // 70509
  doPart2(allInput); // 208567
};

function doPart1(input: string) {
  const mostCalories = Math.max(
    ...input
    .split('\n\n')
    .flatMap(lines => lines.split('\n').map(line => parseInt(line, 10)).reduce(sum))
  );

  console.log(mostCalories);
};

function doPart2(input: string) {
  const [a,b,c] = input
    .split('\n\n')
    .flatMap(lines => lines.split('\n').map(line => parseInt(line, 10)).reduce(sum))
    .sort((a, b) => b-a)
  ;
  console.log(`${a+b+c}`);
};

main();