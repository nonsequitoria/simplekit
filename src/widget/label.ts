import { SKKeyboardEvent } from "../events";
import { measureText } from "../utility";

import { EventHandler, SKElement, SKElementProps } from "./element";
import { Style } from "./style";
import { SKMouseEvent } from "../events";
import { SKEvent } from "../events";
import { requestKeyboardFocus } from "../dispatch";

type LabelAlign = "centre" | "left" | "right";

type SKLabelProps = SKElementProps & {
  text?: string;
  align?: LabelAlign;
};

export class SKLabel extends SKElement {
  constructor({
    text = "?",
    align = "centre",
    ...elementProps
  }: SKLabelProps = {}) {
    super(elementProps);

    this.padding = Style.textPadding;
    this.text = text;
    this.align = align;

    // defaults
    this.fill = "";
    this.border = "";
  }

  private _font = Style.font;
  get font() {
    return this._font;
  }
  set font(f: string) {
    this._font = f;
    this.sizeChanged();
  }

  align: LabelAlign;

  protected _text = "";
  get text() {
    return this._text;
  }
  set text(t: string) {
    this._text = t;
    this.sizeChanged();
  }

  updateContentSize() {
    if (!this.recalculateSize) return;

    const m = measureText(this.text, this.font);

    if (!m) {
      console.warn(`measureText failed in SKLabel for ${this.text}`);
      return;
    }

    this.contentHeight = m.height;
    this.contentWidth = m.width;

    this.recalculateSize = false;
  }

  // no events on a label
  handleKeyboardEvent(ke: SKKeyboardEvent): boolean {
    return false;
  }

  // no events on a label except for clearing focus
  handleMouseEvent(me: SKMouseEvent): boolean {
    // clear focus
    if (me.type === "mousedown") {
      requestKeyboardFocus(null);
    }

    return false;
  }

  // no events on a label
  handleMouseEventCapture(me: SKMouseEvent): boolean {
    return false;
  }

  addEventListener(
    type: string,
    handler: EventHandler,
    capture?: boolean
  ): void {
    // no events on a label
    console.warn(`SKLabel does not support events`);
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();

    const w = this.paddingBox.width;
    const h = this.paddingBox.height;

    gc.translate(this.x, this.y);
    gc.translate(this.margin, this.margin);

    if (this.fill) {
      gc.fillStyle = this.fill;
      gc.fillRect(0, 0, w, h);
    }

    if (this.border) {
      gc.strokeStyle = this.border;
      gc.lineWidth = 1;
      gc.strokeRect(0, 0, w, h);
    }

    // render text
    gc.font = this.font;
    gc.fillStyle = "black";
    gc.textBaseline = "middle";

    // clipping rectangle
    gc.beginPath();
    gc.rect(0, 0, w, h);
    gc.clip();

    switch (this.align) {
      case "left":
        gc.textAlign = "left";
        gc.fillText(this.text, this.padding, h / 2);

        break;
      case "centre":
        gc.textAlign = "center";
        gc.fillText(this.text, w / 2, h / 2);

        break;
      case "right":
        gc.textAlign = "right";
        gc.fillText(this.text, w - this.padding, h / 2);

        break;
    }

    gc.restore();

    // element draws debug viz if flag is set
    super.draw(gc);
  }

  public toString(): string {
    return `SKLabel '${this.text}'`;
  }
}
