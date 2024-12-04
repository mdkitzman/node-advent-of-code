import { getPuzzleInput } from '../../aocClient';
import { sum } from '../../util/arrayUtils';
import { InfiniteGrid } from '../../util/grid';
import { neighborArray, Point2D } from '../../util/point';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(4, 2024);
  const part1Expected = 2458;
  const part2Expected = 1945;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

class Vector {
  constructor(public readonly p:Point2D, public readonly dir:Point2D){}
  toNext() {
    return new Vector(this.p.toAdded(this.dir), this.dir);
  }
}

/**
 * Will search in all cardinal directions starting at the given point
 * in the grid for the word "XMAS"
 * @param grid 
 * @returns 
 */
const xmasSearcher = (grid: InfiniteGrid<string>) => (start: Point2D) => {
  const xmas = "XMAS".split("");

  const findXmasInDirection = (vec: Vector, pos: number = 0): boolean => {
    if (pos >= xmas.length)
      return true;
    const expected = xmas[pos];
    if(grid.get(vec.p) !== expected)
      return false;
    const next = vec.toNext();
    return findXmasInDirection(next, pos+1);
  }
  
  return neighborArray
    .map(([x,y]) => new Vector(start, new Point2D(x,y)))
    .filter(findXmasInDirection)
    .length;
}

/**
 * Will search the diagonals of the center point for X-MAS instances
 * M S    M M    S M    S S
 *  A  or  A  or  A  or  A
 * M S    S S    S M    M M
 * @param grid 
 * @returns 
 */
const masXSearcher = (grid: InfiniteGrid<string>) => (center: Point2D): boolean => {
  const leftDiag = grid.get(center.toAdded(new Point2D(-1, -1))) +
                   grid.get(center)+
                   grid.get(center.toAdded(new Point2D(1, 1)));
  const rightDiag =grid.get(center.toAdded(new Point2D(-1, 1))) +
                   grid.get(center) +
                   grid.get(center.toAdded(new Point2D(1, -1)));

  return (leftDiag  === "MAS" || leftDiag  === "SAM") &&
         (rightDiag === "MAS" || rightDiag === "SAM");
}

function doPart1(input: string) {
  const grid = new InfiniteGrid<string>(".");
  input.split("\n")
    .forEach((line, y) => {
      line.split("")
        .forEach((ch, x) => {
          grid.set(new Point2D(x,y), ch);
        });
    });
  const xmasCounter = xmasSearcher(grid);
  const xmasCounts = grid
    .iterable()
    .filter(([, value]) => value === "X")
    .map(([point]) => xmasCounter(point))
    .reduce(sum);
  return xmasCounts;
};

function doPart2(input: string) {
  const grid = new InfiniteGrid<string>(".");
  input.split("\n")
    .forEach((line, y) => {
      line.split("")
        .forEach((ch, x) => {
          grid.set(new Point2D(x,y), ch);
        });
    });
  const maxXmatcher = masXSearcher(grid);
  const xmasCounts = grid
    .iterable()
    .filter(([, value]) => value === "A")
    .filter(([point]) => maxXmatcher(point))
    .length
  return xmasCounts;
};

main();