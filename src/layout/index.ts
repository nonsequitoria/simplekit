import { SKElement } from "../widget/element";

// export * from "./layouts";
export * from "./fixed";
export * from "./centred";
export * from "./wrap";
export * from "./fill";

export type Size = { width: number; height: number };

export type LayoutMethod = (
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[]
) => Size;
