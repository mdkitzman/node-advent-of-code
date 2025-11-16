import fs  from 'fs';
import { intersection, range } from 'lodash-es';
import { inRange } from '../../util/numberUtils.ts';
import { Point2D } from '../../util/point.ts';

const main = async () => {
  const allInput = 'target area: x=282..314, y=-80..-45';
  doPart1(allInput); // 3160
  doPart2('target area: x=20..30, y=-10..-5');
};

function doPart1(input: string) {
  const [ topLeft ] = getBounds(input);

  const y = Math.abs(topLeft.y);

  const maxHeight = (y*(y-1))/2;
  
  console.log(`The maximum y value height is ${maxHeight}`);
};

function doPart2(input: string) {
  const [topLeft, bottomRight] = getBounds(input);

  const computeValidSteps = (
    keepStepping: (dimValue: number)=>boolean,
    rangeCheck: (val:number)=>boolean,
    updateVel: (vel:number)=>number
  ) => {
    return (vel: number) => {
      const validSteps = new Set<number>();
      let [step, dimVal, dimVelocity] = [0, 0, vel];
      
      while (keepStepping(dimVal)) {
        step++;
        // update the position by applying the current velocity
        dimVal += dimVelocity
        // update the velocity
        dimVelocity = updateVel(dimVelocity);
        // did this value fall in the desired range?  If so add it!
        if (rangeCheck(dimVal))
          validSteps.add(step)
      }
      return validSteps;
    }
  };

  const [ xVelocityMin, xVelocityMax ] = [
    // Solve for n where (n*(n+1))/2 = value => n = √(value * 2 + 1) - 1
    Math.ceil(Math.sqrt(topLeft.x * 2 + 1) -1),
    bottomRight.x+1
  ];
  const validXStepSets:Set<number>[] = 
    range(xVelocityMin, xVelocityMax+1)
      .map(computeValidSteps(
        inRange(topLeft.x, bottomRight.x),
        xVal => xVal <= bottomRight.x,
        xVel => Math.max(xVel - 1, 0)
      ));
  
  const [ yVelocityMin, yVelocityMax ] = [
    bottomRight.y,
    -bottomRight.y
  ];
  const validYStepSets:Set<number>[] = 
    range(yVelocityMin, yVelocityMax)
      .map(computeValidSteps(
        inRange(topLeft.y, bottomRight.y),
        yVal => yVal > bottomRight.y,
        yVel => yVel - 1
      ));

  let count = 0
  for (const validX of validXStepSets) {
    for (const validY of validYStepSets) {
      if ([...validX].filter(x => validY.has(x)))
        count++;
    }
  }
      
  console.log(`There are ${count} valid combinations of velocities`);  
};

function getBounds(input:string): [Point2D, Point2D] {
  const [[x1, x2], [y1, y2]] = input
    .slice('target area: '.length)
    .split(', ')
    .map(part => part.slice(2).split('..').map(Number));
  return [new Point2D(x1, y1), new Point2D(x2, y2)];
}


main();