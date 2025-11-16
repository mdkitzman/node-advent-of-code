import { diff, max, min, multiply, sum } from '../../util/arrayUtils.ts'
import { Packet, PacketType } from './packet-parser.ts'

export const evaluatePacket = (packet:Packet): number => {
  switch(packet.header.type) {
    case PacketType.Sum:
      return packet.packets!.map(evaluatePacket).reduce(sum);
    case PacketType.Product:
      return packet.packets!.map(evaluatePacket).reduce(multiply);
    case PacketType.Minimum:
      return packet.packets!.map(evaluatePacket).reduce(min);
    case PacketType.Maximum:
      return packet.packets!.map(evaluatePacket).reduce(max);
    case PacketType.GreaterThan:
      return packet.packets!.map(evaluatePacket).reduce(diff) > 0 ? 1 : 0;
    case PacketType.LessThan:
      return packet.packets!.map(evaluatePacket).reduce(diff) < 0 ? 1 : 0;
    case PacketType.EqualTo:
      return packet.packets!.map(evaluatePacket).reduce(diff) === 0 ? 1 : 0;
    case PacketType.Literal:
    default:
      return packet.value!
  }
}