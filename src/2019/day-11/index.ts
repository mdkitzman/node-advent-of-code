import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs  from 'fs';
import { sum } from '../../util/arrayUtils.ts';
import { PainterRobot } from './painter-robot.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const main = async () => {
  const allInput = await getPuzzleInput(11, 2019);
  await doPart1(allInput); // 2021
  await doPart2(allInput); // LBJHEKLH
};

async function doPart1(input: string) {
  const robot = new PainterRobot('black');
  await robot.run(input);
  const paintedSpots = Array.from(robot.grid.data.values()).map(v => Number(v.painted)).reduce(sum);
  console.log(`Painted ${paintedSpots} spots`);
};

async function doPart2(input: string) {
  const robot = new PainterRobot('white');
  await robot.run(input);
  console.log(robot.grid.printBlocks((value) => value?.color === 'white', 'low'));
};

main();