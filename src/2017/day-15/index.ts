import { getPuzzleInput } from '../../aocClient';
import { parseNumber } from '../../util/stringUtils';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(15, 2017);
  const part1Expected = 612;
  const part2Expected = 285;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const makeGen = (initialVal:number, multiplicand:number) => {
  return function* generator() {
    let prev = initialVal;
    while (true) {
      const product = prev * multiplicand;
      prev = product % 2147483647;
      yield prev;
    }
  };
};

const multipleGen = (initialVal:number, multiplicand:number, multipleOf: number) => {
  const gen = makeGen(initialVal, multiplicand)();
  return function* multGenerator() {
    while (true) {
      let val:number;
      do {
        val = gen.next().value;
      } while(val % multipleOf !== 0)
      yield val;
    }
  };
};

function doPart1(input: string) {
  const [aStart, bStart] = input.split('\n').map(parseNumber)

  const genA = makeGen(aStart!, 16807)();
  const genB = makeGen(bStart!, 48271)();
  
  let judge = 0;
  for(let i = 0; i < 40000000; i++) {
    const [a, b] = [genA.next().value, genB.next().value];
    if((a & 0xffff) === (b & 0xffff))
      judge++;
  }

  return judge;
};

function doPart2(input: string) {
  const [aStart, bStart] = input.split('\n').map(parseNumber)

  const genA = multipleGen(aStart!, 16807, 4)();
  const genB = multipleGen(bStart!, 48271, 8)();
  
  let judge = 0;
  for(let i = 0; i < 5000000; i++) {
    const [a, b] = [genA.next().value, genB.next().value];
    if((a & 0xffff) === (b & 0xffff))
      judge++;
  }

  return judge;
};

main();