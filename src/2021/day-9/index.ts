import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { multiply, sum } from '../../util/arrayUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { isFinite } from 'lodash-es';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { assert } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 475
  doPart2(allInput);
};

function doPart1(input: string) {
  const lines = input.split('\n');
  const gridWidth = lines[0].length;
  const heightMap = lines.map(line => line.split('')).flat().map(ltr => Number(ltr));
  
  const lowPoints = heightMap.filter((val, i, data) => {
    const neighbors = [
      (i % gridWidth === 0 ? undefined : data[i-1]),
      (i % gridWidth === gridWidth - 1 ? undefined : data[i+1]),
      data[i-gridWidth],
      data[i+gridWidth]
    ].filter(val => isFinite(val));
    return neighbors.every(neighbor => neighbor! > val);
  });

  const riskLevel = lowPoints.map(point => point+1).reduce(sum);
  console.log(`The risk level is ${riskLevel}`);
};

function doPart2(input: string) {
  const lines = input.split('\n');
  const gridWidth = lines[0].length;
  const heightMap = lines.map(line => line.split('')).flat().map(ltr => Number(ltr));
  
  const lowPoints = heightMap.map((val, i, data) => {
    const neighbors = [
      (i % gridWidth === 0 ? undefined : data[i-1]),
      (i % gridWidth === gridWidth - 1 ? undefined : data[i+1]),
      data[i-gridWidth],
      data[i+gridWidth]
    ].filter(val => isFinite(val));
    return [i, neighbors.every(neighbor => neighbor! > val)];
  })
  .filter(([index, isLow]) => isLow)
  .map(([index]) => index as number);
  
  const threeLargest = lowPoints
    .map(lowPoint => walkNeighbors(lowPoint, gridWidth, heightMap, []))
    .sort((a,b) => b-a)
    .slice(0, 3);
  
  console.log(`The three largest multiplied together is ${threeLargest.reduce(multiply)}`);
};

function walkNeighbors(from: number, gridWidth: number, data: number[], seen: number[]): number {
  if (seen.includes(from))
    return 0;
  
  seen.push(from);
  const neighbors = [
    (from % gridWidth === 0 ? undefined : from-1),
    (from % gridWidth === gridWidth - 1 ? undefined : from+1),
    from-gridWidth,
    from+gridWidth
  ]
  // is this a real index with a real value in the array
  .filter(val => val !== undefined && isFinite(data[val]))
  // have we not seen this index
  .filter(val => !seen.includes(val!))
  // only look at neighbors less than 9
  .filter(val => data[val!] < 9);
  
  return 1 + neighbors.map(index => walkNeighbors(index!, gridWidth, data, seen)).reduce(sum, 0);
}

main();