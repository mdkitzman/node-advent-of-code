import fs from 'fs';
import { min } from '../../util/arrayUtils';
import { Point } from '../../util/point';

const main = async () => {
  const allInput = await fs.promises.readFile('./src/2019/day-3/input', { encoding: 'utf-8'});
  
  const [wire1, wire2] = getWires(allInput);
  const intersectionPoints = findIntersections(wire1, wire2);
  
  doPart1(wire1, wire2, intersectionPoints); // 768
  doPart2(wire1, wire2, intersectionPoints); // 8684
};

function doPart1(wire1: Point[], wire2: Point[], intersections: Point[]) {
  const shortestDistance = intersections
    .map(point => Math.abs(point.x) + Math.abs(point.y)) // Calculating the manhattan distance between 0,0 and x,y = abs(x) + abs(y)
    .filter(len => len > 0)
    .reduce(min);
  
  console.log(`The closest intersection point is ${shortestDistance}`);
};

function doPart2(wire1: Point[], wire2: Point[], intersections: Point[]) {
  const walkWire = (wire: Point[], point: Point): number => {
    let distance = 0;
    let end: Point = wire[0];
    for(let iPoint = 0; iPoint < wire.length-1 && end !== point; iPoint++) {
      end = pointIsOnLine(wire[iPoint], wire[iPoint+1], point)
        ? point
        : wire[iPoint+1];
      distance += wire[iPoint].distanceTo(end);
    }
    return distance;
  }

  const shortestDistance = intersections.map(intersection => walkWire(wire1, intersection) + walkWire(wire2, intersection)).reduce(min);
  console.log(`The shortest distance along the wires to an intersection is ${shortestDistance}`);
};

function getWires(input: string): Point[][] {
  return input.split('\n')
  .map(wire => wire.trim())
  .map(wire => {
    const points = [new Point(0,0)];
    wire.split(',').forEach((change, index) => {
      const lastPoint = points[index];
      const dir = change[0];
      const distance = parseInt(change.split('').splice(1).join(''), 10);
      switch(dir) {
        case 'U':
          points.push(new Point(lastPoint.x, lastPoint.y + distance));
          break;
        case 'D':
          points.push(new Point(lastPoint.x, lastPoint.y - distance));
          break;
        case 'R':
          points.push(new Point(lastPoint.x + distance, lastPoint.y));
          break;
        case 'L':
          points.push(new Point(lastPoint.x - distance, lastPoint.y));
          break;
      }
    });
    return points;
  })
}
  

function findIntersections(wire1: Point[], wire2: Point[]): Point[] {
  const intersectionPoints: Point[] = [];
  for (let iPoint1 = 0; iPoint1 < wire1.length - 1; iPoint1++) {
    for (let iPoint2 = 0; iPoint2 < wire2.length - 1; iPoint2++) {
      const intersection = computeIntersection(wire1[iPoint1], wire1[iPoint1 + 1], wire2[iPoint2], wire2[iPoint2+1]);
      if (intersection)
        intersectionPoints.push(intersection);
    }
  }
  return intersectionPoints;
};

// https://jsfiddle.net/ferrybig/eokwL9mp/
function computeH(a: Point, b: Point, c: Point, d: Point): number {
  // E = B-A = ( Bx-Ax, By-Ay )
  const e = { x: b.x - a.x, y: b.y - a.y };
  // F = D-C = ( Dx-Cx, Dy-Cy )
  const f = { x: d.x - c.x, y: d.y - c.y };
  // P = ( -Ey, Ex )
  const p = { x: -e.y, y: e.x };

  // h = ( (A-C) * P ) / ( F * P )
  const intersection = f.x * p.x + f.y * p.y;
  if (intersection === 0) {
    // Paralel lines
    return NaN;
  }
  return ((a.x - c.x) * p.x + (a.y - c.y) * p.y) / intersection;
}

const between0and1 = isBetween.bind(null, 0, 1);

function computeIntersection(a:Point, b:Point, c:Point, d:Point): Point | undefined {
  const h1 = computeH(a, b, c, d);
  const h2 = computeH(c, d, a, b);

  const isParallel = isNaN(h1) || isNaN(h2);
  if (isParallel)
    return;

  const intersect = between0and1(h1) && between0and1(h2);
  if (!intersect)
    return;
  const f = {x: d.x-c.x, y: d.y-c.y }
  return new Point(c.x + f.x * h1, c.y + f.y * h1);
}

function isBetween(x:number, y:number, q:number): boolean {
  return (x <= q && q <= y) || (y <= q && q <= x);
}

function pointIsOnLine(a:Point, b:Point, q:Point):boolean {
  if (a.x === b.x)
    return q.x === a.x && isBetween(a.y, b.y, q.y);
  else if (a.y === b.y) 
    return q.y === a.y && isBetween(a.x, b.x, q.x);
  return false;
}

main();
