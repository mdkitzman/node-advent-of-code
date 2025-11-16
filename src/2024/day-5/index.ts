import assert from 'assert';
import { getPuzzleInput } from '../../aocClient.ts';
import { sum } from '../../util/arrayUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(5, 2024);
  const part1Expected = 3608;
  const part2Expected = 4922;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const orderFinder = (rules: [number, number][]) => (updates: number[]) => {
  const usableRules = rules.filter(([left, right]) => updates.indexOf(left) >= 0 && updates.indexOf(right) >= 0);
  return updates.every(update => {
    const isOk = usableRules
      .filter(([left, right]) => left === update || right === update)
      .every(([left, right]) => {
        if (left === update) {
          return updates.indexOf(update) < updates.indexOf(right);
        } else {
          return updates.indexOf(left) < updates.indexOf(update);
        }
      });
    return isOk;
  });
}

const midpointNumber = (numbers: number[]): number => {
  if (numbers.length%2 === 0) { console.log("Found an even one!")}
  const [mid] = numbers.splice(numbers.length/2, 1);
  return mid;
}

function doPart1(input: string) {
  const [ruleInput, updateInput ] = input.split("\n\n");
  const rules: [number, number][]= ruleInput
    .split("\n")
    .map(line => {
      const [left, right] = line.split("|").map(d => parseInt(d, 10));
      return [left, right];
    });
  const updates:number[][] = updateInput.split("\n").map(line => line.split(",").map(d => parseInt(d, 10)));
  const isInOrder = orderFinder(rules);  
  const total = updates
    .filter(isInOrder)
    .map(midpointNumber)
    .reduce(sum);
  return total;
};

const orderSorter = (rules: [number, number][]) => (updates: number[]) => {
  const usableRules = rules.filter(([left, right]) => updates.indexOf(left) >= 0 && updates.indexOf(right) >= 0);
  updates.sort((a, b) => {
    const rule = usableRules.find(([left, right]) => (left === a || left === b) && (right === a || right === b));
    if (!rule)
      throw new Error("No rule found!!");
    return a === rule[0] ? -1 : 1;
  });
  return updates;
}

function doPart2(input: string) {
  const [ruleInput, updateInput ] = input.split("\n\n");
  const rules: [number, number][]= ruleInput
    .split("\n")
    .map(line => {
      const [left, right] = line.split("|").map(d => parseInt(d, 10));
      return [left, right];
    });
  const updates:number[][] = updateInput.split("\n").map(line => line.split(",").map(d => parseInt(d, 10)));
  const isInOrder = orderFinder(rules);
  const makeOrdered = orderSorter(rules);
  const total = updates
    .filter(updates => !isInOrder(updates))
    .map(makeOrdered)
    .map(midpointNumber)
    .reduce(sum)

  return total;
};

main();