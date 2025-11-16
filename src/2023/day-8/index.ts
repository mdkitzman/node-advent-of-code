import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import timeFn from '../../util/timeFn.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { infiniteLoop } from '../../util/arrayUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { lcm } from '../../util/numberUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
type NodeMap = Map<string, [string,string]>;

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  
  timedPart1(allInput);
  timedPart2(allInput);
};

function doPart1(input: string) {
  const [instructions, nodeMap] = getNodesAndDirections(input);
  
  let counter = walkNodes(instructions, "AAA", nodeMap);
  console.log(counter); // 18113
};

function doPart2(input: string) {
  const [instructions, nodeMap] = getNodesAndDirections(input);

  const counter = [...nodeMap.keys()]
    .filter(node => node.endsWith("A"))
    .map(start => walkNodes(instructions, start, nodeMap))
    .reduce(lcm);
  console.log(counter); // 12315788159977
};

function getNodesAndDirections(input:string): [string, NodeMap] {
  const nodeMap = new Map<string, [string, string]>();
  const [instructions, nodeLines] = input.split("\n\n");
  nodeLines
    .split("\n")
    .forEach(line => {
      const [,key, left, right] = /(\S+) = \((\S+), (\S+)\)/.exec(line)!;
      nodeMap.set(key, [left, right]);
    });
  return [instructions, nodeMap];
}

function walkNodes(instructions:string, node:string, nodeMap: Map<string, [string, string]>): number {
  let counter = 0;
  for(const direction of infiniteLoop(instructions.split(""))) {
    node = nodeMap.get(node)![direction === "L" ? 0 : 1];
    counter++;
    if (node.endsWith("Z")) break;
  }
  return counter;
}

main();