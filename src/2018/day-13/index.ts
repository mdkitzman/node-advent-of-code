import fs  from 'fs';
import lodash from 'lodash';
import { Grid } from '../../util/grid';
import { cardinalNeighbors, Point2D } from '../../util/point';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 14,42
  doPart2(allInput); // 8,7
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

const gridOrder = (a: Car, b: Car) => a.pos.y - b.pos.y || a.pos.x - b.pos.x;

function doPart1(input: string) {
  const [cars, map] = getCarsAndMap(input);

  let colided: number[][] = [];
  do {
    cars.sort(gridOrder)
    
    for (const car of cars) {
      car.move(map);
      if (cars.filter(c => c !== car).some(c => c.pos.equals(car.pos))) {
        colided.push(car.pos.coordinates);
        break;
      }
    }
  } while (colided.length === 0);
  const [[x,y]] = colided;
  console.log(`The locaion of the first crash is ${x},${y}`)
};

function doPart2(input: string) {
  const [cars, map] = getCarsAndMap(input);

  do {
    cars.sort(gridOrder)
    for (const car of cars) {
      if (car.rekt)
        continue;
      car.move(map);
      const iColision = cars
        .findIndex(c => !c.rekt && c !== car && c.pos.equals(car.pos));
      if (iColision > -1) {
        car.rekt = true;
        cars[iColision].rekt = true;
      }
    }
  } while (cars.filter(c => !c.rekt).length > 1);
  const [remainingCar] = cars.filter(c => !c.rekt);
  console.log(`The last car standing is at ${remainingCar.pos.x},${remainingCar.pos.y}`);
};
 
main();