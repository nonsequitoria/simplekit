import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";
import { Settings } from "../settings";

export class CentredLayout implements LayoutMethod {
  constructor() {}

  measure(elements: SKElement[]) {
    // measure all children first
    elements.forEach((el) => {
      el.measure();
    });

    // find the widest element
    const minWidth = elements.reduce(
      (acc, el) => Math.max(acc, el.intrinsicWidth),
      0
    );

    // find the tallest element
    const minHeight = elements.reduce(
      (acc, el) => Math.max(acc, el.intrinsicHeight),
      0
    );

    // return minimum layout size
    return {
      width: minWidth,
      height: minHeight,
    };
  }

  layout(width: number, height: number, elements: SKElement[]) {
    const newBounds: Size = { width: 0, height: 0 };

    // stacks all children in the centre of the container
    elements.forEach((el) => {
      // elements can fill the width or height of the parent
      const w = el.fillWidth ? width : el.intrinsicWidth;
      const h = el.fillHeight ? height : el.intrinsicHeight;

      // layout the element
      el.layout(w, h);

      // centre element
      el.x = width / 2 - el.layoutWidth / 2;
      el.y = height / 2 - el.layoutHeight / 2;

      // warn if element is outside bounds
      if (
        Settings.layoutWarnings &&
        (el.x < 0 ||
          el.y < 0 ||
          el.x + el.layoutWidth > width ||
          el.y + el.layoutHeight > height)
      ) {
        console.warn(
          `element ${el.toString()} outside parent bounds`
        );
      }

      // update bounds that were actually used
      // note, we ignore margins for fixed layout
      newBounds.width = Math.max(newBounds.width, el.layoutWidth);
      newBounds.height = Math.max(newBounds.height, el.layoutHeight);
    });

    return newBounds;
  }
}
