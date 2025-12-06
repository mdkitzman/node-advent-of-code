import { getPuzzleInput } from '../../aocClient.ts';
import { subGraphCount } from '../../util/graph.ts';
import timeFn from '../../util/timeFn.ts';
import cytoscape, { type EdgeDefinition, type NodeDefinition, type Core as Graph } from 'cytoscape';

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

const getGraph = (input: string): Graph => {
  const lines = input.split('\n');
  const nodes: NodeDefinition[] = lines.map((_, index) => ({ data: { id: String(index) } }))
  const edges: EdgeDefinition[] = lines
    .map(line => line.split(' <-> ')[1].split(', '))
    .map((connections: string[], index) => {
      const from = String(index);
      return connections.map(to => {
        return {
          data: {
            source: from,
            target: to
          }
        }
      })
    }).flat();
  const graph = cytoscape({
    elements: {
      nodes,
      edges
    }
  });

  return graph;
}

function doPart1(input: string) {
  const graph = getGraph(input);

  let counter = 0;
  graph.elements().bfs({
    roots: '#0',
    visit: () => { counter++ }
  });
  return counter;
};

function doPart2(input: string) {
  const graph = getGraph(input);

  const count = subGraphCount(graph);
  return count;
};

main();