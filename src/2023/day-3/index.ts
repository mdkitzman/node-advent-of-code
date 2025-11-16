import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Grid, generateCoords } from '../../util/grid.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Point2D } from '../../util/point.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { discriminate, sum } from '../../util/arrayUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput);
  doPart2(allInput);
};

type Widget = {
  type: 'widget';
  value: string;
  origin: Point2D;
}
type PartNumber = {
  type: 'number',
  value: number,
  origin: Point2D;
  width: number,
}

type EnginePart = Widget | PartNumber;

function getGrid(input: string): Grid<EnginePart> {
  const grid = new Grid<EnginePart>();
  input
    .split('\n')
    .forEach((line, y) => {
      line
        .split('')
        .forEach((data, x) => {
          if (data === '.')
            return;
          const type:EnginePart["type"] = /\d/.test(data) ? 'number':'widget';
          const point = new Point2D(x,y);
          // if the previous point in the grid was also a number, add this value to it
          const previousValue = grid.get(new Point2D(x-1, y))
          if (type === 'number') {
            const value = parseInt(data, 10);
            if (previousValue?.type === 'number') {
              previousValue.value = (previousValue.value * 10) + value;
              previousValue.width++;
              grid.set(point, previousValue);  
            } else {
              grid.set(point, {
                type,
                value,
                origin: point,
                width: 1
              })
            }
          } else {
            grid.set(new Point2D(x,y), {
              type,
              value: data,
              origin: point
            });
          }
        });
    });
  return grid;
}

const negativeOffset = new Point2D(-1, -1);
const findAdjacentNumbers = (grid: Grid<EnginePart>) => (w: Widget): PartNumber[] =>{
  const adjacentNumbers = new Set<PartNumber>();
  for(const [x, y] of generateCoords(3,3)) {
    const testPoint = new Point2D(x,y);
    testPoint.add(w.origin)
    testPoint.add(negativeOffset);
    const testPart = grid.get(testPoint);
    if (testPart?.type === 'number') {
      adjacentNumbers.add(testPart);
    }
  }
  return [...adjacentNumbers];
}

const isWidget = discriminate('type', 'widget');

function doPart1(input: string) {
  const grid = getGrid(input);
  // find numbers with a symbol adjacent
  
  const partNumbers = new Set<PartNumber>(grid
    .iterable()
    .map(([, enginePart]) => enginePart)
    .filter(isWidget)
    .map(findAdjacentNumbers(grid))
    .flat());
  const total = [...partNumbers].map(p => p.value).reduce(sum);
  console.log(total); // 525181
};

function doPart2(input: string) {
  const negativeOffset = new Point2D(-1, -1);
  const grid = getGrid(input);
  const total = grid
    .iterable()
    .map(([p, v]) => v)
    .filter(isWidget)
    .filter(symbol => symbol.value === "*")
    .map(findAdjacentNumbers(grid))
    .filter(adjacentNumbers => adjacentNumbers.length === 2)
    .map(([pn1, pn2]) => pn1.value * pn2.value)
    .reduce(sum)
  console.log(total); // 84289137
};

main();