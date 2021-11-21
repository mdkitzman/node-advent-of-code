import fs  from 'fs';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput);
  doPart2(allInput);
};

function doPart1(input: string) {

};

function doPart2(input: string) {

};

main();