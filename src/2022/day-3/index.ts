import fs  from 'fs';
import { sum, chunk } from '../../util/arrayUtils';

const letterValue: Record<string, number> = Object.fromEntries('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ltr, i) => [ltr, i+1]));

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 7716
  doPart2(allInput); // 2973
};

const findCommon = (strings: string[]): number => {
  const [first, ...rest] = strings;
  for(const ltr of first) {
    const found = rest.map(str => str.indexOf(ltr)).every(idx => idx >= 0);
    if(found) {
      return letterValue[ltr];
    }
  }
  return 0;
}

function doPart1(input: string) {
  const total = input
    .split('\n')
    .map(line => {
      const middle = line.length / 2;
      return [line.substring(0, middle), line.substring(middle, line.length)];
    })
    .map(findCommon)
    .reduce(sum);
  console.log(total);
};

function doPart2(input: string) {
  const lines = input.split('\n');
  const groups = chunk(lines, 3);

  const total = groups
    .map(findCommon)
    .reduce(sum);
  console.log(total);
};

main();