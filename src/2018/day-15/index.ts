import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { Point2D } from '../../util/point';
import { Board, ELF, GOBLIN, playGame, SPACE, WALL } from './game';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(15, 2018);
  const part1Expected = null;
  const part2Expected = null;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const setupBoard = (input:string): Board => {
  const board = new Board();
  
  input
    .split('\n')
    .flatMap((line, y) => line
      .split('')
      .forEach((ch, x) => {
        const pos = new Point2D(x,y);
        switch (ch) {
          case ELF:
          case GOBLIN:
            board.addNPC(pos, ch);
            break;
          case WALL:
          case SPACE:
            board.addTile(pos, ch);
            break;
        }
      })
    );
  return board;
}

function doPart1(input: string) {
  const board = setupBoard(input);
  const score = playGame(board);
  return score;
};

function doPart2(input: string) {
  return 0;
};

main();