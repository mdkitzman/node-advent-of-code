import fs  from 'fs';
import { sum } from '../../util/arrayUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
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