import { getPuzzleInput } from '../../aocClient.ts';
import { combinations, sum } from '../../util/arrayUtils.ts';
import { Point3D } from '../../util/point.ts';
import timeFn from '../../util/timeFn.ts';
import { Graph } from 'graphlib';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(8, 2025);
  const part1Expected = 84968;
  const part2Expected = 8663467782;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const getCircuits = (input: string) => {
  const points = input.split('\n')
    .map(line => {
      const [x,y,z] = line.split(',').map(Number);
      return new Point3D(x, y, z);
    });
  const circuits: Graph[] = points.map(p => {
    const g = new Graph();
    g.setNode(p.toString());
    return g;
  });

  const sortedByShortestDistance = combinations(points, 2)
    .map(([p1, p2]) => ({ dist: p1.distanceTo(p2), p1, p2 }))
    .toSorted((a, b) => a.dist - b.dist);

  return { circuits, sortedByShortestDistance };
}

function doPart1(input: string) {
  const { circuits, sortedByShortestDistance } = getCircuits(input);
  
  let max = 1000;
  for (let i = 0; i < max; i++) {
    const { p1, p2 } = sortedByShortestDistance[i];
    
    const circuit1 = circuits.find(circuit => circuit.hasNode(p1.toString()));
    const circuit2 = circuits.find(circuit => circuit.hasNode(p2.toString()));
    
    if (circuit1 === circuit2) {
      // both points are already in the same circuit, skip
      continue;
    }
    // both points are in different circuits, merge them into circuit1
    // remove old circuit
    const index = circuits.indexOf(circuit2);
    circuits.splice(index, 1);
    
    circuit1.setNodes(circuit2!.nodes());
    circuit2.edges().forEach(e => circuit1.setEdge(e.v, e.w, e.name));
  }
  const [a, b, c] = circuits.map(c => c.nodeCount()).toSorted((a, b) => b - a)
  return a * b * c;
};

function doPart2(input: string) {
  const { circuits, sortedByShortestDistance } = getCircuits(input);
  
  let lastP1: Point3D | null = null;
  let lastP2: Point3D | null = null;
  
  for (let i = 0; i < sortedByShortestDistance.length && circuits.length > 1; i++ ) {
    const { p1, p2 } = sortedByShortestDistance[i];
    lastP1 = p1;
    lastP2 = p2;
    
    const circuit1 = circuits.find(circuit => circuit.hasNode(p1.toString()));
    const circuit2 = circuits.find(circuit => circuit.hasNode(p2.toString()));
    
    if (circuit1 === circuit2) {
      // both points are already in the same circuit, skip
      continue;
    }
    // both points are in different circuits, merge them into circuit1
    // remove old circuit
    const index = circuits.indexOf(circuit2);
    circuits.splice(index, 1);
    
    circuit1.setNodes(circuit2!.nodes());
    circuit2.edges().forEach(e => circuit1.setEdge(e.v, e.w, e.name));
  }
  return lastP1.x * lastP2.x;
};

main();