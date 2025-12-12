import { Graph } from 'graphlib';
import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import { sum } from '../../util/arrayUtils.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(11, 2025);
  const part1Expected = 640;
  const part2Expected = 367579641755680;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const graphTraverser = (graph: Graph) => {
  const getNeighbors = (node: string, reverse = false): string[] => {
    return reverse
      ? (graph.inEdges(node) || []).map(e => e.v)
      : (graph.outEdges(node) || []).map(e => e.w);
  }

  const traverer = (reverse: boolean) => (node: string, end: string, cache = {}): number => {
    if (node === end) {
      return 1;
    }
    if (cache[node]) return cache[node];
    
    const neighbors = getNeighbors(node, reverse);
    const total =  neighbors.map(neighbor => traverer(reverse)(neighbor, end, cache)).reduce(sum, 0);
    cache[node] = total;
    return total;
  }
  return {
    reverseTraversalPaths: traverer(true),
    traversalPaths: traverer(false),
  };
}

const getGraph = (input: string) => {
  const graph = new Graph({
    directed: true
  });
  input.split('\n')
    .map(line => line.split(': '))
    .forEach(([node, edges]) => {
      graph.setNode(node);
      edges.split(' ').forEach(edge => {
        graph.setEdge(node, edge);
      });
    });
  return graph;
}

function doPart1(input: string) {
  const { traversalPaths } = graphTraverser(getGraph(input));
  return traversalPaths('you', 'out');
};

function doPart2(input: string) {
  const { traversalPaths, reverseTraversalPaths } = graphTraverser(getGraph(input));
  const dac2out = traversalPaths('dac', 'out');
  const fft2dac = traversalPaths('fft', 'dac');
  const svr2fft = reverseTraversalPaths('fft', 'svr');
  
  return svr2fft * fft2dac * dac2out;
};

main();