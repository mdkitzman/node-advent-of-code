import fs  from 'fs';
import Graph from 'graphology';
import { dfsFromNode } from "graphology-traversal";
import unweighted from 'graphology-shortest-path';
import { getPuzzleInput } from '../../aocClient.ts';
const { bidirectional } = unweighted;

const main = async () => {
  const allInput = await getPuzzleInput(6, 2019);
  const graph = new Graph({
    allowSelfLoops: false,
    multi: false,
    type: 'undirected'
  });

  allInput.split('\n').forEach(line => {
    const [orbitA, orbitB] = line.split(')');
    graph.mergeNode(orbitA);
    graph.mergeNode(orbitB);
    graph.addUndirectedEdge(orbitA, orbitB);
  });

  doPart1(graph); // 247089
  doPart2(graph); // 443
};

function doPart1(graph: Graph) {
  let orbitCount = 0;
  dfsFromNode(graph, 'COM', (node, attrs, depth) => {
    orbitCount += depth;
  });

  console.log({
    orbitCount,
  });
};

function doPart2(graph: Graph) {
  const path = bidirectional(graph, 'YOU', 'SAN');
  if (path && path.length > 1) {
    // subtract 3: 1 for YOU, 1 for SAN, and 1 for the path that YOU is currently already attached to
    console.log({ shortestLen: path.length - 3 });
  }
};

main();