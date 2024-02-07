import { SKElement } from "../widget";
import { LayoutMethod, Size } from ".";
import { Settings } from "../settings";

type FillLayoutProps = {
  gap?: number;
};

export function makeFillRowLayout(
  props?: FillLayoutProps
): LayoutMethod {
  return (
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ) => {
    return fillRowLayout(boundsWidth, boundsHeight, elements, props);
  };
}

function fillRowLayout(
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[],
  { gap = 0 }: FillLayoutProps = {}
): Size {
  const newBounds: Size = { width: 0, height: 0 };

  // get total "basis" width
  const basisTotal = elements.reduce(
    (acc, el) => acc + el.widthBasis,
    0
  );

  // calculate remaining space to distribute elements
  const available = boundsWidth - (elements.length - 1) * gap;
  const remaining = available - basisTotal;

  if (Settings.debugLayout)
    console.log(
      ` fillRowLayout children:${elements.length} basisTotal:${available} remaining:${remaining}`
    );

  if (Settings.layoutWarnings && remaining < 0) {
    console.warn(
      `fillRowLayout: not enough space (container:${boundsWidth} < children:${basisTotal}) `
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
    let w = el.widthBasis;
    // expand or shrink element if fillWidth > 0
    if (fillTotal > 0) {
      w += (el.fillWidth / fillTotal) * remaining;
    }
    // set element size
    el.widthLayout = w;

    // elements can expand vertically too
    if (el.fillHeight > 0) {
      el.heightLayout = boundsHeight;
    }
    // update row height
    rowHeight = Math.max(rowHeight, el.heightLayout);
    // ready for next x position
    x += w + gap;
  });

  // calculate bounds used for layout
  const lastEl = elements.slice(-1)[0];
  newBounds.width = lastEl.x + lastEl.widthLayout;
  newBounds.height = rowHeight;

  if (Settings.debugLayout)
    console.log(
      ` fillRowLayout newBounds:${newBounds.width}x${newBounds.height} `
    );

  return newBounds;
}
