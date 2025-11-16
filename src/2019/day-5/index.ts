import fs  from 'fs';
import { IntComp } from '../intcode-computer.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const main = async () => {
  const allInput = await getPuzzleInput(5, 2019);
  await doPart1(allInput); // input value 1 => 7259358
  await doPart2(allInput); // input value 5 => 11826654
};

async function doPart1(input: string) {
  const memory:number[] = input.split(',').map(val => parseInt(val, 10));
  const computer = new IntComp();
  computer.on("needsInput", () => {
    computer.emit("input", 1);
  });
  let finalValue = 0;
  computer.on("output", (value: number) => {
    finalValue = value;
  });
  await computer.execute(memory);
  console.log(`Computation final value is ${finalValue}`);
};

async function doPart2(input: string) {
  const memory:number[] = input.split(',').map(val => parseInt(val, 10));
  const computer = new IntComp();
  computer.on("needsInput", () => {
    computer.emit("input", 5);
  });
  let finalValue = 0;
  computer.on("output", (value: number) => {
    finalValue = value;
  });
  await computer.execute(memory);
  console.log(`Computation final value is ${finalValue}`);
};

main();