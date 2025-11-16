import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(11, 2017);
  const part1Expected = 685;
  const part2Expected = 1457;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

enum HexDirection {
  // These map to the doubleheight_directions 
  se, ne, n, nw, sw, s
}

const doubleheight_directions:CartesianCoord[] = [
  { col:+1, row:+1 }, { col:+1, row:-1 }, { col:0, row: -2 }, 
  { col:-1, row:-1 }, { col:-1, row:+1 }, { col:0, row: +2 }, 
]

interface CartesianCoord {
  row:number,
  col:number
}

const addPoints = (a: CartesianCoord, b: CartesianCoord):CartesianCoord => {
  return {col: a.col + b.col, row: a.row + b.row };
}

const cartesianDistance = (a:CartesianCoord, b:CartesianCoord):number =>{
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);
    return dx + Math.max(0, (dy - dx) / 2);
}

function doPart1(input: string) {
  const path:HexDirection[] = input.split(',').map(dir => HexDirection[dir]);
  
  const start:CartesianCoord = {row:0, col:0};
  const end:CartesianCoord = path
                              .map(dir => doubleheight_directions[dir])
                              .reduce(addPoints, start);
  return cartesianDistance(start, end);
};

function doPart2(input: string) {
  const path:HexDirection[] = input.split(',').map(dir => HexDirection[dir]);
  
  let maxDistance = 0;
  const start:CartesianCoord = {row:0, col:0};
  let curPos:CartesianCoord = {row:0, col:0}
  path
    .map(dir => doubleheight_directions[dir])
    .forEach(neighbor => {
      curPos = addPoints(curPos, neighbor);
      const dist = cartesianDistance(start, curPos);
      maxDistance = Math.max(maxDistance, dist);
    });
  
  return maxDistance;
};

main();