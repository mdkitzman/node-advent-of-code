import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { sum } from '../../util/arrayUtils';

const initial = /initial state: (.+)/;
const mutator = /(.{5}) => (.)/

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(12, 2018);
  const part1Expected = 3405;
  const part2Expected = 3_350_000_000_000;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

type Mutator = {
  pattern: RegExp;
  replacement: string;
};

const scorePlants = (input: string, generations: number): number => {
  const [initialLine, mutatorLines] = input.split('\n\n');
  const [,initialState] = initial.exec(initialLine)!;
  const mutators: Mutator[] = mutatorLines
    .split('\n')
    .map(line => mutator.exec(line)!.splice(1, 2))
    .map(([input, replacement]) => ({
        pattern: new RegExp(`(?=${input.replace(/\./g, '\\.')})`, 'g'),
        replacement
      }));

  const padding = '....';
  let state: string = initialState;
  let zeroOffset = 0;
  let iGen = 0;

  // window of 5 seems reasonable
  let scoreHistory = new Array(5).fill(0);
  for(; iGen < generations; iGen++) {
    // add padding for the left and right "infinity";
    state = padding + state + padding;
    let nextState = '.'.repeat(state.length);
    
    // Apply the mutations to the next generation
    mutators.forEach(({pattern, replacement}) => {
      for(const match of state.matchAll(pattern)) {
        nextState = nextState.substring(0, match.index! + 2) + replacement + nextState.substring(match.index! + 3);
      }
    });
    
    // do some accounting for the padding
    let leftTrim = 0;
    for(;leftTrim < padding.length && nextState[leftTrim] === '.'; leftTrim++){}
    let rightTrim = 0;
    for(;rightTrim < padding.length && nextState[nextState.length - rightTrim - 1] === '.'; rightTrim++){}
    zeroOffset += padding.length - leftTrim;
    state = nextState.slice(leftTrim,  nextState.length - rightTrim);

    // score this round
    const score = state
      .split('')
      .map((v, i) => v === '#' ? (i - zeroOffset) : 0)
      .reduce(sum);

    // determine if we have reached a stable score rate of increase.
    scoreHistory.unshift(score);
    const oldestScore = scoreHistory.pop();
    let diff = oldestScore;
    const diffs = [...scoreHistory].reverse().map(n => { let p = n - diff!; diff = n; return p });
    if(diffs.every(val => val === diffs[0])) {
      // we have reached a stable rate of increase in score between generations
      break;
    }
  }

  const [last, nextLast] = scoreHistory;
  if (iGen === generations)
    return last;
  
  const diff = last - nextLast;
  return last + (generations - iGen - 1) * diff;
};

function doPart1(input: string) {
  const score = scorePlants(input, 20);
  return score;
};

function doPart2(input: string) {
  const score = scorePlants(input, 50_000_000_000);
  return score;
};

main();