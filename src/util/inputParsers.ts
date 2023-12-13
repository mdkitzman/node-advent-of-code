import { Grid } from "./grid";
import { Point2D } from "./point";

const split = (input:string, delim = "\n") => input.split(delim);

export const lines = (input:string) => split(input)
export const doubleLines = (input:string) => split(input, "\n".repeat(2))

export const gridBuilder = <T>(
  addToGrid:(value:string, x:number, y:number)=>boolean,
  adapter:(val:string)=>T
) => {
  return (input:string): Grid<T> => {
    const grid = new Grid<T>();
    lines(input)
      .forEach((row, y) => row.split("")
        .forEach((ch, x) => {
          if(addToGrid(ch, x, y))
            grid.set(new Point2D(x,y), adapter(ch));
        })
      );
    return grid;
  }
}