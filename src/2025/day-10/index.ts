import { zip } from 'lodash-es';
import { getPuzzleInput } from '../../aocClient.ts';
import { sum } from '../../util/arrayUtils.ts';
import { generateRange } from '../../util/numberUtils.ts';
import { parseAllNumbers } from '../../util/stringUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(10, 2025);
  const part1Expected = 428;
  const part2Expected = null;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const res = input.split("\n")
    .map(
      line => line.split(' ').map(group => {
        switch (group[0]) {
          case '[': // light diagram => parse binary number (but reversed!)
            return parseInt(group.replaceAll('.', '0').replaceAll('#', '1').split('').reverse().join('').substring(1, group.length - 1), 2);
          case '(': // wiring/button schematics => bit masks
            return parseAllNumbers(group).map(pos => Math.pow(2, pos)).reduce(sum);
          default:
            return 0;
        }
      })
    )
    .map(([lights, ...buttonsAndJoltage]) => [lights, ...buttonsAndJoltage.reverse()])
    .map(([lights, _joltage, ...buttons]) => {
      // find the minimal number of button presses to match the desired light pattern
      // This is done by brute-forcing all combinations of button presses (up to 2^n where n is number of buttons)
      const buttonCount = buttons.length;
      let minPresses = Infinity;
      for(const combo of generateRange(0, Math.pow(2, buttonCount))) {
        let combinedMask = 0;
        let presses = 0;
        for(let buttonIndex = 0; buttonIndex < buttonCount; buttonIndex++) {
          if ((combo & Math.pow(2, buttonIndex)) !== 0) {
            combinedMask ^= buttons[buttonIndex];
            presses++;
          }
        }
        if (combinedMask === lights) {
          minPresses = Math.min(minPresses, presses);
        }
      }
      return minPresses;
    })
    .reduce(sum)
    ;
  
  return res;
};

/**
 * A generator function that will yeild number elements of length n.  Each element in the provided array
 * will be incremented from 0 to maxes[i] value for each index i, before the next index is incremented.
 */
const generateRangeN = function*(maxes: number[]) {
  const incrementer = (vals: number[], index: number): boolean => {
    if (index >= vals.length) {
      return false;
    }

    if (vals[index] < maxes[index]) {
      vals[index]++;
      return true;
    } else {
      vals[index] = 0;
      return incrementer(vals, index + 1);
    }
  }
  const vals = new Array(maxes.length).fill(0);
  do {
    yield [...vals];
  } while (incrementer(vals, 0));
};

function doPart2(input: string) {
  const res = input.split("\n")
    .map(
      line => line.split(' ').map(group => {
        switch (group[0]) {
          case '{': // joltages => bitwise AND of several numbers
            return parseAllNumbers(group);
          case '(': // wiring/button schematics => bit masks
            return parseAllNumbers(group);
          default:
            return [0]
        }
      })
    )
    .map(([, ...buttonsAndJoltage]) => ({
      joltages: buttonsAndJoltage.pop() as number[],
      buttons: buttonsAndJoltage as number[][],
    }))
    .map(({joltages, buttons}) => {
      const maxPressesPerButton = buttons.map(button => {
        const maxPresses = Math.min(...button.map(joltageIndex => joltages[joltageIndex]));
        return maxPresses;
      });

      let minPresses = Infinity;
      for (const multiplerSet of generateRangeN(maxPressesPerButton)) {
        const computedJoltage = new Array(joltages.length).fill(0);
        zip(buttons, multiplerSet)
          .forEach(([button, presses]) => button.map(joltageIndex => computedJoltage[joltageIndex] += presses));
        
        if (zip(computedJoltage, joltages).every(([computed, target]) => computed === target)) {
          // valid combination
          const pressCount = multiplerSet.reduce(sum);
          minPresses = Math.min(minPresses, pressCount);
        }
      }
      
      return minPresses;
    });
  
  return res;
};

main();