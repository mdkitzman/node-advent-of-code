import { range } from "lodash";
import { Point2D } from "./point";

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