import { identity } from "lodash";
import { EventEmitter } from "stream";

const opMap = {
  '+': (a: number) => (b: number): number => (a||b) + b,
  '*': (a: number) => (b: number): number => (a||b) * b,
}

export type Relief = (worry:number) => number;

export class Monkey extends EventEmitter{
  public readonly id: number;
  public readonly moduloTest: number;
  
  private readonly worryLevels : number[];
  private inspectItem: (a:number)=> number;
  private test: (a: number) => boolean;
  private nextMonkeys: [number, number];
  
  constructor(monkeyInput: string, private relieve: Relief = identity){
    super();
    // get our id
    const lines = monkeyInput.split('\n');
    this.id = parseInt(lines[0].split(' ')[1], 10);
    // get worry levels
    this.worryLevels = lines[1].split(': ')[1].split(', ').map(v => parseInt(v, 10));
    // generate our worry transformer
    const [,op,val] = /\S+ new = old ([+*]) (\d+|old)/.exec(lines[2])!;
    this.inspectItem = opMap[op](parseInt(val, 10));
    // make our test function
    const [,testStr] = /Test: divisible by (\d+)/.exec(lines[3])!;
    this.moduloTest = parseInt(testStr);
    this.test = (a: number): boolean => a % this.moduloTest === 0;
    // get ids of who to toss to
    const [,idTrue] = /If true: throw to monkey (\d)/.exec(lines[4])!
    const [,idFalse] = /If false: throw to monkey (\d)/.exec(lines[5])!
    this.nextMonkeys = [parseInt(idTrue, 10), parseInt(idFalse, 10)];
  }

  public catch(idTo: number, worry: number) {
    if (idTo === this.id) {
      this.worryLevels.push(worry);
    }
  }

  public inspectItems(worryBounder: number) {
    let worryLevel: number | undefined;
    this.emit('inspect', this.id, this.worryLevels.length);
    while (worryLevel = this.worryLevels.shift()) {
      worryLevel %= worryBounder;
      // inspect
      worryLevel = this.inspectItem(worryLevel);
      // provide some relief
      worryLevel = this.relieve(worryLevel);
      // see who to throw to
      const toMonkey = this.test(worryLevel) ? this.nextMonkeys[0] : this.nextMonkeys[1];
      // throw
      this.emit('throw', toMonkey, worryLevel);
    }
  }
}  