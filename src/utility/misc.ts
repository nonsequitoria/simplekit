// Euclidean distance
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

/**
 * returns a random number between a and b, or between 0 and a
 * @param a if b is undefined, a is the upper bound
 * @param b upper bound
 * @returns
 */
export function random(a: number, b?: number): number {
  if (b != undefined) {
    return a + Math.random() * (b - a);
  } else {
    return Math.random() * a;
  }
}

/**
 * returns a random integer between a and b, or between 0 and a
 * @param a if b is undefined, a is the upper bound
 * @param b upper bound
 * @returns
 */
export function randomInt(a: number, b?: number): number {
  if (b != undefined) {
    return Math.floor(a + Math.random() * (b - a));
  } else {
    return Math.floor(Math.random() * a);
  }
}
