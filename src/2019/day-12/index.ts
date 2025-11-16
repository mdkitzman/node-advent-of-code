import { Point3D } from '../../util/point.ts';
import Iter from 'es-iter';
import { sum } from '../../util/arrayUtils.ts';
import { lcm } from '../../util/numberUtils.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const main = async () => {
  const allInput = await getPuzzleInput(12, 2019);

  doPart1(allInput); // 7179
  doPart2(allInput); // 428576638953552
};

function doPart1(input: string) {
  const moons = getMoons(input);
  const moonPairs: [Moon, Moon][] = new Iter(moons).combinations(2).toArray();

  // Simulate in time steps
  for(let iSimStep = 0; iSimStep < 1000; iSimStep++) {
    // 1. Update the velocity of every moon
    moonPairs.forEach(([moonA, moonB]) => applyGravities([moonA, moonB]));

    // 2. Update the position of every moon
    moons.forEach(moon => applyVelocity(moon));
  }

  const totalEnergy = moons.map(moon => moon.energy).reduce(sum);

  console.log(`The total energy is ${totalEnergy}`);
};


/**
 * Okay, so there is a bit of a trick to this part.  Straight-up brute force simulation
 * will not work here.  
 * 
 * After reading through some of the other solutions and discussions online, it looks like
 * you have to come to the realization that each dimension (x,y,z) of all of the moons
 * are independent of one another, i.e. movement in the x axis of the moons is unaffected
 * by any movement in the y axis.
 * 
 * Knowing this, just calculate the periodicity of each dimention independently, then
 * take the LCM (least common multiplier) of all three
 * 
 * @param input 
 */
function doPart2(input: string) {
  const moons = getMoons(input);
  const moonPairs: [Moon, Moon][] = new Iter(moons).combinations(2).toArray();
  const dimensions: Dim[] = ['x', 'y', 'z'];
  const dimension_periods = { x: 0, y: 0, z: 0};

  for (let dimension of dimensions) {
    let at_start = false;
    while (!at_start) {
      // 1. Update the velocity of every moon
      moonPairs.forEach(([moonA, moonB]) => applyGravities([moonA, moonB], [dimension]));
      // 2. Update the position of every moon
      moons.forEach(moon => applyVelocity(moon, [dimension]));
      dimension_periods[dimension]++;

      at_start = moons.every(moon => moon.atStart(dimension));
    }
  }

  // Why * 2?  This troubles me
  const iterations = Object.values(dimension_periods).reduce(lcm) * 2;
  console.log(`Finished after ${iterations} steps`);
};

function getMoons(input: string) {
  return input
  .split('\n')
  .map(line => line.split(',').map(v => parseInt(v, 10)))
  .map(([x, y, z]) => new Point3D(x,y,z))
  .map(point => new Moon(point));
}

type Dim = 'x'|'y'|'z';

class Moon {
  public readonly pos: Point3D;
  public readonly velocity: Point3D;
  private readonly originalPos: Point3D;

  constructor(pos: Point3D, velocity?: Point3D) {
    this.pos = pos;
    this.velocity = velocity || new Point3D(0,0,0);
    this.originalPos = pos;
  }
  get energy(): number {
    return absSum(this.pos) * absSum(this.velocity);
  }

  atStart(dimension: Dim): boolean {
		const position = this.pos[dimension];
		const initial_position = this.originalPos[dimension];
		const velocity = this.velocity[dimension];

		return position === initial_position && velocity === 0;
	}
}

function applyGravities([moonA, moonB]: Moon[], dimensions: Dim[] = ['x','y','z']) {
  for (let dim of dimensions) {
    if (moonA.pos[dim] > moonB.pos[dim]) {
      moonA.velocity[dim]--;
      moonB.velocity[dim]++;
    } else if (moonA.pos[dim] < moonB.pos[dim]) {
      moonA.velocity[dim]++;
      moonB.velocity[dim]--;
    }
  }
}

function applyVelocity(moon: Moon, dimensions: Dim[] = ['x','y','z']) {
  dimensions.forEach(dim => moon.pos[dim] += moon.velocity[dim]);
}

function absSum(p: Point3D): number {
  return [p.x, p.y, p.z].map(Math.abs).reduce(sum);
}

main();