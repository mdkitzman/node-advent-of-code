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
  doPart1(allInput); // 841526
  doPart2(allInput); // 4790390
};

function doPart1(input: string) {
  const rows = input.split('\n');
  const [gammaRate, epsilonRate] = gammaEpsilonRates(rows);
  
  console.log(`The result of gammaRate ${gammaRate} and epsilonRate ${epsilonRate} is ${gammaRate * epsilonRate} `);
};

function doPart2(input: string) {
  const rows = input.split('\n');
  
  const bitCount = rows[0].split('').length;
  
  function findMatch(rateIndex: number, equalComp: 0|1): number {
    let results = [...rows];
    for (let i = 0; i < bitCount && results.length > 1; i++) {
      const rates = gammaEpsilonRates(results);
      const rate = rates[rateIndex];
      
      const totalInThisPosition = results
        .map(row => row.split('')[i])
        .map(ch => parseInt(ch, 10))
        .reduce(sum);
      
      const compareTo = totalInThisPosition === (results.length / 2)
        ? equalComp
        : (rate >> bitCount - i - 1) & 1;
      results = results
        .filter(row => row.split('')[i] === compareTo.toString(10))
    }
    return parseInt(results[0], 2);
  }

  const oxygenRating = findMatch(0, 1);
  const co2Rating = findMatch(1, 0);

  console.log(`The result of oxygenRating ${oxygenRating} and co2Rating ${co2Rating} is ${oxygenRating * co2Rating}`);
};

function gammaEpsilonRates(input: string[]): [number, number] {
  const totals = input
                .map(line => line.split('').map(ch => parseInt(ch, 10)))
                .reduce((prev, cur) => prev.map((col, index) => col + cur[index]));
  const binStr = totals
              .map(count => count < input.length/2 ? 0 : 1)
              .join('');
  const gammaRate = parseInt(binStr, 2);
  const epsilonRate = parseInt(binStr.split('').map(ch => ch === '1' ? '0' : '1').join(''), 2);
  return [gammaRate, epsilonRate];
}

main();