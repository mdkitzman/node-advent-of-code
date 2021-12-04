import EventEmitter from "events";
import { sum } from "../../util/arrayUtils";

class BingoNumber {
  public selected: boolean = false;

  constructor(
    public readonly num: number
  ){}
}

export class BingoBoard extends EventEmitter {
  public boardSize = 5;
  private values: BingoNumber[]

  constructor(
    vals: number[]
  ){
    super();
    this.values = vals.map(val => new BingoNumber(val));
    this.on("callNumber", this.callNumber);
  }

  private callNumber(value: number): void {
    const bingoNumIdx = this.values.findIndex(v => v.num === value);
    if (bingoNumIdx === -1)
      return;
    
    if (this.values[bingoNumIdx].selected)
      return;

    this.values[bingoNumIdx].selected = true;
    // get the column and row for this number
    const [col, row] = [bingoNumIdx % this.boardSize, Math.floor(bingoNumIdx / this.boardSize)]
    // check the full row and column to see if we have a bingo
    const isRowWinner = this.values.filter((val, idx) => Math.floor(idx / this.boardSize) === row).every(val => val.selected);
    const isColWinner = this.values.filter((val, idx) => (idx % this.boardSize) === col ).every(val => val.selected);

    if (isRowWinner || isColWinner) {
      this.off("callNumber", this.callNumber);
      this.emit("bingo!", this, value);
    }
  }

  public score(winningNumber: number): number {
    return this.values.filter(v => !v.selected).map(v => v.num).reduce(sum) * winningNumber;
  }
}