import { getPuzzleInput } from '../../aocClient';
import { sum } from '../../util/arrayUtils';
import { Grid } from '../../util/grid';
import { cardinalNeighbors, Point2D } from '../../util/point';
import timeFn from '../../util/timeFn';

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

type Bounds = {
  top: number,
  bottom: number,
  left: number;
  right:number;
};

const surfaceCount = (plot: Set<string>): number => {
  const points = Array
    .from(plot)
    .map(Point2D.fromString);
    
  const [left, right] = points.map(({x}) => [x,x]).reduce(minMax);
  const [top, bottom] = points.map(({y}) => [y,y]).reduce(minMax);

  const tops: boolean[] = [];
  const bottoms: boolean[] = [];
  const lefts: boolean[] = [];
  const rights: boolean[] = [];

  const transitionCounter = (arr: boolean[]) => 
    arr
    .map(b => [b])
    .reduce((acc, [b]) => {
      if (b !== acc[acc.length - 1]) {
        acc.push(b)
      }
      return acc;
    }, [false])
    .flat()
    .filter(b => b === true)
    .length;

  // scan from top to bottom, left to right for the top and bottom edges
  for(let y = top; y <= bottom; y++) {
    for(let x = left; x <= right; x++) {
      const hasP = plot.has(`${x},${y}`)
      tops.push(hasP && !plot.has(`${x},${y-1}`));
      bottoms.push(hasP && !plot.has(`${x},${y+1}`));
    }
    tops.push(false);
    bottoms.push(false);
  }

  // scan from left to right, top to bottom for lefts and right edges 
  for(let x = left; x <= right; x++) {
    for(let y = top; y <= bottom; y++) {
      const hasP = plot.has(`${x},${y}`)
      lefts.push(hasP && !plot.has(`${x-1},${y}`));
      rights.push(hasP && !plot.has(`${x+1},${y}`));
    }
    lefts.push(false);
    rights.push(false);
  }
  
  return [tops, lefts, rights, bottoms].map(transitionCounter).reduce(sum);
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