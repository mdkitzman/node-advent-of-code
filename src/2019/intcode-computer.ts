import EventEmitter from 'events';

/**
 * This is a proxy handler for a number[] that will automatically expand
 * the array when trying to index something out of bounds. 
 */
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

export const readProgram = (input: string) => input.split(',').map(ch => parseInt(ch, 10));

type Operation = (memory: number[], opIdx: number) => Promise<number>;
export class IntComp extends EventEmitter {
  private readonly opcodeMap: Map<OpCode, Operation>;
  private relativeBase: number = 0;
  
  constructor(){
    super({
      captureRejections: false
    });

    this.opcodeMap = new Map<OpCode, Operation>([
      [OpCode.ADD, this.add.bind(this)],
      [OpCode.MULTIPLY, this.mult.bind(this)],
      [OpCode.INPUT, this.input.bind(this)],
      [OpCode.OUTPUT, this.output.bind(this)],
      [OpCode.JMPIFTRUE, this.jumpIfTrue.bind(this)],
      [OpCode.JMPIFFALSE, this.jumpIfFalse.bind(this)],
      [OpCode.LESSTHAN, this.lessThan.bind(this)],
      [OpCode.EQUALS, this.equals.bind(this)],
      [OpCode.RELATIVE_BASE_OFFSET, this.relativeBaseOffset.bind(this)],
      [OpCode.TERMINATE, this.terminate.bind(this)],
    ]);
  }

  async execute(program:number[]):Promise<number> {
    const programProxy = new Proxy(program, autoExpander);

    let increment = 0;
    // increment will either be a number to increment the opcode pointer by or NaN, indicating that we're done.
    for (let opIdx = 0; isFinite(increment); opIdx += increment) {
      const opCode = this.nextOpCode(programProxy, opIdx);
      const doOperation = this.opcodeMap.get(opCode) || this.terminate.bind(this);
      increment = await doOperation(programProxy, opIdx);
    }
    return programProxy[0];
  }

  private nextOpCode(memory:number[], index: number): OpCode {
    const code = memory[index].toString(10).slice(-2);
    return parseInt(code, 10);
  }

  /**
   * Extracts the desired number of parameters from memory at the given index.
   * 
   * Parameter modes for each parameter are stored in the same value as the instruction's opcode.
   * The opcode is a two-digit number based only on the ones and tens digit of the value, that is,
   * the opcode is the rightmost two digits of the first value in an instruction.
   * 
   * Parameter modes are single digits, one per parameter, read right-to-left from the opcode:
   *  - The first parameter's mode is in the hundreds digit
   *  - The second parameter's mode is in the thousands digit 
   *  - The third parameter's mode is in the ten-thousands digit
   *  - Etc.
   * Any missing modes are 0.
   * @param memory - The program
   * @param opIdx - the index of the current operation
   * @param paramCount - How many parameters do you want to extract
   * @returns the indicies of the location in memory of each parameter
   */
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
    return 3; // increment the instruction pointer.
  }

  private async jumpIfFalse(memory: number[], opIdx: number): Promise<number> {
    const [idxa, idxb] = this.getParameterIndices(memory, opIdx, 2);
    if (memory[idxa] === 0) {
      const jumpPoint = memory[idxb];
      return jumpPoint - opIdx; // return where we want the opIdx to jump to
    }
    return 3; // increment the instruction pointer.
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

enum ParamMode {
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