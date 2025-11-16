import { getPuzzleInput } from '../../aocClient.ts';
import { chunk, sum } from '../../util/arrayUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(9, 2024);
  const part1Expected = 6607511583593;
  const part2Expected = 6636608781232;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

type FileData = number|undefined;
const swapper = <T>(arr:T[]) => (idxA: number, idxB: number) => {
  [arr[idxA], arr[idxB]] = [arr[idxB], arr[idxA]];
}

const checksum = (data:FileData[]) => {
  return data.map(v => v === undefined ? 0 : v).map((v,idx) => v * idx).reduce(sum);
}

const defrag = (data:FileData[], mode: "bit"|"block" = "bit") => {
  let idLeft = 0;
  let idRight = data.length-1;

  const rightLen = (idStart: number) => {
    if (mode === "bit")
      return 1;
    const val = data[idStart];
    let idEnd = idStart;
    while (data[--idEnd] === val) {}
    return idStart - idEnd;
  }

  const isEmpty = (start: number, len: number) => {
    if (mode === "bit")
      return data[start] === undefined;
    return data.slice(start, start+len).every(v => v === undefined);
  }

  const swap = swapper(data);
  while (idRight > 0) {
    idLeft = 0;
    while (data[idLeft] !== undefined)
      idLeft++;
    while (data[idRight] === undefined)
      idRight--;
    const needed = rightLen(idRight);
    while (!isEmpty(idLeft, needed) && idLeft < idRight)
      idLeft++;
    if (idLeft >= idRight) {
      idRight -= needed;
      continue;
    }
    for(let iSwap = 0; iSwap < needed; iSwap++)
      swap(idLeft++, idRight--);
  }
}

function doPart1(input: string) {
  const data:FileData[] = chunk(input.split("").map(c => parseInt(c, 10)), 2)
    .map(([fileLen, space], idx) => [
      ...new Array(fileLen).fill(idx),
      ...new Array(space||0)
    ])
    .flat();
  defrag(data, "bit");
  return checksum(data);
};

function doPart2(input: string) {
  const data = chunk(input.split("").map(c => parseInt(c, 10)), 2)
    .map(([fileLen, space], idx) => [
      ...new Array(fileLen).fill(idx),
      ...new Array(space||0)
    ])
    .flat();
  defrag(data, "block");
  
  return checksum(data);
};

main();