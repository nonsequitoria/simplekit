import { SKElement } from "../widget/element";

// export * from "./layouts";
import { makeFixedLayout } from "./fixed";
import { makeCentredLayout } from "./centred";
import { makeWrapRowLayout } from "./wrapRow";
import { makeFillRowLayout } from "./fillRow";

export const Layout = {
  makeFixedLayout,
  makeCentredLayout,
  makeWrapRowLayout,
  makeFillRowLayout,
};

export type Size = { width: number; height: number };

export type LayoutMethod = (
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[]
) => Size;
