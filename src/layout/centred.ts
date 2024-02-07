import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";
import { Settings } from "../settings";

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
    // elements can fill the width or height of the parent
    if (el.fillWidth) el.widthLayout = boundsWidth;
    if (el.fillHeight) el.heightLayout = boundsHeight;

    // centre element
    el.x = boundsWidth / 2 - el.widthLayout / 2;
    el.y = boundsHeight / 2 - el.heightLayout / 2;

    // warn if element is outside bounds
    if (
      Settings.layoutWarnings &&
      (el.x < 0 ||
        el.y < 0 ||
        el.x + el.widthLayout > boundsWidth ||
        el.y + el.heightLayout > boundsHeight)
    ) {
      console.warn(`element ${el.toString()} outside parent bounds`);
    }

    // update bounds that were actually used
    // note, we ignore margins for fixed layout
    newBounds.width = Math.max(newBounds.width, el.widthLayout);
    newBounds.height = Math.max(newBounds.height, el.heightLayout);
  });

  return newBounds;
}
