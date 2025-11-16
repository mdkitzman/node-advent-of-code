import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  promises as fs,
  createWriteStream,
  writeFileSync,
  Stats
} from 'fs';
import { Readable } from 'stream';
import { getReadme, getPuzzleInput } from './aocClient.ts';
import { template } from 'lodash-es';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const toNumber = (val: string, prev: number): number => parseInt(val, 10);

const ensureFile = async (filePath: string, fn: ()=>Promise<void>): Promise<void> => {
  let stats: Stats | null = null;
  try {
    stats = await fs.stat(filePath); 
  } catch (err) {}
  if (!stats || !stats.isFile()) {
    await fn();
  }
};

type Options = {
  day: number,
  year: number
};

const run = async ({ day, year}: Options) => {
  const newPath = join(__dirname, `${year}/day-${day}`);
  
  try {
    await fs.mkdir(newPath, { recursive: true });
  } catch (err) {
    return console.error({err}, 'Unable to make new directory 😭');
  }
  const newFilePath = join(newPath, 'index.ts');
  const readmePath = join(newPath, 'README.md');

  await Promise.all([
    ensureFile(newFilePath, async () => {
      const fileData = await fs.readFile(join(__dirname, 'day-template.ts'), { encoding: 'utf-8'});
      const compiled = template(fileData)({ day, year });

      Readable.from(compiled).pipe(createWriteStream(newFilePath));
    }),
    ensureFile(readmePath, async () => {
      const mdData = await getReadme(day, year);
      writeFileSync(readmePath, mdData)
    }),
  ]);
}

const setupProgram = (program: Command): void => {
  program
    .command('init-day')
    .description('Will create the folders and files necessary to start an AOC day')
    .requiredOption<number>('-d, --day <day>', 'What day is this for?', toNumber)
    .option<number>('-y, --year [year]', 'What year should this be created for?', toNumber, new Date().getUTCFullYear())
    .action(run);
}

export default setupProgram;