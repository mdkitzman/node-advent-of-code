import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import { ConwaySpace } from './cube.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(17, 2020);
  const part1Expected = 375;
  const part2Expected = 2192;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const pointMapper = (neighborCount:number, isActive:boolean):boolean => {
  return isActive
    ? (neighborCount === 2 || neighborCount === 3)
    : neighborCount === 3
}

function doPart1(input: string) {
  const cube = new ConwaySpace(input, 3);
  for(let i = 0; i < 6; i++) {
    cube.cycle(pointMapper);
  }
  return cube.activeCount;
};

function doPart2(input: string) {
  const cube = new ConwaySpace(input, 4);
  for(let i = 0; i < 6; i++) {
    cube.cycle(pointMapper);
  }

  return cube.activeCount;
};

main();