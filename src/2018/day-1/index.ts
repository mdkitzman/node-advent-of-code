import fs  from 'fs';
import { sum, infiniteLoop } from '../../util/arrayUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 479
  doPart2(allInput); // 66105
};

function doPart1(input: string) {
  const total = input
    .split('\n')
    .map(val => parseInt(val, 10))
    .reduce(sum, 0);
  console.log(`Resulting frequency: ${total}`);
};

function doPart2(input: string) {
  const numbers = input.split('\n').map(val => parseInt(val, 10));
  const seen = new Set<number>();
  let frequency = 0;
  for (const val of infiniteLoop(numbers)) {
    frequency += val;
    if (seen.has(frequency))
      break;
    seen.add(frequency);
  }
  console.log(`Final frequency after repeat is: ${frequency}`);
};

main();