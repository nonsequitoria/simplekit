import { insideHitTestRectangle } from "../utility";
import { LayoutMethod, Size } from "../layout";
import { SKMouseEvent } from "../events";
import { invalidateLayout } from "../imperative-mode";

import { SKElement, SKElementProps } from "./element";
import { makeFixedLayout } from "../layout/fixed";

type SKContainerProps = SKElementProps & {};

export class SKContainer extends SKElement {
  constructor(elementProps: SKContainerProps = {}) {
    super(elementProps);
    this._layoutMethod = makeFixedLayout();
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

  //#region layout children

  protected _layoutMethod: LayoutMethod;
  set layoutMethod(method: LayoutMethod | "default") {
    this._layoutMethod =
      method !== "default" ? method : makeFixedLayout();
    invalidateLayout();
  }

  measure(): void {
    if (this._children.length > 0) {
      const size = this._layoutMethod(
        this.contentBox.width,
        this.contentBox.height,
        this._children,
        true
      );
      this.contentWidth = size.width;
      this.contentHeight = size.height;
    }
    super.measure();
  }

  layout(width: number, height: number): Size {
    if (this._children.length > 0) {
      // this._children.forEach((el) => el.updateMinLayoutSize());
      // do initial layout of children (might change after this container layout)
      console.log(`1️⃣ ${this.id} layout`);
      // this._children.forEach((el) => el.doLayout());
      // run the layout method
      const size = this._layoutMethod(width, height, this._children);
      console.log(
        `${this.id} layout bounding box is ${size.width} x ${size.height}`
      );
      this.layoutWidth = size.width;
      this.layoutHeight = size.height;

      // do final layout of children
      // (using size assigned by this container)
      // console.log(`2️⃣ ${this.id} layout`);
      // this._children.forEach((el) => el.doLayout());

      return size;
    } else {
      const size = super.layout(width, height);
      return size;
      // return { width: this.layoutWidth, height: this.layoutHeight };
    }
    // else if (this._children.length > 0) {
    //   console.warn(`${this.id} has children but no layout method`);
    // }
  }

  //#endregion

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
