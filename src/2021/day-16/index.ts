import fs  from 'fs';
import { hex2bin } from '../../util/numberUtils';
import { evaluatePacket } from './packet-evaluator';
import { Packet, parsePackets } from './packet-parser';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 895
  doPart2(allInput); // 1148595959144
};

function doPart1(input: string) {
  const bits: number[] = hex2bin(input).split('').map(bit => parseInt(bit, 2));

  const [packet] = parsePackets(bits)!;

  function sumVersions(packet: Packet): number {
    return packet.header.version + (packet.packets || []).reduce((acc, cur) => acc + sumVersions(cur), 0);
  }

  console.log(`The summed up header versions is ${sumVersions(packet)}`);
};

function doPart2(input: string) {
  const bits: number[] = hex2bin(input).split('').map(bit => parseInt(bit, 2));

  const [packet] = parsePackets(bits)!;
  const result = evaluatePacket(packet);

  console.log(`The result of evaluating the packet is ${result}`);
};

main();