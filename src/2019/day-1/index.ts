import fs from 'fs';
import { sum } from '../../util/arrayUtils';

const fuelNeeded = (mass: number): number => Math.floor(mass/3) - 2;

const doPart1 = (moduleMasses: number[]) => {
  const totalFuelNeeded = moduleMasses.map(fuelNeeded).reduce(sum);
  console.log(`Total fuel needed is ${totalFuelNeeded}`);
};

const doPart2 = (moduleMasses: number[]) => {
  const totalFuelNeeded = moduleMasses.map(mass => {
    const fuelNeeds:number[] = [];
    let acc = mass;
    do {
      acc = fuelNeeded(acc);
      if (acc > 0)
        fuelNeeds.push(acc);
    } while (acc > 0);
    return fuelNeeds.reduce(sum);
  }).reduce(sum);

  console.log(`Total fuel needed is ${totalFuelNeeded}`);
};

const main = async () => {
  const allInput = await fs.promises.readFile('./src/2019/day-1/input', { encoding: 'utf-8'});
  const moduleMasses = allInput.split('\n').map(line => parseInt(line, 10));
  doPart1(moduleMasses); // 3560353
  doPart2(moduleMasses); // 5337642
};

main();