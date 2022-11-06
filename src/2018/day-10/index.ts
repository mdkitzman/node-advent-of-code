import fs  from 'fs';
import { InfiniteGrid } from '../../util/infinite-grid';
import { Point2D } from '../../util/point';

const starLine = /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/;
const surround = [
  [-1, -1], [ 0, -1], [ 1, -1],
  [-1,  0],           [ 1,  0],
  [-1,  1], [ 0,  1], [ 1,  1]
].map(([x,y]) => new Point2D(x,y));

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1And2(allInput); // RLEZNRAN, 10240
};

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
      console.log(`Clock tick ${i}`);
      sky.print(v => v ? "#":'.', 'low');
      console.log();
    }
    stars.forEach(([star, velocity]) => star.add(velocity));    
  }
};

main();