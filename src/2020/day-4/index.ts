import { difference } from 'lodash-es';
import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(4, 2020);
  const part1Expected = 233;
  const part2Expected = 111;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

const reqFields = ['byr','iyr','eyr','hgt','hcl','ecl','pid'];
const inRange = (min:number, max:number) => (val:number):boolean => min <= val && val <= max;
const yearValidator = (min:number, max:number) => (value:string):boolean => inRange(min, max)(parseInt(value, 10));

const validFieldCount = (passport:string) => {
  const ppFields = passport.split(' ').map(ent => ent.split(':')[0]);
  return difference(reqFields, ppFields).length === 0;
};
const cmInRange = inRange(150, 193);
const inInRange = inRange(59, 76);

const validators:{[k:string]:(v:string)=>boolean} = {
  'byr': yearValidator(1920, 2002),
  'iyr': yearValidator(2010, 2020),
  'eyr': yearValidator(2020, 2030),
  'hgt': (value:string):boolean => { 
    const [_, heightStr, unit] = /^([0-9]+)(cm|in)$/.exec(value) || [];
    if(!heightStr || !unit)
      return false;
    const height = parseInt(heightStr, 10);
    switch(unit) {
      case 'cm': return cmInRange(height);
      case 'in': return inInRange(height);
      default: return false;
    }
   },
  'hcl': (value:string):boolean => /^#[0-9a-f]{6}$/.test(value),
  'ecl': (value:string):boolean => ['amb','blu','brn','gry','grn','hzl','oth'].indexOf(value) !== -1,
  'pid': (value:string):boolean => /^\d{9}$/.test(value),
  'cid': (_:string):boolean => true,
};

function doPart1(input: string) {
  const validPpassports = input
    .split(/\s\s/).map(line => line.replace(/\n/g, ' '))
    .filter(validFieldCount)
    .length;
  return validPpassports;
};

function doPart2(input: string) {
  const validPpassports = input
    .split(/\s\s/).map(line => line.replace(/\n/g, ' '))
    .filter(validFieldCount)
    .filter((passport:string) => {
      return passport.split(' ')
        .map(entry => entry.split(':'))
        .map(([key, value]) => validators[key](value))
        .every(t => t)
    })
    .length
  return validPpassports;
};

main();