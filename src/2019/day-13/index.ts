import fs  from 'fs';
import { Arcade, TileType } from './arcade';
import { readProgram } from '../intcode-computer';

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