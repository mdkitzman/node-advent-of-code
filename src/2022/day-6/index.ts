import { readFile }  from 'fs/promises';
import { windowed } from '../../util/arrayUtils';
import { uniq } from 'lodash';

const main = async () => {
  const allInput = await readFile(`${__dirname}/input`, { encoding: 'utf-8'});
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