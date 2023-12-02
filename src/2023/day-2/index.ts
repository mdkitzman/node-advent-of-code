import fs  from 'fs';
import { multiply, sum } from '../../util/arrayUtils';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput);
  doPart2(allInput);
};

type GameRound = {
  red?: number,
  green?: number,
  blue?: number,
}

type Game = {
  id: number;
  rounds: GameRound[]
}

const getGames = (input: string): Game[] => {
  return input
  .split('\n')
  .map(game => {
    const [gameLine, roundData] = game.split(':');
    const [,gameId] = /Game (\d+)/.exec(gameLine)!;
    const rounds: Game['rounds'] = roundData
      .split(';')
      .map(roundStr => 
        roundStr
          .trim()
          .split(', ')
          .map(r => r.split(' '))
          .map(([count, color]) => ({[color]: parseInt(count, 10)}))
          .reduce((acc, cur) => ({...acc, ...cur}))
      );
      const result: Game = {
        id: parseInt(gameId, 10),
        rounds
      };
      return result;
  });
}

function doPart1(input: string) {
  const max = { red: 12, green: 13, blue: 14};

  const impossible = (game: Game): boolean => {
    return game.rounds.some(round => round.red! > max.red || round.green! > max.green || round.blue! > max.blue);
  }
  const games = getGames(input);
  const total = games
    .filter(game => !impossible(game))
    .map(game => game.id)
    .reduce(sum);

  console.log(total); // 2348
};

function doPart2(input: string) {
  const games = getGames(input);
  const gamePowersSum = games
    .map(game => {
      const minRound = game.rounds
        .reduce((acc, cur) => ({
          red: Math.max(acc.red || 0, cur.red || 0),
          green: Math.max(acc.green || 0, cur.green || 0),
          blue: Math.max(acc.blue || 0, cur.blue || 0)
        }));
      return Object.values(minRound).reduce(multiply)
    })
    .reduce(sum);
  
    console.log(gamePowersSum) // 76008
};

main();