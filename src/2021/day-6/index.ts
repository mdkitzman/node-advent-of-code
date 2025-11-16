import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { sum } from '../../util/arrayUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 396210
  doPart2(allInput); // 1770823541496
};

function doPart1(input: string) {
  const poolSize = waitNDays(input, 80);

  console.log(`There are ${poolSize} fish after 80 days`);
};

function doPart2(input: string) {
  const poolSize = waitNDays(input, 256);

  console.log(`There are ${poolSize} fish after 256 days`);
};

// Bigtime help from this post
// https://www.reddit.com/r/adventofcode/comments/r9z49j/comment/hnfifxz/?utm_source=share&utm_medium=web2x&context=3
/**
 * Rather than think about each number as a representation of a fish, group them all 
 * by how many days they have left.
 * 
 * i.e.
 * For this array
 * [3,4,3,1,2]
 * 
 * The state array would look like this:
 * [0,1,1,2,1,0,0,0,0,0]
 */
function waitNDays(input:string, days: number): number {
  const fishStates:number[] = [0,0,0,0,0,0,0,0,0];
  input
    .split(',')
    .map(val => parseInt(val, 10))
    .forEach(fishState => fishStates[fishState] += 1);

  for (let i = 0; i < days; i++) {
    // Find the count of fish at state 0, and remove that from the array
    const newFishCount = fishStates.shift()!;
    // those fish make new fish and start at state 8
    fishStates.push(newFishCount);
    // add these fish to state 6
    fishStates[6] += newFishCount;
  }
  
  // add 'em all up
  return fishStates.reduce(sum);
}

main();