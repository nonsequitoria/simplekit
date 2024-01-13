import { distance, closestPoint, Point2, point } from ".";

export function insideHitTestRectangle(
  mx: number,
  my: number,
  x: number,
  y: number,
  w: number,
  h: number
) {
  return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

export function edgeHitTestRectangle(
  mx: number,
  my: number,
  x: number,
  y: number,
  w: number,
  h: number,
  strokeWidth: number
) {
  // width of stroke on either side of edges
  const s = strokeWidth / 2;
  // inside rect after adding stroke
  const outer =
    mx >= x - s && mx <= x + w + s && my >= y - s && my <= y + h + s;
  // but NOT inside inner rect after subtracting stroke
  const inner =
    mx >= x + s && mx <= x + w - s && my >= y + s && my <= y + h - s;
  return outer && !inner;
}

export function hitTestLine(
  mx: number,
  my: number,
  p0x: number,
  p0y: number,
  p1x: number,
  p1y: number,
  strokeWidth: number
) {
  // edge hit-test
  const m = point(mx, my);
  const q = closestPoint(m, point(p0x, p0y), point(p1x, p1y));
  const d = distance(m.x, m.y, q.x, q.y);
  if (d < strokeWidth / 2) return true;

  // no hit
  return false;
}

export function edgeHitTestPolygon(
  mx: number,
  my: number,
  points: Point2[],
  strokeWidth: number
) {
  const m = new Point2(mx, my);
  // assume shape is closed, so start with segment
  // from last point to first point
  let p0 = points.slice(-1)[0];
  for (let p1 of points) {
    if (hitTestLine(m.x, m.y, p0.x, p0.y, p1.x, p1.y, strokeWidth)) return true;
    p0 = p1;
  }
  return false;
}
