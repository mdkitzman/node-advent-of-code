import { getPuzzleInput } from '../../aocClient';
import { sum } from '../../util/arrayUtils';
import { Grid } from '../../util/grid';
import { cardinalNeighbors, Point2D } from '../../util/point';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(10, 2024);
  const part1Expected = 782;
  const part2Expected = null;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

type Trail = {
  score:number;
  rating: number;
}

const trailScorer = (map: Grid<number>) => {
  const scoreTrail = (point: Point2D, seen: Set<string> = new Set()): Trail => {
    const value = map.get(point);
    if (value === -1 || value === undefined) // impassable terrain
      return { score: 0, rating: 0 };
    if (value === 9) {
      const score = seen.has(point.toString()) ? 0 : 1;
      if (score)
        seen.add(point.toString());
      const rating = 1;
      return { score, rating };
    }
    return cardinalNeighbors
      .map(([x,y]) => point.toAdded(new Point2D(x,y)))
      .filter(neighbor => map.get(neighbor) === (value + 1))
      .map(neighbor => scoreTrail(neighbor, seen))
      .reduce((prev, acc) => { 
        acc.score += prev.score;
        acc.rating += prev.rating;
        return acc;
       } , { score: 0, rating: 0 })
  }
  return scoreTrail;
}

function doPart1(input: string) {
  const map = new Grid<number>();
  input.split('\n')
    .forEach((line, y) => line.split('')
      .forEach((ltr, x) => map.set(new Point2D(x,y), /\d/.test(ltr) ? parseInt(ltr, 10) : -1)
    )
  );
  const scoreTrail = trailScorer(map);
  
  const scores = map.iterable()
    .filter(([,value]) => value === 0)
    .map(([start]) => scoreTrail(start))
    .map(({ score }) => score)
    .reduce(sum)
  return scores;
};

function doPart2(input: string) {
  const map = new Grid<number>();
  input.split('\n')
    .forEach((line, y) => line.split('')
      .forEach((ltr, x) => map.set(new Point2D(x,y), /\d/.test(ltr) ? parseInt(ltr, 10) : -1)
    )
  );
  const scoreTrail = trailScorer(map);
  
  const ratings = map.iterable()
    .filter(([,value]) => value === 0)
    .map(([start]) => scoreTrail(start))
    .map(({ rating }) => rating)
    .reduce(sum)
  return ratings;
};

main();