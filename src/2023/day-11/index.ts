import fs  from 'fs';
import timeFn from '../../util/timeFn';
import { Grid } from '../../util/grid';
import { Point2D } from '../../util/point';
import { difference } from 'lodash';
import { choose, sum } from '../../util/arrayUtils';
import { gridBuilder } from '../../util/inputParsers';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const getGrid = gridBuilder(ch => ch === "#", ch => ch);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  const part1Expected = 9177603;
  const part2Expected = 632003913611;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const grid = expandGrid(getGrid(input));
  return choose(grid.iterable().map(([p]) => p), 2)
    .map(([p1, p2]) => p1.manhattenDistance(p2))
    .reduce(sum)
};

function doPart2(input: string) {
  const grid = expandGrid(getGrid(input), 1_000_000);
  return choose(grid.iterable().map(([p]) => p), 2)
    .map(([p1, p2]) => p1.manhattenDistance(p2))
    .reduce(sum)
};

function expandGrid(grid: Grid<string>, expansion = 2) {
  const {
    width, height
  } = grid.dimensions;
  const [cols, rows] = grid
    .iterable()
    .map(([point]) => ([[point.x], [point.y]]))
    .reduce((acc, cur) => ([[...cur[0], ...acc[0]], [...cur[1], ...acc[1]]]))
    .map(vals => [...(new Set(vals))]);
  const emptyCols = difference(new Array(width).fill(0).map((v, i) => i), cols);
  const emptyRows = difference(new Array(height).fill(0).map((v, i) => i), rows);
  const numberSort = (a,b) => a-b;
  emptyCols.sort(numberSort);
  emptyRows.sort(numberSort);
  const newGrid = new Grid<string>();
  grid.iterable().forEach(([p, v]) => {
    const expandColsBy = emptyCols.filter(c => c < p.x).length;
    const expandRowsBy = emptyRows.filter(r => r < p.y).length;
    const expandCol = (expandColsBy * expansion) - expandColsBy;
    const expandRow = (expandRowsBy * expansion) - expandRowsBy;
    newGrid.set(new Point2D(p.x + expandCol, p.y + expandRow), v);
  });
  return newGrid;
}



main();