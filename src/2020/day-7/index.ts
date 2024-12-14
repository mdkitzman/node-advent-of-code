import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { sum, anyTrue } from '../../util/arrayUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(7, 2020);
  const part1Expected = 119;
  const part2Expected = 155802;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

interface Contents {
  [bagColor:string]:number
}
const bagMatcher = /^([a-z]+ [a-z]+) bags contain /;
const containsMatcher = /(\d+) ([a-z]+ [a-z]+) bag/gm
type InputLine = { color:string, contents:Contents};

const parseInput = (input:string): InputLine[] => 
  input.split('\n')
  .map(line => {
    const [_, color ] = bagMatcher.exec(line)  || [];
    let vals;
    const contents:Contents = {};
    while ((vals = containsMatcher.exec(line)) !== null) {
      const [_, numStr, color] = vals;
      contents[color] = parseInt(numStr, 10);
    } 
    return {color, contents};
  });

function doPart1(input: string) {
  const bags = parseInput(input);
  const needle = "shiny gold";
  
  const find = (color:string):boolean => {
    if(color === needle)
      return true;
    const bag = bags.find((value) => value.color === color)!;
    const found = Object.entries(bag.contents)
      .map(([bagColor, _]) => find(bagColor))
      .reduce(anyTrue, false);
    return found;
  }
  
  const num = bags
    .filter(line => line.color !== needle)
    .map(line => find(line.color) ? 1 : 0)
    .reduce(sum, 0);
  return num;
};

function doPart2(input: string) {
  const bags = parseInput(input);
  
  const countBags = (color:string):number => {
    const bag = bags.find((value) => value.color === color)!;
    const found = Object.entries(bag.contents)
      .map(([bagColor, numBags]) => countBags(bagColor) * numBags)
      .reduce(sum, 1);
    return found;
  }
  const num = countBags("shiny gold") - 1;
  return num;
};

main();