import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";
import { Settings } from "../settings";

type WrapLayoutProps = {
  gap?: number;
};

export class WrapRowLayout implements LayoutMethod {
  constructor({ gap = 0 }: WrapLayoutProps = {}) {
    this.gap = gap;
  }

  private gap: number;

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

    let x = 0;
    let y = 0;
    let rowHeight = 0;

    elements.forEach((el) => {
      // layout the element
      el.layout(el.intrinsicWidth, el.intrinsicHeight);

      if (Settings.layoutWarnings && el.intrinsicWidth > width) {
        // warn if element overflows
        console.warn(`element ${el.toString()} horizontal overflow`);
      } else if (x + el.intrinsicWidth > width) {
        // wrap to next row and clear rowHeight
        x = 0;
        y += rowHeight + this.gap;
        rowHeight = 0;
      }

      // set the element position
      el.x = x;
      el.y = y;

      // update the row height
      rowHeight = Math.max(rowHeight, el.intrinsicHeight);
      // get x ready for next element
      x += el.intrinsicWidth + this.gap;

      // update bounds that were actually used
      newBounds.width = Math.max(newBounds.width, el.intrinsicWidth);
      newBounds.height = Math.max(newBounds.height, y + rowHeight);
    });

    // warn if rows of elements overflow
    if (Settings.layoutWarnings && newBounds.height > height) {
      console.warn(
        `${(newBounds.height - height).toFixed(1)} vertical overflow`
      );
    }

    return newBounds;
  }
}
