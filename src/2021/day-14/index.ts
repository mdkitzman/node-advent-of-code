import fs  from 'fs';
import { countBy, range } from 'lodash';
import safeRecord from '../../util/safe-record';
import { minMax, windowed } from '../../util/arrayUtils'

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 3118
  doPart2(allInput); // 4332887448171
};

function doPart1(input: string) {
  process(input, 10);
};

function doPart2(input: string) {
  process(input, 40);
};

function process(input:string, count: number) {
  const [template, matchers] = getSetup(input);  

  // Get the inital 
  let pairCounts = safeRecord(0, countBy(windowed(2, [...template]).map(pair => pair.join(''))));
  
  // Count the pairs!
  range(0,count).forEach(() => {
    const newCounts = safeRecord(0);
    Object.entries(pairCounts)
    .forEach(([pair, count]) => {
      newCounts[matchers[pair].left]  += count;
      newCounts[matchers[pair].right] += count;
    });
    pairCounts = newCounts;
  });

  const letterCounts = Object
    .entries(pairCounts)
    .map(([pair, count]) => ({
      count,
      // only count the first character, otherwise we'd double count the letters
      letter: pair[0],
    }))
    .reduce((acc, entry) => {
      acc[entry.letter] += entry.count;
      return acc;
    }, safeRecord(0));

  // Also add in the last letter
  letterCounts[template[template.length - 1]]++;

  const [min, max] = minMax(Object.values(letterCounts));
    
  console.log(`The delta of the min and max counts = ${max - min}`);
}

type Transform = {
  [pair: string] : {
    left: string;
    right: string;
  }
};

function getSetup(input:string): [ string, Transform ] {
  const [ template, pairLines ] = input.split('\n\n');

  const matchers = pairLines
    .split('\n')
    .map(line => line.split(' -> '))
    .map(([match, insert]) => ({
      [match]: {
        left: `${match[0]}${insert}`,
        right: `${insert}${match[1]}`,
      }
    }))
    .reduce((a, b) => ({...a, ...b}));
  return [ template, matchers ];
}

main();