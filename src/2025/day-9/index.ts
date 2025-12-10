import { getPuzzleInput } from '../../aocClient.ts';
import { combinations, max, windowed } from '../../util/arrayUtils.ts';
import { Point2D } from '../../util/point.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

function Turn(p1: Point2D, p2: Point2D, p3: Point2D) {
  const a = p1.x; const b = p1.y; 
  const c = p2.x; const d = p2.y;
  const e = p3.x; const f = p3.y;
  const A = (f - b) * (c - a);
  const B = (d - b) * (e - a);
  return (A > B + Number.EPSILON) ? 1 : (A + Number.EPSILON < B) ? -1 : 0;
}

function isIntersect(p1, p2, p3, p4) {
  return (Turn(p1, p3, p4) != Turn(p2, p3, p4)) && (Turn(p1, p2, p3) != Turn(p1, p2, p4));
}

class Line {
  start: Point2D;
  end: Point2D;

  constructor(start: Point2D, end: Point2D) {
    this.start = start;
    this.end = end;
  }

  length(): number {
    return this.start.distanceTo(this.end);
  }

  parallelTo(other: Line): boolean {
    const slope1 = this.start.slope(this.end);
    const slope2 = other.start.slope(other.end);
    return slope1 === slope2;
  }

  intersectsWith(other: Line): boolean {
    return isIntersect(this.start, this.end, other.start, other.end);
  }
}

const main = async () => {
  const allInput = await getPuzzleInput(9, 2025);
  const part1Expected = 4761736832;
  const part2Expected = null;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const points = input
    .split('\n')
    .map(line => line.split(',').map(Number))
    .map(([x, y]) => new Point2D(x, y));
  const maxSize = Math.max(
    ...combinations(points, 2)
    .map(([p1, p2]) => [Math.abs(p1.x - p2.x)+1, Math.abs(p1.y - p2.y)+1])
    .map(([dx, dy]) => dx * dy)
  );
  return maxSize;
};


// does not work... :sad-panda:
function doPart2(input: string) {
  const points = input
    .split('\n')
    .map(line => line.split(',').map(Number))
    .map(([x, y]) => new Point2D(x, y));
  
  const floorPlanPerimeter = windowed(2, [...points, points[0]])
    .map(([p1, p2]) => new Line(p1, p2));
    
  // get all combinations of red points 
  const rectangle = combinations(points, 2)
    // ignore any point pairs that are co-linear with one another
    .filter(([p1, p2]) => !p1.horizontallyAligned(p2) && !p1.verticallyAligned(p2))
    // sort by the largest area boxes first
    .map(([p1, p2]) => ({ p1, p2, area: (Math.abs(p1.x - p2.x)+1) * (Math.abs(p1.y - p2.y)+1)}))
    .toSorted(({ area: areaA }, { area: areaB}) => areaB - areaA)
    // find the first rectalgle that is contained fully within the green area
    .find(({ p1, p2 }) => {
      // construct a rectangle from p1 to p2, with p1 as the last point to close the loop
      const corners = [p1, new Point2D(p2.x, p1.y), p2, new Point2D(p1.x, p2.y), p1];
      const box = windowed(2, corners).map(([p1, p2]) => new Line(p1, p2));
      
      // check if any of the rectangle's lines intersect with the floor plan perimeter
      for (const rectLine of box) {
        for (const floorLine of floorPlanPerimeter) {
          const intersects = rectLine.intersectsWith(floorLine);
          const isParallel = rectLine.parallelTo(floorLine);
          if (intersects && !isParallel) {
            return false;
          }
        }
      }
      return true;
    });

  return rectangle;
};

main();