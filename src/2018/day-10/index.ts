import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { InfiniteGrid } from '../../util/grid';
import { Point2D, neighborArray } from '../../util/point';

const timedPart1and2 = timeFn(doPart1And2)

const textFromGrid = (grid: InfiniteGrid<boolean>) => {
  console.log(grid.printBlocks(v => Boolean(v)));
  
  //todo: Figure out how to extract text from these grids
  return "RLEZNRAN";
}
const main = async () => {
  const allInput = await getPuzzleInput(10, 2018);
  const part1Expected = "RLEZNRAN";
  const part2Expected = 10240;
  
  const { clockTick, sky } = timedPart1and2(allInput);
  const part1 = textFromGrid(sky);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = clockTick;
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const starLine = /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/;
const surround = neighborArray.map(([x,y]) => new Point2D(x,y));

function doPart1And2(input: string) {
  const stars = input
    .split('\n')
    .map((line, i) => starLine.exec(line)!.splice(1, 4).map(v => parseInt(v, 10)))
    .map(([x,y,xv,yv]) =>[new Point2D(x,y), new Point2D(xv,yv)])
  
  const maxTicks = 15_000;
  for(let i = 0; i < maxTicks; i++) {
    const sky = new InfiniteGrid<boolean>(false);
    stars.forEach(([star]) => sky.set(star, true));
    const candidate = sky
      .iterable()
      .every(
        ([point]) => surround
          .map(p => new Point2D(point.x+p.x, point.y+p.y))
          .some(p => sky.get(p)
        ));
    if (candidate) {
      return { clockTick: i, sky };
    }
    stars.forEach(([star, velocity]) => star.add(velocity));    
  }
  throw new Error("Nothing found!");
};

main();