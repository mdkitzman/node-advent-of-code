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
  doPart1(allInput); // 1665
  doPart2(allInput); // 1702
};

function doPart1(input: string) {
  let count = 0;
  const vals = input
    .split('\n')
    .map(line => parseInt(line, 10))
  for (let i =0; i < vals.length -1; i++) {
    if (vals[i] < vals[i+1])
      count++;
  }
  console.log(count)
};

function doPart2(input: string) {
  let count = 0;
  const windowVals: number[] = [];
  const vals = input.split('\n').map(line => parseInt(line, 10))

  for (let i =0; i < vals.length - 2; i++) {
    windowVals.push(vals[i] + vals[i+1] + vals[i+2]);
  }

  for (let i = 0; i < windowVals.length - 1; i++) {
    if (windowVals[i] < windowVals[i+1])
      count++;
  }
  
  console.log(count);
};

main();