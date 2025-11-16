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
  doPart1(allInput);
  doPart2(allInput);
};

const digitLookup = {
  "1":     "1",
  "2":     "2",
  "3":     "3",
  "4":     "4",
  "5":     "5",
  "6":     "6",
  "7":     "7",
  "8":     "8",
  "9":     "9",
  "one":   "1",
  "two":   "2",
  "three": "3",
  "four":  "4", 
  "five":  "5",
  "six":   "6",
  "seven": "7",
  "eight": "8",
  "nine":  "9",
};

const convertToDigits = (tokens: string[]): string[] => tokens.map(token => digitLookup[token]);

const pairFirstAndLast = (digits: string[]) => digits[0] + digits.splice(-1);

const sumLines = (input: string, tokenize: (line:string)=>string[]) => 
  input
    .split("\n")
    .map(tokenize)
    .map(convertToDigits)
    .map(pairFirstAndLast)
    .map(v => parseInt(v, 10))
    .reduce(sum);

function doPart1(input: string) {
  const tokenizer = (line:string): string[] => line.replaceAll(/\D/g, "").split('');
  const sum = sumLines(input, tokenizer)
  console.log(sum); // 55816
};

function doPart2(input: string) {
  const tokens = Object.keys(digitLookup);

  // Because lines like "oneight" and "twone" result in values 18 and 21
  // note the combined usage of the "e" and "o". 
  const tokenizer = (line:string): string[] => {
    const foundTokens: string[] = [];
    for(let iPos = 0; iPos < line.length; iPos++) {
      const found = tokens.find(token => line.slice(iPos, iPos + token.length) === token)
      if (found)
        foundTokens.push(found);
    }
    return foundTokens;
  };
  const sum = sumLines(input, tokenizer)
  console.log(sum); // 54980
};

main();