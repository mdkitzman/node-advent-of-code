import fs  from 'fs';
import lodash from 'lodash';
import Iter from 'es-iter';

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 6150
  doPart2(allInput); // rteotyxzbodglnpkudawhijsc
};

function doPart1(input: string) {
  const wordWithNLetters = (n: number, word: string): boolean => {
    return Object.values(lodash.countBy(word.split(''))).some(count => count === n);
  }

  const words = input.split('\n');
  const twos = words
    .filter(word => wordWithNLetters(2, word))
    .length;
  const threes = words
    .filter(word => wordWithNLetters(3, word))
    .length;
  console.log(`Checksum value is ${twos * threes}`);
};

function doPart2(input: string) {
  const similarLetters = (str1, str2) => {
    const similar:string[] = [];
    for(let i = 0; i < str1.length; i++) {
      if(str1[i] === str2[i]){
        similar.push(str1[i]);
      }
    }
    return similar.join('');
  }

  const words = input.split('\n')
  const wordPairs: [string, string][] = new Iter(words).combinations(2).toArray();
  const [word1, word2] = wordPairs.find((([str1, str2]) => {
    const word = similarLetters(str1, str2);
    return str1.length - word.length === 1
  })) || [];
  const word = similarLetters(word1, word2);

  console.log(`Common box letters : ${word}`);
};

main();