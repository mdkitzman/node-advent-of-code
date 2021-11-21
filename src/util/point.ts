export class Point {
  constructor(readonly x: number, readonly y: number) {}

  equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

  distanceTo(p: Point): number {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
  }

  slope(p: Point): number {
    const deltaX = p.x - this.x;
    const deltaY = this.y - p.y;
    return deltaY / deltaX;
  }

  angle(p: Point): number {
    const deltaX = p.x - this.x;
    const deltaY = this.y - p.y;
    return Math.atan2(deltaY, deltaX);
  }

  verticallyAligned(p: Point): boolean {
    return this.y === p.y;
  }

  horizontallyAligned(p: Point): boolean {
    return this.x === p.x;
  }
}

// Clockwise rotation of point `p`, `radians` degrees around point `origin`
// i.e. rotate((1,1), Math.PI / 2, (3,4)) rotates point (1,1) around (3,4) by pi / 2 radians (90 degrees)
export const rotate = (p: Point, radians: number, origin: Point): Point => {
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const x = cos * (origin.x - p.x) - sin * (origin.y - p.y) + origin.x;
  const y = sin * (origin.x - p.x) + cos * (origin.y - p.y) + origin.y;
  return new Point(Math.round(x), Math.round(y));
}
