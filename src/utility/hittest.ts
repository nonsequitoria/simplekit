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
  // outside rect after adding stroke
  const outer =
    mx >= x - s && mx <= x + w + s && my >= y - s && my <= y + h + s;
  // but NOT inside rect after subtracting stroke
  const inner =
    mx > x + s && mx < x + w - s && my > y + s && my < y + h - s;
  return outer && !inner;
}
