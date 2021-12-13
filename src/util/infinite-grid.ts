import { Point2D } from './point';
import { cloneDeep } from 'lodash'
import { Grid } from './grid';

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