import fs  from 'fs';
import { IntComp, readProgram } from '../intcode-computer';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  await doPart1(allInput); // 4234906522
  await doPart2(allInput); // 60962
};

async function doPart1(input: string) {
  const memory = readProgram(input);
  const computer = new IntComp('expanded');
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
  const computer = new IntComp('expanded');
  computer.on("needsInput", () => {
    computer.emit("input", 2);
  });
  computer.on("output", value => {
    console.log(value);
  });
  await computer.execute(memory);
};

main();