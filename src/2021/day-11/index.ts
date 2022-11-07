import fs  from 'fs';
import { Grid, neighborArray as adjacent } from '../../util/grid';
import { Point2D } from '../../util/point';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 1683
  doPart2(allInput); // 788
};

function doPart1(input: string) {
  const grid = new Grid<number>();
  
  input
    .split('\n')
      .forEach((line, y) => line
        .split('')
        .forEach((val, x) => grid.set(new Point2D(x,y), Number(val))));

  const numberOfFlashes = simulateFlashes(grid, 100);

  console.log(`There were ${numberOfFlashes} flashes`);
};

function doPart2(input: string) {
  const grid = new Grid<number>();
  
  input
    .split('\n')
      .forEach((line, y) => line
        .split('')
        .forEach((val, x) => grid.set(new Point2D(x,y), Number(val))));

  let iteration = 0;
  let flashCount = 0;
  do {
    iteration++;
    flashCount = simulateFlashes(grid, 1);
    if (flashCount === grid.data.size)
      break;
  } while (true);
  
  console.log(`It took ${iteration} iterations to synchronize`);
};

const neighborArray = adjacent.map(([x,y]) => new Point2D(x,y));

function simulateFlashes(grid: Grid<number>, steps: number):number {
  let flashCount = 0;
  for(let iStep = 0; iStep < steps; iStep++) {
    // increase all by 1
    grid.forEach((key, value) => grid.set(key, value+1));

    const seen: Point2D[] = [];
    let lastSeenCount = 0;
    do {
      lastSeenCount = seen.length;
      grid.forEach((key, value) => {
        if(value <= 9)
          return;
        if(seen.some(value => value.equals(key)))
          return;
        seen.push(key);
        // any > 9 flash
        flashCount++;
        // increase neighbors by 1
        neighborArray
          .map(p => new Point2D(key.x + p.x, key.y + p.y))
          .forEach(neighborKey => {
            const val = grid.get(neighborKey);
            if (val !== undefined)
              grid.set(neighborKey, val+1);           
          });
      });
    } while(lastSeenCount < seen.length)

    // set the flashers back to 0
    grid.forEach((key, value) => {
      if(value > 9)
        grid.set(key, 0);
    });

    //grid.print('low',String);
    //console.log('');
  }

  return flashCount;
}

main();