import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import { ListNode, LinkedList } from '../../util/linked-list.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(9, 2018);
  const part1Expected = 390093;
  const part2Expected = 3150377341;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const inputParser = /(\d+) players; last marble is worth (\d+) points/;

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

  return score;
};

function doPart2(input: string) {
  const [ playerCount, maxRounds ] = inputParser.exec(input)!.slice(1, 3).map(val => parseInt(val, 10));
  const score = playGame(playerCount, maxRounds * 100);
  
  return score;
};

main();