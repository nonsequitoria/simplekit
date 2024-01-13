import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";

export function makeFillRowLayout(
  params: { gap: number } = { gap: 0 }
): LayoutMethod {
  return (
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ) => {
    return fillRowLayout(boundsWidth, boundsHeight, elements, params);
  };
}

function fillRowLayout(
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[],
  params: { gap: number }
): Size {
  const newBounds: Size = { width: 0, height: 0 };
  const gap = params.gap;

  // get total "basis" width
  const basisTotal = elements.reduce(
    (acc, el) => acc + el.box.fullWidth,
    0
  );

  // calculate remaining space to distribute elements
  const remaining =
    boundsWidth - basisTotal - (elements.length - 1) * gap;

  // get total fill proportion
  const fillTotal = elements.reduce(
    (acc, el) => acc + el.fillWidth,
    0
  );

  // first element starts at top left
  let x = 0;
  let y = 0;
  let rowHeight = 0;

  elements.forEach((el) => {
    // set element position
    el.x = x;
    el.y = y;

    // calculate element size
    let w = el.box.fullWidth;
    // expand or shrink element if fillWidth > 0
    if (fillTotal > 0) {
      w += (el.fillWidth / fillTotal) * remaining;
    }
    // set element size
    el.box.fullWidth = w;

    // elements can expand vertically too
    if (el.fillHeight > 0) {
      el.box.fullHeight = boundsHeight;
    }
    // update row height
    rowHeight = Math.max(rowHeight, el.box.fullHeight);
    // ready for next x position
    x += w + gap;
  });

  // calculate bounds used for layout
  const lastEl = elements.slice(-1)[0];
  newBounds.width = lastEl.x + lastEl.box.fullWidth;
  newBounds.height = rowHeight;

  return newBounds;
}
