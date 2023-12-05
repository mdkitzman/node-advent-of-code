#!/usr/bin/env ts-node-script
import 'dotenv/config';
import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import * as APPS from './applications'

const pkg = require(`${__dirname}/../package.json`); // from local lib
const banner = chalk.red(figlet.textSync(pkg.name, { horizontalLayout: 'full', font: 'Rectangles' }));
const program = new Command();
program.version(pkg.version);
// Pass the program to each application and setup the command and arguments
Object.values(APPS).forEach(app => app(program as unknown as Command));

// parse and execute the desire application
program
  .addHelpText('before', banner)
  .parseAsync(process.argv)
  .catch(e => console.error(e))
  .finally(() => {
    console.log('all done')
  });