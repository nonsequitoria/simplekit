import { SKEvent, SKKeyboardEvent, SKMouseEvent } from "../events";

import { Settings } from "../settings";
import { Style } from "./style";
import { insideHitTestRectangle } from "../utility";

import {
  invalidateLayout,
  requestKeyboardFocus,
} from "../imperative-mode";

import { Size, sizeToString } from "../layout";

export type EventHandler = (me: SKEvent) => boolean | void;

type BindingRoute = {
  type: string; // event type
  handler: EventHandler;
  capture: boolean;
};

export type SKElementProps = {
  id?: string;
  debug?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  border?: string;
  padding?: number;
  margin?: number;
  fillWidth?: number;
  fillHeight?: number;
};

export abstract class SKElement {
  constructor({
    id = "",
    debug = false,
    x = 0,
    y = 0,
    width = undefined,
    height = undefined,
    fill = "",
    border = "",
    padding = 0,
    margin = 0,
    fillWidth = 0,
    fillHeight = 0,
  }: SKElementProps = {}) {
    this.id = id;
    this.debug = debug;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = fill;
    this.border = border;
    this.padding = padding;
    this.margin = margin;
    this.fillWidth = fillWidth;
    this.fillHeight = fillHeight;
  }

  // top-left corner of element bounding box
  private _x = 0;
  public get x() {
    return this._x;
  }
  public set x(value) {
    this._x = value;
    this.sizeChanged();
  }
  private _y = 0;
  public get y() {
    return this._y;
  }
  public set y(value) {
    this._y = value;
    this.sizeChanged();
  }

  protected _width: number | undefined;
  set width(w: number | undefined) {
    if (w !== this._width) {
      this._width = w;
      this.sizeChanged();
    }
  }
  get width(): number | undefined {
    return this._width;
  }

  protected _height: number | undefined;
  set height(h: number | undefined) {
    if (h !== this._height) {
      this._height = h;
      this.sizeChanged();
    }
  }
  get height(): number | undefined {
    return this._height;
  }

  //#region size and layout calculations

  // size calculation flag
  protected recalculateSize = false;
  sizeChanged() {
    this.recalculateSize = true;
    invalidateLayout();
  }

  protected contentWidth = 0;
  protected contentHeight = 0;

  // some widgets may need to update content size
  // (e.g. to measure text in a button, or size of children after layout)
  updateContentSize() {
    if (
      Settings.debugLayout &&
      (this.contentWidth || this.contentHeight)
    )
      console.log(
        `   content '${this.id}' -> ${sizeToString(
          this.contentWidth,
          this.contentHeight
        )}`
      );
  }

  // intrinsic size of element
  protected _intrinsicWidth = 0;
  get intrinsicWidth(): number {
    return this._intrinsicWidth;
  }
  private _intrinsicHeight = 0;
  get intrinsicHeight(): number {
    return this._intrinsicHeight;
  }

  // calculate the intrinsic size of the element
  measure() {
    this.updateContentSize();

    // calculate intrinsic size
    if (this.width) {
      this._intrinsicWidth = Math.max(this.width, 2 * this.padding);
    } else if (this.contentWidth) {
      this._intrinsicWidth = this.contentWidth + 2 * this.padding;
    } else {
      this._intrinsicWidth = 2 * this.padding;
    }
    this._intrinsicWidth += 2 * this.margin;

    if (this.height) {
      this._intrinsicHeight = Math.max(this.height, 2 * this.padding);
    } else if (this.contentHeight) {
      this._intrinsicHeight = this.contentHeight + 2 * this.padding;
    } else {
      this._intrinsicHeight = 2 * this.padding;
    }
    this._intrinsicHeight += 2 * this.margin;

    if (Settings.debugLayout)
      console.log(
        `1️⃣ measure '${this.id}' -> ${sizeToString(
          this.intrinsicWidth,
          this.intrinsicHeight
        )}`
      );
  }

  // proportion to grow and shrink in some layouts
  // (0 means do not grow or shrink)
  private _fillWidth = 0;
  public get fillWidth() {
    return this._fillWidth;
  }
  public set fillWidth(value) {
    this._fillWidth = value;
    invalidateLayout();
  }
  private _fillHeight = 0;
  public get fillHeight() {
    return this._fillHeight;
  }
  public set fillHeight(value) {
    this._fillHeight = value;
    invalidateLayout();
  }

  // width and height after layout
  private _layoutWidth = 0;
  get layoutWidth(): number {
    return this._layoutWidth;
  }
  private _layoutHeight = 0;
  get layoutHeight(): number {
    return this._layoutHeight;
  }

  layout(width?: number, height?: number): Size {
    if (Settings.debugLayout)
      console.log(
        `2️⃣ layout '${this.id}' in ${sizeToString(width, height)}`
      );

    this._layoutWidth = width ?? this.intrinsicWidth;
    this._layoutHeight = height ?? this.intrinsicHeight;

    return { width: this.layoutWidth, height: this.layoutHeight };
  }

  //#endregion

  //#region box model

  // margin
  private _margin = 0;
  set margin(m: number) {
    if (m !== this.margin) {
      m = Math.max(0, m);
      this._margin = m;
      this.sizeChanged();
    }
  }
  get margin() {
    return this._margin;
  }
  get marginBox(): Size {
    return {
      width: this.layoutWidth,
      height: this.layoutHeight,
    };
  }

  // padding
  private _padding = 0;
  set padding(p: number) {
    if (p !== this.padding) {
      p = Math.max(0, p);
      this._padding = p;
      this.sizeChanged();
    }
  }
  get padding() {
    return this._padding;
  }
  get paddingBox(): Size {
    return {
      width: this.layoutWidth - 2 * this.margin,
      height: this.layoutHeight - 2 * this.margin,
    };
  }

  get contentBox(): Size {
    return {
      width: this.layoutWidth - 2 * this.margin - 2 * this.padding,
      height: this.layoutHeight - 2 * this.margin - 2 * this.padding,
    };
  }

  // draw box model for debugging
  drawBoxModel(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.lineWidth = 1;

    // margin
    if (this.margin > 0) {
      gc.strokeStyle = "red";
      gc.setLineDash([2, 2]);
      gc.strokeRect(0, 0, this.layoutWidth, this.layoutHeight);
    }

    // padding
    if (this.padding > 0) {
      gc.strokeStyle = "green";
      gc.setLineDash([2, 2]);
      gc.strokeRect(
        this.margin,
        this.margin,
        this.paddingBox.width,
        this.paddingBox.height
      );
    }

    // content
    gc.strokeStyle = "blue";
    gc.setLineDash([2, 2]);
    gc.strokeRect(
      this.margin + this.padding,
      this.margin + this.padding,
      this.contentBox.width,
      this.contentBox.height
    );

    gc.restore();
  }

  //#endregion

  //#region widget event binding

  private bindingTable: BindingRoute[] = [];

  protected sendEvent(e: SKEvent, capture = false): boolean {
    let handled = false;
    this.bindingTable.forEach((d) => {
      if (d.type == e.type && d.capture == capture) {
        handled ||= d.handler(e) as boolean;
      }
    });
    return handled;
  }

  addEventListener(
    type: string,
    handler: EventHandler,
    capture = false
  ) {
    this.bindingTable.push({ type, handler, capture });
  }

  removeEventListener(
    type: string,
    handler: EventHandler,
    capture = false
  ) {
    this.bindingTable = this.bindingTable.filter(
      (d) =>
        !(
          d.type == type &&
          d.handler == handler &&
          d.capture == capture
        )
    );
  }

  //#endregion

  //#region event handling

  handleKeyboardEvent(ke: SKKeyboardEvent): boolean {
    return this.sendEvent(ke);
  }

  handleMouseEvent(me: SKMouseEvent): boolean {
    if (me.type === "mousedown") {
      requestKeyboardFocus();
    }

    return this.sendEvent(me);
  }

  handleMouseEventCapture(me: SKMouseEvent): boolean {
    return this.sendEvent(me, true);
  }

  //#endregion

  hitTest(mx: number, my: number): boolean {
    return insideHitTestRectangle(
      mx,
      my,
      this.x + this.margin,
      this.y + this.margin,
      this.paddingBox.width,
      this.paddingBox.height
    );
  }

  // background colour
  fill;
  // border colour (assume 1 px solid)
  border;

  // for debugging
  id = "";
  debug = false;

  draw(gc: CanvasRenderingContext2D): void {
    if (Settings.debug || this.debug) {
      gc.save();
      gc.translate(this.x, this.y);
      // draw the box model visualization
      this.drawBoxModel(gc);

      // display element id
      gc.strokeStyle = "white";
      gc.lineWidth = 2;
      gc.textBaseline = "top";
      gc.textAlign = "left";
      gc.font = "7pt sans-serif";
      gc.strokeText(this.id, 2, 2);
      gc.fillStyle = "black";
      gc.fillText(this.id, 2, 2);
      gc.restore();
    }
  }

  public boxModelToString(): string {
    // const s = JSON.stringify({
    //   margin: this.margin,
    //   padding: this.padding,
    //   marginBox: this.marginBox,
    //   paddingBox: this.paddingBox,
    //   contentBox: this.contentBox,
    //   width: this.widthLayout,
    //   this.height
    // }
    return `width:${this._width} height:${this._height} margin:${this.margin} padding:${this.padding} basis:${this.intrinsicWidth}x${this.intrinsicHeight} layout:${this.layoutWidth}x${this.layoutHeight}`;
  }

  public toString(): string {
    return `SKElement id:${this.id}`;
  }
}
