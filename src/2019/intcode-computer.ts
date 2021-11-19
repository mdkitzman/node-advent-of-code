import EventEmitter from 'events';

export enum CompMode {
  POSITIONAL = 0,
  IMMEDIEATE = 1
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
  TERMINATE = 99
}

type Operation = (memory: number[], opIdx: number) => Promise<number>;
type InstructionSet = 'basic' | 'expanded';

export class IntComp extends EventEmitter {
  private readonly opcodeMap: Map<OpCode, Operation>;
  
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
    }
  }

  async execute(memory:number[]):Promise<number> {
    let increment = 0;
    for (let opIdx = 0; isFinite(increment); opIdx += increment) {
      const opCode = this.opCode(memory, opIdx);
      let doOperation = this.opcodeMap.get(opCode);
      if (!doOperation) {
        console.log({
          opCode,
          opIdx,
          increment,
          memory: memory.slice(opIdx, opIdx + 5)
        }, 'Unable to find a proper op code');
        doOperation = this.terminate;
      }
      increment = await doOperation(memory, opIdx);
    }
    return memory[0];
  }

  private opCode(memory:number[], index: number): OpCode {
    const code = memory[index].toString(10).slice(-2);
    return parseInt(code, 10);
  }

  private getParameterIndices(memory:number[], opIdx: number, paramCount = 0): number[] {
    // rightmost 2 digits are the opCode.  Everything else is parameter mode
    const paramModes = memory[opIdx].toString(10).slice(0, -2).split('').map(ch => parseInt(ch, 10) as CompMode);
    const paramIndicies: number[] = [];
    let paramIdx = opIdx;
    while (paramCount-- > 0) {
      paramIdx++;
      const mode = paramModes.pop();
      switch(mode) {
        case CompMode.POSITIONAL:
        default:
          paramIndicies.push(memory[paramIdx]);
          break;
        case CompMode.IMMEDIEATE:
          paramIndicies.push(paramIdx);
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
        resolve(2);
        this.off("input", onInput);
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