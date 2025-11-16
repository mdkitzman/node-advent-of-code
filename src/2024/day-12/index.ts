import { getPuzzleInput } from '../../aocClient.ts';
import { sum, windowed } from '../../util/arrayUtils.ts';
import { Grid } from '../../util/grid.ts';
import { cardinalNeighbors, Point2D } from '../../util/point.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(12, 2024);
  const part1Expected = 1434856;
  const part2Expected = 891106;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const minMax = (a: number[], acc: number[]): number[] => ([
  Math.min(a[0], acc[0]),
  Math.max(a[1], acc[1])
]);

const floodFiller = (garden: Grid<string>) => {
  return (start: Point2D) => {
    const plantType = garden.get(start);
    const plotPoints = new Set<string>();
    const getCandidates = () => {
      return cardinalNeighbors
        .map(([x,y]) => candidate.toAdded(new Point2D(x,y)))
        .filter(p => garden.get(p) === plantType)
        .filter(p => !plotPoints.has(p.toString()))
    }
    let candidate:Point2D;
    const candidates: Point2D[] = [start];
    do {
      candidate = candidates.pop()!;
      plotPoints.add(candidate.toString());
      candidates.push(
        ...getCandidates()   
      );
    } while (candidates.length > 0);
    return plotPoints; 
  }
};

const perimeter = (plot: Set<string>) => {
  let perim = 0;
  for(const p of plot) {
    perim += cardinalNeighbors.map(([x,y]) => new Point2D(x,y).toAdded(Point2D.fromString(p)).toString()).filter(n => !plot.has(n)).length
  }
  return perim;
}

const area = (plot: Set<string>) => plot.size;

const orderedNeighbors = [
  [0, -1],
  [1,  0],
  [0,  1],
  [-1, 0],
  [0, -1],
];
const surfaceCount = (plot: Set<string>): number => {
  const cornerCount = (p:Point2D) => {
    const outsideCorner = ([p1, p2]: Point2D[]) => !plot.has(p.toAdded(p1).toString()) && !plot.has(p.toAdded(p2).toString());
    const insideCorner = ([p1, p2]: Point2D[]) => plot.has(p.toAdded(p1).toString()) && plot.has(p.toAdded(p2).toString()) && !plot.has(p.toAdded(p1.toAdded(p2)).toString());
    const isCorner = (neighbors: Point2D[]) => outsideCorner(neighbors) || insideCorner(neighbors);
    
    const neighbors = orderedNeighbors.map(([x, y]) => new Point2D(x,y));
    return windowed(2, neighbors)
      .map(isCorner)
      .filter(hasCorner => hasCorner)
      .length
  }

  return Array
    .from(plot)
    .map(Point2D.fromString)
    .map(cornerCount)
    .reduce(sum);
}

const getGardenPlots = (input:string) => {
  const garden = new Grid<string>();
  input.split("\n")
    .map((line, y) => line.split("").map((ch, x) => garden.set(new Point2D(x,y), ch)));
  const floodFill = floodFiller(garden);
  const plots: Set<string>[] = [];
  const seenPoint = (p: Point2D) => plots.some(s => s.has(p.toString()));
  garden.forEach((point) => {
    if (seenPoint(point))
      return;
    plots.push(floodFill(point));
  });
  return plots;
}

function doPart1(input: string) {
  const gardenPlots = getGardenPlots(input);
  const costCalculator = (plot:Set<string>) => area(plot) * perimeter(plot);
  const costToFence = [...gardenPlots].map(costCalculator).reduce(sum);
  return costToFence;
};

function doPart2(input: string) {
  const gardenPlots = getGardenPlots(input);
  const costCalculator = (plot:Set<string>) => area(plot) * surfaceCount(plot);
  const costToFence = [...gardenPlots].map(costCalculator).reduce(sum);
  return costToFence;
};

main();