import fs  from 'fs';
import timeFn from '../../util/timeFn';
import { zip, unzip } from 'lodash';
import { sum } from '../../util/arrayUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  const part1Expected = 1666427;
  const part2Expected = 24316233;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const getLists = (input:string): [number[], number[]] => {
  const [left, right] = unzip(input
    .split("\n")
    .map(line => line.split("   ").map(entry => parseInt(entry, 10))));
  return [left, right];
}

function doPart1(input: string) {
  const [left, right] = getLists(input);
    
  left.sort((a, b) => a-b);
  right.sort((a, b) => a -b);
  return zip(left, right).map(([a, b]) => Math.abs(a!-b!)).reduce(sum);
};

function doPart2(input: string) {
  const [left, right] = getLists(input);
  
  const counts = left.map(l => right.filter(r => l === r).length);
  return zip(left, counts).map(([l, c]) => l! * c!).reduce(sum);
};

main();