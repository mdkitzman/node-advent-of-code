import { getPuzzleInput } from '../../aocClient';
import { multiply, sum } from '../../util/arrayUtils';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(3, 2020);
  const part1Expected = 209;
  const part2Expected = 1574890240;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const treeCount = (input:string, slope:{x:number,y:number}):number => {
  return input.split('\n')
    .filter((_, row) => row % slope.y === 0)
    .map((line, row) => {
      const colIndex = (slope.x * row) % line.length;
      return line[colIndex] === '#' ? 1 : 0;
    })
    .reduce(sum, 0);
}

function doPart1(input: string) {
  const trees = treeCount(input, {x:3, y:1});

  return trees;
};

function doPart2(input: string) {
  const slopes = [
    {x:1, y:1},
    {x:3, y:1},
    {x:5, y:1},
    {x:7, y:1},
    {x:1, y:2},
  ];
  const mult = slopes.map(slope => treeCount(input, slope)).reduce(multiply, 1);
  return mult;
};

main();