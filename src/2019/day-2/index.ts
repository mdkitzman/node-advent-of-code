import fs from 'fs';
import Iter from 'es-iter';
import { execute } from '../intcode-computer';

const doPart1 = (input: string) => {
  const memory:number[] = input.split(',').map(val => parseInt(val, 10));
  const result = execute([...memory], 12, 2);
  
  console.log(`Initial ops value is ${result}`)
};

const doPart2 = (input: string) => {
  const memory:number[] = input.split(',').map(val => parseInt(val, 10));
  const needle = 19690720;

  const nounVerbCombos = new Iter(Iter.range(99)).product(Iter.range(99));
  for(const [noun, verb] of nounVerbCombos){
    const result = execute([...memory], noun, verb);
    if (result === needle) {
      console.log(`Noun: ${noun}, Verb: ${verb} - Result is ${(100 * noun) + verb}`);
      return;
    }
  }

  console.log(`Not found`);
};

const main = async () => {
  const allInput = await fs.promises.readFile('./src/2019/day-2/input', { encoding: 'utf-8'});
  doPart1(allInput); // 4330636
  doPart2(allInput); // 6086
};

main();