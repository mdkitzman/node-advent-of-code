import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { DateTime } from 'luxon';
import Guard from './guard';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(4, 2018);
  const part1Expected = 35184;
  const part2Expected = 37886;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

type GuardMap = Record<number, Guard>;

const getGuardSchedules = (input: string): GuardMap => {
  const statusReg = /\[(\d{4}-\d{2}\-\d{2} \d{2}:\d{2})\] (Guard #(\d+) begins shift|falls asleep|wakes up)/;
  const timeSortedInput = input
    .split('\n')
    .map(line => statusReg.exec(line)!.splice(1,4))
    .map(([date, action, guardId]) => ({
      ts: DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm'),
      date,
      action,
      guardId: parseInt(guardId, 10) || undefined
    }))
    .sort((a, b) => a.ts.toMillis() - b.ts.toMillis());
  
  const guardHandler = {
    get: function(target:GuardMap, prop:string) {
      if(!target[prop]){
        const id = parseInt(prop, 10);
        target[prop] = new Guard(id);
      } 
      return target[prop];
    }
  };
  const datastore: GuardMap = {};
  const guardMap = new Proxy(datastore, guardHandler);
  let currentGuard = -1;
  timeSortedInput.forEach(input => {
    switch (true) {
      case Boolean(input.guardId):
        currentGuard = input.guardId!;
        break;
      case input.action === 'falls asleep':
        guardMap[currentGuard].sleep(input.ts);
        break;
      case input.action === 'wakes up':
        guardMap[currentGuard].wakeUp(input.ts);
        break;
      default:
        console.warn(`Unknown action!  ${input.action}`);
    }
  });
  
  return datastore;
}

function doPart1(input: string) {
  const datastore = getGuardSchedules(input);
  const [guard] = Object.values(datastore).sort((a, b) => b.minutesSlept - a.minutesSlept);
  const result = guard.id * guard.sleepiestMinute.minute;
  return result;
};

function doPart2(input: string) {
  const datastore = getGuardSchedules(input);
  const [guard] = Object.values(datastore).sort((a, b) => b.sleepiestMinute.count - a.sleepiestMinute.count);
  const result = guard.id * guard.sleepiestMinute.minute;
  return result;
};

main();