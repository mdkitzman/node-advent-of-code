import { InfiniteGrid } from '../../util/grid.ts';
import { Point2D } from '../../util/point.ts';
import { IntComp } from '../intcode-computer.ts';

export enum TileType {
  EMPTY,
  WALL,
  BLOCK,
  PADDLE,
  BALL,
};

export enum JoystickPosition {
  LEFT = -1,
  NEUTRAL = 0,
  RIGHT = 1
};

export class Arcade {
  private ballPos?: Point2D;
  private paddlePos?: Point2D;

  private readonly grid: InfiniteGrid<TileType> = new InfiniteGrid<TileType>(TileType.EMPTY);
  private readonly computer: IntComp = new IntComp();
  private readonly outputQueue: number[] = [];
  private _score: number = 0;
  private nextMove: JoystickPosition = JoystickPosition.NEUTRAL;
  
  constructor() {
    this.computer.on("output", this.handleOutput.bind(this));
    this.computer.on("needsInput", this.handleInput.bind(this));
  }

  public async play(program: number[]) {
    await this.computer.execute(program);
  }

  public get score() { return this._score; }

  public display() {
    console.log(`The score is ${this._score}`);
    console.log(this.grid.print(tile => {
      switch (tile) {
        case TileType.BALL:   return 'o';
        case TileType.BLOCK:  return '□';
        case TileType.PADDLE: return '-';
        case TileType.WALL:   return '█';
        default:
        case TileType.EMPTY:  return ' ';
      }
    }));
  }

  public get tileset(): TileType[] {
    return Array.from(this.grid.data.values());
  }

  private determineNextMove(newBallPos: Point2D): JoystickPosition {
    if (!this.ballPos || !this.paddlePos)
      return JoystickPosition.NEUTRAL;

    if (newBallPos.x < this.paddlePos.x) {
      return JoystickPosition.LEFT
    } else if (newBallPos.x > this.paddlePos.x) {
      return JoystickPosition.RIGHT;
    } else {
      return JoystickPosition.NEUTRAL;
    }
  }

  private handleOutput(value: number) {
    this.outputQueue.push(value);
    // wait for at least 3 output values to be received.
    if (this.outputQueue.length === 3) {
      // take action!
      const x = this.outputQueue.shift()!;
      const y = this.outputQueue.shift()!;
      const value = this.outputQueue.shift()!;

      if (x === -1 && y === 0) {
        // this is the score!
        this._score = value;
        return;
      }

      // Update positions of stuff!
      const newPos = new Point2D(x, y)
      this.grid.set(newPos, value);
      
      // Paddle position is updated before the ball position.
      if(value === TileType.PADDLE) {
        this.paddlePos = newPos;
      } else if (value == TileType.BALL) {
        this.nextMove = this.determineNextMove(newPos);
        this.ballPos = newPos;
      }
    }
  }

  private handleInput() {
    this.computer.emit("input", this.nextMove);
  }
}