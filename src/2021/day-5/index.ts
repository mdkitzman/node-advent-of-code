import fs  from 'fs';
import { range, zip } from 'lodash';
import { InfiniteGrid } from '../../util/infinite-grid';
import { Point2D } from '../../util/point';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 6548
  doPart2(allInput); // 19663
};

function doPart1(input: string) {
  const points = getAllPoints(input, false);
  
  const grid = new InfiniteGrid<number>(0);
  points.forEach(point => {
    const value:number = grid.get(point);
    grid.set(point, value+1);
  });
  
  const numDangerousPoints = Array.from(grid.data.values()).filter((num:number) => num >= 2).length;

  console.log(`There are ${numDangerousPoints} dangerous points`)
};

function doPart2(input: string) {
  const points = getAllPoints(input, true);

  const grid = new InfiniteGrid<number>(0);
  points.forEach(point => {
    const value:number = grid.get(point);
    grid.set(point, value+1);
  });
  
  const numDangerousPoints = Array.from(grid.data.values()).filter((num:number) => num >= 2).length;

  console.log(`There are ${numDangerousPoints} dangerous points`)
};

function getAllPoints(input: string, includeDiag: boolean): Point2D[] {
  return input.split('\n')
  .map(line => line.split(' -> '))
  .map(points => points
    .map(pair => pair.split(',').map(v => parseInt(v, 10)))
    .map(([x, y]) => new Point2D(x,y))
  )
  .map(([from, to]) => pointsBetween(from, to, includeDiag))
  .flat();
}

function pointsBetween(pointA: Point2D, pointB: Point2D, includeDiag: boolean = false): Point2D[] {
  const isDiag = (pointA.x !== pointB.x) && (pointA.y !== pointB.y);
  
  if (isDiag && !includeDiag)
    return [];
  
  const xRange = pointA.x === pointB.x
    ? new Array(Math.abs(pointA.y - pointB.y)).fill(pointA.x)
    : range(pointA.x, pointB.x);
  const yRange = pointA.y === pointB.y
    ? new Array(Math.abs(pointA.x - pointB.x)).fill(pointA.y)
    : range(pointA.y, pointB.y);
    
  return [
    ...zip(xRange, yRange).map(([x,y]) => new Point2D(x!,y!)),
    pointB    
  ];
}

main();