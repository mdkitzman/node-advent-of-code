import fs  from 'fs';
import { ListNode, LinkedList } from '../../util/linked-list';

const inputParser = /(\d+) players; last marble is worth (\d+) points/;

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 390093
  doPart2(allInput); // 3150377341
};

const playGame = (playerCount: number, maxRounds: number):number => {
  const scores = new Array(playerCount).fill(0);
  const initial = new ListNode<number>(0);
  initial.next = initial;
  initial.previous = initial;
  const list = new LinkedList<number>(initial)
  
  for(let round = 1; round <= maxRounds; round++) {
    if (round % 23 === 0) {
      // score!
      // go back 7 entries in the list
      list.head = list
        .head!
        .previous!
        .previous!
        .previous!
        .previous!
        .previous!
        .previous!;
      const removed = list.head.previous!;
      list.head.previous = removed.previous;
      removed.previous!.next = list.head;
      scores[round % playerCount] += round + removed.data;
    } else {
      const newPrev = list.head!.next!;
      const newNext = newPrev.next!;
      const newNode = new ListNode<number>(round, newNext, newPrev);
      list.head = newNode;      
    }
  }
  
  return Math.max(...scores);
}

function doPart1(input: string) {
  const [ playerCount, maxRounds ] = inputParser.exec(input)!.slice(1, 3).map(val => parseInt(val, 10));
  const score = playGame(playerCount, maxRounds);

  console.log(`Max high score is ${score}`);
};

function doPart2(input: string) {
  const [ playerCount, maxRounds ] = inputParser.exec(input)!.slice(1, 3).map(val => parseInt(val, 10));
  const score = playGame(playerCount, maxRounds * 100);

  console.log(`Max high score is ${score}`);
};

main();