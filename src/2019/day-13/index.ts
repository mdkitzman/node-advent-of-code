import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Arcade, TileType } from './arcade.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { readProgram } from '../intcode-computer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  await doPart1(allInput); // 344
  await doPart2(allInput); // 17336
};

async function doPart1(input: string) {
  const arcade = new Arcade();
  const program = readProgram(input);
  await arcade.play(program);
  const blockTiles = arcade.tileset.filter(type => type === TileType.BLOCK).length;

  console.log(`There are ${blockTiles} block tiles`);
};

async function doPart2(input: string) {
  const arcade = new Arcade();
  const program = readProgram(input);
  program[0] = 2;
  await arcade.play(program);

  console.log(`The final score is ${arcade.score}`);
};

main();