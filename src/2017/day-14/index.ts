import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import Graph from 'graphology';
import { knotHash, subGraphCount } from '../../util/hash.ts';
import { sum } from '../../util/arrayUtils.ts';
import { dec2bin } from '../../util/numberUtils.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(14, 2017);
  const part1Expected = 8226;
  const part2Expected = 1128;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const hexHash2bin = (hash:string):string[] => hash.split('')
    .map(hex => parseInt(hex, 16))
    .map(num => dec2bin(num, 4))
    .map(binStr => binStr.split(''))
    .flat();

function doPart1(input: string) {
  let count = 0;
  for(let i = 0; i < 128; i++) {
    const hash = knotHash(`${input}-${i}`);
    const binary = hexHash2bin(hash);
    count += binary
      .map(num => parseInt(num, 10))
      .reduce(sum, 0)
  }
  return count;
};

function doPart2(input: string) {
  const grid:string[][] = [];
  const graph = new Graph();

  const key = (iRow:number, iCol:number) => `[${iRow}][${iCol}]`;

  // populate the grid with binary and graph with nodes.
  for(let iRow = 0; iRow < 128; iRow++) {
    const hash = knotHash(`${input}-${iRow}`);
    const binary = hexHash2bin(hash);
    grid.push(binary);
    binary.forEach((b, iColumn) => {
      if(b === "1") {
        graph.addNode(key(iRow, iColumn));
      }
    });
  }
  
  // Build up the graph edges
  for(let iRow = 0; iRow < 128; iRow++) {
    for(let iColumn = 0; iColumn < 128; iColumn++) {
      if(grid[iRow][iColumn] !== "1") {
        continue;
      }
      graph.addUndirectedEdge(key(iRow, iColumn), key(iRow, iColumn));
      //check next neighbor
      if(iColumn < 127 && grid[iRow][iColumn+1] === "1") {
        graph.addUndirectedEdge(key(iRow, iColumn), key(iRow, iColumn+1));
      }
      //check below neighbor
      if(iRow < 127 && grid[iRow+1][iColumn] === "1") {
        graph.addUndirectedEdge(key(iRow, iColumn), key(iRow+1, iColumn));
      }
    }
  }

  // count the number of graphs
  const count = subGraphCount(graph);

  return count;
};

main();