import { range } from "lodash";
import { Point2D } from "./point";
import { cloneDeep } from 'lodash'

/**
 * Will generate coordinate values for n-dimensions from the origin
 * to the coordinates specified.
 *
 * Accepts the size of each dimension. e.g. a 1x2x3 3D grid:
 *  generateCoords(1, 2, 3) ->
 *  [ 0, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ], [ 0, 1, 1 ], [ 0, 0, 2 ], [ 0, 1, 2 ]
 */
export function* generateCoords(...dimensionSizes: number[]) {
  const dimCount = dimensionSizes.length;
  const coords = new Array(dimCount).fill(0);

  while (true) {
    yield coords;

    let carry = 0;
    while (++coords[carry] === dimensionSizes[carry]) {
      coords[carry] = 0;
      ++carry;
      if (carry === dimCount) {
        return;
      }
    }
  }
}

export class Grid<T> {
  public readonly data = new Map<string, T>();
  
  constructor(){}

  static toPoint(key:string) {
    const [x, y] = key.split(',').map(Number);
    return new Point2D(x,y);
  }

  static toKey(point: Point2D): string {
    return `${point.x},${point.y}`;
  }

  public get(point: Point2D): T | undefined {
    const key = Grid.toKey(point);
    return this.data.get(key)!;
  }

  public set(point: Point2D, value: T): void {
    const key = Grid.toKey(point);
    this.data.set(key, value);
  }

  public delete(point: Point2D) {
    const key = Grid.toKey(point);
    this.data.delete(key);
  }

  public iterable(): Array<[Point2D, T]> {
    return Array
      .from(this.data.entries())
      .map(([key, value]) => [Grid.toPoint(key), value as T]);
  }

  public forEach(action:(key: Point2D, value: T)=>void) {
    Array
      .from(this.data.entries())
      .forEach(([key, value]) => 
        action(Grid.toPoint(key), value as T)
      );
  }

  public print(printValue: (value?: T)=>string, verticalStart: 'high'|'low' = 'high') {
    const points = Array
      .from(this.data.keys())
      .map(Grid.toPoint);
    
    const left   = points.map(p => p.x).reduce((x1, x2) => x1 <= x2 ? x1 : x2);
    const right  = points.map(p => p.x).reduce((x1, x2) => x1 >= x2 ? x1 : x2);
    
    const top    = points.map(p => p.y).reduce((y1, y2) => y1 >= y2 ? y1 : y2);
    const bottom = points.map(p => p.y).reduce((y1, y2) => y1 <= y2 ? y1 : y2);

    const yRange:number[] = verticalStart === 'high'
      ? range(top, bottom-1)
      : range(bottom, top+1);
    
    yRange.forEach(y => {
      let row = '';
      for (let x = left; x <= right; x++) {
        const value:T|undefined = this.data.get(`${x},${y}`);
        row += printValue(value);
      }
      console.log(row);
      row = '';
    });
  }
}

export class InfiniteGrid<T> extends Grid<T> {
  constructor(
    private defaultValue: T,
  ){
    super();
  }

  public get(point: Point2D): T {
    const key = Grid.toKey(point);
    if (!this.data.has(key)) {
      this.data.set(key, cloneDeep(this.defaultValue));  
    }
    return this.data.get(key)!;
  }
}