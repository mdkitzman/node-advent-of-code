import fs  from 'fs';
import { Point2D } from '../../util/point';
import { Board, ELF, GOBLIN, playGame, SPACE, WALL } from './game';

const test = `#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######`

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(test);
  doPart2(allInput);
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
  console.log(score);
};

function doPart2(input: string) {

};

main();