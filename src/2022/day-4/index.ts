import { getPuzzleInput } from '../../aocClient.ts';
import { inRange } from '../../util/numberUtils.ts';

const ranges = /(\d+)-(\d+),(\d+)-(\d+)/;

type Range = {
  start: number;
  end: number;
};

const main = async () => {
  const allInput = await getPuzzleInput(4, 2022);
  doPart1(allInput); // 571
  doPart2(allInput); // 917
};

function doPart1(input: string) {
  const contained = (range1: Range, range2: Range): boolean => {
    const inRange1 = inRange(range1.start, range1.end);
    const inRange2 = inRange(range2.start, range2.end);
    return (
      (inRange1(range2.start) && inRange1(range2.end)) ||
      (inRange2(range1.start) && inRange2(range1.end))
    );
  };

  const count = input
    .split("\n")
    .map((line) => ranges.exec(line)!)
    .map(([, ...rest]) => rest.map((str) => parseInt(str, 10)))
    .map(([start1, end1, start2, end2]) => [
      { start: start1, end: end1 },
      { start: start2, end: end2 },
    ])
    .filter(([range1, range2]) => contained(range1, range2)).length;
  console.log(count);
}

function doPart2(input: string) {
  const exclusive = (range1: Range, range2: Range): boolean =>
    range1.end < range2.start || range1.start > range2.end;

  const count = input
    .split("\n")
    .map((line) => ranges.exec(line)!)
    .map(([, ...rest]) => rest.map((str) => parseInt(str, 10)))
    .map(([start1, end1, start2, end2]) => [
      { start: start1, end: end1 },
      { start: start2, end: end2 },
    ])
    .filter(([range1, range2]) => !exclusive(range1, range2)).length;
  console.log(count);
}

main();
