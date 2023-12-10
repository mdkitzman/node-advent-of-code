import fs  from 'fs';
import timeFn from '../../util/timeFn';
import { Grid } from '../../util/grid';
import { Point2D, cardinalNeighbors } from '../../util/point';
import { assert } from 'console';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const validNeighbors = {
  ["0,-1"]: ["S", "|", "7", "F"], // north
  ["0,1"] : ["S", "|", "L", "J"], // south
  ["-1,0"]: ["S", "-", "F", "L"], // west
  ["1,0"] : ["S", "-", "J", "7"], // east 
}

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  
  timedPart1(allInput);
  timedPart2(allInput);
};

function doPart1(input: string) {
  const pipeGrid = new Grid<string>();
  input.split("\n")
    .forEach((row, y) => {
      row.split("").forEach((ch, x) => {
        if (ch === ".")
          return;
        pipeGrid.set(new Point2D(x,y), ch);
      });
    });
  
  const [start] = pipeGrid.iterable().find(([, pipe]) => pipe === "S")!;
  let [left, right] = nextPipes(start, pipeGrid);
  let [prevLeft, prevRight] = [start, start];
  let distance = 1;
  let collision = false;
  do {
    [prevLeft, left] = [left, nextPipe(prevLeft, left, pipeGrid)];
    [prevRight, right] = [right, nextPipe(prevRight, right, pipeGrid)];
    distance++;
    collision = left.equals(right) || (left.equals(prevRight) && right.equals(prevLeft));
  } while (!collision);
  console.log(distance);
};

function doPart2(input: string) {

};

function nextPipe(prev: Point2D, pos: Point2D, grid: Grid<string>): Point2D {
  const [left, right] = nextPipes(pos, grid);
  assert(left, `No Left - prev: ${grid.get(prev)} (${prev.x},${prev.y}), pos: ${grid.get(pos)} (${pos.x},${pos.y})` )
  assert(right, `No Right - prev: ${grid.get(prev)} (${prev.x},${prev.y}), pos: ${grid.get(pos)} (${pos.x},${pos.y})`)
  return prev.equals(left)
    ? right
    : left;
}

function nextPipes(pos: Point2D, grid: Grid<string>): [Point2D, Point2D] {
  const negX = -pos.x;
  const negY = -pos.y;
  const [left, right] = grid
    .cardinalNeighbors(pos)
    .filter(neighborPos => {
      const value = grid.get(neighborPos);
      const { x, y } = neighborPos;
      const possibleNeighbors: string[] = validNeighbors[`${x+negX},${y+negY}`];
      return possibleNeighbors.find(p => value === p);
    });
  return [left,right];
}

main();