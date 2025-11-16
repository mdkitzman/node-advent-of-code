import { identity } from 'lodash-es';
import { lcm } from '../../util/numberUtils.ts';
import { Monkey, type Relief } from './monkey.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const main = async () => {
  const allInput = await getPuzzleInput(11, 2022);
  doPart1(allInput); // 121450
  doPart2(allInput); // 28244037010
};

function doPart1(input: string) {
  const worryReducer = (worry:number) => Math.floor(worry/3);
  const score = watchMonkeys(input, 20, worryReducer);
  console.log(score);
};

function doPart2(input: string) {
  const worryReducer = identity;
  const score = watchMonkeys(input, 10_000, worryReducer);
  console.log(score);
};

function watchMonkeys(input: string, rounds: number, relief?: Relief): number {
  const monkeys = input
    .split('\n\n')
    .map(block => new Monkey(block, relief));
  
  const monkeyCounters = new Array(monkeys.length).fill(0);
  monkeys.forEach(m => {
    m.on('inspect', (id: number, count:number) => {
      monkeyCounters[id]+=count;
    });
    monkeys
      .filter(m2 => m2.id !== m.id)
      .forEach(m2 => m.on('throw', (id, worry) => m2.catch(id, worry)));
  });

  // used to keep the worry values from growing unbounded!
  const worryBounder = monkeys.map(m => m.moduloTest).reduce(lcm);
  for(let iRound = 0; iRound < rounds; iRound++) {
    monkeys.forEach(m => m.inspectItems(worryBounder));
  }

  monkeyCounters.sort((a,b) => b - a);
  const [max1, max2] = monkeyCounters;
  return max1 * max2;
}

main();