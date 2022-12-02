import fs  from 'fs';
import { sum } from '../../util/arrayUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 8890
  doPart2(allInput); // 10238
};

type Choice = 'rock' | 'paper' | 'scissors';
const choices: Choice[] = ['rock', 'paper', 'scissors'];
const win = 6;
const tie = 3;
const loss = 0;

var lookupMap: Record<string, number> = {};
choices.forEach(function(choice, i) {
    for (var j = 0, half = (choices.length-1)/2; j < choices.length; j++) {
        var opposition = (i+j)%choices.length
        if (!j)
            lookupMap[choice+choice] = tie
        else if (j <= half)
            lookupMap[choice+choices[opposition]] = loss
        else
            lookupMap[choice+choices[opposition]] = win
    }
})

const inputMap: Record<string, Choice> = {
  'A': 'rock',
  'B': 'paper',
  'C': 'scissors',
  'X': 'rock',
  'Y': 'paper',
  'Z': 'scissors',
}

const play = (me: Choice, opponent: Choice): number => {
  return lookupMap[me+opponent] + choices.indexOf(me) + 1;
}

function doPart1(input: string) {
  const score = input
    .split('\n')
    .map(line => {
      const [opponent, me] = line.split(' ').map(ltr => inputMap[ltr]);
      return play(me, opponent);
    })
    .reduce(sum);
  console.log(score);
};

const rig = (opponent: string, desiredOutcome:string): number => {
  // x = LOSS
  // y = TIE
  // z = WIN
  const moveLookup = {
    // ROCK
    'AX': 'Z',
    'AY': 'X',
    'AZ': 'Y',
    // PAPER
    'BX': 'X',
    'BY': 'Y',
    'BZ': 'Z',
    // SCISSOR
    'CX': 'Y',
    'CY': 'Z',
    'CZ': 'X',
  }  
  const me = inputMap[moveLookup[opponent+desiredOutcome]];
  return play(me, inputMap[opponent]);
}

function doPart2(input: string) {
  const score = input
  .split('\n')
  .map(line => {
    const [opponent, desiredOutcome] = line.split(' ');
    return rig(opponent, desiredOutcome);
  })
  .reduce(sum);
console.log(score);
};

main();