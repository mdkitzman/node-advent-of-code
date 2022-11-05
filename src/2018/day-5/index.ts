import fs  from 'fs';
import { min } from '../../util/arrayUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 11252
  doPart2(allInput); // 6118
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
  console.log(`There are ${data.length} units left`);
};

function doPart2(input: string) {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const smallest = letters
    .map(letter => input.replace(new RegExp(`${letter}`, 'ig'), ''))
    .map(doReaction)
    .map(str => str.length)
    .reduce(min)
  console.log(`The smallest reaction was length ${smallest}`);
};

main();