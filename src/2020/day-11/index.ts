import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import { inRange } from 'lodash-es';
import { neighborArray } from '../../util/point.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(11, 2020);
  const part1Expected = 2334;
  const part2Expected = 2100;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

enum Item {
  floor = '.',
  empty = 'L',
  occupied = '#'
}

const seatGrid = (input:string): Item[][] => {
  return input.split('\n')
    .map(line => line.split('')
      .map(ch => {
        switch (ch) {
          case 'L': return Item.empty;
          case '#': return Item.occupied;
          default:
          case '.': return Item.floor;
        }
      }))
};

type SeatSeeker = (grid:Item[][], row:number, col:number) => number;

const fillSeats = (grid:Item[][], seatFinder:SeatSeeker, occupiedTolerance:number):number => {
  let changed:boolean;
  do {
    changed = false;
    grid = grid
      .map((row, iRow) => 
        row.map((item, iCol) => {
          const occupiedCount = seatFinder(grid, iRow, iCol);
          switch(item) {
            case Item.empty:
              if (occupiedCount === 0) {
                changed = true;
                return Item.occupied;
              }
              return Item.empty
            case Item.occupied:
              if (occupiedCount >= occupiedTolerance){
                changed = true;
                return Item.empty;
              }
              return Item.occupied;
            case Item.floor:
            default:
              return Item.floor;
          }
        })
      );
  } while (changed);

  const occupiedSeats = grid.flat().filter(item => item === Item.occupied).length;
  return occupiedSeats;
}

const inGrid = (width:number, height:number) => (row:number, col:number) => inRange(row, 0, height) && inRange(col, 0, width);

function doPart1(input: string) {
  let grid = seatGrid(input);
  const width = grid[0].length;
  const height = grid.length;
  const isValid = inGrid(width, height);  

  const visibleSeats = (grid:Item[][], iRow:number, iCol:number) => neighborArray
    .map(([dCol, dRow]) => [iCol + dCol, iRow + dRow])
    .filter(([col, row]) => isValid(row, col))
    .map(([col, row]) => grid[row][col])
    .filter(i => i === Item.occupied)
    .length;

  const occupiedSeats = fillSeats(grid, visibleSeats, 4);

  return occupiedSeats;
};

function doPart2(input: string) {
  let grid = seatGrid(input);
  const width = grid[0].length;
  const height = grid.length;
  const isValid = inGrid(width, height);

  const addPoints = (row1:number, col1:number, row2:number, col2:number):number[] => [row1 + row2, col1 + col2];

  const visibleSeats = (grid:Item[][], iRow:number, iCol:number):number => neighborArray
    .map(([dCol, dRow]) => {
      let [row, col] = addPoints(iRow, iCol, dRow, dCol);
      while (true) {
        if(!isValid(row, col)) {
          return Item.floor; // we went out of bounds, this will be filtered out
        }
        if(grid[row][col] !== Item.floor)
          break;
        [row, col] = addPoints(row, col, dRow, dCol);
      }
      return grid[row][col];
    })
    .filter(item => item === Item.occupied)
    .length

  const occupiedSeats = fillSeats(grid, visibleSeats, 5);

  return occupiedSeats;
};

main();