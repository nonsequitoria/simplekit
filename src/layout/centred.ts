import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";

export function makeCentredLayout(): LayoutMethod {
  return (
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ) => {
    return centredLayout(boundsWidth, boundsHeight, elements);
  };
}

export function centredLayout(
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[]
): Size {
  const newBounds: Size = { width: 0, height: 0 };

  // stacks all children in the centre of the container
  elements.forEach((el) => {
    // centre element
    el.x = boundsWidth / 2 - el.box.fullWidth / 2;
    el.y = boundsHeight / 2 - el.box.fullHeight / 2;

    // warn if element is outside bounds
    if (
      el.x < 0 ||
      el.y < 0 ||
      el.x + el.box.fullWidth > boundsWidth ||
      el.y + el.box.fullHeight > boundsHeight
    ) {
      console.warn(`element ${el.toString()} outside parent bounds`);
    }

    // update bounds that were actually used
    // note, we ignore margins for fixed layout
    newBounds.width = Math.max(newBounds.width, el.box.width);
    newBounds.height = Math.max(newBounds.height, el.box.height);
  });

  return newBounds;
}
