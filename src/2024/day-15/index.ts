import { assert } from 'console';
import { getPuzzleInput } from '../../aocClient.ts';
import { sum } from '../../util/arrayUtils.ts';
import { Grid } from '../../util/grid.ts';
import { Point2D } from '../../util/point.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(15, 2024);
  const part1Expected = 1371036;
  const part2Expected = 1392847;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const getWarehouseLayout = (input: string, charMapper: (ch: string) => string = ch => ch) => {
  const warehouse = new Grid<string>();
  input
    .split("\n")
    .forEach((line, y) => line.split("").map(charMapper).map(ch => ch.split("")).flat().forEach((ch, x) => {
      if (ch === ".")
        return;
      warehouse.set(new Point2D(x,y), ch);
    }));
  return warehouse;
}

const getMoveset = (input: string) => {
  const moveMap = {
    ">": new Point2D(1, 0),
    "<": new Point2D(-1, 0),
    "v": new Point2D(0, 1),
    "^": new Point2D(0, -1),
  };

  return input
    .split("\n")
    .map(line => line.split("").map(ch => moveMap[ch] as Point2D))
    .flat();
}

const wideBox = ["[", "]"];
const moveBoxesIn = (warehouse: Grid<string>) => {
  const moveBoxes = (dir: Point2D, pos: Point2D) => {
    const thisVal = warehouse.get(pos);
    
    if (thisVal === undefined)
      return;

    const pointsToMove: Point2D[] = [pos];
    if (dir.x === 0) { // making a vertical move
      if (wideBox.includes(thisVal)) {
        const connectedPos = thisVal === "["
          ? pos.toAdded(new Point2D(1, 0))
          : pos.toAdded(new Point2D(-1, 0));
        pointsToMove.push(connectedPos);
      }
    }
    
    // move any boxes in our way
    pointsToMove.forEach(p => moveBoxes(dir, p.toAdded(dir)));
    pointsToMove.forEach(p => {
      // move ourselves
      warehouse.set(p.toAdded(dir), warehouse.get(p)!);
      // delete our old positions
      warehouse.delete(p);
    });
  }
  return moveBoxes;
}

const canMoveBoxesIn = (warehouse: Grid<string>) => {
  const canMoveBoxes = (dir: Point2D, pos: Point2D) => {
    const thisVal = warehouse.get(pos);
    
    if (thisVal === "#") 
      return false;
    if (thisVal === undefined)
      return true;

    const pointsToCheck: Point2D[] = [pos];
    if (dir.x === 0) { // making a vertical move
      if (wideBox.includes(thisVal)) {
        const connectedPos = thisVal === "["
          ? pos.toAdded(new Point2D(1, 0))
          : pos.toAdded(new Point2D(-1, 0));
        pointsToCheck.push(connectedPos);
      }      
    }
    return pointsToCheck.every(p => canMoveBoxes(dir, p.toAdded(dir)));
  }
  return canMoveBoxes;
};

const runBoxMovingSimulation = (warehouse: Grid<string>, moves: Point2D[]) => {
  const [[pRobot]] = warehouse.iterable().filter(([,ch]) => ch === "@");
  warehouse.delete(pRobot);

  const canMoveBoxes = canMoveBoxesIn(warehouse);
  const moveBoxes = moveBoxesIn(warehouse);

  for (const moveDir of moves) {
    const wantedMove = pRobot.toAdded(moveDir);
    if (canMoveBoxes(moveDir, wantedMove)) {
      moveBoxes(moveDir, wantedMove);
      pRobot.add(moveDir);
    }
  }
}

function doPart1(input: string) {
  const [wInput, mInput] = input.split("\n\n");
  
  const warehouse = getWarehouseLayout(wInput);
  const moves = getMoveset(mInput);

  runBoxMovingSimulation(warehouse, moves);
  
  return warehouse.iterable()
    .filter(([,str]) => str === "O")
    .map(([{x,y}]) => 100 * y + x)
    .reduce(sum);
};

function doPart2(input: string) {
  const [wInput, mInput] = input.split("\n\n");
  const doubler = (ch: string) => {
    switch (ch) {
      case "@": return "@.";
      case "O": return "[]";
      default: return `${ch}${ch}`;
    }
  }
  
  const warehouse = getWarehouseLayout(wInput, doubler);
  const moves = getMoveset(mInput);

  runBoxMovingSimulation(warehouse, moves);
  
  return warehouse.iterable()
    .filter(([,str]) => str === "[")
    .map(([{x, y}]) => 100 * y + x)
    .reduce(sum);
  return 0;
};

main();