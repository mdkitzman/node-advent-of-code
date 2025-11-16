import EventEmitter from 'events';
import { SafeArray } from '../util/arrayUtils.ts';

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
      [OpCode.ADD, this.add],
      [OpCode.MULTIPLY, this.mult],
      [OpCode.INPUT, this.input],
      [OpCode.OUTPUT, this.output],
      [OpCode.JMPIFTRUE, this.jumpIfTrue],
      [OpCode.JMPIFFALSE, this.jumpIfFalse],
      [OpCode.LESSTHAN, this.lessThan],
      [OpCode.EQUALS, this.equals],
      [OpCode.RELATIVE_BASE_OFFSET, this.relativeBaseOffset],
      [OpCode.TERMINATE, this.terminate],
    ]);
  }

  async execute(program:number[]):Promise<number> {
    const programProxy = new Proxy(program, SafeArray<number>(OpCode.TERMINATE));

    let increment = 0;
    // increment will either be a number to increment the opcode pointer by or NaN, indicating that we're done.
    for (let opIdx = 0; isFinite(increment); opIdx += increment) {
      const operation = this.nextOperation(programProxy, opIdx);
      increment = await operation(programProxy, opIdx);
    }
    return programProxy[0];
  }

  private nextOperation(memory:number[], index: number): Operation {
    const code = memory[index].toString(10).slice(-2);
    const opCode = parseInt(code, 10) as OpCode;
    return this.opcodeMap.get(opCode) || this.terminate;
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

  private terminate = async (memory: number[], opIdx: number): Promise<number> => {
    this.emit("terminate");
    return NaN;
  }

  private add = async (memory: number[], opIdx: number): Promise<number> => {
    const [idxa, idxb, idxr] = this.getParameterIndices(memory, opIdx, 3);
    memory[idxr] = memory[idxa] + memory[idxb];
    return 4;
  }

  private mult = async (memory: number[], opIdx: number): Promise<number> => {
    const [idxa, idxb, idxr] = this.getParameterIndices(memory, opIdx, 3);
    memory[idxr] = memory[idxa] * memory[idxb];
    return 4;
  }

  private input = async (memory: number[], opIdx: number): Promise<number> => {
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

  private output = async (memory: number[], opIdx: number): Promise<number> => {
    const [idxa] = this.getParameterIndices(memory, opIdx, 1);
    const value = memory[idxa];
    this.emit("output", value);
    return 2;
  }

  private jumpIfTrue = async (memory: number[], opIdx: number): Promise<number> => {
    const [idxa, idxb] = this.getParameterIndices(memory, opIdx, 2);
    if (memory[idxa] !== 0) {
      const jumpPoint = memory[idxb];
      return jumpPoint - opIdx; // return where we want the opIdx to jump to
    }
    return 3; // increment the instruction pointer.
  }

  private jumpIfFalse = async (memory: number[], opIdx: number): Promise<number> => {
    const [idxa, idxb] = this.getParameterIndices(memory, opIdx, 2);
    if (memory[idxa] === 0) {
      const jumpPoint = memory[idxb];
      return jumpPoint - opIdx; // return where we want the opIdx to jump to
    }
    return 3; // increment the instruction pointer.
  }
  
  private lessThan = async (memory: number[], opIdx: number): Promise<number> => {
    const [idxa, idxb, idxc] = this.getParameterIndices(memory, opIdx, 3);
    memory[idxc] = Number(memory[idxa] < memory[idxb]);
    return 4;
  }

  private equals = async (memory: number[], opIdx: number): Promise<number> => {
    const [idxa, idxb, idxc] = this.getParameterIndices(memory, opIdx, 3);
    memory[idxc] = Number(memory[idxa] === memory[idxb]);
    return 4;
  }

  private relativeBaseOffset = async (memory: number[], opIdx: number): Promise<number> => {
    const [ idxValue ] = this.getParameterIndices(memory, opIdx, 1);
    this.relativeBase += memory[idxValue];
    return 2;
  }
}

const ParamMode = {
  ADDRESS: 0 as const,
  IMMEDIEATE: 1 as const,
  RELATIVE: 2 as const,
} as const;
type ParamMode = typeof ParamMode[keyof typeof ParamMode];

const OpCode = {
  ADD: 1 as const,
  MULTIPLY: 2 as const,
  INPUT: 3 as const,
  OUTPUT: 4 as const,
  JMPIFTRUE: 5 as const,
  JMPIFFALSE: 6 as const,
  LESSTHAN: 7 as const,
  EQUALS: 8 as const,
  RELATIVE_BASE_OFFSET: 9 as const,
  TERMINATE: 99 as const,
} as const;
type OpCode = typeof OpCode[keyof typeof OpCode];