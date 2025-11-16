import { getPuzzleInput } from '../../aocClient.ts';
import { windowed } from '../../util/arrayUtils.ts';
import { uniq } from 'lodash-es';

const main = async () => {
  const allInput = await getPuzzleInput(6, 2022);
  doPart1(allInput); // 1848
  doPart2(allInput); // 2308
};

const packetIndex = (input: string, packetSize: number): number => {
  return windowed(packetSize, input.split(''))
    .findIndex(packet => uniq(packet).length === packetSize) + packetSize;
}

function doPart1(input: string) {
  console.log(packetIndex(input, 4));
};

function doPart2(input: string) {
  console.log(packetIndex(input, 14));
};

main();