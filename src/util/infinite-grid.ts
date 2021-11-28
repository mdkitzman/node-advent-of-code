import { Point2D } from './point';
import { cloneDeep } from 'lodash'

export class InfiniteGrid<T> {
  constructor(
    private defaultValue: T,
    public readonly data = new Map<string, T>()
  ){}

  private key(point: Point2D):string {
    return `${point.x},${point.y}`;
  }

  public get(point: Point2D): T {
    const key = this.key(point);
    if (!this.data.has(key)) {
      this.data.set(key, cloneDeep(this.defaultValue));  
    }
    return this.data.get(key)!;
  }

  public set(point: Point2D, value: T): void {
    const key = this.key(point);
    this.data.set(key, value);
  }

  public print(printValue: (value: T)=>string) {
    const points = Array
    .from(this.data.keys())
    .map(str => {
      const [x, y] = str.split(',').map(v => parseInt(v, 10));
      return new Point2D(x,y);
    });
    const left   = points.map(p => p.x).reduce((x1, x2) => x1 <= x2 ? x1 : x2);
    const right  = points.map(p => p.x).reduce((x1, x2) => x1 >= x2 ? x1 : x2);
    
    const top    = points.map(p => p.y).reduce((y1, y2) => y1 >= y2 ? y1 : y2);
    const bottom = points.map(p => p.y).reduce((y1, y2) => y1 <= y2 ? y1 : y2);

    for (let y = top; y >= bottom; y--) {
      let row = '';
      for (let x = left; x <= right; x++) {
        const value:T = this.data.get(`${x},${y}`) || cloneDeep(this.defaultValue);
        row += printValue(value);
      }
      console.log(row);
      row = '';
    }
  }
}