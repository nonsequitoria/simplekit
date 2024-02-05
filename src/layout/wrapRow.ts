import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";

type WrapLayoutProps = {
  gap?: number;
};

export function makeWrapRowLayout(
  props?: WrapLayoutProps
): LayoutMethod {
  return (
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ) => {
    return wrapRowLayout(boundsWidth, boundsHeight, elements, props);
  };
}

// places elements in rows, wrapping to next row as needed
export function wrapRowLayout(
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[],
  { gap = 0 }: WrapLayoutProps = {}
): Size {
  const newBounds: Size = { width: 0, height: 0 };

  let x = 0;
  let y = 0;
  let rowHeight = 0;

  elements.forEach((el) => {
    if (el.widthLayout > boundsWidth) {
      // warn if element overflows
      console.warn(`element ${el.toString()} horizontal overflow`);
    } else if (x + el.widthLayout > boundsWidth) {
      // wrap to next row and clear rowHeight
      x = 0;
      y += rowHeight + gap;
      rowHeight = 0;
    }

    // set the element position
    el.x = x;
    el.y = y;
    // update the row height
    rowHeight = Math.max(rowHeight, el.heightLayout);
    // get x ready for next element
    x += el.widthLayout + gap;

    // update bounds that were actually used
    newBounds.width = Math.max(newBounds.width, el.widthLayout);
    newBounds.height = Math.max(newBounds.height, y + rowHeight);
  });

  // warn if rows of elements overflow
  if (newBounds.height > boundsHeight) {
    console.warn(`vertical overflow`);
  }

  return newBounds;
}
