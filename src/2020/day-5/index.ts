import { difference } from 'lodash-es';
import { getPuzzleInput } from '../../aocClient.ts';
import { max } from '../../util/arrayUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(5, 2020);
  const part1Expected = 965;
  const part2Expected = 524;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const binSearch = (input:string, max:number):number => {
  let [low, high] = [0, max];
  input.split('').forEach(ch => {
    const mid = (low + high)/2;
    switch(ch) {
      case 'F':
      case 'L':
        high = Math.floor(mid);
        break;
      case 'B':
      case 'R':
        low = Math.ceil(mid);
        break;
    }
  });
  return low;
};

const quickId = (pass:string) => parseInt(pass.replace(/F|L/g, '0').replace(/B|R/g, '1'), 2)

const seatIds = (input:string) => input.split('\n')
  .map(boardingPass => {
    const rowSearch = boardingPass.substr(0, 7);
    const colSearch = boardingPass.substr(7, 3);

    const row = binSearch(rowSearch, 127);
    const col = binSearch(colSearch, 7);

    const seatID = (row * 8) + col;
    return seatID;
  });

function doPart1(input: string) {
  const maxSeat = seatIds(input).reduce(max, 0);
  return maxSeat;
};

function doPart2(input: string) {
  const ids = seatIds(input);
  const diff = difference([...Array(128*8).keys()], ids)
    .filter(num => num >= 128) 
    .filter(num => num < (128 * 8 - 128));
  return diff[0];
};

main();