import fs  from 'fs';
import lodash from 'lodash';
import { InfiniteGrid } from '../../util/grid';
import { Point2D } from '../../util/point';

class Claim {
  constructor(
    public readonly id: number,
    public readonly topLeft: Point2D,
    public readonly bottomRight: Point2D
  ){}

  public forEachPoint(action: (point: Point2D) => void) {
    const [x1, y1] = this.topLeft.coordinates;
    const [x2, y2] = this.bottomRight.coordinates;
    for(let x = x1; x <= x2; x++) {
      for(let  y = y1; y <= y2; y++) {
        action(new Point2D(x,y));
      }
    }
  }
}

const claimRegex = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
const toClaim = (line: string): Claim => {
  const match = claimRegex.exec(line);
  if(!match)
    throw new Error("Unable to match line!");
  const [id, x, y, w, h] = match.slice(1, 6).map(v => parseInt(v, 10));
  return new Claim(id, new Point2D(x, y), new Point2D(x + w -1, y + h -1));
};

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 109785
  doPart2(allInput); // 504
};

function doPart1(input: string) {
  const grid = new InfiniteGrid<number[]>([]);  
  const claims = input.split('\n').map(toClaim);
  claims.forEach(claim => {
    claim.forEachPoint(point => {
      grid.get(point).push(claim.id);
    });
  });
  const duplicates = Array
    .from(grid.data.values())
    .filter(value => value.length > 1);

  console.log(`The total overlapping square inches is ${duplicates.length}`);
};

function doPart2(input: string) {
  const grid = new InfiniteGrid<number[]>([]);  
  const claims = input.split('\n').map(toClaim);
  claims.forEach(claim => {
    claim.forEachPoint(point => {
      grid.get(point).push(claim.id);
    });
  });
  const duplicates = Array
    .from(grid.data.values())
    .filter(value => value.length > 1);
  
  const uniqeDups = Array.from(new Set(duplicates.flatMap(v => v)));
  const all = claims.map(c => c.id)

  const diff = lodash.difference(all, uniqeDups);
  console.log(`Found claim with id : ${diff[0]}`);
}

main();