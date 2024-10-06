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
      elements.reduce((acc, el) => acc + el.minLayoutWidth, 0) +
      (elements.length - 1) * this.gap;

    // height is height of tallest element
    const totalHeight = elements.reduce(
      (acc, el) => Math.max(acc, el.minLayoutHeight),
      0
    );

    // return minimum layout size
    return {
      width: totalWidth,
      height: totalHeight,
    };
  }

  layout(width: number, height: number, elements: SKElement[]) {
    // get total "basis" width
    const basisTotal = elements.reduce(
      (acc, el) => acc + el.minLayoutWidth,
      0
    );

    // calculate remaining space to distribute elements
    const available = width - (elements.length - 1) * this.gap;
    const remaining = available - basisTotal;

    if (Settings.debugLayout)
      console.log(
        ` fillRowLayout children:${elements.length} basisTotal:${available} remaining:${remaining}`
      );

    if (Settings.layoutWarnings && remaining < 0) {
      console.warn(
        `fillRowLayout: not enough space (container:${width} < children:${basisTotal}) `
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
      let w = el.minLayoutWidth;
      // expand or shrink element if fillWidth > 0
      if (fillTotal > 0) {
        w += (el.fillWidth / fillTotal) * remaining;
      }

      // elements can expand vertically too
      let h = el.minLayoutHeight;
      if (el.fillHeight > 0) {
        h = height;
      }

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

/*
function fillRowLayout(
  width: number,
  boundsHeight: number,
  elements: SKElement[],
  isMeasuring?: boolean,
  { gap = 0 }: FillLayoutProps = {}
): Size {
  const newBounds: Size = { width: 0, height: 0 };

  if (isMeasuring) {
    // measure each element
    elements.forEach((el) => {
      el.measure();
    });

    // calculate total width and height
    const totalWidth = elements.reduce(
      (acc, el) => acc + el.minLayoutWidth,
      0
    );
    const totalHeight = elements.reduce(
      (acc, el) => Math.max(acc, el.minLayoutHeight),
      0
    );

    // calculate bounds used for layout
    newBounds.width = totalWidth + (elements.length - 1) * gap;
    newBounds.height = totalHeight;
  } else {
    // get total "basis" width
    const basisTotal = elements.reduce(
      (acc, el) => acc + el.minLayoutWidth,
      0
    );

    // calculate remaining space to distribute elements
    const available = width - (elements.length - 1) * gap;
    const remaining = available - basisTotal;

    if (Settings.debugLayout)
      console.log(
        ` fillRowLayout children:${elements.length} basisTotal:${available} remaining:${remaining}`
      );

    if (Settings.layoutWarnings && remaining < 0) {
      console.warn(
        `fillRowLayout: not enough space (container:${width} < children:${basisTotal}) `
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
      let w = el.minLayoutWidth;
      // expand or shrink element if fillWidth > 0
      if (fillTotal > 0) {
        w += (el.fillWidth / fillTotal) * remaining;
      }

      // elements can expand vertically too
      let h = el.minLayoutHeight;
      if (el.fillHeight > 0) {
        h = boundsHeight;
      }

      // layout the element in the allotted space
      el.layout(w, h);

      // update row height
      rowHeight = Math.max(rowHeight, el.layoutHeight);
      // ready for next x position
      x += w + gap;
    });

    // calculate bounds used for layout
    const lastEl = elements.slice(-1)[0];
    newBounds.width = lastEl.x + lastEl.layoutWidth;
    newBounds.height = rowHeight;
  }

  if (Settings.debugLayout)
    console.log(
      ` fillRowLayout ${
        isMeasuring ? "measure" : "layout"
      } newBounds: ${newBounds.width} x ${newBounds.height} `
    );

  return newBounds;
}
*/
