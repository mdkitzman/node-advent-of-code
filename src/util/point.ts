export class Point2D {
  constructor(public x: number, public y: number) {}

  equals(other: Point2D): boolean {
    return this.x === other.x && this.y === other.y;
  }

  distanceTo(p: Point2D): number {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
  }

  manhattenDistance(p: Point2D): number {
    return Math.abs(this.x - p.x) + Math.abs(this.y - p.y);
  }

  slope(p: Point2D): number {
    // This slope is assuming a top-left origin
    const deltaX = p.x - this.x;
    const deltaY = this.y - p.y;
    return deltaY / deltaX;
  }

  angle(p: Point2D): number {
    // This angle is assuming a top-left origin
    const deltaX = p.x - this.x;
    const deltaY = this.y - p.y;
    return Math.atan2(deltaY, deltaX);
  }

  verticallyAligned(p: Point2D): boolean {
    return this.y === p.y;
  }

  horizontallyAligned(p: Point2D): boolean {
    return this.x === p.x;
  }

  add(p: Point2D): void {
    this.x += p.x;
    this.y += p.y;
  }

  get coordinates() {
    return [this.x, this.y];
  }
}

export class Point3D {
  constructor(
    public x: number,
    public y: number,
    public z: number,) {}
  
  equals(other: Point3D): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
}

// Clockwise rotation of point `p`, `radians` degrees around point `origin`
// i.e. rotate((1,1), Math.PI / 2, (3,4)) rotates point (1,1) around (3,4) by pi / 2 radians (90 degrees)
export const rotate = (p: Point2D, radians: number, origin: Point2D): Point2D => {
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const x = cos * (origin.x - p.x) - sin * (origin.y - p.y) + origin.x;
  const y = sin * (origin.x - p.x) + cos * (origin.y - p.y) + origin.y;
  return new Point2D(Math.round(x), Math.round(y));
}

export const neighborArray: number[][] = [
  [-1, -1], [0, -1], [+1, -1],
  [-1,  0],          [+1,  0],
  [-1, +1], [0, +1], [+1, +1],
];

export const cardinalNeighbors: number[][] = [
            [0, -1],
  [-1,  0],          [+1,  0],
            [0, +1]
];
