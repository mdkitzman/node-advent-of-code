import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import nearley from "nearley";

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(19, 2020);
  const part1Expected = 147;
  const part2Expected = null;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const matchingLineCount = (input:string, grammar) => {
  grammar.ParserStart = "0";
  const validResults = input
  .split('\n')
  .map(line => line.trim())
  .filter(line => {
    try {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(line).results; 
        console.log(line);
        return true;
      } catch (e) {
        return false;
      }
    })
    .length;
  return validResults;
}

function doPart1(input: string) {
  const grammar = require("./grammar.js");
  const validResults = matchingLineCount(input.split('\n\n')[1], grammar);
  return validResults;
};

function doPart2(input: string) {
  const grammar = require("./test-grammar2.js");
  const validResults = matchingLineCount(input.split('\n\n')[1], grammar);

  return validResults;
};

main();