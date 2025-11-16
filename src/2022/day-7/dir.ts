import { set } from 'lodash-es';
import { sum } from '../../util/arrayUtils.ts';

export type Directory = {
  [k: string]: number | Directory;
  __size: number
}

const computeSizes = (dir: Directory): number => {
  const size = Object
    .values(dir)
    .map(val => {
      if(val instanceof Object) {
        return computeSizes(val);
      } else {
        return val as number;
      }
    })
    .reduce(sum)
  dir.__size = size;
  return size;
}

export const getDirectory = (input: string): Directory => {
  const directory: Directory = {
    __size:0
  };
  const currentPath:string[] = [];
  const commandReg = /\$ (\S+)(?: (\S+))?/;
  
  function handleCommand(line:string) {
    const [,cmd, args] = commandReg.exec(line)!;
    switch(cmd) {
      case 'cd':
        switch(args) {
          case '..':
            currentPath.pop();
            break;
          case '/':
            currentPath.length = 0;
            break;
          default:
            currentPath.push(args);
            break;
        }
    }
  }

  function handleListing(line:string) {
    const [first, second] = line.split(' ');
    if(first === 'dir') {
      set(directory, [...currentPath, second].join('.'), {});
    } else {
      const size = parseInt(first, 10);
      set(directory, [...currentPath, second.replace('.', '_')].join('.'), size);
    }
  }

  input
    .split('\n')
    .forEach(line => 
      line.startsWith('$') 
        ? handleCommand(line)
        : handleListing(line)
    );
  computeSizes(directory);
  return directory;
}

export const walkDirs = (dir: Directory, cb: (currentDir: string, size: number)=>void): void => {
  Object
    .entries(dir)
    .forEach(([current, val]) => {
      if (val instanceof Object) {
        cb(current, val.__size);
        walkDirs(val, cb);
      }
    });
}