import { getPuzzleInput } from '../../aocClient';
import { sum } from '../../util/arrayUtils';
import { parseAllNumbers } from '../../util/stringUtils';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(13, 2024);
  const part1Expected = 29711;
  const part2Expected = 94955433618919;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

type ClawMachine = {
  btnA: [number, number];
  btnB: [number, number];
  prize: [number, number];
}
/**
 * Solved using a system two equations and two variables, solve for A and B
 * aX*A + bX*B = slnX
 * aY*A + bY*B = slnY
 *
 * After solving the second equation for button B, substituting it into the first equation,
 * you get this
 * A = (bY*slnX - bX*slnY)/(bY*aX - bX*aY)
 * Plug that value in for one of the other equations to get the value for B
 */
const findSolution = ({
  btnA: [aX, aY],
  btnB: [bX, bY],
  prize: [slnX, slnY]
}: ClawMachine) => {
  const A = (bY*slnX - bX*slnY)/(bY*aX - bX*aY);
  const B = (slnY - aY*A)/bY;
  if (!Number.isInteger(A) || !Number.isInteger(B))
    return undefined;
  return [A, B];
}

function doPart1(input: string) {
  const coinCost = input.split("\n\n")
    .map(block => {
      const [ btnA, btnB, prize] = block.split("\n").map(parseAllNumbers);
      return {
        btnA, btnB, prize
      } as ClawMachine;
    })
    .map(findSolution)
    .filter(soln => soln !== undefined)
    .map(([A, B]) => A*3 + B)
    .reduce(sum, 0)
  return coinCost;
};

function doPart2(input: string) {
  const coinCost = input.split("\n\n")
    .map(block => {
      const [ btnA, btnB, prize] = block.split("\n").map(parseAllNumbers);
      const longPrize = prize.map(p => p + 10000000000000);
      return {
        btnA, btnB, prize: longPrize
      } as ClawMachine;
    })
    .map(findSolution)
    .filter(soln => soln !== undefined)
    .map(([A, B]) => A*3 + B)
    .reduce(sum, 0)
  return coinCost;
};

main();