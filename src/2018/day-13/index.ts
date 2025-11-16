import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import lodash from 'lodash-es';
import { Grid } from '../../util/grid.ts';
import { cardinalNeighbors, Point2D } from '../../util/point.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(13, 2018);
  const part1Expected = "14,42";
  const part2Expected = "8,7";
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

// rotations right and left
const rotations = {
  '^': ['>', '<'],
  '<': ['^', 'v'],
  'v': ['<', '>'],
  '>': ['v', '^'],
}
const carDirMap = Object.fromEntries(
  lodash.zip(['^', '<', '>', 'v'],
  cardinalNeighbors.map(([x,y]) => new Point2D(x,y))
));

const isCar = (ch: string) => Object.keys(carDirMap).includes(ch);

enum TrackType {
  vertical = '|',
  horizontal = '-',
  turn1 = '/',
  turn2 = '\\',
  cross = '+',
}

enum TurnManeuver {
  Left, Straight, Right
}

class Car {
  public rekt = false;
  private nextCrossroadTurn: TurnManeuver = TurnManeuver.Left;

  constructor(public pos: Point2D, public dir: string){}

  public move(grid: Grid<TrackType>) {
    if (this.rekt)
      return;
    // move
    this.pos.add(carDirMap[this.dir]);
    const currentTrack = grid.get(this.pos)!;
    
    // set turn and direction
    switch (true) {
      case currentTrack === '+' && this.nextCrossroadTurn === TurnManeuver.Right:
        // turn left at the next crossing.
        this.nextCrossroadTurn = TurnManeuver.Left;
        // Intentional fall through
      case ['^', 'v'].includes(this.dir) && currentTrack === '/':
      case ['<', '>'].includes(this.dir) && currentTrack === '\\':
        // turn right;
        this.dir = rotations[this.dir][0];
        break;

      case currentTrack === '+' && this.nextCrossroadTurn === TurnManeuver.Left:
        // go straight at the next crossing.
        this.nextCrossroadTurn = TurnManeuver.Straight;
        // Intentional fall through
      case ['^', 'v'].includes(this.dir) && currentTrack === '\\':
      case ['<', '>'].includes(this.dir) && currentTrack === '/':
        // turn left;
        this.dir = rotations[this.dir][1]
        break;

      case currentTrack === '+' && this.nextCrossroadTurn === TurnManeuver.Straight:
        // turn right at the next crossing.
        this.nextCrossroadTurn = TurnManeuver.Right;
        break;
    }
  }

  public checkCollissions(cars: Car[]) {
    if (this.rekt)
      return;
    const other = cars.find(other => !other.rekt && other !== this && other.pos.equals(this.pos), this);
    if (other) {
      other.rekt = true;
      this.rekt = true;
    }
  }
}

const getCarsAndMap = (input:string): [Car[], Grid<TrackType>] => {
  const map = new Grid<TrackType>();
  const cars: Car[] = [];
  input
    .split('\n')
    .flatMap((line, y) => line.split('').map((ch, x) => [new Point2D(x,y), ch] as [Point2D, string]))
    .filter(([_, ch]) => ch !== ' ')
    .forEach(([point, ch]) => {
      if (isCar(ch)) {
        const [dx,dy] = carDirMap[ch].coordinates;
        cars.push(new Car(point, ch));
        ch = dx === 0 ? '|' : '-';
      }
      map.set(point, ch as TrackType);
    });
  return [cars, map];
}

const driveCars = (cars: Car[], map: Grid<TrackType>, keepDriving: () => boolean): void => {
  const gridOrder = (a: Car, b: Car) => a.pos.y - b.pos.y || a.pos.x - b.pos.x;
  do {
    cars.sort(gridOrder)
    for (const car of cars) {
      car.move(map);
      car.checkCollissions(cars);
    }
  } while (keepDriving());
}

function doPart1(input: string) {
  const [cars, map] = getCarsAndMap(input);
  const keepDriving = () => cars.filter(c => c.rekt).length === 0
  driveCars(cars, map, keepDriving);

  const [[x,y]] = cars.filter(c => c.rekt).map(c=>c.pos.coordinates);

  return `${x},${y}`;
};

function doPart2(input: string) {
  const [cars, map] = getCarsAndMap(input);
  const keepGoing = () => cars.filter(c => !c.rekt).length > 1;
  driveCars(cars, map, keepGoing);

  const [[x,y]] = cars.filter(c => !c.rekt).map(c => c.pos.coordinates);

  return `${x},${y}`;
};

main();