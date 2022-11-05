import fs  from 'fs';
import { max, min, sum } from '../../util/arrayUtils';
import { Point2D } from '../../util/point';
import lodash from 'lodash';
import { InfiniteGrid } from '../../util/infinite-grid';
import Iter from 'es-iter';

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 3660
  doPart2(allInput, 10_000); // 35928
};

type LabeldPoint = {
  label: string;
  point: Point2D;
}

function doPart1(input: string) {
  const points = input
    .split('\n')
    .map(line => line.split(', ').map(val => parseInt(val, 10)))
    .map(([x, y], i) => ({label: letters[i], point: new Point2D(x,y)} as LabeldPoint));
    
  const left =   points.map(p => p.point.x).reduce(min);
  const right =  points.map(p => p.point.x).reduce(max);
  const top =    points.map(p => p.point.y).reduce(min);
  const bottom = points.map(p => p.point.y).reduce(max);

  const grid = new InfiniteGrid<string>(' ');
  points.forEach(p => grid.set(p.point, p.label));
  for(let x = left; x < right; x++) {
    for(let y = top; y < bottom; y++) {
      const point = new Point2D(x, y);
      if (points.some(p => p.point.equals(point)))
        continue;
      
      // group by the distances from this point to the input points
      const grouped = lodash.groupBy(
        points,
        p => point.manhattenDistance(p.point)
      );
      // find the smallest distance
      const minDist = Object
        .keys(grouped)
        .map(key => parseInt(key, 10))
        .reduce(min);
      const minPoints = grouped[minDist];
      // We map to more than one point, so does not count
      if (minPoints.length > 1)
        continue;
      // single point we have a minimum distance to
      const [minPoint] = minPoints;
      // set this point's value to the point's label we have a minimum distance with
      grid.set(point, minPoint.label);
    }
  }
  const xRange = Iter.range(left, right).toArray() as number[];
  const yRange = Iter.range(top, bottom).toArray() as number[];
  const edgePoints = [
    ...xRange.map(x => new Point2D(x, top)),
    ...xRange.map(x => new Point2D(x, bottom)),
    ...yRange.map(y => new Point2D(left, y)),
    ...yRange.map(y => new Point2D(right, y)),
  ];
  const labelsOnTheEdge = new Set(
    edgePoints.map(point => grid.get(point)).filter(label => label != ' ')
  );
  const interiorLabels = points.map(p => p.label).filter(label => !labelsOnTheEdge.has(label));

  const groupCount = Object.fromEntries(interiorLabels.map(label => [label, 0]));
  grid.forEach((_, label) => groupCount[label]++);
  const largest = Object
    .values(groupCount)
    .filter(count => lodash.isFinite(count))
    .reduce(max);
  
  console.log(`Largest area is ${largest}`); 
};

function doPart2(input: string, maxDistanceSum: number) {
  const points = input
    .split('\n')
    .map(line => line.split(', ').map(val => parseInt(val, 10)))
    .map(([x, y], i) => ({label: letters[i], point: new Point2D(x,y)} as LabeldPoint));
    
  const left =   points.map(p => p.point.x).reduce(min);
  const right =  points.map(p => p.point.x).reduce(max);
  const top =    points.map(p => p.point.y).reduce(min);
  const bottom = points.map(p => p.point.y).reduce(max);

  const grid = new InfiniteGrid<boolean>(false);
  
  for(let x = left; x < right; x++) {
    for(let y = top; y < bottom; y++) {
      const point = new Point2D(x, y);
      const distanceSums = points
        .map(p => point.manhattenDistance(p.point))
        .reduce(sum);
      
      if(distanceSums >= maxDistanceSum)
        continue;

      grid.set(point, true)
    }
  }
  const regionSize = grid.data.size
  console.log(`Largest area is ${regionSize}`); 
};

main();