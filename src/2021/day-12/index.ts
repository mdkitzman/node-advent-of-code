import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs  from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import Graph from 'graphology';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { countBy } from 'lodash-es';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { sum } from '../../util/arrayUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 5958
  doPart2(allInput); // 150426
};

function doPart1(input: string) {
  const graph = getGraph(input);
  const paths: string[][] = allPaths(graph, (child, visited) => {
    return isLowerCase(child) && visited.has(child)
  });
  console.log(`There are ${paths.length} paths`);
};

function doPart2(input: string) {
  const graph = getGraph(input);

  const paths: string[][] = allPaths(graph, (child, visited) => {
    const lowers = [...visited.stack, child].filter(isLowerCase);
    // { a: 1, b: 2, c: 1 }
    const lowerCounts = countBy(lowers);
    const total = Object.values(lowerCounts).reduce(sum);
    const diff = total - Object.keys(lowerCounts).length;
    return diff > 1;
  });
  
  console.log(`There are ${paths.length} paths`);
};

function isLowerCase(str:string):boolean {
  return str === str.toLowerCase()
}

const getGraph = (input:string):Graph => {
  const graph = new Graph();
  input
    .split('\n')
    .forEach(line => {
      const [nodeA, nodeB] = line.split('-');
      graph.mergeNode(nodeA);
      graph.mergeNode(nodeB);
      graph.addUndirectedEdge(nodeA, nodeB);
    });
  return graph;
}

class StackSet {
  private set = new Set<string>();
  public stack:string[] = [];

  constructor(){}

  public has(value:string) {
    return this.set.has(value);
  };
  
  public push(value:string) {
    this.stack.push(value);
    this.set.add(value);
  };
  
  public pop() {
    this.set.delete(this.stack.pop()!);
  };
  
  public path() {
    return [...this.stack];
  };
}

function allPaths(graph: Graph, stopTraversal:(child: string, visited: StackSet)=>boolean): string[][] {
  const start = 'start';
  const end = 'end';

  const visited = new StackSet();
  visited.push(start);
  const stack = [graph.outboundNeighbors(start)];

  const paths: string[][] = [];
  let children: string[], child: string | undefined;

  while (stack.length !== 0) {
    children = stack[stack.length - 1];
    child = children.pop();

    if (!child) {
      stack.pop();
      visited.pop();
    } else {
      // Don't examine the start node again
      if (child === start || stopTraversal(child, visited))
        continue;

      // mark the node as visited
      visited.push(child);

      if (child === end) {
        // we reached the end, record this path
        paths.push(visited.path());
        visited.pop();
      } else {
        // not at the end, grab this node's children
        stack.push(graph.outboundNeighbors(child));
      }
    }
  }

  return paths;
}

main();