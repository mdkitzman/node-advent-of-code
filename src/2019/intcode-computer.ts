import EventEmitter from 'events';

export enum ParamMode {
  ADDRESS = 0,
  IMMEDIEATE = 1,
  RELATIVE = 2,
};

enum OpCode {
  ADD = 1,
  MULTIPLY,
  INPUT,
  OUTPUT,
  JMPIFTRUE,
  JMPIFFALSE,
  LESSTHAN,
  EQUALS,
  RELATIVE_BASE_OFFSET,
  TERMINATE = 99
}

type Operation = (memory: number[], opIdx: number) => Promise<number>;
type InstructionSet = 'basic' | 'expanded';

const autoExpander: ProxyHandler<number[]> = {
  get: function(target: number[], prop: string | Symbol, receiver) {
    const index = Number(prop);
    if (index >= target.length)
      target.push(...new Array(index - target.length + 1).fill(0));
    return target[index];
  },
  set: function(target: number[], prop: string | Symbol, value:number) {
    const index = Number(prop);
    if (index >= target.length)
      target.push(...new Array(index - target.length + 1).fill(0));
    target[index] = value;
    return true;
  }
};

export const program = (input: string) => input.split(',').map(ch => parseInt(ch, 10));

export class IntComp extends EventEmitter {
  private readonly opcodeMap: Map<OpCode, Operation>;
  private relativeBase: number = 0;
  
  constructor(instructionSet: InstructionSet = 'basic'){
    super({
      captureRejections: false
    });

    this.opcodeMap = new Map<OpCode, Operation>([
      [OpCode.ADD, this.add.bind(this)],
      [OpCode.MULTIPLY, this.mult.bind(this)],
      [OpCode.INPUT, this.input.bind(this)],
      [OpCode.OUTPUT, this.output.bind(this)],
      [OpCode.TERMINATE, this.terminate.bind(this)]
    ]);
    if (instructionSet === 'expanded') {
      this.opcodeMap.set(OpCode.JMPIFTRUE, this.jumpIfTrue.bind(this));
      this.opcodeMap.set(OpCode.JMPIFFALSE, this.jumpIfFalse.bind(this));
      this.opcodeMap.set(OpCode.LESSTHAN, this.lessThan.bind(this));
      this.opcodeMap.set(OpCode.EQUALS, this.equals.bind(this));
      this.opcodeMap.set(OpCode.RELATIVE_BASE_OFFSET, this.relativeBaseOffset.bind(this));
    }
  }

  async execute(memory:number[]):Promise<number> {
    const memoryProxy = new Proxy(memory, autoExpander);

    let increment = 0;
    for (let opIdx = 0; isFinite(increment); opIdx += increment) {
      const opCode = this.opCode(memoryProxy, opIdx);
      let doOperation = this.opcodeMap.get(opCode);
      if (!doOperation) {
        console.log({
          opCode,
          opIdx,
          increment,
          memory: memoryProxy.slice(opIdx, opIdx + 5)
        }, 'Unable to find a proper op code');
        doOperation = this.terminate;
      }
      increment = await doOperation(memoryProxy, opIdx);
    }
    return memoryProxy[0];
  }

  private opCode(memory:number[], index: number): OpCode {
    const code = memory[index].toString(10).slice(-2);
    return parseInt(code, 10);
  }

  private getParameterIndices(memory:number[], opIdx: number, paramCount = 0): number[] {
    // rightmost 2 digits are the opCode.  Everything else is parameter mode
    const paramModes = memory[opIdx].toString(10).slice(0, -2).split('').map(ch => parseInt(ch, 10) as ParamMode);
    const paramIndicies: number[] = [];
    let paramIdx = opIdx;
    while (paramCount-- > 0) {
      paramIdx++;
      const mode = paramModes.pop();
      switch(mode) {
        case ParamMode.ADDRESS:
        default:
          paramIndicies.push(memory[paramIdx]);
          break;
        case ParamMode.IMMEDIEATE:
          paramIndicies.push(paramIdx);
          break;
        case ParamMode.RELATIVE:
          paramIndicies.push(this.relativeBase + memory[paramIdx]);
          break;
      }
    }
    return paramIndicies;
  }

  private async terminate(memory: number[], opIdx: number): Promise<number> {
    this.emit("terminate");
    return NaN;
  }

  private async add(memory: number[], opIdx: number): Promise<number> {
    const [idxa, idxb, idxr] = this.getParameterIndices(memory, opIdx, 3);
    memory[idxr] = memory[idxa] + memory[idxb];
    return 4;
  }

  private async mult(memory: number[], opIdx: number): Promise<number> {
    const [idxa, idxb, idxr] = this.getParameterIndices(memory, opIdx, 3);
    memory[idxr] = memory[idxa] * memory[idxb];
    return 4;
  }

  private async input(memory: number[], opIdx: number): Promise<number> {
    const [idxr] = this.getParameterIndices(memory, opIdx, 1);
    return new Promise((resolve) => {
      const onInput = (value) => {
        memory[idxr] = parseInt(value, 10);
        this.off("input", onInput);
        resolve(2);
      };
      this.on("input", onInput);
      this.emit("needsInput");
    });
  }

  private async output(memory: number[], opIdx: number): Promise<number> {
    const [idxa] = this.getParameterIndices(memory, opIdx, 1);
    const value = memory[idxa];
    this.emit("output", value);
    return 2;
  }

  private async jumpIfTrue(memory: number[], opIdx: number): Promise<number> {
    const [idxa, idxb] = this.getParameterIndices(memory, opIdx, 2);
    if (memory[idxa] !== 0) {
      const jumpPoint = memory[idxb];
      return jumpPoint - opIdx; // return where we want the opIdx to jump to
    }
    return 3 // increment the instruction pointer.
  }

  private async jumpIfFalse(memory: number[], opIdx: number): Promise<number> {
    const [idxa, idxb] = this.getParameterIndices(memory, opIdx, 2);
    if (memory[idxa] === 0) {
      const jumpPoint = memory[idxb];
      return jumpPoint - opIdx; // return where we want the opIdx to jump to
    }
    return 3 // increment the instruction pointer.
  }
  
  private async lessThan(memory: number[], opIdx: number): Promise<number> {
    const [idxa, idxb, idxc] = this.getParameterIndices(memory, opIdx, 3);
    memory[idxc] = Number(memory[idxa] < memory[idxb]);
    return 4;
  }

  private async equals(memory: number[], opIdx: number): Promise<number> {
    const [idxa, idxb, idxc] = this.getParameterIndices(memory, opIdx, 3);
    memory[idxc] = Number(memory[idxa] === memory[idxb]);
    return 4;
  }

  private async relativeBaseOffset(memory: number[], opIdx: number): Promise<number> {
    const [ idxValue ] = this.getParameterIndices(memory, opIdx, 1);
    this.relativeBase += memory[idxValue];
    return 2;
  }
}

export const execute = (memory:number[], noun:number, verb:number):number => {
  memory[1] = noun;
  memory[2] = verb;

  let increment = 0;
  for (let opIdx = 0; memory[opIdx] != 99; opIdx += increment) {
    const operation = memory[opIdx];
    switch(operation) {
      case 1: // Add
        memory[memory[opIdx+3]] = memory[memory[opIdx+1]] + memory[memory[opIdx+2]];
        increment = 4;
        break;
      case 2: // Multiply
        memory[memory[opIdx+3]] = memory[memory[opIdx+1]] * memory[memory[opIdx+2]];
        increment = 4;
        break;
      case 3: // Store input
        increment = 2;
        break;
      case 4: // output value
        increment = 2;
        break;
      case 99: // Terminate
      default:
        increment = 0;
        break;
    }
  }
  return memory[0];
};