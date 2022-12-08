import fs  from 'fs';
import { Grid } from '../../util/grid';
import { Point2D } from '../../util/point';
import Iter from 'es-iter';
import { anyTrue, max, multiply } from '../../util/arrayUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  const grid = new Grid<number>();
  
  allInput
    .split('\n')
    .map((line, y) => 
      line
        .split('')
        .map(v => parseInt(v, 10))
        .forEach((height, x) => grid.set(new Point2D(x,y), height))
    );
  doPart1(grid); // 1796
  doPart2(grid); // 288120
};

const cardinalTreeHeights = (grid: Grid<number>): (point: Point2D)=>number[][] => {
  const getTreeHeight = (p: Point2D) => grid.get(p)!;
  const { width, height } = grid.dimensions;
  return (point: Point2D) => {
    const east  = Iter.rangeRight(0, point.x).toArray().map(v => new Point2D(v, point.y)).map(getTreeHeight);
    const west  = Iter.range(point.x+1, width).toArray().map(v => new Point2D(v, point.y)).map(getTreeHeight);
    const north = Iter.rangeRight(0, point.y).toArray().map(v => new Point2D(point.x, v)).map(getTreeHeight);
    const south = Iter.range(point.y+1, height).toArray().map(v => new Point2D(point.x, v)).map(getTreeHeight);

    return [east, west, north, south];
  };
}

function doPart1(grid: Grid<number>) {
  const { width, height } = grid.dimensions;
  const directionalHeights = cardinalTreeHeights(grid);
  const isVisible = (point: Point2D, treeHeight: number): boolean => {
    if (point.x === 0 || point.x === width -1 || point.y === 0 || point.y === height-1)
      return true;
    
    const isShorter = (h: number) => h < treeHeight;

    return directionalHeights(point)
      .map(arr => arr.every(isShorter))
      .reduce(anyTrue);
  };
  const visibleCount = grid
    .iterable()
    .filter(([point, height]) => isVisible(point, height))
    .length;
  console.log(visibleCount);
};

function doPart2(grid: Grid<number>) {
  const { width, height } = grid.dimensions;
  const directionalHeights = cardinalTreeHeights(grid);
  const visibilityScore = (point: Point2D, treeHeight: number): number => {
    if (point.x === 0 || point.x === width -1 || point.y === 0 || point.y === height-1)
      return 0;
    
    const sameOrTaller = (h:number, i: number, arr: number[]) => h >= treeHeight || i === arr.length-1;

    return directionalHeights(point)
      .map(arr => arr.findIndex(sameOrTaller))
      .map(v => v+1)
      .reduce(multiply);
  };
  const bestVisible = grid
    .iterable()
    .map(([point, height]) => visibilityScore(point, height))
    .reduce(max);
  console.log(bestVisible);
};

main();