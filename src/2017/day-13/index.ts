import { getPuzzleInput } from '../../aocClient.ts';
import timeFn from '../../util/timeFn.ts';
import { max } from '../../util/arrayUtils.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(13, 2017);
  const part1Expected = 1_728;
  const part2Expected = 3_946_838;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

class Entity {
  patrolLength:number;
  iPos:number;
  forward: boolean;
  constructor(patrolLength:number){
    this.patrolLength = patrolLength
    this.iPos = 0;
    this.forward = true;
  }

  step() {
    if(this.iPos == this.patrolLength -1) {
      this.forward = false;
    } else if (this.iPos == 0) {
      this.forward = true;
    }
    this.iPos += this.forward ? 1 : -1;
  }

  reset(delay:number = 0) {
    const cycleLen = (this.patrolLength * 2) - 2;
    const offset = delay % cycleLen;
    this.forward = offset < this.patrolLength;
    this.iPos = this.forward
      ? offset
      : this.patrolLength - (offset % this.patrolLength) - 2
  }

  get position() { return this.iPos; }
}

class Player extends Entity{
  constructor(patrolLength:number){
    super(patrolLength);
    this.iPos = -1;
  }

  step() {
    this.iPos++;
  }

  reset(delay:number = 0) {
    this.iPos = -1;
  }

}

function doPart1(input: string) {
  const layers = input.split('\n').map(line => line.split(': '));
  const maxLayer = layers.map(layer => layer[0]).map(v => parseInt(v, 10)).reduce(max);

  const scanners:{[k:string]:{depth:number,scanner:Entity}} = {};
  layers.forEach(layer => {
    scanners[layer[0]] = {
      depth: parseInt(layer[1]),
      scanner: new Entity(parseInt(layer[1]))
    };
  });

  let cost=0;
  const player = new Player(maxLayer);
  for(let iLayer = 0; iLayer <= maxLayer; iLayer++) {
    player.step();
    const scannedLayer = scanners[String(iLayer)] 
    if(scannedLayer && scannedLayer.scanner.position === 0){
      // we  landed on a scanner!
      cost += iLayer * scannedLayer.depth;
    }
    Object.entries(scanners).forEach(([_, scannedLayer]) => scannedLayer.scanner.step() );
  }

  return cost;
};

function doPart2(input: string) {
  const layers = input.split('\n').map(line => line.split(': '));
  const maxLayer = layers.map(layer => layer[0]).map(v => parseInt(v, 10)).reduce(max);

  const scanners:{[k:string]:{depth:number,scanner:Entity}} = {};
  layers.forEach(layer => {
    scanners[layer[0]] = {
      depth: parseInt(layer[1]),
      scanner: new Entity(parseInt(layer[1]))
    };
  });

  let caught = false;
  let delay = 0;
  const player = new Player(maxLayer);
  do {
    caught = false;
    for(let i = 0; player.position <= maxLayer; i++) {
      player.step();
      const scannedLayer = scanners[String(player.position)] 
      if(scannedLayer && scannedLayer.scanner.position === 0){
        // we  landed on a scanner!
        caught = true;
        break;
      }
      Object.entries(scanners).forEach(([_, scannedLayer]) => scannedLayer.scanner.step() );
    }
    if(caught) {
      delay++;
      player.reset(delay);
      Object.entries(scanners).forEach(([_, scannedLayer]) => scannedLayer.scanner.reset(delay) );
    }
  } while (caught);

  return delay;
};

main();