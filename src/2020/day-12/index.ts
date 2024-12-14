import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(12, 2020);
  const part1Expected = 445;
  const part2Expected = 42495;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

enum Direction { N=0, E=1, S=2, W=3 };
const dirDeltas:Point[] = [ 
  [+0, +1], // N
  [+1, +0], // E
  [+0, -1], // S
  [-1, +0]  // W
] 

type Point = [x:number, y:number];

const addPoints = (p1:Point, p2:Point):Point => [p1[0] + p2[0], p1[1] + p2[1]];
const rad = (degrees:number) => degrees * Math.PI / 180;

const move = (point:Point, dir:Direction, amount:number):Point => {
  const delta = dirDeltas[dir];
  const move:Point = [delta[0] * amount, delta[1] * amount];
  return addPoints(point, move);
}

const manhattan = (point:Point):number =>  Math.abs(point[0]) + Math.abs(point[1]);

function doPart1(input: string) {
  let dir = Direction.E;
  let ship:Point = [0, 0];
  
  const actions = input.split('\n');
  actions
    .forEach(instruction => {
      const action = instruction[0];
      const amount = parseInt(instruction.slice(1), 10);
      switch(action) {
        case 'R':
          dir = (dir + (amount / 90)) % 4;
          break;
        case 'L':
          dir = (dir + ((360 - amount) / 90)) % 4;
          break;
        case 'N':
        case 'S':
        case 'E':
        case 'W':
          ship = move(ship, Direction[action], amount);
          break;
        default:
        case 'F':
          ship = move(ship, dir, amount);
          break;
      }
    });
  return manhattan(ship);
};

function doPart2(input: string) {
  let ship:Point = [0, 0];
  let waypoint:Point = [10, 1]

  
  const rotatePoint = (point:Point, angle:number, center:Point = [0,0]):Point => {
    const x = Math.round(Math.cos(angle) * (point[0] - center[0]) - Math.sin(angle) * (point[1] - center[1]) + center[0]);
    const y = Math.round(Math.sin(angle) * (point[0] - center[0]) + Math.cos(angle) * (point[1] - center[1]) + center[1]);
    return [x, y];
  }

  const actions = input.split('\n');
  actions
    .forEach(instruction => {
      const action = instruction[0];
      const amount = parseInt(instruction.slice(1), 10);
      switch(action) {
        case 'R':
          waypoint = rotatePoint(waypoint, -rad(amount));
          break;
        case 'L':
          waypoint = rotatePoint(waypoint, rad(amount));
          break;
        case 'N':
        case 'S':
        case 'E':
        case 'W':
          waypoint = move(waypoint, Direction[action], amount);
          break;
        default:
        case 'F':
          ship = addPoints(ship, [waypoint[0] * amount, waypoint[1] * amount]);
          break;
      }
    });
  return manhattan(ship);
};

main();