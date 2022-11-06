import { Grid } from '../../util/grid';
import { InfiniteGrid } from '../../util/infinite-grid';
import { Point2D } from '../../util/point';
import { leftpad } from '../../util/stringUtils';

const gridSize = 300;

const main = async () => {
  const allInput = '7803';

  doPart1(allInput); // 20,51
  doPart2(allInput); // 230,272,17
};

const computePowerLevel = (serial: number, x:number, y: number): number => {
  const rackId = x + 10;
  const val = ((rackId * y) + serial) * rackId;
  const [hudredsDigit] = leftpad(val.toString(10), 3).split('')
  return parseInt(hudredsDigit, 10) - 5;
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
  const grid = new Grid<number>();
  for(let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      grid.set(new Point2D(x,y), powerLevel(x,y));
    }
  }
  
  // use cumulative sums to find the largest 3x3 grid.
  const preSum = new InfiniteGrid<number>(0)
  for(let x = 0; x < gridSize; x++) {
    for(let y = 0; y < gridSize; y++) {
      const [
        thisPoint,
        right,
        below,
        diagonal
      ] = [[0,0], [1,0], [0,1], [1,1]].map(([x1,y1]) => new Point2D(x1 + x, y1 + y));
      
      const sum = grid.get(thisPoint)! + preSum.get(right) + preSum.get(below) - preSum.get(thisPoint);
      preSum.set(diagonal, sum);
    }
  }
  return preSum;
}

function doPart1(input: string) {
  const serialNumber = parseInt(input, 10);
  const preSum = getPreSumGrid(serialNumber, gridSize);
  const getSum = getAreaSum.bind(null, preSum);
  
  const windowSize = 3;
  let largest: [number, Point2D] = [-Number.MAX_VALUE, new Point2D(0,0)];
  for(let x = 0; x < gridSize - windowSize; x++) {
    for(let y = 0; y < gridSize - windowSize; y++) {
      const areaSum = getSum(x,y, windowSize);
      if(areaSum > largest[0]) {
        largest = [areaSum, new Point2D(x,y)];
      }
    }
  }
  const [bestArea,bestPoint] = largest;
  console.log(`The largest is at ${bestPoint.x},${bestPoint.y} with a total of ${bestArea}`);
};

function doPart2(input: string) {
  const serialNumber = parseInt(input, 10);
  const preSum = getPreSumGrid(serialNumber, gridSize);
  const getSum = getAreaSum.bind(null, preSum);
  
  let largest: [number, number, Point2D] = [-Number.MAX_VALUE, 0, new Point2D(0,0)];
  for(let windowSize = 1; windowSize < gridSize; windowSize++) {
    for(let x = 0; x < gridSize - windowSize; x++) {
      for(let y = 0; y < gridSize - windowSize; y++) {
        const areaSum = getSum(x,y, windowSize);
        if(areaSum > largest[0]) {
          largest = [areaSum, windowSize, new Point2D(x,y)];
        }
      }
    }
  }
  const [bestArea,bestWindow, bestPoint] = largest;
  console.log(`The largest is at ${bestPoint.x},${bestPoint.y} at window size ${bestWindow} with a total of ${bestArea}`);
};

main();