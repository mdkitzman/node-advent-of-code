import fs  from 'fs';
import timeFn from '../../util/timeFn';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  
  timedPart1(allInput);
  timedPart2(allInput);
};

function doPart1(input: string) {

};

function doPart2(input: string) {

};

main();