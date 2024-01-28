import {
  insideHitTestCircle,
  insideHitTestRectangle,
  measureText,
} from "../utility";
import { SKElement, SKElementProps } from "./element";
import { Style } from "./style";
import { SKEvent, SKMouseEvent } from "../events";

import { requestMouseFocus } from "../dispatch";
import { SKThumb } from "./thumb";

type SKSliderProps = SKElementProps & {
  min?: number;
  max?: number;
  value?: number;
};

export class SKSlider extends SKElement {
  constructor({
    min = 0,
    max = 100,
    value = 50,
    ...elementProps
  }: SKSliderProps = {}) {
    super(elementProps);
    console.warn("SKSlider is pre-release, use at own risk");
    this.box.height = 20;
    this._min = min;
    this._max = Math.max(min, max);
    this._value = Math.max(this._min, Math.min(value, this._max));
    this.lastValue = this._value;
    this.thumb = new SKThumb({
      x: this.valueRatio() * (this.box.width - 20),
      minX: 0,
      maxX: this.box.width - 20,
      minY: 0,
      maxY: 0,
      width: 20,
      height: 20,
    });
  }

  state: "idle" | "hover" | "down" = "idle";

  _min: number;
  get max() {
    return this._max;
  }
  set max(v: number) {
    this._max = v;
    this.value = Math.min(this.value, this._max);
  }
  _max: number;
  get min() {
    return this._min;
  }
  set min(v: number) {
    this._min = v;
    this.value = Math.max(this.value, this._min);
  }
  _value: number;
  get value() {
    return this._value;
  }
  set value(v: number) {
    this._value = Math.min(this._max, Math.max(this._min, v));
    this.thumb.x = this.valueRatio() * (this.box.width - 20);
  }

  protected lastValue: number;

  protected valueRatio = () =>
    (this._value - this._min) / (this._max - this._min);

  protected thumb: SKThumb;
  protected thumbFocus = false;
  protected thumbY = 0;

  protected updateThumb(meOriginal: SKMouseEvent) {
    // modify mouse event position to be relative to slider
    const me = { ...meOriginal };
    me.x -= this.x;
    me.y -= this.y;

    // check if mouse is over thumb
    const hit = this.thumb.hitTest(me.x, me.y);

    // set thumb focus
    if (hit && me.type == "mousedown") {
      this.thumbFocus = true;
      // save thumb y position to keep it aligned with slider
      this.thumbY = this.thumb.y;
    } else if (me.type == "mouseup") {
      this.thumbFocus = false;
    }

    // forward the modified event to the thumb
    if (this.thumbFocus || hit) {
      // keep thumb y position aligned with slider
      me.y = this.thumbY;
      // send a mouseenter
      if (this.thumb.state == "idle") {
        const mouseenter = { ...me, type: "mouseenter" };
        this.thumb.handleMouseEvent(mouseenter);
      }
      // constrain mousemove to slider width
      if (me.type == "mousemove") {
        const mousemove = { ...me, type: "mousemove" };
        // mousemove.x = Math.min(xMax, Math.max(xMin, mousemove.x));
        this.thumb.handleMouseEvent(mousemove);

        // dispatch slider value updated event
        const thumbRatio =
          this.thumb.x / (this.thumb.maxX - this.thumb.minX);
        this._value =
          this._min + thumbRatio * (this._max - this._min);
        // console.log(`slider value = ${this.value}`);

        if (this._value != this.lastValue) {
          this.dispatch({
            source: this,
            timeStamp: me.timeStamp,
            type: "valuechanged",
          });
          this.lastValue = this._value;
        }
      } else {
        this.thumb.handleMouseEvent(me);
      }
    } else {
      // send a mouseexit
      if (this.thumb.state != "idle") {
        const mouseexit = { ...me, type: "mouseexit" };
        this.thumb.handleMouseEvent(mouseexit);
      }
    }
  }

  handleMouseEvent(me: SKMouseEvent) {
    this.updateThumb(me);

    switch (me.type) {
      case "mousedown":
        requestMouseFocus(this);
        return true;
        break;
      case "mousemove":
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

    // slider line
    gc.beginPath();
    const lh = 5;
    gc.rect(0, h / 2 - lh / 2, w, lh);
    if (this.state == "hover" || this.state == "down") {
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 4;
      gc.stroke();
    }

    gc.fillStyle = Style.defaultColour;
    gc.fill();
    gc.lineWidth = 1;
    gc.strokeStyle = "darkgrey";
    gc.stroke();

    // draw thumb

    this.thumb.draw(gc);

    gc.restore();

    // element draws debug viz if flag is set
    super.draw(gc);
  }

  public toString(): string {
    return `SKSlider [${this._min}, ${this._max}] = ${this._value}`;
  }
}
