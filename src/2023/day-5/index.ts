import fs  from 'fs';
import { pipe } from '../../util/pipe';
import { chunk, min, minMax, windowed } from '../../util/arrayUtils';
import { generateRange, inRange } from '../../util/numberUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput);
  doPart2(allInput);
};

class MapCollection {
  private ranges: number[][];

  constructor() {
    this.ranges = [];
  }

  addRange(line: string) {
    const [dst, src, range] = line.split(' ').map(v => parseInt(v, 10));
    this.ranges.push([dst, src, range]);
  }

  mapTo(source: number): number {
    const range = this.ranges.find(([,src, rng]) => inRange(src, src+rng)(source));
    if (!range)
      return source;
    const [dst, src] = range;
    const offset = src - dst;
    return source - offset;
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
  const pipeline = pipe(first.mapTo.bind(first), ...rest.map(m => m.mapTo.bind(m)));
  const minVal = seeds.map(pipeline).reduce(min);
  console.log(minVal);
};

function doPart2(input: string) {
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
  
  console.log(minVal); // too slow.
};

main();