// cached canvas for measuring text
let canvasBuffer: HTMLCanvasElement;

/**
 * Measures the size of a text string using the given font.
 * @param text
 * @param font in CSS format (e.g. "12px Arial")
 * @returns width and height in pixels or null if failed to measure
 */
export function measureText(
  text: string,
  font: string
): {
  height: number;
  width: number;
} | null {
  if (!canvasBuffer) canvasBuffer = document.createElement("canvas");

  const gc = canvasBuffer.getContext("2d");
  if (!gc) return null;

  // do the measurement
  gc.font = font;
  const m = gc.measureText(text);

  if (!m) return null;

  // calculate height from font metrics
  const height = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;

  return { width: m.width, height };
}
