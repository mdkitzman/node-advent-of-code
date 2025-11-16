import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { assert } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { intersection, zip } from 'lodash-es';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import Iter from 'es-iter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput);
  doPart2(
`acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`
  );
};

function doPart1(input: string) {
  const signals:string[] = [];
  const outputs:string[] = [];

  input.split('\n')
    .map(line => line.split(' | '))
    .forEach(([signal, output]) => {
      signals.push(...(signal.split(' ')));
      outputs.push(...(output.split(' ')));
    });
  // 2,4,3,7 map to digits 1,4,7, and 8
  const unique = outputs.map(str => str.length).filter(len => [2,4,3,7].includes(len)).length;

  console.log(`There are ${unique} unique signals`)
};

function doPart2(input: string) {
  const signals:string[][] = [];
  const outputs:string[][] = [];

  input.split('\n')
    .map(line => line.split(' | '))
    .forEach(([signal, output]) => {
      signals.push(signal.split(' '));
      outputs.push(output.split(' '));
    });

  const mapping = determineLetterMapping(signals[0]);
  const number = determineOutput(outputs[0], mapping);
};

const digitMap = new Map<string, number>([
  ['abcefg', 0],
  ['cf',     1],
  ['acdeg',  2],
  ['acdfg',  3],
  ['bcdf',   4],
  ['abdfg',  5],
  ['abdefg', 6],
  ['acf',    7],
  ['abcdefg',8],
  ['abcdfg', 9],
]);

const uniqueDigits = ['cf', 'bcdf', 'acf', 'abcdefg'];

const identityMap = new Map<string, string>(zip('abcdefg'.split(''), 'abcdefg'.split('')) as Tuple);

function toDigit(input: string, letterMapping: Map<string, string>): number {
  const rewiredInput = input.split('').map(inputLtr => letterMapping.get(inputLtr)!).sort().join('');
  return digitMap.get(rewiredInput)!;
}

function determineOutput(outputs: string[], letterMapping: Map<string, string>): number {
  const strNum = outputs.map(output => toDigit(output, letterMapping)).map(d => String(d)).join('');
  return Number(strNum);
}

function doesMappingWork(test: string, expected: string, mapping: Map<string, string>): boolean {
  const testNum = toDigit(test, mapping);
  const expectedNum = toDigit(expected, identityMap);

  return isFinite(testNum) && testNum === expectedNum;
}

function determineLetterMapping(inputs: string[]): Map<string, string> {
  const possibleMappings: string[][] = new Iter('abcdefg'.split('')).permutations(7).toArray();
  const inputMap = inputs
    .filter(signal => uniqueDigits.map(i => i.length).includes(signal.length))
    .sort((a,b) => a.length - b.length)
    .map(input => ([ input, uniqueDigits.find(v => v.length === input.length)!]));
  
  let maps: Map<string, string>[] = [];
  for(let i = 0; i < possibleMappings.length; i++) {
    //const tuples = [['d','a'],['e','b'],['a','c'],['f','d'],['g','e'],['b','f'],['c','g']];
    const tuples = zip(possibleMappings[i], 'abcdefg'.split('')) as Tuple;
    const map = new Map<string, string>(tuples);
    // check to see if digits 1,4, and 7 (not 8) work with this mapping
    const uniquesWork = inputMap.filter(val => val.length !== 7).every(([input, expected]) => doesMappingWork(input, expected, map));
    if (uniquesWork)
      maps.push(map);
  }


  return maps.pop()!;
}

type Tuple = [string, string][];

main();