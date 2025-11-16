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
import dijkstra from 'graphology-shortest-path/dijkstra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { sum } from '../../util/arrayUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Grid } from '../../util/grid.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Point2D } from '../../util/point.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 398
  doPart2(allInput); // 2817
};

function doPart1(input: string) {
  const grid = getGrid(input);
  
  findPath(grid);  
};

function doPart2(input: string) {
  const grid = getExpandedGrid(input);

  findPath(grid);
};

function findPath(grid: number[][]) {
  const neighbors = [
    [-1,  0],
    [+1,  0],
    [ 0, +1],
    [ 0, -1]
  ]

  const graph = new Graph();
  // Construct the graph with weights
  grid.forEach((row, y) => {
    row.forEach((value, x) => {
      const from = new Point2D(x,y).toString();
      graph.mergeNode(from, { cost: value })
      neighbors
        .map(([dx, dy]) => [x+dx, y+dy])
        .forEach(([nx, ny]) => {
          const neighborVal = grid[ny]?.[nx];
          if (neighborVal === undefined)
            return;
          const to = new Point2D(nx, ny).toString();
          graph.mergeNode(to, { cost: neighborVal })
          graph.mergeEdge(from, to, { weight: value + neighborVal });
        });        
    });
  });

  const start = new Point2D(0,0).toString();
  const end = new Point2D(grid[0].length -1, grid.length -1).toString();
  const path = dijkstra.bidirectional(graph, start, end, 'weight');

  if (path === null) {
    console.error(`Unable to find a path between start and end`);
    return;
  }

  const cost = path
    .map(node => Grid.toPoint(node))
    .map(point => grid[point.y][point.x])
    .reduce(sum, 0) - grid[0][0];
  
  console.log(`Lowest risk is ${cost}`);
}

function getGrid(input:string): number[][] {
  return input
    .split('\n')
    .map((line) => line.split('').map(Number));  
}

function getExpandedGrid(input:string): number[][] {
  let tile = getGrid(input);

  function between1and9(val, inc) {
    const remainder = (val + inc) % 10;
    return val + inc < 10
      ? val + inc
      : 1 + remainder;
  }

  return [
    ...tile.map(row => row.map(val => between1and9(val, 0))),
    ...tile.map(row => row.map(val => between1and9(val, 1))),
    ...tile.map(row => row.map(val => between1and9(val, 2))),
    ...tile.map(row => row.map(val => between1and9(val, 3))),
    ...tile.map(row => row.map(val => between1and9(val, 4))),
  ].map(row => [
    ...row.map(val => between1and9(val, 0)),
    ...row.map(val => between1and9(val, 1)),
    ...row.map(val => between1and9(val, 2)),
    ...row.map(val => between1and9(val, 3)),
    ...row.map(val => between1and9(val, 4)),
  ]);
}

main();