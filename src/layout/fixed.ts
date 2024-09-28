import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";

export function makeFixedLayout(): LayoutMethod {
  return (
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ) => {
    return fixedLayout(boundsWidth, boundsHeight, elements);
  };
}

function fixedLayout(
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[]
): Size {
  const newBounds: Size = { width: 0, height: 0 };

  elements.forEach((el) => {
    el.doLayout(el.width, el.height);
    // warn if element is outside bounds
    if (
      el.x < 0 ||
      el.y < 0 ||
      el.x + el.layoutWidth > boundsWidth ||
      el.y + el.layoutHeight > boundsHeight
    ) {
      console.warn(`element ${el.toString()} outside parent bounds`);
    }

    // update bounds that were actually used
    newBounds.width = Math.max(
      newBounds.width,
      el.x + el.layoutWidth
    );
    newBounds.height = Math.max(
      newBounds.height,
      el.y + el.layoutHeight
    );
  });

  return newBounds;
}
