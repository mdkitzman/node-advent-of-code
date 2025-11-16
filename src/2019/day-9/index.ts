import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs  from 'fs';
import { IntComp, readProgram } from '../intcode-computer.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const main = async () => {
  const allInput = await getPuzzleInput(9, 2019);
  await doPart1(allInput); // 4234906522
  await doPart2(allInput); // 60962
};

async function doPart1(input: string) {
  const memory = readProgram(input);
  const computer = new IntComp();
  computer.on("needsInput", () => {
    computer.emit("input", 1);
  });
  computer.on("output", value => {
    console.log(value);
  });
  await computer.execute(memory);
};

async function doPart2(input: string) {
  const memory = readProgram(input);
  const computer = new IntComp();
  computer.on("needsInput", () => {
    computer.emit("input", 2);
  });
  computer.on("output", value => {
    console.log(value);
  });
  await computer.execute(memory);
};

main();