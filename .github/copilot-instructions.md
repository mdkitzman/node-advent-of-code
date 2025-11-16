# Copilot Instructions for node-advent-of-code

## Project Overview

A TypeScript CLI tool for solving Advent of Code problems. The project manages solutions for multiple years (2017-2024) with auto-generation of day templates and automated puzzle input/description fetching from adventofcode.com.

## Architecture

**Entry Point:** `src/index.ts` — Commander-based CLI with figlet banner. Routes commands to applications.

**Applications:** Registered in `src/applications.ts` using a plugin pattern:
- `initDay`: Creates new day directories with template code and fetched problem descriptions
- `runDay`: Executes a specific year/day solution via dynamic require

**Day Structure:** Each day lives in `src/{year}/day-{N}/index.ts`. The template (`src/day-template.ts`) includes:
- `doPart1()` and `doPart2()` functions
- Lodash template substitution for day/year variables
- Timing wrapper via `timeFn()` and expected result validation

## Key Patterns & Conventions

**Input Handling:**
- `getPuzzleInput(day, year)` in `aocClient.ts` fetches raw puzzle input (trimmed)
- `inputParsers.ts` provides utilities: `lines()`, `doubleLines()`, `gridBuilder()`
- Parsing is typically inline in day solutions, not abstracted

**Coordinate Systems:**
- `Point2D` class in `util/point.ts` with top-left origin (y increases downward)
- `manhattenDistance()` and `angle()` assume this origin
- `cardinalNeighbors` and `neighborArray` constants for iteration
- `Grid<T>` for spatial problems: stores data as `Map<"x,y", T>`, use `point.toString()` as key

**Utilities (in `src/util/`):**
- `arrayUtils.ts`: Reducers (`sum`, `multiply`), chunking, windowing, combinations (`choose()`), `discriminate()` for unions
- `timeFn.ts`: Wraps functions to log execution time via `console.time()`
- `inputParsers.ts`: `gridBuilder()` creates Grid instances from char input
- `grid.ts`: `Grid<T>` for coordinates, `InfiniteGrid<T>` for infinite coordinate spaces
- `stringUtils.ts`, `numberUtils.ts`, `hash.ts`: Single-purpose helpers

**CLI Workflow:**
```bash
# Install globally or use npm link
npm link
aoc init-day -d 1 -y 2024          # Creates src/2024/day-1/ with template + README
aoc run -d 1 -y 2024               # Executes day solution
```

## Conventions

- **Import style:** ES modules (`import`/`export`, `"type": "module"` in package.json)
- **Typing:** Strict TypeScript enabled; utility types like reducers use `(prev, cur) => result`
- **Naming:** `doPart1`/`doPart2` for solution functions, `timedPart1`/`timedPart2` for wrapped versions
- **Session Token:** Requires `AOC_SESSION_TOKEN` environment variable for puzzle fetching
- **Expected Results:** Store expected answers in template to validate (`part1 === part1Expected ? '✅' : '❌'`)

## External Dependencies

- **lodash**: Templates, grouping, zip/unzip (used in day solutions)
- **luxon**: Datetime (not widely used yet)
- **graphology**: Graph structures for path finding
- **fast-astar**: A* pathfinding
- **nearley/rpn/infix-to-postfix**: Expression parsing

## Common Pitfalls & Tips

- **Grid coordinates:** Remember top-left origin; `angle()` and `slope()` are perspective-dependent
- **Infinite grids:** Use `InfiniteGrid<T>` when space is unbounded to avoid manual bounds checking
- **Combinations:** Use `choose(arr, k)` not `permutations`; permutation logic is in `util/permutation.ts`
- **Part 2 async timing:** If Part 2 depends on Part 1, wrap both or run sequentially to avoid timeout issues
- **Dynamic imports:** `require()` is used in `run-day.ts` despite ES modules; ensures code executes on import
