import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Point2D } from '../../util/point.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 1654760
  doPart2(allInput); // 1956047400
};

function doPart1(input: string) {
  const point = new Point2D(0,0);
  input.split('\n')
    .forEach(line => {
      const [dir, valStr] = line.split(' ');
      const val = parseInt(valStr);
      switch (dir) {
        case "forward":
          point.x += val;
          break;
        case "down":
          point.y += val;
          break;
        case "up":
          point.y -= val;
          break;
      }
    });
    console.log(`Ended up at point ${point.x}, ${point.y} with multipled values of ${point.x * point.y}`);
};

function doPart2(input: string) {
  const point = new Point2D(0,0);
  let aim = 0;
  input.split('\n')
    .forEach(line => {
      const [dir, valStr] = line.split(' ');
      const val = parseInt(valStr);
      switch (dir) {
        case "forward":
          point.y += val * aim;
          point.x += val;
          break;
        case "down":
          aim += val;
          break;
        case "up":
          aim -= val;
          break;
      }
    });
    console.log(`Ended up at point ${point.x}, ${point.y} with multipled values of ${point.x * point.y}`);
};

main();