import fs, { link }  from 'fs';
import { chunk } from '../../util/arrayUtils';
import { Device } from './device';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 13440
  doPart2(allInput); // PBZGRAZA
};

function doPart1(input: string) {
  const device = new Device(input);
  let sum = 0;
  const tickPoints = [20, 60, 100, 140, 180, 220];
  device.on('tick', (tick:number, x: number) => {
    if (tickPoints.includes(tick)) {
      sum += (x * tick);
    }
  });
  device.execute();
  console.log(sum);
};

function doPart2(input: string) {
  const screen:string[][] = chunk(new Array(240).fill(' '), 40);
  const device = new Device(input);
  device.on('tick', (tick:number, x: number) => {
    // tick starts at 1, not 0
    const offset = Math.floor((tick-1)/40);
    const index = (tick-1) % 40;
    screen[offset][index] = [x-1,x,x+1].includes(index) ? '█':' ';
  });
  device.execute();
  screen
    .map(line => line.join(''))
    .forEach(line => console.log(line));
};

main();