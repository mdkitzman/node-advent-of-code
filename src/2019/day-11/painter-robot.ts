import { Point } from '../../util/point';
import { InfiniteGrid } from '../../util/infinite-grid';
import { absoluteModulo } from '../../util/numberUtils';
import { IntComp, readProgram } from '../intcode-computer';

type GridValue = {
  painted: boolean;
  color: 'white'|'black';
};

enum Direction {
  NORTH = 0,
  EAST,
  SOUTH,
  WEST,
};

export class PainterRobot {
  constructor(
    initialColor: 'white' | 'black' = 'black',
    private computer = new IntComp('expanded'),
    public grid = new InfiniteGrid<GridValue>({ painted: false, color: 'black'}),
    private currentPos = new Point(0,0),
    private direction: Direction = Direction.NORTH,
  ){
    this.gridValue.color = initialColor
    const commands: number[] = [];
    this.computer.on("needsInput", () => {
      const value = this.gridValue.color === 'black' ? 0 : 1;
      this.computer.emit("input", value);
    });
    this.computer.on("output", (value:number) => {
      commands.push(value);
      // wait for at least 2 output values to be received.
      if (commands.length === 2) {
        // take action!
        const colorVal = commands.shift();
        const direction = commands.shift();
        // paint the current pos
        this.paintHere(colorVal === 0 ? 'black' : 'white');
        // turn left or right
        direction === 0
          ? this.turnLeft()
          : this.turnRight();
        // move forward 1
        this.moveForward(1);
      }
    });
  }

  public async run(input: string) {
    const program = readProgram(input);
    await this.computer.execute(program);
  }

  private get gridValue(): GridValue {
    return this.grid.get(this.currentPos)!;
  }

  private paintHere(color: 'white'|'black') {
    const curValue = this.gridValue;
    curValue.painted = true;
    curValue.color = color;
  }

  private moveForward(steps: number = 1) {
    switch (this.direction) {
      case Direction.NORTH:
        this.currentPos = new Point(this.currentPos.x, this.currentPos.y+steps)
        break;
      case Direction.SOUTH:
        this.currentPos = new Point(this.currentPos.x, this.currentPos.y-steps)
        break;
      case Direction.EAST:
        this.currentPos = new Point(this.currentPos.x+steps, this.currentPos.y)
        break;
      case Direction.WEST:
        this.currentPos = new Point(this.currentPos.x-steps, this.currentPos.y)
        break;
    }
  }

  private turnLeft() {
    this.direction = absoluteModulo(this.direction - 1, 4);
  }

  private turnRight() {
    this.direction = absoluteModulo(this.direction + 1, 4);
  }
};