import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const toNumber = (val: string, prev: number): number => parseInt(val, 10);

type Options = {
  day: number,
  year: number
};

const run = async ({ day, year}: Options) => {
  const newPath = join(__dirname, `${year}/day-${day}/index.ts`);

  console.log(`Executing ${newPath}`);

  // Execute the thing!
  await import(newPath);
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