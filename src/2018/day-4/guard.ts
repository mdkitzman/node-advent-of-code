import { DateTime } from 'luxon';
import { sum } from '../../util/arrayUtils.ts';

export default class Guard {
  public sleepSchedule: DateTime[][] = [];

  constructor(public readonly id: number){}

  public sleep(time: DateTime): void {
    this.sleepSchedule.push([time]);
  }
  
  public wakeUp(time: DateTime): void {
    const [sleepTime] = this.sleepSchedule.pop()!;
    if (!sleepTime){
      console.warn(`Guard ${this.id} is waking up without a previous sleep time`);
    }
    this.sleepSchedule.push([sleepTime, time]);
  }
  
  public get minutesSlept(): number {
    return this.sleepSchedule
      .map(([start, end]) => end.diff(start, 'minutes').minutes)
      .reduce(sum, 0);
  }

  public get sleepiestMinute(): {minute: number, count: number} {
    const minutes = new Array(60).fill(0);
    this.sleepSchedule
      .forEach(([start, end]) => {
        const startMinute = start.get('minute');
        const endMinute = startMinute + end.diff(start, 'minutes').minutes;
        for (let i = startMinute; i <= endMinute; i++)
          minutes[i]++;
      });
    const [best] = minutes
      .map((value, index) => ({minute: index, count: value}))
      .sort((a, b) => b.count - a.count)
    return best;
  }
}