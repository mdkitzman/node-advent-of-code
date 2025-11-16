import { assert } from 'console';
import Graph from 'graphology';
import shortestPath from 'graphology-shortest-path';
import { min } from '../../util/arrayUtils.ts';
import { cardinalNeighbors } from '../../util/point.ts';
import { getPuzzleInput } from '../../aocClient.ts';
const { dijkstra } = shortestPath;

const test = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`

const main = async () => {
  const allInput = await getPuzzleInput(12, 2022);
  doPart1(allInput); // 361
  doPart2(allInput); // 176 - too low
};

const node = (x:number, y:number, v: string):string => [v,x,y].join(',');
const toNode = (width: number, id: number, label: string): string => {
  const x = id % width;
  const y = Math.floor(id / width);
  return node(x,y,label);
}

function getGraph(input:string): [string, string, Graph] {
  const sId = input.replace(/\n/g, '').indexOf('S');
  const eId = input.replace(/\n/g, '').indexOf('E');
  const grid = input
    .replace('S', 'a')
    .replace('E', 'z')
    .split('\n').map(line => line.split(''));
  const graph = new Graph({
    type: 'directed'
  });
  // Construct the graph with weights
  grid.forEach((row, y) => {
    row.forEach((letter, x) => {
      cardinalNeighbors
        .map(([dx, dy]) => [x+dx, y+dy])
        .forEach(([nx, ny]) => {
          const neighborLetter = grid[ny]?.[nx];
          if (neighborLetter === undefined)
            return;
          const from = node(x,y,letter);
          const to = node(nx,ny,neighborLetter);
          const edgeWeight = (() => {
            const diff = neighborLetter.charCodeAt(0) - letter.charCodeAt(0);
            switch (true) {
              // if it is the same letter or lower, cost is 1
              case diff <= 0:  return 1;
              // if going up a letter, cost is 2
              case diff === 1: return 2;
              // if going up more than one letter, this is essentially a cliff
              default:         return Number.MAX_SAFE_INTEGER;
            }
          })();
          assert(edgeWeight >= 0);
          graph.mergeDirectedEdge(from, to, { weight: edgeWeight });
        });        
    });
  });
  const width = grid[0].length;
  const start = toNode(width, sId, 'a');
  const end = toNode(width, eId, 'z');
  return [start, end, graph];
}

function doPart1(input: string) {
  const [start, end, graph] = getGraph(input);
  const path = dijkstra.bidirectional(graph, start, end, 'weight');
  console.log(path.length-1);
};

function doPart2(input: string) {
  const [,end, graph] = getGraph(input);
  const startIds: number[] = input.replace(/\n/g, '').split('').map((c, i) => c === 'a' ? i : undefined).filter(id => id !== undefined) as number[];
  
  const width = input.split('\n')[0].length;
  const shortestPath = startIds
    .map(startId => {
      const start = toNode(width, startId, 'a');
      const path = dijkstra.bidirectional(graph, start, end, 'weight');
      return path.length - 1;
    })
    .reduce(min);
  
  console.log(shortestPath);
};

main();