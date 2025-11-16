import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import lodash from 'lodash-es';
import { InfiniteGrid } from '../../util/grid.ts';
import { Point2D } from '../../util/point.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(3, 2018);
  const part1Expected = 109785;
  const part2Expected = 504;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

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
  
  return duplicates.length;
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

  const [ diff ] = lodash.difference(all, uniqeDups);

  return diff;
};

main();