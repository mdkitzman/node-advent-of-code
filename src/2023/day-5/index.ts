import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { pipe } from '../../util/pipe.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { chunk, min } from '../../util/arrayUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { generateRange, inRange } from '../../util/numberUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import timeFn from '../../util/timeFn.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  
  timedPart1(allInput);
  timedPart2(allInput);
};

const isInRange = (source:number) => (([,src, rng]: number[]) => inRange(src, src+rng)(source));

class MapCollection {
  public readonly ranges: number[][];

  constructor() {
    this.ranges = [];
  }

  addRange(line: string) {
    const [dst, src, range] = line.split(' ').map(v => parseInt(v, 10));
    this.ranges.push([dst, src, range]);
  }

  mapTo(value: number): number {
    const range = this.ranges.find(isInRange(value));
    if (!range)
      return value;
    const [dst, src] = range;
    return dst + (value - src);    
  }
}

function getMaps(input: string) {
  const [seedLine, ...maps] = input
    .split('\n\n');
  const seeds = seedLine.slice('seeds: '.length).split(' ').map(v => parseInt(v, 10));
  const mappers = maps.map(txt => {
    const mapper = new MapCollection();
    const [, ...ranges] = txt.split('\n');
    ranges.forEach(mapper.addRange.bind(mapper));
    return mapper;
  });
  return {seeds, mappers};
}

function doPart1(input: string) {
  const {seeds, mappers} = getMaps(input);
  const [first, ...rest] = mappers;
  // chain the mappers' mapTo method together, one after the other in a pipeline.
  const pipeline = pipe(first.mapTo.bind(first), ...rest.map(m => m.mapTo.bind(m)));
  const minVal = seeds.map(pipeline).reduce(min);
  console.log(minVal); // 178159714
};


// Big thank you to mastermatt 🙇!
// I did not come up with this on my own, and this was his implementation
// https://github.com/mastermatt/advent_of_code/blob/master/2023/day05/index.js#L28-L63
function doPart2(input: string) {
  const {seeds, mappers} = getMaps(input);
  // sort the ranges for the mappers based on the source input
  mappers.forEach(m => m.ranges.sort((rangeA, rangeB) => rangeA[1] - rangeB[1]));

  // Takes the seed ranges and maps them through each mapper, yielding a collection seed ranges for the next mapper
  function walkRanges(seedRanges:number[][], mapper: MapCollection) {
    const results: number[][] = [];
  
    for (let [seedStart, seedLen] of seedRanges) {
      for (const [destStart, sourceStart, mapLen] of mapper.ranges) {
        if (!seedLen) break;
  
        // head of the seed range outside/before of map range
        if (seedStart < sourceStart) {
          const range = Math.min(seedLen, sourceStart - seedStart);
          results.push([seedStart, range]);
          // this map range consumes some of the seed range
          seedStart += range;
          seedLen -= range;
        }
        
        // head of the seed range is at or inside the map range
        if (seedStart >= sourceStart && seedStart < sourceStart + mapLen) {
          const range = Math.min(seedLen, sourceStart + mapLen - seedStart);
          results.push([destStart + (seedStart - sourceStart), range]);
          // this map range consumes some of the seed range
          seedStart += range;
          seedLen -= range;
        }
      }
  
      // The seed length might be completely consumed at this point.
      // if not, add the remainder to the results
      if (seedLen) {
        results.push([seedStart, seedLen]);
      }
    }
  
    return results;
  }

  const minVal = mappers
    .reduce(walkRanges, chunk(seeds, 2))
    .map(([a]) => a)
    .reduce(min);
  
  console.log(minVal); // 100165128
}

function bruteForcePart2(input: string) {
  const {seeds, mappers} = getMaps(input);
  const seedRanges = chunk(seeds, 2);
  const [first, ...rest] = mappers;
  const pipeline = pipe(first.mapTo.bind(first), ...rest.map(m => m.mapTo.bind(m)));

  let minVal = Number.MAX_VALUE;
  for (const [start, len] of seedRanges) {
    for (const seed of generateRange(start, start+len)) {
      minVal = Math.min(pipeline(seed), minVal);
    }
  }
  
  console.log(minVal); // too slow. 100165128
};

main();