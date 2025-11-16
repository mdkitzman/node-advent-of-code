#!/usr/bin/env node
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import * as APPS from './applications.ts'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const banner = chalk.red(figlet.textSync(pkg.name, { horizontalLayout: 'full', font: 'Rectangles' }));
const program = new Command();
program.version(pkg.version);
// Pass the program to each application and setup the command and arguments
Object.values(APPS).forEach(app => app(program as unknown as Command));

// parse and execute the desire application
program
  .addHelpText('before', banner)
  .parseAsync(process.argv)
  .catch(e => console.error(e));