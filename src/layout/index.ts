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

export function sizeToString(
  w: number | undefined,
  h: number | undefined
): string {
  return `${w ? Math.round(w * 10) / 10 : w} x ${
    h ? Math.round(h * 10) / 10 : h
  }`;
}

// using strategy pattern for swapping layout methods
export interface LayoutMethod {
  measure: (elements: SKElement[]) => Size;
  layout: (
    width: number,
    height: number,
    elements: SKElement[]
  ) => Size;
}
