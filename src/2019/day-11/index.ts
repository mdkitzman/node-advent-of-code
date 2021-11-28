import fs  from 'fs';
import { sum } from '../../util/arrayUtils';
import { Point2D } from '../../util/point';
import { PainterRobot } from './painter-robot';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
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
  robot.grid.print((value) => value.color === 'white' ? '█' : ' ');
};

main();