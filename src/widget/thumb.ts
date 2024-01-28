import {
  insideHitTestCircle,
  insideHitTestRectangle,
  measureText,
} from "../utility";
import { SKElement, SKElementProps } from "./element";
import { Style } from "./style";
import { SKEvent, SKMouseEvent } from "../events";

import { requestMouseFocus } from "../dispatch";

type SKThumbProps = SKElementProps & {
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
};

export class SKThumb extends SKElement {
  constructor({
    minX = Number.MIN_VALUE,
    maxX = Number.MAX_VALUE,
    minY = Number.MIN_VALUE,
    maxY = Number.MAX_VALUE,
    ...elementProps
  }: SKThumbProps = {}) {
    super(elementProps);
    console.warn("SKThumb is pre-release, use at own risk");

    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
  }

  state: "idle" | "hover" | "down" = "idle";

  offsetX = 0;
  offsetY = 0;

  minX: number;
  maxX: number;

  minY: number;
  maxY: number;

  updatePosition(x: number, y: number) {
    this.x = Math.max(this.minX, Math.min(x, this.maxX));
    this.y = Math.max(this.minY, Math.min(y, this.maxY));
  }

  handleMouseEvent(me: SKMouseEvent) {
    switch (me.type) {
      case "mousedown":
        this.state = "down";
        {
          const { x: mx, y: my } = me;
          this.offsetX = mx - this.x;
          this.offsetY = my - this.y;
          console.log(`offset: ${this.offsetX}, ${this.offsetY}`);
        }
        requestMouseFocus(this);
        return true;
        break;
      case "mousemove":
        if (this.state == "down") {
          this.updatePosition(
            me.x - this.offsetX,
            me.y - this.offsetY
          );
          // this.x = me.x - this.offsetX;
          // this.y = me.y - this.offsetY;
        }
        // return true if a listener was registered
        // return this.dispatch({
        //   source: this,
        //   timeStamp: me.timeStamp,
        //   type: "action",
        // } as SKEvent);
        break;

      case "mouseup":
        this.state = "hover";
        // return true if a listener was registered
        return this.dispatch({
          source: this,
          timeStamp: me.timeStamp,
          type: "action",
        } as SKEvent);
        break;
      case "mouseenter":
        this.state = "hover";
        return true;
        break;
      case "mouseexit":
        this.state = "idle";
        return true;
        break;
    }
    return false;
  }

  draw(gc: CanvasRenderingContext2D) {
    // to save typing "this" so much
    const box = this.box;

    gc.save();

    const w = box.paddingBox.width;
    const h = box.paddingBox.height;

    gc.translate(this.x, this.y);
    gc.translate(this.box.margin, this.box.margin);

    // draw thumb
    gc.beginPath();
    gc.roundRect(0, 0, w, h, 4);
    if (this.state == "hover" || this.state == "down") {
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 8;
      gc.stroke();
    }

    gc.fillStyle =
      this.state == "down"
        ? Style.highlightColour
        : Style.defaultColour;
    gc.fill();
    gc.lineWidth = 2;
    gc.strokeStyle = "black";
    gc.stroke();

    gc.restore();

    // element draws debug viz if flag is set
    super.draw(gc);
  }

  public toString(): string {
    return `SKThumb`;
  }
}
