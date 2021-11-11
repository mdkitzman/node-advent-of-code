import { Command } from 'commander';
import fs, { PathLike } from 'fs';
const program = new Command();

const toNumber = (val: string, prev: number): number => parseInt(val, 10);

program
  .requiredOption<number>('-d, --day <day>', 'What day is this for?', toNumber)
  .option<number>('-y, --year [year]', 'What year should this be created for?', toNumber, new Date().getUTCFullYear());
program.parse(process.argv);

const {
  day, year
} = program.opts();

const newPath = `./src/${year}/day-${day}`;

fs.mkdir(newPath, { recursive: true }, (err, path) => {
  if(err) {
    console.error({err}, 'Unable to make new directory 😭');
    return;
  }
  const newFilePath = `${newPath}/index.ts`;
  const readmePath = `${newPath}/README.md`;
  fs.access(newFilePath, () => {
    fs.stat(newFilePath, (err, stats) => {
      if (!stats || !stats.isFile()) {
        fs.createReadStream('./src/day-template.ts').pipe(fs.createWriteStream(newFilePath));
      }
    });
  });
  fs.access(readmePath, () => {
    fs.stat(newFilePath, (err, stats) => {
      if (!stats || !stats.isFile()) {
        fs.writeFileSync(readmePath, `# Day ${day}\n\n## Part 1\n\n## Part 2`);
      }
    });
  });

});