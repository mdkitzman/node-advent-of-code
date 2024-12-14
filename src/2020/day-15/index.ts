import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(15, 2020);
  const part1Expected = 959;
  const part2Expected = 116590;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const makeIterator = (initialVal:number[]) => {
  const seen:Map<number, number[]> = new Map();
  const seenHandler = {
    get: function(target:Map<number, number[]>, prop:string) {
      const key = parseInt(prop, 10);
      if(!target.has(key)){
        target.set(key, []);
      } 
      return target.get(key);
    }
  };
  const safeSeen = new Proxy(seen, seenHandler);
  let lastVal:number|undefined;
  let turn = 1;

  return function* elfNumGen() {
    while (turn <= initialVal.length) {
      lastVal = initialVal[turn-1];
      safeSeen[lastVal].push(turn++);
      yield lastVal;
    }
    while (true) {
      const turnsSeen = safeSeen[lastVal!];
      if(turnsSeen.length === 1) {
        lastVal = 0;
      } else {
        lastVal = turnsSeen[turnsSeen.length - 1] - turnsSeen[turnsSeen.length - 2];
      }
      safeSeen[lastVal].push(turn++);
      yield lastVal;
    }
  }  
}

function doPart1(input: string) {
  const starters = input.split(',').map(k => parseInt(k, 10));
  const itr = makeIterator(starters);

  let val = 0;
  for(let i = 0; i < 2020; i++){
    val = itr().next().value;
  }

  return val;
};

function doPart2(input: string) {
  const starters = input.split(',').map(k => parseInt(k, 10));
  const itr = makeIterator(starters);
  
  let val = 0;
  for(let i = 0; i < 30_000_000; i++){
    val = itr().next().value;
  }

  return val;
};

main();