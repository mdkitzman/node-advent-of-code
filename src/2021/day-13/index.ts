import fs  from 'fs';
import { InfiniteGrid } from '../../util/grid';
import { Point2D } from '../../util/point';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 814
  doPart2(allInput); // PZEHRAER
};

function doPart1(input: string) {
  const [grid, folds] = getGrid(input);

  doFold(grid, folds[0]);
  
  console.log(`There are ${grid.data.size} visible dots.`);
};

function doPart2(input: string) {
  const [grid, folds] = getGrid(input);

  folds.forEach(fold => doFold(grid, fold));

  grid.printBlocks(value => Boolean(value));
};

function doFold(grid: InfiniteGrid<boolean>, fold: Fold) {
  switch(fold.axis) {
    case 'x':
      grid.forEach((key, value) => {
        if (key.x < fold.value)
          return;
        const delta = key.x - fold.value;
        grid.delete(key);
        grid.set(new Point2D(fold.value - delta, key.y), value);
      });
      break;
    case 'y':
      grid.forEach((key, value) => {
        if (key.y < fold.value)
          return;
        const delta = key.y - fold.value;
        grid.delete(key);
        grid.set(new Point2D(key.x, fold.value - delta), value);
      });
      break;
  }
}

type Fold = {
  axis: string;
  value: number;
}

function getGrid(input:string): [InfiniteGrid<boolean>, Fold[]] {
  const grid = new InfiniteGrid<boolean>(false);

  const [pointLines, foldLines] = input.split('\n\n');
  pointLines
    .split('\n')
    .map(line => {
      const [x,y] = line.split(',').map(Number);
      return new Point2D(x,y);
    })
    .forEach(point => grid.set(point, true));
  const folds = foldLines
    .split('\n')
    .map(line => {
      const [left, right] = line.split('=');
      return { axis: left.slice(left.length-1), value: Number(right) };
    });
  return [grid, folds];
}

main();