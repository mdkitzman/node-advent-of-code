import fs  from 'fs';
import { sum } from '../../util/arrayUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 46096
  doPart2(allInput); // 24820
};

type Node = {
  children: Node[]
  metadata: number[]
}

const readNode = (data: number[], pos: number = 0): [Node, number] =>{
  if (pos >= data.length)
    return [{children:[], metadata:[]}, pos];

  const [childCount, metadataCount] = [data[pos++], data[pos++]];
  const node: Node = {
    children: [],
    metadata: []
  };
  for (let iChild = 0; iChild < childCount; iChild++) {
    const [child, newPos] = readNode(data, pos);
    pos = newPos;
    node.children.push(child);
  }
  node.metadata.push(...data.slice(pos, pos + metadataCount));
  return [node, pos + metadataCount];
};

function doPart1(input: string) {
  const memory = input.split(' ').map(val => parseInt(val, 10));
  const [root] = readNode(memory);
  const sumMetadata = (node: Node): number => {
    return node.children.map(sumMetadata).reduce(sum, 0) + node.metadata.reduce(sum, 0);
  };
  const total = sumMetadata(root);
  console.log(`Total metadata is ${total}`);
};

function doPart2(input: string) {
  const memory = input.split(' ').map(val => parseInt(val, 10));
  const [root] = readNode(memory);

  const nodeValue = (node: Node): number => {
    if(node.children.length === 0) {
      return node.metadata.reduce(sum, 0);
    }
    const value = node.metadata
      .map(iChild => node.children[iChild-1])
      .filter(child => child !== undefined)
      .map(nodeValue)
      .reduce(sum, 0);
    return value;
  }
  const value = nodeValue(root);
  console.log(`Total node value is ${value}`);
};

main();