import { Grid } from '../../util/grid.ts';
import { Point2D, cardinalNeighbors } from '../../util/point.ts';
import { Grid as AStarGrid, Astar } from 'fast-astar';
import { sum } from '../../util/arrayUtils.ts';

export const WALL = "#";
export const SPACE = ".";

export const ELF = "E";
export const GOBLIN = "G";

interface HasPos {
  pos: Point2D
}
const readingOrder = (a: HasPos, b: HasPos) => a.pos.y - b.pos.y || a.pos.x - b.pos.x;

interface Entity {
  label: string;
  pos: Point2D;
};

class Tile implements Entity {
  constructor(public pos: Point2D, public label: "." | "#"){}

  public get traversable() { return this.label === "."; }
}

class NPC implements Entity {
  private _hp = 200;
  private _damage = 3;

  constructor(public pos: Point2D, public label: "E" | "G") {}

  public get hp() { return this._hp; }
  public get alive() { return this._hp > 0; }

  protected neighborSpaces(board: Board): Point2D[] {
    return cardinalNeighbors
      .map(([x,y]) => {
        const neighbor = new Point2D(x,y);
        neighbor.add(this.pos);
        return neighbor;
      })
      .filter(pos => board.get(pos));
  }

  public move(board: Board, target: Point2D) {
    board.set(this.pos, new Tile(new Point2D(this.pos.x, this.pos.y), SPACE));
    this.pos = target;
    board.set(target, this);
  }

  public findTarget(board: Board): Point2D | undefined {
    const targets = board.npcs
      // are an enemy
      .filter(npc => npc.label !== this.label)
      // and alive
      .filter(npc => npc.alive)
      // get spaces around it
      .flatMap(npc => npc.neighborSpaces(board))
      // that are open (or myself)
      .filter(enemyNeighborPos => {
        const entity = board.get(enemyNeighborPos);
        if (!entity)
          return false;
        return entity.label === '.' || entity === this;
      })
      
      
    if(targets.length === 0)
      return;

    const [targetAndPath] = targets
      .map(target => ({
        pos: target,
        path: board.findPath(this.pos, target)
      }))
      .filter(target => !!target.path)
      .sort((a, b) => a.path!.length - b.path!.length || readingOrder(a, b));
    
    if (!targetAndPath || !targetAndPath.path?.length) {
      return;
    }
    
    // find "closest" enemy
    return targetAndPath.path![1] || targetAndPath.path![0];
  }

  public maybeAttack(board: Board): void {
    const [target] =  this
      .neighborSpaces(board)
      .map(space => board.get(space))
      .filter(entity => entity instanceof NPC && entity.label !== this.label && entity.alive)
      .map(e => e as NPC)
      .sort((e1, e2) => e1.hp - e2.hp || readingOrder(e1, e2))

    if(target) {
      target._hp -= this._damage;
    }
  }
}

export class Board extends Grid<Entity>{
  
  public addTile(pos: Point2D, type: "."|"#") {
    this.set(pos, new Tile(pos, type));
  }

  public addNPC(pos: Point2D, type: "G" | "E") {
    this.set(pos, new NPC(pos, type));
  }

  public get npcs(): NPC[] {
    return this
      .iterable()
      .map(e => e[1])
      .filter(e => e instanceof NPC)
      .sort(readingOrder)
      .map(e => e as NPC);
  }

  public findPath(pointA: Point2D, pointB: Point2D): Point2D[] | undefined{
    // A* path search between 2 points.
    const { width, height } = this.dimensions;
    const currentBoard = new AStarGrid({ col: width, row: height});
    this
      .iterable()
      .forEach(([pos, entity]) => {
        const weight = pos.equals(pointA) || entity.label === "." ? 0 : 1;
        currentBoard.set(pos.coordinates, 'value', weight);    
      });
    const astar = new Astar(currentBoard);
    const path: number[][] = astar.search(
      pointA.coordinates,    // start
      pointB.coordinates,    // end
      {                      // option
        rightAngle:true,     // default:false,Allow diagonal
        optimalResult:true   // default:true,In a few cases, the speed is slightly slower
      }
    );
    if (!path) {
      return;
    }      
    return path.map(([x,y]) => new Point2D(x,y));
  }
};

export function playGame(board: Board) {
  let inCombat = true;
  let rounds = 0;
  // combat rounds
  do {
    //board.print(v => v ? v.label : ".", "low");
    //console.log("");

    // each unit, if alive, take a turn
    inCombat = false;
    for (const npc of board.npcs) {
      if (!npc.alive)
        continue;

      const target = npc.findTarget(board);
      inCombat ||= !!target;
      if (!target)
        continue;

      npc.move(board, target);
      npc.maybeAttack(board);
    }    
  } while (inCombat && ++rounds);

  const hpSum = board.npcs.filter(npc => npc.alive).map(npc => npc.hp).reduce(sum);
  return rounds * hpSum;
}

