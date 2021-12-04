import fs  from 'fs';
import { BingoBoard } from './bingo-board';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 28082
  doPart2(allInput); // 8224
};

function doPart1(input: string) {
  const [draw, ...boards] = input.split('\n\n');
  const bingoNumbers = draw.split(',').map(val => parseInt(val, 10));

  const bingoBoards = boards.map(makeBoard);
  let winner;
  let winningNumber = 0;
  bingoBoards.forEach(board => board.on("bingo!", (winningBoard, callNumber) => {
    winner = winningBoard;
    winningNumber = callNumber;
  }));

  for(let iDraw = 0; iDraw < bingoNumbers.length && !winner; iDraw++) {
    const nextNumber = bingoNumbers[iDraw];
    bingoBoards.forEach(board => board.emit("callNumber", nextNumber));
  }
  const score = winner.score(winningNumber);

  console.log(`The winning number was ${winningNumber} and the winning board has a score of ${score}`);
};

function doPart2(input: string) {
  const [draw, ...boards] = input.split('\n\n');
  const bingoNumbers = draw.split(',').map(val => parseInt(val, 10));

  const playingBoards = boards.map(makeBoard);
  let lastWinner;
  let lastNumber;
  
  playingBoards.forEach(board => board.on("bingo!", (winningBoard, callNumber) => {
    lastWinner = winningBoard;
    lastNumber = callNumber;
  }));
  
  for(let iDraw = 0; iDraw < bingoNumbers.length; iDraw++) {
    const callNumber = bingoNumbers[iDraw];
    playingBoards.forEach(board => board.emit("callNumber", callNumber));
  }
  const score = lastWinner.score(lastNumber);
  
  console.log(`The winning number was ${lastNumber} and the winning board has a score of ${score}`);
};

function makeBoard(input: string): BingoBoard {
  const numbers = input
    .split('\n')
    .map(line => line.trim().split(/\s+/))
    .flat()
    .map(val => parseInt(val, 10));
  
  return new BingoBoard(numbers);    
}

main();