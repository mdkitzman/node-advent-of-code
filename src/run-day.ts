import { Command } from 'commander';

const toNumber = (val: string, prev: number): number => parseInt(val, 10);

type Options = {
  day: number,
  year: number
};

const run = async ({ day, year}: Options) => {
  const newPath = `${__dirname}/${year}/day-${day}`;

  console.log(`Executing ${newPath}`);

  // Execute the thing!
  require(newPath);
}

const setupProgram = (program: Command): void => {
  program
    .command('run')
    .description('Execute a given Advent of Code day')
    .requiredOption<number>('-d, --day <day>', 'Which day?', toNumber)
    .option<number>('-y, --year [year]', 'Which year?', toNumber, new Date().getUTCFullYear())
    .action(run);
}

export default setupProgram;