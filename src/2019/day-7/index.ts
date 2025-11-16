import fs, { WriteStream }  from 'fs';
import { IntComp } from '../intcode-computer.ts';
import Iter from 'es-iter';
import { max } from '../../util/arrayUtils.ts';
import EventEmitter from 'events';
import { getPuzzleInput } from '../../aocClient.ts';

const main = async () => {
  const allInput = await getPuzzleInput(7, 2019);
  
  await doPart1(allInput); // 880726
  await doPart2(allInput); // 4931744
};

async function doPart1(input: string) {
  const program = input.split(',').map(val => parseInt(val, 10));  
  
  const outputValues: { output: number, combo: number[] }[] = [];
  const settingsCombos: number[][] = Iter.range(5).permutations().toArray();
  for(const phaseSettings of settingsCombos) {
    let lastOutput = 0;
    for(const setting of phaseSettings) {
      const amp = new Amp(setting);
      // initial input is set to the last output
      amp.addInput(lastOutput);
      
      // wire the input to its own output
      amp.wireTo(amp)
      amp.on("output", value => lastOutput = value);
      await amp.execute([...program]);
    }
    outputValues.push({
      output: lastOutput,
      combo: phaseSettings
    });
  }
  
  const maxOutput = outputValues.map(v => v.output).reduce(max);
  console.log(`Max output is ${maxOutput}`);
};

async function doPart2(input: string) {
  const program = input.split(',').map(val => parseInt(val, 10));  
  
  const outputValues: { output: number, combo: number[] }[] = [];
  const settingsCombos: number[][] = Iter.range(5, 10).permutations().toArray();
  for(const phaseSettings of settingsCombos) {
    const [
      ampA, ampB, ampC, ampD, ampE
    ]: Amp[] = phaseSettings.map((phaseMode) => new Amp(phaseMode));
    
    ampA.wireTo(ampB);
    ampB.wireTo(ampC);
    ampC.wireTo(ampD);
    ampD.wireTo(ampE);
    ampE.wireTo(ampA);

    let lastOutput = 0;
    ampE.on("output", (value:number) => lastOutput = value);

    ampA.addInput(0);
    await Promise.all([
      ampA.execute([...program]),
      ampB.execute([...program]),
      ampC.execute([...program]),
      ampD.execute([...program]),
      ampE.execute([...program]),
    ]);
    
    outputValues.push({
      output: lastOutput,
      combo: phaseSettings
    });
  }
  
  const maxOutput = outputValues.map(v => v.output).reduce(max);
  console.log(`Max output is ${maxOutput}`);
};

class Amp extends EventEmitter {
  private computer: IntComp = new IntComp();
  private writeBuffer: number[] = [];
  private readBuffer: number[] = [];

  constructor(phaseMode: number){
    super();
    this.addInput(phaseMode);
    
    this.computer.on("output", (value:number) => {
      this.emit("output", value);
      // insert this value at the beginning if the write buffer
      this.writeBuffer.unshift(value);
    });
    this.computer.on("needsInput", () => {
      // The computer needs input, and we may need to wait until 
      // our read buffer has some input.
      const waiter = setInterval(() => {
        if (this.readBuffer.length > 0) {
          // We have some input!
          // pop it out of the buffer, stop our wait interval, and send it along 
          const value = this.readBuffer.pop();
          clearInterval(waiter);
          this.computer.emit("input", value);
        }  
      }, 1);
    });
  }

  public addInput(input: number) {
    this.readBuffer.unshift(input);
  }

  public wireTo(other: Amp) {
    this.writeBuffer = other.readBuffer;
  }

  public async execute(program: number[]): Promise<number> {
    return this.computer.execute(program);
  }
}

main();