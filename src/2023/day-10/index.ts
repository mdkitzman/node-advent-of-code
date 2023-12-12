import fs  from 'fs';
import timeFn from '../../util/timeFn';
import { Grid } from '../../util/grid';
import { Point2D, cardinalNeighbors } from '../../util/point';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);
const [
  NORTH, WEST, EAST, SOUTH
] = cardinalNeighbors.map(([x,y]) => new Point2D(x,y));
const validNeighborsFor: Record<string, string[]> = {
  [`${NORTH}`] : ["S", "|", "7", "F"],
  [`${SOUTH}`] : ["S", "|", "L", "J"],
  [`${EAST}`]  : ["S", "-", "J", "7"],
  [`${WEST}`]  : ["S", "-", "F", "L"],
}
const nexPossibleDirections: Record<string, Point2D[]> = Object.freeze({
  ["S"]: [NORTH, WEST, EAST, SOUTH],
  ["|"]: [NORTH, SOUTH],
  ["-"]: [EAST, WEST],
  ["L"] : [NORTH, EAST],
  ["J"] : [NORTH, WEST],
  ["7"] : [SOUTH, WEST],
  ["F"] : [SOUTH, EAST],
});

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  const part1Expected = 6738;
  const part2Expected = null;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const pipeGrid = getPipes(input);
  
  let [cur] = pipeGrid.iterable().find(([, pipe]) => pipe === "S")!;
  let [next] = nextPipes(cur, pipeGrid);
  let distance = 1;
  do {
    [cur, next] = [next, walkPipes(cur, next, pipeGrid)]
    distance++;
  } while (pipeGrid.get(next) !== "S")

  return Math.floor(distance/2);
};

function doPart2(input: string) {
  const pipeGrid = getPipes(input);
  
  const [start] = pipeGrid.iterable().find(([, pipe]) => pipe === "S")!;
  return 0;
};

function getPipes(input:string): Grid<string> {
  const pipeGrid = new Grid<string>();
  input.split("\n")
    .forEach((row, y) => {
      row.split("").forEach((ch, x) => {
        if (ch === ".")
          return;
        pipeGrid.set(new Point2D(x,y), ch);
      });
    });
  return pipeGrid;
}

function walkPipes(prev: Point2D, pos: Point2D, grid: Grid<string>): Point2D {
  const [left, right] = nextPipes(pos, grid);
  return prev.equals(left)
    ? right
    : left;
}

function nextPipes(pos: Point2D, grid: Grid<string>): [Point2D, Point2D] {
  const val = grid.get(pos)!;
  const [left, right] = nexPossibleDirections[val]
    .map((dir: Point2D):[Point2D, string] => ([dir, grid.get(new Point2D(pos.x+dir.x, pos.y+dir.y))!]))
    .filter(([,n]) => !!n)
    .filter(([dir,n]) => validNeighborsFor[dir.toString()].includes(n))
    .map(([dir]) => new Point2D(pos.x+dir.x, pos.y+dir.y));
  
  return [left, right];
}

main();