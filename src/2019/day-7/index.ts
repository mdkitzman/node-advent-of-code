import fs, { WriteStream }  from 'fs';
import { IntComp } from '../intcode-computer';
import Iter from 'es-iter';
import { max } from '../../util/arrayUtils';
import { EventEmitter } from 'stream';

const main = async () => {
  const allInput = await fs.promises.readFile('./src/2019/day-7/input', { encoding: 'utf-8'});
  
  await doPart1(allInput); // 880726
  await doPart2(allInput); // 4931744
};

async function doPart1(input: string) {
  const computer = new IntComp('expanded');
  const program = input.split(',').map(val => parseInt(val, 10));  
  
  const outputValues: { output: number, combo: number[] }[] = [];
  const settingsCombos: number[][] = Iter.range(5).permutations().toArray();
  for(const phaseSettings of settingsCombos) {
    let previousOutput = 0;
    for(const setting of phaseSettings) {
      const input = [setting, previousOutput];
      const sendInput = () => {
        computer.emit("input", input.shift());
      };
      const onOutput = (value:number) => {
        previousOutput = value;
      };

      computer.on("needsInput", sendInput);
      computer.on("output", onOutput);
      await computer.execute([...program]);
      computer.off("output", onOutput);
      computer.off("needsInput", sendInput);
    }
    outputValues.push({
      output: previousOutput,
      combo: phaseSettings
    });
  }
  
  const maxOutput = outputValues.map(v => v.output).reduce(max);
  console.log(`Max output is ${maxOutput}`);
};

class Amp extends EventEmitter {
  private computer: IntComp;
  private writeBuffer: number[] = [];
  private readBuffer: number[] = [];

  constructor(phaseMode: number){
    super();
    this.computer = new IntComp('expanded');
    this.readBuffer.unshift(phaseMode);  
    this.computer.on("output", (value:number) => {
      this.emit("output", value);
      const i = setImmediate(() => {
        this.writeBuffer.unshift(value);
        clearImmediate(i);
      });
    });
    this.computer.on("needsInput", () => {
      const waiter = setInterval(() => {
        if (this.readBuffer.length > 0) {
          const value = this.readBuffer.pop();
          clearInterval(waiter);
          const i = setImmediate(() => {
            this.computer.emit("input", value);
            clearImmediate(i);
          });
        }  
      }, 10);
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

main();