import fs  from 'fs';
import { sum } from '../../util/arrayUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput);
  doPart2(allInput);
};

function doPart1(input: string) {
  const vals = input.split(',').map(val => parseInt(val, 10));
  let bestFuel = Infinity;
  for(let i = 0; i < vals.length; i++) {
    bestFuel = Math.min(sumDeltas(vals, vals[i]), bestFuel);
  }
  
  console.log(`Lowest fuel consumption is ${bestFuel}`);
};

function doPart2(input: string) {
  const vals = input.split(',').map(val => parseInt(val, 10));
  let bestFuel = Infinity;
  const [min, max] = [Math.min(...vals), Math.max(...vals)];
  for(let i = min; i < max; i++) {
    bestFuel = Math.min(triangularSumDeltas(vals, i), bestFuel);
  }
  
  console.log(`Lowest fuel consumption is ${bestFuel}`);
};

function sumDeltas(numbers: number[], center: number): number {
  return numbers.map(val => Math.abs(val - center)).reduce(sum);
}

function triangularSumDeltas(numbers: number[], center: number): number {
  return numbers.map(val => {
    const delta = Math.abs(val - center);
    return (delta * (delta + 1)) / 2;
  })
  .reduce(sum);
}

main();