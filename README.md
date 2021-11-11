# node-advent-of-

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

## New Day Creation

Execute the following command to create a new file, ready to accept code for the problem of the day!

```
npm run init-day -- -d <day> -y [year]
```

The `year` parameter will default to the current year, but the `day` parameter is required.

```
npm run init-day -- --d 1 -y 2019
```

Will create a new directory in `./src/2019/day-1`.  In that directory will be an `index.ts` file and a `README.md` file.

Now you're off to the races!