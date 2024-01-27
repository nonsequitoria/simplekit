import { SKEvent, SKKeyboardEvent, SKMouseEvent } from "../events";
// import { Drawable } from "../utility";

import { BoxModel } from "./boxmodel";
import { Settings } from "../settings";
import { Style } from "./style";

type EventHandler = (me: SKEvent) => boolean | void;

type DispatchRoute = {
  type: string; // event type
  handler: EventHandler;
  capture: boolean;
};

type SKElementProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export abstract class SKElement {
  constructor({
    x = 0,
    y = 0,
    width = Style.minElementSize,
    height = Style.minElementSize,
  }: SKElementProps = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // top-left corner of element bounding box
  x = 0;
  y = 0;

  protected _width: number | undefined;
  set width(w: number | undefined) {
    if (w !== undefined) w = Math.max(w, 0);
    this._width = w;
    // if no width specified, use 0
    this.box.width = w || 0;
  }
  get width(): number | undefined {
    return this._width;
  }

  protected _height: number | undefined;
  set height(h: number | undefined) {
    if (h !== undefined) h = Math.max(h, 0);
    this._height = h;
    // if no height specified, use 0
    this.box.height = h || 0;
  }
  get height(): number | undefined {
    return this._height;
  }

  box: BoxModel = new BoxModel();

  // proportion to grow and shrink in some layouts
  // (0 means do not grow or shrink)
  fillWidth = 0;
  fillHeight = 0;

  // layout placeholder
  doLayout(width?: number, height?: number) {}

  //#region event dispatching

  private dispatchTable: DispatchRoute[] = [];

  protected dispatch(e: SKEvent, capture = false): boolean {
    let handled = false;
    this.dispatchTable.forEach((d) => {
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
    this.dispatchTable.push({ type, handler, capture });
  }

  removeEventListener(
    type: string,
    handler: EventHandler,
    capture = false
  ) {
    this.dispatchTable = this.dispatchTable.filter(
      (d) =>
        d.type != type && d.handler != handler && d.capture != capture
    );
  }

  //#endregion

  //#region event handling

  handleKeyboardEvent(ke: SKKeyboardEvent): boolean {
    return false;
  }

  handleMouseEvent(ms: SKMouseEvent): boolean {
    return false;
  }

  handleMouseEventCapture(ms: SKMouseEvent): boolean {
    return false;
  }

  //#endregion

  hitTest(x: number, y: number) {
    return false;
  }

  // background colour
  fill = "";
  // border colour (assume 1 px solid)
  border = "";

  // for debugging
  id = "";
  debug = false;

  draw(gc: CanvasRenderingContext2D): void {
    if (Settings.debug || this.debug) {
      gc.save();
      gc.translate(this.x, this.y);
      // draw the box model visualization
      this.box.draw(gc);

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

  public toString(): string {
    return `SKElement id:${this.id}`;
  }
}
