import fs  from 'fs';
import { chunk } from '../../util/arrayUtils';
import { InfiniteGrid } from '../../util/grid';
import { Point2D } from '../../util/point';

const main = async () => {
  const allInput = await fs.promises.readFile('./src/2019/day-8/input', { encoding: 'utf-8'});
  doPart1(allInput, 25, 6); // 1950
  doPart2(allInput, 25, 6); // FKAHL
};

function doPart1(input: string, x: number, y: number) {

  const layers:number[][] = chunk(input.split('').map(ch => parseInt(ch, 10)), x * y)

  const layer = layers
    .map((pix:number[], index: number) => ({pix, index }))
    .sort((a, b) => {
      return b.pix.filter(v => v === 0).length - a.pix.filter(v => v === 0).length;
    })
    .pop()!.index;

  const mult = layers[layer].filter(v => v === 1).length * layers[layer].filter(v => v === 2).length

  console.log(`Found layer ${mult}`);
};

function doPart2(input: string, x: number, y: number) {
  const layers:number[][] = chunk(input.split('').map(ch => parseInt(ch, 10)), x * y);
  const result = new InfiniteGrid<number>(0);
  for(let iPixel = 0; iPixel < layers[0].length; iPixel++) {
    let pixel = -1;
    let iLayer = 0;
    do {
      pixel = layers[iLayer++][iPixel];
    } while (pixel == 2 && iLayer < layers.length);
    const point = new Point2D(iPixel % x, y - 1 - Math.floor(iPixel / x));
    result.set(point, pixel);
  }
  result.printBlocks((pixel) => pixel === 1, 'low');
};

main();