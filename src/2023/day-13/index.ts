import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import timeFn from '../../util/timeFn.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { doubleLines } from '../../util/inputParsers.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { reduce } from 'lodash-es';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { sum } from '../../util/arrayUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { assert } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  const part1Expected = 35691;
  const part2Expected = null;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  return sumSymetries(input, 0);
};

function doPart2(input: string) {
  return sumSymetries(input, 1);
};

function sumSymetries(input:string, smudgeCount:number) {
  const summedSymetries = doubleLines(input)
    .map(block => {
      const width = block.split("\n")[0].length;
      const cols: string[] = new Array(width).fill("");
      const rows: string[] = [];
      block.split("\n")
        .forEach((row, y) => {
          rows.push(row);
          row.split("")
            .forEach((colLetter, x) => {
              cols[x] += colLetter;
            });
        });
      return [rows, cols];
    })
    .map(([rows, cols], iBlock) => {
      let symLine = symetryLine(rows, smudgeCount);
      if (symLine > 0) {
        return symLine
      }

      symLine = symetryLine(cols, smudgeCount);
      if (symLine > 0) {
        return symLine * 100;
      }
      console.log(`Block ${iBlock} is missing some symetry?`);
      return 0;
    })
    .reduce(sum);
  return summedSymetries;
}

function symetryLine(lines: string[], smudgeCount = 0) {
  const width = lines[0].length;
  let symetrical = true;
  let symLine = 0;
  let foundSmudges = 0;
  symetryLoop: for (; symLine < width - 1; symLine++) {
    symetrical = true;
    foundSmudges = 0;
    for(let iLeft = symLine, iRight = symLine+1; iLeft >= 0 && iRight < width; iLeft--, iRight++) {
      for(let iLine = 0; iLine < lines.length; iLine++) {
        if (lines[iLine][iLeft] !== lines[iLine][iRight]){
          foundSmudges++;
          if (foundSmudges > smudgeCount) {
            symetrical = false;
            continue symetryLoop;
          }
        }
      }
    }
    if (foundSmudges === smudgeCount)
      break;
  }
  return symetrical ? symLine + 1 : 0;
}

main();