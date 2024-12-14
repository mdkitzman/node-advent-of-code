import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { multiply, sum } from '../../util/arrayUtils';
import infixToPostfix from 'infix-to-postfix';
import rpn from 'rpn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(18, 2020);
  const part1Expected = 9535936849815;
  const part2Expected = 472171581333710;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const evaluate = (input:string):number => {
    return rpn(infixToPostfix(input));
  }

  const total = input.split('\n').map(evaluate).reduce(sum)
  return total;
};

function doPart2(input: string) {
  const reduce = (part:(number|string)[]) => {
    const sums:number[] = [part[0] as number];
    for (let i = 1; i < part.length; i += 2) {
      const sign = part[i];
      const val:number = part[i + 1] as number;

      if(sign === '+') {
        sums[0] += val
      } else {
        sums.unshift(val);
      }
    }
    return sums.reduce(multiply);
  }
  
  const wrapAddition = (line:string) =>{
    // Parse numbers, leave all other tokens as strings
    let tokens:(number|string)[] = line
      .replace(/\(/g, '( ')
      .replace(/\)/g, ' )')
      .split(' ')
      .map(token => parseInt(token, 10) || token);;
  
    // Resolve all parens first
    while (tokens.includes(')')) {
      let close_paren = tokens.indexOf(')');
      let open_paren = tokens.lastIndexOf('(', close_paren);
  
      let slice = tokens.slice(open_paren + 1, close_paren);
      const slice_length = slice.length;
      
      let total = reduce(slice);
      
      // The `+ 2` is for the parens we removed in the slice
      tokens.splice(open_paren, slice_length + 2, total);
    }
  
    let total = reduce(tokens);
    return total;
  }

  const total = input.split('\n').map(wrapAddition).reduce(sum);
  return total;
};

main();