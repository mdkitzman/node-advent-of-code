import { Command } from 'commander';
import {
  promises as fs,
  createReadStream,
  createWriteStream,
  writeFileSync,
  Stats
} from 'fs';
import { getReadme, getPuzzleInput } from './aocClient';


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
  const newPath = `${__dirname}/${year}/day-${day}`;
  
  try {
    await fs.mkdir(newPath, { recursive: true });
  } catch (err) {
    return console.error({err}, 'Unable to make new directory 😭');
  }
  const newFilePath = `${newPath}/index.ts`;
  const readmePath = `${newPath}/README.md`;
  const inputPath = `${newPath}/input`;
  await Promise.all([
    ensureFile(newFilePath, async () => {
      createReadStream(`${__dirname}/day-template.ts`).pipe(createWriteStream(newFilePath))
    }),
    ensureFile(readmePath, async () => {
      const mdData = await getReadme(day, year);
      writeFileSync(readmePath, mdData)
    }),
    ensureFile(inputPath, async() => {
      const input = await getPuzzleInput(day, year);
       writeFileSync(inputPath, input)
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