import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";

export class FixedLayout implements LayoutMethod {
  measure(elements: SKElement[]) {
    const newBounds: Size = { width: 0, height: 0 };

    // measure all children and calculate new bounds
    elements.forEach((el) => {
      el.measure();

      // bounds that's needed to fit all elements
      newBounds.width = Math.max(
        newBounds.width,
        el.x + el.intrinsicWidth
      );
      newBounds.height = Math.max(
        newBounds.height,
        el.y + el.intrinsicHeight
      );
    });

    // newBounds.width += 50;
    console.log(
      `🔥 FixedLayout measure ${newBounds.width} x ${newBounds.height}`
    );
    return newBounds;
  }

  layout(width: number, height: number, elements: SKElement[]) {
    const newBounds: Size = { width: 0, height: 0 };

    // layout all children and calculate new bounds
    elements.forEach((el) => {
      el.layout(el.width, el.height);

      // warn if element is outside bounds
      if (
        el.x < 0 ||
        el.y < 0 ||
        el.x + el.layoutWidth > width ||
        el.y + el.layoutHeight > height
      ) {
        console.warn(
          `element ${el.toString()} outside parent bounds`
        );
      }

      // bounds that were actually used
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
}
