import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import Graph from 'graphology';
import { min } from '../../util/arrayUtils.ts';
import lodash  from 'lodash-es';
import { ALPHABET } from '../../util/stringUtils.ts';

const stepRegex = /Step (\S) must be finished before step (\S) can begin./;

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(7, 2018);
  const part1Expected = "CFMNLOAHRKPTWBJSYZVGUQXIDE";
  const part2Expected = 971;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const buildGraph = (input: string) => {
  const graph = new Graph();
  input.split('\n')
    .map(line => stepRegex.exec(line)!.splice(1, 3))
    .forEach(([pre, post]) => {
      if (!graph.hasNode(pre)) graph.addNode(pre);
      if (!graph.hasNode(post)) graph.addNode(post);
      graph.addDirectedEdge(pre, post);
    });
  return graph;
}

function doPart1(input: string) {
  const graph = buildGraph(input);
  const visited:string[] = [];
  // get the starting candidates
  const candidates = graph.nodes().filter(n => graph.inNeighbors(n).length === 0).sort();
  while (candidates.length) {
    // get the next candidate
    const [node] = candidates.splice(0,1)!;
    // mark the node as visited
    visited.push(node);
    // get the neighbors of this node
    const neighbors = graph
      .outNeighbors(node)
      // if all of the dependencies of a node have been met...
      .filter(neighbor => {
        const dependencies = graph.inNeighbors(neighbor);
        return dependencies.every(dependency => visited.includes(dependency))
      });
    // ...add to the queue
    candidates.push(...neighbors);
    // sort by alphabetical priority
    candidates.sort();
  };

  return visited.join('');
};

type Job = {
  node: string|null,
  time: number
};

const hasJob = (j:Job) => j.node !== null;
const jobCount = (workers: Job[]) => workers.filter(hasJob).length;

function doPart2(input: string) {
  const workerCount = 5;
  const baseTime = 60;
  
  const graph = buildGraph(input);
  const workers: Job[] = [];
  const done:string[] = [];
  const timeChart = Object.fromEntries(ALPHABET.split('').map((ltr, id) => [ltr, id + 1 + baseTime]));
  let totalTime = 0;
  
  const candidates = graph.nodes().filter(n => graph.inNeighbors(n).length === 0).sort();
  while(candidates.length || jobCount(workers) > 0) {
    // Find next candidates
    const availableWorkers = workerCount - jobCount(workers);
    const nextCandidates = candidates.splice(0, availableWorkers);
    workers.push(...nextCandidates.map(node => ({node, time: timeChart[node]})));

    // do the work
    const minJobTime = workers.filter(hasJob).map(job => job.time).reduce(min, Number.MAX_VALUE);
    workers.filter(hasJob).forEach(j => j.time -= minJobTime);
    lodash.sortBy(workers, 'time');
    totalTime += minJobTime;
    const doneJobs = lodash.remove(workers, j => j.time === 0).map(j => j.node!);
    done.push(...doneJobs.sort());
    nextCandidates.push(...doneJobs.sort());

    // update candidates
    candidates.push(...Array.from(
      new Set(nextCandidates
        .flatMap(node => {
          const neighbors = graph
            .outNeighbors(node)
            // if all of the dependencies of a node have been met...
            .filter(neighbor => {
              const dependencies = graph.inNeighbors(neighbor);
              return dependencies.every(dependency => done.includes(dependency))
            });
          return neighbors;
      }))
    ).sort());    
  }

  return totalTime;
};

main();