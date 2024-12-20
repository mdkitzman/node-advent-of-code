import { getPuzzleInput } from '../../aocClient';
import timeFn from '../../util/timeFn';
import { sum } from '../../util/arrayUtils';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(3, 2017);
  const part1Expected = 552;
  const part2Expected = 330785;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const east  = (radius:number):number => Math.pow(((radius * 2) - 1), 2) + radius;
  const north = (radius:number):number => east(radius) + 2*radius;
  const west  = (radius:number):number => east(radius) + 4*radius;
  const south = (radius:number):number => east(radius) + 6*radius;

  const maxRadius = (value:number):number => {
    let maxRadius = 0;
    let eastNum = 0;
    while((eastNum = east(maxRadius)) < value) {
      maxRadius++;
    } 
    return maxRadius;
  }

  const optimalDistanceTo1 = (fromValue:number):number => {
    const r = maxRadius(fromValue);

    const minDiffMinus1 = Math.min(...[north(r-1), south(r-1), east(r-1), west(r-1)].map(directionValue => Math.abs(directionValue - fromValue)));
    const minDiff = Math.min(...[north(r), south(r), east(r), west(r)].map(directionValue => Math.abs(directionValue - fromValue)));
    
    const optimalRadius = minDiff < minDiffMinus1 ? r : r - 1;
    
    const distanceTo1 = optimalRadius + Math.min(minDiffMinus1, minDiff);
    return distanceTo1;
  };

  return optimalDistanceTo1(parseInt(input, 10));
};

function doPart2(input: string) {
  const isCorner = (pos: number): boolean => {
    const root = Math.sqrt(pos);
    return Number.isInteger(root) || Math.pow(Math.floor(root),2) + Math.floor(root) === pos;
  }

  const previousSpiralRoot = (pos:number): number => {
    let prevRoot = Math.floor(Math.sqrt(pos)) - 2;
    if(prevRoot < 0)
      prevRoot = 0
    return Math.pow( prevRoot, 2);
  }
  
  const distToLastRoot = (pos:number): number => pos - Math.pow(Math.floor(Math.sqrt(pos)), 2);
  
  const distToLastCorner = (pos:number): number => {
    // I think I have to walk back iteratively.
    let cornerPos = pos;
    while(!isCorner(cornerPos)) {
      cornerPos--;
    }
    return pos - cornerPos;
  }
  
  const previousSpiralCorner = (pos:number): number => {
    // pos must be a corner for this to work.
    const root = Math.sqrt(pos);
    if(Number.isInteger(root)) {
      // top-left or bottom-right diagonal
      return Math.pow(root - 2, 2);
    } else {
      // top-right or bottom-left diagonal
      const prevSteps = Math.floor(root) - 2;
      const prevRoot = Math.pow(prevSteps, 2);
      return prevRoot + prevSteps;
    }
  }
  
  const nearestNeighbors = (pos:number): number[] => {
    // initial positions
    if(pos === 0) return [];
    if(pos === 1) return [pos - 1];
  
    // Previous position is always a neighbor
    const neighbors:number[] = [pos - 1];
    
    /* corner positions only has two neighbors:
       - last position (pos - 1)
       - the next diagonal corner
       otherwise, the position should have a 
     */
    if(isCorner(pos)) {
      // there is no horizontal neighbor, only diagonal
      neighbors.push(previousSpiralCorner(pos));
    } else {
      if(isCorner(pos-1)) {
        // When the previous one was a corner, just round the corner
        neighbors.push(pos-2);
        // Horizontal neighbor is the last square position
        const horizontalNeighbor = previousSpiralCorner(pos-1);
        neighbors.push(horizontalNeighbor);
        if(!isCorner(pos+1)) {
          // we only have this forward diagonal neighbor if the next position is not a corner
          neighbors.push(horizontalNeighbor+1);
        }
      } else {
        // Otherwise, pull out some feaky math to find the diagonal neighbor in the square
        //let horizontalNeighbor = previousSpiralRoot(pos) + distToLastCorner(pos) - 1;
        const lastRootDist = distToLastRoot(pos);
        let horizontalNeighbor = previousSpiralRoot(pos) + lastRootDist
        horizontalNeighbor -= distToLastCorner(pos) != lastRootDist
          ? 3 // We've rounded a corner from the last square root corner, knock off a few extra.
          : 1;
        //early on this result is negative.  Lets keep it neutral!
        if(horizontalNeighbor < 0) {
          horizontalNeighbor = 0;
        }
        // These two neighbors should be in sequence with one another.
        neighbors.push(horizontalNeighbor);
        neighbors.push(horizontalNeighbor-1);
        if(!isCorner(pos+1)) {
          // we only have this forward diagonal neighbor if the next position is not a corner
          neighbors.push(horizontalNeighbor+1);
        }
      }
    }
    
    return neighbors;
  };
  
  const constructSquare = (limit:number): number[] => {
    const squareNumbers:number[] = [];
    let i = 0;
    do {
      const neighbors = nearestNeighbors(i);
      const total = neighbors.map(pos => squareNumbers[pos]).reduce(sum, 0) || 1;
      squareNumbers.push(total);
    } while (squareNumbers[i++] <= limit);
    return squareNumbers;
  }
  
  const values = constructSquare(parseInt(input, 10));
  const largestValue = values.pop();
  return largestValue;
};

main();