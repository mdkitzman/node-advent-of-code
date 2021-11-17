import fs  from 'fs';
import { IntComp } from '../intcode-computer';

const main = async () => {
  const allInput = await fs.promises.readFile('./src/2019/day-5/input', { encoding: 'utf-8'});
  await doPart1(allInput); // input value 1 => 7259358
  await doPart2(allInput); // input value 5 => 11826654
};

async function doPart1(input: string) {
  const memory:number[] = input.split(',').map(val => parseInt(val, 10));
  const computer = new IntComp();
  const finalValue = await computer.execute(memory);
  console.log(`Computation final value is ${finalValue}`);
};

async function doPart2(input: string) {
  const memory:number[] = input.split(',').map(val => parseInt(val, 10));
  const computer = new IntComp('expanded');
  const finalValue = await computer.execute(memory);
  console.log(`Computation final value is ${finalValue}`);
};

main();