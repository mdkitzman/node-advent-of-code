import { getPuzzleInput } from '../../aocClient.ts';
import { getDirectory, walkDirs, type Directory } from './dir.ts';

const main = async () => {
  const allInput = await getPuzzleInput(7, 2022);
  const directory = getDirectory(allInput);
  doPart1(directory); // 1182909
  doPart2(directory); // 2832508
};

function doPart1(directory: Directory) {
  let total = 0;
  walkDirs(directory, (_, size) => {
    if (size > 100_000) {
      return;
    }
    total += size;
  });

  console.log(total);
};

function doPart2(directory: Directory) {
  const maxSpace = 70_000_000;
  const freeSpace = maxSpace - directory['__size'];
  
  let dirSize = 0;
  let minSpace = maxSpace;
  walkDirs(directory, (_, size) => {
    const newFree = freeSpace + size;
    if (newFree <= minSpace && newFree >= 30_000_000) {
      minSpace = freeSpace + size;
      dirSize = size;
    }
  });

  console.log(dirSize);
};

main();