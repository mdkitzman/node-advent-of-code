import { zip } from 'lodash-es';
import { sum } from '../../util/arrayUtils.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const CORRECT = 1;
const UNKNOWN = 0;
const INCORRECT = -1;

type Packet = number|number[];
type CmpResult = 1 | 0 | -1;

const main = async () => {
  const allInput = await getPuzzleInput(13, 2022);
  doPart1(allInput); // 5330
  doPart2(allInput); // 27648
};

const isNumber = (n: Packet): n is number => typeof n === "number"
const toArray = (a: Packet): number[] => Array.isArray(a) ? a : [a];

const packetCmp = (packet1: Packet[], packet2: Packet[]): CmpResult => {
  for (const [left, right] of zip(packet1, packet2)) {
    if (left === undefined && right === undefined){
      return UNKNOWN;
    }
    if (left === undefined) {
      return CORRECT;
    }
    if (right === undefined) {
      return INCORRECT;
    }
    if (isNumber(left) && isNumber(right)) {
      if (left === right) continue;
      return left < right ? CORRECT : INCORRECT;
    }
    const result = packetCmp(toArray(left), toArray(right));     
    if (result !== 0){
      return result;
    }
  }
  return UNKNOWN;
}

function doPart1(input: string) {
  const total = input.split('\n\n')
    .map(pair => pair.split('\n').map<Packet[]>(line => JSON.parse(line)))
    .map(([packet1, packet2]) => packetCmp(packet1, packet2) === 1)
    .map((inTheRightOrder, i) => inTheRightOrder ? i + 1: 0)
    .reduce(sum);
  console.log(total);
};

function doPart2(input: string) {
  const packets: Packet[][] = input
    .replace(/\n\n/g, '\n')
    .split('\n')
    .map<Packet[]>(line => JSON.parse(line));
  const separators = [
    '[[2]]','[[6]]'
  ];
  packets.push(...separators.map<Packet[]>(sep => JSON.parse(sep)));
  packets.sort(packetCmp);
  packets.reverse();
  const strPackets = packets.map<string>(p => JSON.stringify(p));
  const [id1, id2] = [
    strPackets.indexOf(separators[0]) + 1,
    strPackets.indexOf(separators[1]) + 1
  ];
  console.log(id1*id2);
};

main();