import { getPuzzleInput } from '../../aocClient.ts';
import { Grid } from '../../util/grid.ts';
import { Point2D } from '../../util/point.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(7, 2025);
  const part1Expected = 1717;
  const part2Expected = 231507396180012;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const getGrid = (input:string) => {
  let start = new Point2D(0,0);
  const grid = Grid.fromInput(input, (char, p) => {
    if (char === 'S') start = p;
    return char
  });
  
  return [grid, start] as const;
}

function doPart1(input: string) {
  const [grid, start] = getGrid(input);
  const [leftDown, down, rightDown] = [
    new Point2D(-1,1),
    new Point2D(0,1),
    new Point2D(1,1),
  ]
  
  // run the simulation in a breadth-first manner
  let splitCount = 0;
  const beamPositions: Point2D[] = [start];
  do {
    const newBeamPositions = new Set<string>();
    let pos: Point2D | undefined;
    while ((pos = beamPositions.pop())) {
      const below = grid.get(pos.toAdded(down));
      switch (below) {
        // the space directly below us is empty, beam continues down
        case '.':
          newBeamPositions.add(pos.toAdded(down).toString());
          break;
        
        case '^':
          // split the beam
          splitCount++;
          newBeamPositions.add(pos.toAdded(leftDown).toString());
          newBeamPositions.add(pos.toAdded(rightDown).toString());
          break;
      }
    }
    const newPoints = [...newBeamPositions.values()].map(p => Point2D.fromString(p))
    beamPositions.push(...newPoints);
  } while (beamPositions.length > 0);

  return splitCount;
};

function doPart2(input: string) {
  const [grid, start] = getGrid(input);
  
  const [leftDown, down, rightDown] = [
    new Point2D(-1,1),
    new Point2D(0,1),
    new Point2D(1,1),
  ]

  const memo = new Map<string, number>();
  const memoKey = (pos: Point2D) => pos.toString();
  const traverse = (pos: Point2D): number => {
    const key = memoKey(pos);
    if (memo.has(key)) {
      return memo.get(key)!;
    }
    const below = grid.get(pos.toAdded(down));
    let count = 0;
    switch (below) {
      // the space directly below us is empty, beam continues down
      case '.':
        count = traverse(pos.toAdded(down));
        break;
      
      case '^':
        // split the beam
        count = traverse(pos.toAdded(leftDown)) + traverse(pos.toAdded(rightDown));
        break;
      
      default:
        // we've reached the bottom!
        count = 1;
        break;
    }
    memo.set(key, count);
    return count;
  }

  // run the simulation in a depth-first manner
  return traverse(start);
};

main();