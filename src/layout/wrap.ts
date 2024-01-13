import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";

export function makeWrapRowLayout(
  params: { gap: number } = { gap: 0 }
): LayoutMethod {
  return (
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ) => {
    return wrapRowLayout(boundsWidth, boundsHeight, elements, params);
  };
}

// places elements in rows, wrapping to next row as needed
export function wrapRowLayout(
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[],
  params: { gap: number }
): Size {
  const newBounds: Size = { width: 0, height: 0 };

  let x = 0;
  let y = 0;
  let rowHeight = 0;

  elements.forEach((el) => {
    if (el.box.fullWidth > boundsWidth) {
      // warn if element overflows
      console.warn(`element ${el.toString()} horizontal overflow`);
    } else if (x + el.box.fullWidth > boundsWidth) {
      // wrap to next row and clear rowHeight
      x = 0;
      y += rowHeight + params.gap;
      rowHeight = 0;
    }

    // set the element position
    el.x = x;
    el.y = y;
    // update the row height
    rowHeight = Math.max(rowHeight, el.box.fullHeight);
    // get x ready for next element
    x += el.box.fullWidth + params.gap;

    // update bounds that were actually used
    newBounds.width = Math.max(newBounds.width, el.box.width);
    newBounds.height = Math.max(newBounds.height, y + rowHeight);
  });

  // warn if rows of elements overflow
  if (newBounds.height > boundsHeight) {
    console.warn(`vertical overflow`);
  }

  return newBounds;
}
