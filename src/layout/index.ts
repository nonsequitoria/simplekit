import { SKElement } from "../widget/element";

import { FixedLayout } from "./fixed";
import { CentredLayout } from "./centred";
import { WrapRowLayout } from "./wrapRow";
import { FillRowLayout } from "./fillRow";

// keep layout methods in one place
export const Layout = {
  FixedLayout,
  CentredLayout,
  WrapRowLayout,
  FillRowLayout,
};

export type Size = { width: number; height: number };

export interface LayoutMethod {
  measure: (elements: SKElement[]) => Size;
  layout: (
    width: number,
    height: number,
    elements: SKElement[]
  ) => Size;
}
