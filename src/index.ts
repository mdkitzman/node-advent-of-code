#!/usr/bin/env ts-node-script
import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import * as APPS from './applications'

const pkg = require("../package.json"); // from local lib
const banner = chalk.red(figlet.textSync(pkg.name, { horizontalLayout: 'full', font: 'Slant' }));
const program = new Command();
program.version(pkg.version);
// Pass the program to each application and setup the command and arguments
Object.values(APPS).forEach(app => app(program as unknown as Command));

// parse and execute the desire application
program
  .addHelpText('before', banner)
  .parse(process.argv);