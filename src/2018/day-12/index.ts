import fs  from 'fs';
import { sum } from '../../util/arrayUtils';

const initial = /initial state: (.+)/;
const mutator = /(.{5}) => (.)/

// ...## -> ##...
const test = `initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`;

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 3405
  doPart2(allInput); // 3350000000000
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
  console.log(`Total score is ${score}`);
};

function doPart2(input: string) {
  const score = scorePlants(input, 50_000_000_000)
  console.log(`Total score is ${score}`);
};

main();