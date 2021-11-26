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
  const points = Array
    .from(robot.grid.data.keys())
    .map(str => {
      const [x, y] = str.split(',').map(v => parseInt(v, 10));
      return new Point2D(x,y);
    });
  const left   = points.map(p => p.x).reduce((x1, x2) => x1 <= x2 ? x1 : x2);
  const top    = points.map(p => p.y).reduce((y1, y2) => y1 >= y2 ? y1 : y2);
  const right  = points.map(p => p.x).reduce((x1, x2) => x1 >= x2 ? x1 : x2);
  const bottom = points.map(p => p.y).reduce((y1, y2) => y1 <= y2 ? y1 : y2);
  
  for (let y = top; y >= bottom; y--) {
    let row = '';
    for (let x = left; x <= right; x++) {
      const value = robot.grid.data.get(`${x},${y}`);
      row += value?.color === 'white' ? '█' : ' ';
    }
    console.log(row);
    row = '';
  }
};

main();