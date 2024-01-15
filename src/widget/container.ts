import { insideHitTestRectangle } from "../utility";
import { LayoutMethod } from "../layout";
import { SKMouseEvent } from "../events";
import { invalidateLayout } from "../imperative-mode";

import { SKElement } from "./element";

export class SKContainer extends SKElement {
  constructor();
  constructor(x: number, y: number);
  constructor(x: number, y: number, width: number, height: number);
  constructor(x: number = 0, y: number = 0, width?: number, height?: number) {
    super(x, y, width, height);
    // console.log(`SKContainer ${this.id} size ${width}x${height}`);
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

  //#region event handling

  handleMouseEventCapture(me: SKMouseEvent) {
    // console.log(`${this.toString()} capture ${me.type}`);

    switch (me.type) {
      case "click":
        return this.dispatch(
          {
            source: this,
            timeStamp: me.timeStamp,
            type: "action",
          },
          true
        );
        break;
    }
    return false;
  }

  handleMouseEvent(me: SKMouseEvent) {
    // console.log(`${this.toString()} bubble ${me.type}`);

    switch (me.type) {
      case "click":
        return this.dispatch({
          source: this,
          timeStamp: me.timeStamp,
          type: "action",
        });
        break;
    }
    return false;
  }

  //#endregion

  // hit test ignores margin
  hittest(mx: number, my: number): boolean {
    return insideHitTestRectangle(
      mx,
      my,
      this.x + this.box.margin,
      this.y + this.box.margin,
      this.box.paddingBox.width,
      this.box.paddingBox.height
    );
  }

  draw(gc: CanvasRenderingContext2D) {
    // to avoid typing "this" so much
    const box = this.box;

    gc.save();
    // set coordinate system to padding box
    gc.translate(this.x, this.y);
    gc.translate(this.box.margin, this.box.margin);

    // draw background colour if set
    if (this.fill) {
      gc.fillStyle = this.fill;
      gc.fillRect(0, 0, this.box.paddingBox.width, this.box.paddingBox.height);
    }

    // draw border if set
    if (this.border) {
      gc.strokeStyle = this.border;
      gc.lineWidth = 1;
      gc.strokeRect(0, 0, box.paddingBox.width, box.paddingBox.height);
    }

    gc.restore();

    // let element draw debug if flag is set
    super.draw(gc);

    // now draw all the children
    gc.save();
    // set coordinate system to container content box
    gc.translate(this.x, this.y);
    gc.translate(box.margin, box.margin);
    gc.translate(box.padding, box.padding);
    // draw children
    this._children.forEach((el) => el.draw(gc));
    gc.restore();
  }

  //#region layout children

  protected _layoutMethod: LayoutMethod | undefined;
  set layoutMethod(lm: LayoutMethod) {
    this._layoutMethod = lm;
  }

  doLayout() {
    if (this._layoutMethod && this._children.length > 0) {
      // run the layout method
      // (it returns new bounds, but we ignore it for now)
      console.log(
        `${this.id} layout in ${this.box.contentBox.width}x${this.box.contentBox.height}`
      );
      this._layoutMethod(
        this.box.contentBox.width,
        this.box.contentBox.height,
        this._children
      );

      this._children.forEach((el) => el.doLayout());
    } else if (this._children.length > 0) {
      console.warn(`${this.id} has children but no layout method`);
    }
  }

  //#endregion

  public toString(): string {
    return `SKContainer '${this.fill}'` + (this.id ? ` id '${this.id}'` : "");
  }
}
