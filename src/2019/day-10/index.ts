import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs  from 'fs';
import { Point2D, rotate } from '../../util/point.ts';
import { groupBy, orderBy, uniq } from 'lodash-es';
import { getPuzzleInput } from '../../aocClient.ts';

const main = async () => {
  const allInput = await getPuzzleInput(10, 2019);
  const best = doPart1(allInput);
  console.log(`Found the best asteroid at (${best.asteroid.x}, ${best.asteroid.y}) with ${best.visibleCount} asteroids`); // 292
  const p = doPart2(allInput, best.asteroid);
  console.log(`The 200th asteroid is at (${p.originalPoint.x}, ${p.originalPoint.y}), with value of ${p.originalPoint.x * 100 + p.originalPoint.y}`); // 317
};

function getAteroids(input:string): Point2D[] {
  const asteroids: Point2D[] = input
    .split('\n')
    .map((line, y) => 
      line
        .split('')
        .map((val, x) => val !== '.' ? new Point2D(x, y) : new Point2D(-1, -1))
        .filter(pt => pt.x >= 0 && pt.y >= 0)
    ).flat();
  return asteroids;
}

function doPart1(input: string) {
  const asteroids: Point2D[] = getAteroids(input);
  
  function findVisibilityCount(asteroid: Point2D): { asteroid: Point2D, visibleCount: number} {
    const angles = asteroids
      .filter(a => !a.equals(asteroid))
      .map(a => ({ x: a.x, y: a.y, angle: asteroid.angle(a)}));
    
    const uniqeDirections = new Set(angles.map(a => a.angle));
    const visibleCount = uniqeDirections.size;
    return { asteroid, visibleCount };
  };
  
  return asteroids
    .map(findVisibilityCount)
    .reduce((left, right) => left.visibleCount >= right.visibleCount ? left : right);
};


/*
With a ray going up from the center, where origin is top left, is the same as a ray
going down where the origin is bottom left.

Translate all other points to the new center asteroid as the origin.
Rotate all of the points 90 degrees counter clockwise.
*/
function doPart2(input: string, centerAsteroid: Point2D) {
  const asteroids: Point2D[] = getAteroids(input);
  const otherAsteroids = asteroids
      .filter(a => !a.equals(centerAsteroid))
      .map(asteroid => rotate(asteroid, Math.PI/2, centerAsteroid))  // rotate all points 90 degrees clockwise
      .map(asteroid => ({
        originalPoint: rotate(asteroid, -Math.PI / 2, centerAsteroid), // rotate back
        angle: centerAsteroid.angle(asteroid),
        dist: centerAsteroid.distanceTo(asteroid),
      }));

  const angles = uniq(otherAsteroids.map(a => a.angle));
  angles.sort((a,b) => b - a);
  const layers = groupBy(orderBy(otherAsteroids, ["angle", "dist"], ['asc', 'desc']), "angle");

  const orderedAsteroids: {originalPoint: Point2D, angle: number, dist: number}[] = [];
  let iAngle = 0;
  while (orderedAsteroids.length < otherAsteroids.length) {
    const maybeVal = layers[angles[iAngle]].pop();
    if(maybeVal) {
      orderedAsteroids.push(maybeVal);
    }
    iAngle = (iAngle + 1) % angles.length;
  }
  
  return orderedAsteroids[199];  
};

main();