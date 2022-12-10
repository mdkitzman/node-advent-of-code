import EventEmitter from "events";

const opMap = {
  'noop': 1,
  'addx': 2,
}

export class Device extends EventEmitter{
  private register:number;
  private instructions: string[][];
  
  constructor(program: string){
    super();
    this.register = 1;
    this.instructions = program.split('\n').map(line => line.split(' '));
  }

  public execute() {
    let tick = 0;
    this.instructions
      .forEach(([op, arg]) => {
        for(let iTick = 0; iTick < opMap[op]; iTick++){
          tick++;
          this.emit('tick', tick, this.register);
        }
        this[op](arg);
      });
  }

  private noop() {}

  private addx(arg:string) {
    this.register += parseInt(arg, 10);
  }

}