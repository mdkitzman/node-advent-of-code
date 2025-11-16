import { assert } from 'console';
import { InfiniteGrid } from '../../util/grid.ts';
import { Point2D, neighborArray } from '../../util/point.ts';
import { getPuzzleInput } from '../../aocClient.ts';

const test = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`

const main = async () => {
  const allInput = await getPuzzleInput(9, 2022);
  doPart1(allInput); // 6087
  doPart2(allInput);
};

type Dir = 'U'|'D'|'L'|'R';

const unitPoint = (dir: Dir): Point2D => {
  switch(dir){
    case 'U': return new Point2D(0, -1);
    case 'D': return new Point2D(0, 1);
    case 'L': return new Point2D(-1, 0);
    case 'R': return new Point2D(1, 0);
  }
};
const touchPoints = [[0,0], ...neighborArray];
const touching = (a: Point2D, b: Point2D):boolean => {
  return touchPoints.map(([x,y]) => new Point2D(x+a.x, y+a.y)).some(p => p.equals(b));
}

function doPart1(input: string) {
  const tailPositions = new InfiniteGrid<number>(0);
  const head = new Point2D(0,0);
  const tail = new Point2D(0,0);
  
  const incrementPosCount = (pos: Point2D) => {
    const val = tailPositions.get(pos) + 1;
    tailPositions.set(pos, val);
  };
  incrementPosCount(tail);

  const print = () => {
    console.log(tailPositions.print(v => v ? v.toString() : '.', 'high'));
    console.log('');
  }

  input
    .split('\n')
    .forEach(line => {
      const [d, c] = line.split(' ');
      const direction = d as Dir;
      const count = parseInt(c, 10);
      //console.log(line);
      for (let i = 0; i < count; i++) {
        const moveTo = unitPoint(direction);
        // move the head
        head.add(moveTo);
        // maybe move the tail to follow
        if(!touching(head, tail)) {
          tail.add(moveTo);
          if (!head.verticallyAligned(tail) && !head.horizontallyAligned(tail)) {
            if (moveTo.x === 0) {
              const diff = head.x - tail.x;
              assert(diff === -1 || diff === 1);
              if(diff < 0)
                tail.add(unitPoint('L'));
              else
                tail.add(unitPoint('R'));
            } else {
              const diff = head.y - tail.y;
              assert(diff === -1 || diff === 1);
              if(diff < 0)
                tail.add(unitPoint('U'));
              else
                tail.add(unitPoint('D'));
            }
          }
          incrementPosCount(tail);
        }
        //print();
      }
    });

  const visitedCount = tailPositions.data.size;
  //print();
  console.log(visitedCount);
};

function doPart2(input: string) {

};

main();