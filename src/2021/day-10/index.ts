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
  doPart1(allInput); // 319233
  doPart2(allInput);
};

const OPENS = ['(', '[', '{', '<'];
const CLOSES = [')', ']', '}', '>'];

function doPart1(input: string) {
  const totalScore = input.split('\n')
    .map(line => invalidScore(line))
    .reduce(sum, 0)

  console.log(`Total score is ${totalScore}`);
};

function doPart2(input: string) {
  const scores = input.split('\n')
    .filter(line => invalidScore(line) === 0)
    .map(line => autoCompleteScore(line))
    .sort((a,b) => a-b)
    
  const totalScore = scores[Math.round((scores.length - 1) / 2)]

  console.log(`Total score is ${totalScore}`);
};

function autoCompleteScore(line:string):number {
  const scores = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
  }
  const [invalidIndex, stack ] = checkLine(line);
  if (invalidIndex >= 0)
    return 0;
    
  let score = 0;
  stack.reverse();
  for(let iRemain = 0; iRemain < stack.length; iRemain++){
    const iClose = OPENS.findIndex((val) => val === stack[iRemain])!
    score = (score * 5) + scores[CLOSES[iClose]];
  }
  return score;
}

function invalidScore(line:string):number {
  const scores = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
  }
  const [invalidIndex] = checkLine(line);
  if(invalidIndex === -1)
    return 0
  return scores[line[invalidIndex]];
}

function checkLine(line:string): [number, string[]] {
  const stack: string[] = [];
  const chars = line.split('');
  let invalidIndex = -1;
  for(let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if(OPENS.includes(char))
      stack.push(char)
    else {
      const iClose = CLOSES.findIndex((close) => close === char)!

      if (OPENS[iClose] !== stack[stack.length-1]){
        // invlaid!
        invalidIndex = i;
        break;
      }
      stack.pop();
    }
  }
  return [invalidIndex, stack];
}

main();