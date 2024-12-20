import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { InfiniteGrid, generateCoords } from '../../util/grid';
import { Point2D } from '../../util/point';

const gridSize = 300;

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(11, 2018);
  const part1Expected = "20,51";
  const part2Expected = "230,272,17";
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const computePowerLevel = (serial: number, x:number, y: number): number => {
  const rackId = x + 10;
  return ((((((rackId * y) + serial) * rackId) / 100) | 0) % 10) - 5;
}

const getAreaSum = (preSum: InfiniteGrid<number>, x: number, y: number, size: number): number => {
  const [
    thisPoint,
    right,
    below,
    diagonal
  ] = [[0,0], [size,0], [0,size], [size,size]].map(([x1,y1]) => new Point2D(x1 + x, y1 + y));
  
  return preSum.get(diagonal) - preSum.get(right) - preSum.get(below) + preSum.get(thisPoint);
};

const getPreSumGrid = (serialNumber: number, gridSize: number): InfiniteGrid<number> => {
  const powerLevel = computePowerLevel.bind(null, serialNumber);
  const grid = new InfiniteGrid<number>(0);
  for(const [x, y] of generateCoords(gridSize, gridSize)) {
    grid.set(new Point2D(x,y), powerLevel(x,y));
  }
  
  // use cumulative sums to find the largest 3x3 grid.
  const preSum = new InfiniteGrid<number>(0)
  for(const [x, y] of generateCoords(gridSize, gridSize)) {
    const [
      thisPoint,
      right,
      below,
      diagonal
    ] = [[0,0], [1,0], [0,1], [1,1]].map(([x1,y1]) => new Point2D(x1 + x, y1 + y));
    
    const sum = grid.get(thisPoint) + preSum.get(right) + preSum.get(below) - preSum.get(thisPoint);
    preSum.set(diagonal, sum);
  }
  return preSum;
}

function doPart1(input: string) {
  const serialNumber = parseInt(input, 10);
  const preSum = getPreSumGrid(serialNumber, gridSize);
  const getSum = getAreaSum.bind(null, preSum);
  
  const windowSize = 3;
  let largest: [number, Point2D] = [-Number.MAX_VALUE, new Point2D(0,0)];
  for(const [x, y] of generateCoords(gridSize - windowSize, gridSize - windowSize)) {
    const areaSum = getSum(x,y, windowSize);
    if(areaSum > largest[0]) {
      largest = [areaSum, new Point2D(x,y)];
    }
  }
  const [,bestPoint] = largest;

  return `${bestPoint.x},${bestPoint.y}`;
};

function doPart2(input: string) {
  const serialNumber = parseInt(input, 10);
  const preSum = getPreSumGrid(serialNumber, gridSize);
  const getSum = getAreaSum.bind(null, preSum);
  
  let largest: [number, number, Point2D] = [-Number.MAX_VALUE, 0, new Point2D(0,0)];
  for(let windowSize = 1; windowSize < gridSize; windowSize++) {
    for(const [x, y] of generateCoords(gridSize - windowSize, gridSize - windowSize)) {
      const areaSum = getSum(x,y, windowSize);
      if(areaSum > largest[0]) {
        largest = [areaSum, windowSize, new Point2D(x,y)];
      }
    }
  }
  const [,bestWindow, bestPoint] = largest;

  return `${bestPoint.x},${bestPoint.y},${bestWindow}`;
};

main();