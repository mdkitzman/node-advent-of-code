
const HEADERLEN = 6;
const PACKLEN_OP_0 = 15;
const PACKLEN_OP_1 = 11;

export enum PacketType {
  Sum = 0,
  Product = 1,
  Minimum = 2,
  Maximum = 3,
  Literal = 4,
  GreaterThan = 5,
  LessThan = 6,
  EqualTo = 7,
}

interface PacketHeader {
  version: number;
  type: PacketType;
}

export interface Packet {
  header: PacketHeader;
  value?: number;
  packets?: Packet[];
}

export const parsePackets = (bits: number[], iPos: number = 0): [Packet, number] => {
  if (iPos >= bits.length) {
    throw `You went too far!  bit length ${bits.length} with position ${iPos}`;
  }

  const header = readHeader(bits, iPos);
  const parsePacketFn = header.type === PacketType.Literal
    ? parseLiteralValue
    : parseOperatorValue;

  return parsePacketFn(bits, header, iPos + HEADERLEN);
}

function readHeader(bits: number[], iPos: number): PacketHeader {
  return {
    version: toNum(bits.slice(iPos+0, iPos+3)),
    type:    toNum(bits.slice(iPos+3, iPos+6)),
  }
}

function parseOperatorValue(bits: number[], header: PacketHeader, iPos: number): [Packet, number] {
  return bits[iPos] === 0
    ? parseOperatorType0(bits, header, iPos + 1)
    : parseOperatorType1(bits, header, iPos + 1);
}

function parseOperatorType0(bits: number[], header: PacketHeader, iPos: number): [Packet, number] {
  const bitLenPackets = toNum(bits.slice(iPos, iPos + PACKLEN_OP_0));
  const packets: Packet[] = [];
  iPos += PACKLEN_OP_0;
  
  let iSubPacketPos = iPos;
  while (iSubPacketPos < iPos + bitLenPackets) {
    const [subpacket, pos] = parsePackets(bits, iSubPacketPos);
    if (!subpacket)
      break;
    packets.push(subpacket);
    iSubPacketPos = pos;
  };
    
  return [{ header, packets}, iSubPacketPos ];
}

function parseOperatorType1(bits: number[], header: PacketHeader, iPos: number): [Packet, number] {
  const numPackets = toNum(bits.slice(iPos, iPos + PACKLEN_OP_1));
  
  const packets: Packet[] = [];
  iPos += PACKLEN_OP_1;
  
  let iSubPacketPos = iPos;
  while (packets.length < numPackets) {
    const [subpacket, pos ] = parsePackets(bits, iSubPacketPos);
    if (!subpacket)
      break;
    packets.push(subpacket);
    iSubPacketPos = pos;
  }
    
  return [{ header, packets}, iSubPacketPos ];
}

function parseLiteralValue(bits: number[], header: PacketHeader, iPos: number): [Packet, number] {
  const valueBits: number[] = [];
  let keepGoing = 1;
  do {
    const [leadBit, ...nibble] = bits.slice(iPos, iPos + 5);
    valueBits.push(...nibble);
    keepGoing = leadBit;
    iPos += 5;
  } while (keepGoing);
  
  const value = toNum(valueBits);
  
  return [{ header, value}, iPos ];
}

function toNum(bits: number[]) {
  return parseInt(bits.join(''), 2);
}