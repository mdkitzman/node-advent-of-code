import { getPuzzleInput } from '../../aocClient';
import { Grid } from '../../util/grid';
import { cardinalNeighbors, Point2D } from '../../util/point';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(6, 2024);
  const part1Expected = 4696;
  const part2Expected = 1443; // took 60s!
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const nextStepMap = {
  "^": new Point2D(0, -1),
  ">": new Point2D(1, 0),
  "v": new Point2D(0, 1),
  "<": new Point2D(-1, 0),
};
const rotateMap = {
  "^": ">",
  ">": "v",
  "v": "<",
  "<": "^",
}

const simulatePatrol = (map: Grid<string>) => {
  let [guardPos, guardDirection] = map.iterable().find(([,mark]) => mark !== "." && mark !== "#")!;
  const startPos = Point2D.fromPoint(guardPos);
  const startDir = guardDirection;
  const nextStep = () => {
    const nextPos = guardPos.toAdded(nextStepMap[guardDirection])
    const nextMapTile = map.get(nextPos);
    
    switch (nextMapTile) {
      case ".":
      case "X":
        return [nextPos, guardDirection];
      case "#":
        return [ guardPos, rotateMap[guardDirection]];
      default:
      case undefined:
        return undefined;
    }
  }
  let inALoop = false;
  let action;
  const seen = new Set<string>();
  while (action = nextStep()) {
    map.set(guardPos, "X");
    seen.add(`${guardPos.x},${guardPos.y},${guardDirection}`);
    const [nextPos, nextDir] = action!;
    if (seen.has(`${nextPos.x},${nextPos.y},${nextDir}`)) {
      // we're in a spot we've seen before, so we're in a loop
      inALoop = true;
      break;
    }
    guardPos = nextPos;
    guardDirection = nextDir;
  }
  map.set(guardPos, "X");
  return inALoop;
}

function doPart1(input: string) {
  const map = new Grid<string>();
  input
    .split("\n")
    .map((line, y) => {
      line.split("")
        .map((mark, x) => map.set(new Point2D(x,y), mark));
    });
  simulatePatrol(map);
  const spotsVisited = map.iterable()
    .filter(([,mark]) => mark === "X")
    .length
    
  return spotsVisited;
};

function doPart2(input: string) {
  const startingMap = new Grid<string>();
  input
    .split("\n")
    .map((line, y) => {
      line.split("")
        .map((mark, x) => startingMap.set(new Point2D(x,y), mark));
    });
  const firstRun = startingMap.clone();
  simulatePatrol(firstRun);
  let [guardStart] = startingMap.iterable().find(([,mark]) => mark !== "." && mark !== "#")!;
  const runsInALoop = firstRun.iterable()
    // look at visited spots, except for the starting position
    .filter(([pos,mark]) => mark === "X" && !pos.equals(guardStart))
    .map(([possibleBlockPoint]) => {
      const alternateMap = startingMap.clone();
      alternateMap.set(possibleBlockPoint, "#");
      const isInLoop = simulatePatrol(alternateMap);
      return isInLoop;
    })
    .filter(inALoop => inALoop)
    .length;

  return runsInALoop;
};

main();