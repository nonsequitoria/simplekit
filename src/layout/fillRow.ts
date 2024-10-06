import { Settings } from "../settings";
import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";

type FillLayoutProps = {
  gap?: number;
};

export class FillRowLayout implements LayoutMethod {
  constructor({ gap = 0 }: FillLayoutProps = {}) {
    this.gap = gap;
  }

  private gap: number;

  measure(elements: SKElement[]) {
    // measure all children first
    elements.forEach((el) => {
      el.measure();
    });

    // min layout width is sum of al element widths
    // with gaps between elements
    const totalWidth =
      elements.reduce((acc, el) => acc + el.intrinsicWidth, 0) +
      (elements.length - 1) * this.gap;

    // height is height of tallest element
    const totalHeight = elements.reduce(
      (acc, el) => Math.max(acc, el.intrinsicHeight),
      0
    );

    // return minimum layout size
    return {
      width: totalWidth,
      height: totalHeight,
    };
  }

  layout(width: number, height: number, elements: SKElement[]) {
    // get fixed width elements
    const fixedElements = elements.filter((el) => el.fillWidth === 0);

    // get space used by elements with fixed width
    const fixedElementsWidth = fixedElements.reduce(
      (acc, el) => acc + el.intrinsicWidth,
      0
    );

    // calculate space to distribute elements
    const available = width - (elements.length - 1) * this.gap;
    const remaining = available - fixedElementsWidth;

    if (Settings.debugLayout) {
      console.log(
        ` FillRowLayout: ${
          fixedElements.length
        } fixed elements need ${fixedElementsWidth}px, ${
          elements.length - fixedElements.length
        } elements to fill ${remaining}px`
      );
    }

    if (Settings.layoutWarnings && remaining < 0) {
      console.warn(
        `fillRowLayout: not enough space (container:${width} < children:${fixedElementsWidth}) `
      );
    }

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
      let w =
        el.fillWidth === 0
          ? el.intrinsicWidth
          : (el.fillWidth / fillTotal) * remaining;

      // elements can expand vertically too
      let h = el.fillHeight === 0 ? el.intrinsicHeight : height;

      // layout the element in the allotted space
      el.layout(w, h);

      // update row height
      rowHeight = Math.max(rowHeight, el.layoutHeight);
      // ready for next x position
      x += w + this.gap;
    });

    // calculate bounds used for layout
    const rightElement = elements.slice(-1)[0];
    return {
      width: rightElement.x + rightElement.layoutWidth,
      height: rowHeight,
    };
  }
}
