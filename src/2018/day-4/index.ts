import fs  from 'fs';
import { DateTime } from 'luxon';
import Guard from './guard';

type GuardMap = Record<number, Guard>;

const main = async () => {
  const allInput = await fs.promises.readFile(`${__dirname}/input`, { encoding: 'utf-8'});
  doPart1(allInput); // 35184
  doPart2(allInput); // 37886
};

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
  console.log(`The result is ${guard.id * guard.sleepiestMinute.minute}`);
};

function doPart2(input: string) {
  const datastore = getGuardSchedules(input);
  const [guard] = Object.values(datastore).sort((a, b) => b.sleepiestMinute.count - a.sleepiestMinute.count);
  console.log(`The result is ${guard.id * guard.sleepiestMinute.minute}`);
};

main();