import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import Graph from 'graphology';
import {bfsFromNode} from 'graphology-traversal'
import { subGraphCount } from '../../util/hash';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(12, 2017);
  const part1Expected = 145;
  const part2Expected = 207;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const getGraph = (input:string):Graph => {
  const graph = new Graph();

  const lines = input.split('\n');
  lines.forEach((_, index) => graph.addNode(String(index)));
  lines
    .map(line => line.split(' <-> ')[1].split(', '))
    .forEach((connections:string[], index) => {
      const from = String(index);
      connections.forEach(to => graph.addEdge(from, to));
    });
  return graph;
}

function doPart1(input: string) {
  const graph = getGraph(input);
  
  let counter = 0;
  bfsFromNode(graph, '0', () => { counter++ });

  return counter;
};

function doPart2(input: string) {
  const graph = getGraph(input);

  const count = subGraphCount(graph);
  return count;
};

main();