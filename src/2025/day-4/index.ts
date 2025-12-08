import { getPuzzleInput } from '../../aocClient.ts';
import { Grid } from '../../util/grid.ts';
import { neighborArray, Point2D } from '../../util/point.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(4, 2025);
  const part1Expected = 1549;
  const part2Expected = 8887;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const grid = new Grid<string>();
  input.split("\n")
    .map((line, y) => line.split("").map((char, x) => char === '@' ? new Point2D(x, y) : null) )
    .flat()
    .filter((p): p is Point2D => p !== null)
    .forEach(p => grid.set(p, '@'));
  
  return getAccessibleRolls(grid).length;
};

function doPart2(input: string) {
  const grid = new Grid<string>();
  input.split("\n")
    .map((line, y) => line.split("").map((char, x) => char === '@' ? new Point2D(x, y) : null) )
    .flat()
    .filter((p): p is Point2D => p !== null)
    .forEach(p => grid.set(p, '@'));

  let totalRemoved = 0;
  let accessibleRolls = [];
  while ((accessibleRolls = getAccessibleRolls(grid)).length > 0) {
    totalRemoved += accessibleRolls.length;
    accessibleRolls.forEach(p => grid.delete(p));
  }
  return totalRemoved;
};

function getAccessibleRolls(grid: Grid<string>): Point2D[] {
  let accessibleRolls = [];
  for (const [point] of grid.iterable()) {
    const occupiedNeighborCount = neighborArray
      .map(neighbor => point.toAdded(neighbor))
      .filter(neighbor => grid.get(neighbor) === '@')
      .length;
    if (occupiedNeighborCount < 4) 
      accessibleRolls.push(point);
  }
  return accessibleRolls;
}

main();