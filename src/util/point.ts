export class Point2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  static fromPoint(point: Point2D) {
    return new Point2D(point.x, point.y);
  }

  /**
   * Expects the passed in value to be in the format of `x,y`
   * @param str 
   */
  static fromString(str: string) {
    const [x,y] = str.split(",").map(v => parseInt(v, 10));
    return new Point2D(x,y);
  }

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

  toAdded(p: Point2D): Point2D {
    return new Point2D(this.x + p.x, this.y + p.y);
  }

  get coordinates() {
    return [this.x, this.y];
  }

  toString() {
    return `${this.x},${this.y}`
  }
}

export class Point3D {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
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

export const neighborArray: [number, number][] = [
  [-1, -1], [0, -1], [+1, -1],
  [-1,  0],          [+1,  0],
  [-1, +1], [0, +1], [+1, +1],
];

export const cardinalNeighbors: [number, number][] = [
            [0, -1],
  [-1,  0],          [+1,  0],
            [0, +1]
];
