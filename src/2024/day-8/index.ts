import { getPuzzleInput } from '../../aocClient.ts';
import { choose, pairwise } from '../../util/arrayUtils.ts';
import { Grid } from '../../util/grid.ts';
import { Point2D } from '../../util/point.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(8, 2024);
  const part1Expected = 269;
  const part2Expected = 949;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const onlyUnique = <T>(v:T, index:number, arr: T[]) => arr.indexOf(v) === index;

const getSpace = (input:string) => {
  const space = new Grid<string>();
  input
  .split("\n")
  .forEach((line, y) => {
    line.split("")
    .forEach((mark, x) => {
      space.set(new Point2D(x,y), mark);
    });
  });
  return space;
}

const boundaryForSpace = <T>(space: Grid<T>) => {
  const { top, left, right, bottom } = space.dimensions;
  return ({x, y}:Point2D) => top <= y && y <= bottom && left <= x && x <= right;
}

function doPart1(input: string) {
  const space = getSpace(input);
  const inBounds = boundaryForSpace(space);
  const markTypes = new Set<string>(space.iterable().map(([,mark]) => mark).filter(mark => mark !== "."));
    
  const occupiedPoints = space.iterable().filter(([,mark]) => mark !== ".").map(([point]) => point);
  const antiPointCount = [...markTypes.values()]
    .map(markType => 
      choose(occupiedPoints.filter(point => space.get(point) === markType), 2)
    )
    .flat()
    .map(([a, b]) => {
      return [
        a.toAdded(new Point2D(a.x - b.x, a.y - b.y)),
        b.toAdded(new Point2D(b.x - a.x, b.y - a.y))
      ];
    })
    .flat()
    .filter(inBounds)
    .map(p => `${p.x}:${p.y}`)
    .filter(onlyUnique)
    .length;
  return antiPointCount;
};

function doPart2(input: string) {
  const space = getSpace(input);
  const markTypes = new Set<string>(space.iterable().map(([,mark]) => mark).filter(mark => mark !== "."));
  
  const inBounds = boundaryForSpace(space);
  const pointsAlong = (start: Point2D, slope: Point2D) => {
    const series:Point2D[] = [];
    let itr = start.toAdded(slope);
    while (inBounds(itr)) {
      series.push(Point2D.fromPoint(itr));
      itr.add(slope);
    }
    return series;
  }

  const pointsBetween = (a: Point2D, b: Point2D) => {
    const slope = new Point2D(a.x - b.x, a.y - b.y);
    const oppositeSlope = new Point2D(b.x - a.x, b.y - a.y);
    return [
      ...pointsAlong(a, slope),
      a,
      ...pointsAlong(a, oppositeSlope)
    ];
  }

  const occupiedPoints = space.iterable().filter(([,mark]) => mark !== ".").map(([point]) => point);
  const antiPointCount = [...markTypes.values()]
    .map(markType => 
      choose(occupiedPoints.filter(point => space.get(point) === markType), 2)
    )
    .flat()
    .map(([a, b]) => pointsBetween(a, b))
    .flat()
    .map(({x, y})=> `${x}:${y}`)
    .filter(onlyUnique)
    .length;
  return antiPointCount;
};

main();