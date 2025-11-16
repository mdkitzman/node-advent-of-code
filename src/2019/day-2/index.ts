import fs from 'fs';
import Iter from 'es-iter';
import { IntComp, readProgram } from '../intcode-computer.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const doPart1 = async (input: string) => {
  const memory:number[] = readProgram(input);
  memory[1] = 12;
  memory[2] = 2;
  const computer = new IntComp();
  const result = await computer.execute(memory);
  
  console.log(`Initial ops value is ${result}`)
};

const doPart2 = async (input: string) => {
  const needle = 19690720;
  const memory:number[] = readProgram(input);
  
  const computer = new IntComp();
  const nounVerbCombos = new Iter(Iter.range(99)).product(Iter.range(99));

  for(const [noun, verb] of nounVerbCombos){
    const duplicate = [...memory];
    duplicate[1] = noun;
    duplicate[2] = verb;
    const result = await computer.execute(duplicate);
    if (result === needle) {
      console.log(`Noun: ${noun}, Verb: ${verb} - Result is ${(100 * noun) + verb}`);
      return;
    }
  }

  console.log(`Not found`);
};

const main = async () => {
  const allInput = await getPuzzleInput(2, 2019);
  doPart1(allInput); // 4330636
  doPart2(allInput); // 6086
};

main();