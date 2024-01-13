import { Point2 } from "./vector2";

export function closestPoint(
  m: Point2,
  p0: Point2,
  p1: Point2,
  segmentOnly = true
): Point2 {
  const v = p1.subtract(p0); // v = P1 - P0

  // early out if line is less than 1 pixel long
  if (v.magnitude() < 1) return p0.clone();

  const u = m.subtract(p0); // u = M - P0

  // scalar of vector projection ...
  const s = u.dot(v) / v.dot(v);

  // returns closest point on infinite line
  if (!segmentOnly) {
    return p0.add(v.multiply(s));
  }

  // find point for constrained line segment
  if (s < 0) {
    return p0.clone();
  } else if (s > 1) {
    return p1.clone();
  } else {
    const w = v.multiply(s); // w = s * v
    return p0.add(w); // Q = P0 + w
  }
}
