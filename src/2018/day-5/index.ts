import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { min } from '../../util/arrayUtils';
import { alphabet } from '../../util/stringUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(5, 2018);
  const part1Expected = 11252;
  const part2Expected = 6118;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const polarPair = (a: string, b:string): boolean => 
  a !== b && (
    a.toUpperCase() === b ||
    b.toUpperCase() === a
  );

const doReaction = (input: string): string => {
  const data = input.split('');
  let deleted = false;
  do {
    deleted = false;
    for(let i = 0; i < data.length -1; i++) {
      if(polarPair(data[i], data[i+1])) {
        data.splice(i, 2);
        deleted = true;
      }
    }
  } while (deleted);
  return data.join('');
}

function doPart1(input: string) {
  const data = doReaction(input);
  return data.length;
};

function doPart2(input: string) {
  const letters = alphabet.split('');
  const smallest = letters
    .map(letter => input.replace(new RegExp(`${letter}`, 'ig'), ''))
    .map(doReaction)
    .map(str => str.length)
    .reduce(min)
  return smallest;
};

main();