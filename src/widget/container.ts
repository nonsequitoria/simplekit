import { Layout, LayoutMethod, Size } from "../layout";
import { invalidateLayout } from "../imperative-mode";

import { SKElement, SKElementProps } from "./element";
import { FixedLayout } from "../layout/fixed";
import { Settings } from "../settings";

type SKContainerProps = SKElementProps & {
  layoutMethod?: LayoutMethod | "default";
};

export class SKContainer extends SKElement {
  constructor({
    layoutMethod = "default",
    ...elementProps
  }: SKContainerProps = {}) {
    super(elementProps);

    this._layoutMethod =
      layoutMethod !== "default"
        ? layoutMethod
        : new Layout.FixedLayout();
  }

  //#region managing children

  private _children: SKElement[] = [];
  get children(): readonly SKElement[] {
    return this._children;
  }

  addChild(element: SKElement) {
    this._children.push(element);
    invalidateLayout();
  }

  removeChild(element: SKElement) {
    this._children = this._children.filter((el) => el != element);
    invalidateLayout();
  }

  clearChildren() {
    this._children = [];
    invalidateLayout();
  }

  //#endregion

  //#region layout children

  protected _layoutMethod: LayoutMethod;
  set layoutMethod(method: LayoutMethod | "default") {
    this._layoutMethod =
      method !== "default" ? method : new Layout.FixedLayout();
    invalidateLayout();
  }

  measure(): void {
    if (this._children.length > 0) {
      const size = this._layoutMethod.measure(this._children);
      this.contentWidth = size.width;
      this.contentHeight = size.height;
    }
    super.measure();
  }

  layout(width: number, height: number): Size {
    // first layout the children
    if (this._children.length > 0) {
      // calculate content area of container to layout elements
      const w = width - this.padding * 2 - this.margin * 2;
      const h = height - this.padding * 2 - this.margin * 2;

      // run the layout method
      this._layoutMethod.layout(w, h, this._children);
    }

    // now layout the container itself
    const size = super.layout(width, height);

    return size;
  }

  //#endregion

  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    // set coordinate system to padding box
    gc.translate(this.x, this.y);
    gc.translate(this.margin, this.margin);

    // draw background colour if set
    if (this.fill) {
      gc.fillStyle = this.fill;
      gc.fillRect(
        0,
        0,
        this.paddingBox.width,
        this.paddingBox.height
      );
    }

    // draw border if set
    if (this.border) {
      gc.strokeStyle = this.border;
      gc.lineWidth = 1;
      gc.strokeRect(
        0,
        0,
        this.paddingBox.width,
        this.paddingBox.height
      );
    }

    gc.restore();

    // let element draw debug if flag is set
    super.draw(gc);

    // now draw all the children
    gc.save();
    // set coordinate system to container content box
    gc.translate(this.x, this.y);
    gc.translate(this.margin, this.margin);
    gc.translate(this.padding, this.padding);
    // draw children
    this._children.forEach((el) => el.draw(gc));
    gc.restore();
  }

  public toString(short = true): string {
    const out =
      `SKContainer '${this.fill}'` + (this.id ? ` '${this.id}'` : "");
    if (short) {
      return out;
    } else {
      return out + " " + this.boxModelToString();
    }
  }
}
