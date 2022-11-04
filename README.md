# node-advent-of-code

Node project containing problems for several years of the [Advent of Code](https://adventofcode.com/).

## Installation

I use `nvm` to manage my node evironments.

Run the following command to install and set the current node version.

```
nvm use
```

Then run the following command to install everything

```
npm i
```

Make sure to have `ts-node` installed globally as this package uses `ts-node` to execute

```
npm i ts-node -g
```

## Usage

You can either execute `npm run start` to run the package locally or run `npm link` to install it globally under the `aoc` command.

## New Day Creation

Execute the following command to create a new file, ready to accept code for the problem of the day!

```
aoc init-day -d <day> -y [year]
```

The `year` parameter will default to the current year, but the `day` parameter is required.

```
aoc init-day -d 1 -y 2019
```

Will create a new directory in `./src/2019/day-1`.  In that directory will be an `index.ts` file and a `README.md` file.

Now you're off to the races!

## Execution

Execute the following command to run the code for a given day/year

```
aoc run -d 1 -y 2019
```

This will run the code for day 1 of year 2019.