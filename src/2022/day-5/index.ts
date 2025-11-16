import { getPuzzleInput } from "../../aocClient.ts";

const moveRgx = /move (\d+) from (\d) to (\d)/;

const main = async () => {
  const allInput = await getPuzzleInput(5, 2022);
  doPart1(allInput); // TGWSMRBPN
  doPart2(allInput); // TZLTLWRNF
};

const getStacksAndMoves = (input:string): [string[][], number[][]] => {
  const [top, bottom] = input.split('\n\n').map(str => str.split('\n'));
  top.reverse();
  const [stackNums, ...crates] = top;
  const stacks: string[][] = [];
  for(let i = 0; i < stackNums.length; i++) {
    if(stackNums[i] === ' ')
      continue;
    const stackNum = parseInt(stackNums[i], 10);
    stacks[stackNum] = crates.map(line => line[i]).filter(ch => ch !== ' ');
  }

  const moves = bottom
    .map(line => moveRgx.exec(line)!)
    .map(([,...move]) => move.map(m => parseInt(m, 10)));
  
  return [stacks, moves];
}

function doPart1(input: string) {
  const [stacks, moves] = getStacksAndMoves(input);
  moves.forEach(([count, from, to]) => {
    for(let i = 0; i < count; i++) {
      stacks[to].push(stacks[from].pop()!);
    }
  });
  const result = stacks.map(stack => stack.pop()!).join('');
  console.log(result);  
};

function doPart2(input: string) {
  const [stacks, moves] = getStacksAndMoves(input);
  moves.forEach(([count, from, to]) => {
    const end = stacks[from].splice(-count, count);
    stacks[to].push(...end);
  });
  const result = stacks.map(stack => stack.pop()!).join('');
  console.log(result);  
};

main();