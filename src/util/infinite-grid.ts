import { Point2D } from './point';
import { cloneDeep } from 'lodash'

export class InfiniteGrid<T> {
  constructor(
    private defaultValue: T,
    public readonly data = new Map<string, T>()
  ){}

  public get(point: Point2D): T {
    const key = `${point.x},${point.y}`;
    if (!this.data.has(key)) {
      this.data.set(key, cloneDeep(this.defaultValue));  
    }
    return this.data.get(key)!;
  }
}