export class Point2 {
  constructor(public x: number, public y: number) {}

  add(v: Vector2): Point2 {
    return new Point2(this.x + v.x, this.y + v.y);
  }

  subtract(other: Point2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  clone(): Point2 {
    return new Point2(this.x, this.y);
  }
}

export function point(x: number, y: number): Point2 {
  return new Point2(x, y);
}

export class Vector2 {
  constructor(public x: number, public y: number) {}

  normalize(): Vector2 {
    const v = new Vector2(this.x, this.y);
    const m = v.magnitude();
    if (m == 0) return v;
    v.x /= m;
    v.y /= m;
    return v;
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vector2): number {
    return this.x * other.y - this.y * other.x;
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}

export function vector(x: number, y: number): Vector2 {
  return new Vector2(x, y);
}
