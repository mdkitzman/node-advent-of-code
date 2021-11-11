import { promises as fs } from 'fs';

const part1 = (input:string) => {
  const [ingredients, alergens] = input.split(' (')

  console.log(`Part 1 : `);
};

const part2 = (input:string) => {
  console.log(`Part 2 : `)
}

(async () => {
  const allInput = await fs.readFile('./src/2020/day-21/input', { encoding: 'utf-8'});
  const test = await fs.readFile('./src/2020/day-21/test', { encoding: 'utf-8'});

  part1(test);
  part2(test);
})();