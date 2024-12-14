import { groupBy } from 'lodash';
import { getPuzzleInput } from '../../aocClient';
import { neighborArray, Point2D } from '../../util/point';
import timeFn from '../../util/timeFn';
import { multiply } from '../../util/arrayUtils';
import { absoluteModulo } from '../../util/numberUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(14, 2024);
  const part1Expected = 232589280;
  const part2Expected = 7569;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const positionReg = /p=([\d\-]+),([\d\-]+) v=([\d\-]+),([\d\-]+)/
type GridSize = {
  width: number;
  height: number;
};
const movePointInGrid = (steps: number, gridSize: GridSize) => ([pStart, pVel]: Point2D[]) => {
  const endX = absoluteModulo((pVel.x * (steps) + pStart.x), gridSize.width);
  const endY = absoluteModulo((pVel.y * (steps) + pStart.y), gridSize.height);
  return new Point2D(endX, endY);
}

const gridSize = {
  width:  101,
  height: 103,
};

function doPart1(input: string) {
  const midX = Math.floor(gridSize.width/2);
  const midY = Math.floor(gridSize.height/2);
  
  const quadrantArray = input.split("\n")
    .map(line => positionReg.exec(line) || [])
    .map(([,px, py, vx, vy]) => [Point2D.fromString(`${px},${py}`), Point2D.fromString(`${vx},${vy}`)])
    .map(movePointInGrid(100, gridSize))
    // filter out points on the mid-lines
    .filter(({x,y}) => x !== midX && y !== midY)
    // map the point to the quadrant it's in
    .map(({x, y}) => {
      switch (true) {
        case x < midX && y < midY:
          return 1;
        case x < midX && y > midY:
          return 2;
        case x > midX && y < midY:
          return 3;
        case x > midX && y > midY:
          return 4;
      }
    });
  const result = Object.values(groupBy(quadrantArray)).map(arr => arr.length).reduce(multiply)
  return result;
};

const mightBeTree = (points: Set<string>) => {
  let hasNeighborCount = 0;
  for (const p of points.values()) {
    if (neighborArray
      .map(([x,y]) => new Point2D(x,y))
      .map(n => n.toAdded(Point2D.fromString(p)))
      .some(n => points.has(n.toString()))
    ) {
      hasNeighborCount++;
    }
  }
  // arbitrary threshold of 75% of points have a neighboring point
  return (hasNeighborCount/points.size) > .75;
}

function doPart2(input: string) {
  const startingPoints = input.split("\n")
    .map(line => positionReg.exec(line) || [])
    .map(([,px, py, vx, vy]) => [Point2D.fromString(`${px},${py}`), Point2D.fromString(`${vx},${vy}`)]);

  let stepCount = 0;
  let maybeTree = false;
  do {
    stepCount++;
    const step = startingPoints.map(movePointInGrid(stepCount, gridSize));
    const newPoints = new Set(step.map(p => p.toString()));
    maybeTree = mightBeTree(newPoints);
  } while (!maybeTree);

  return stepCount;
};

main();