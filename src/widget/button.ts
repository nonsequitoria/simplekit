import { insideHitTestRectangle, measureText } from "../utility";
import { SKElement, SKElementProps } from "./element";
import { Style } from "./style";
import { SKEvent, SKMouseEvent } from "../events";

import { requestMouseFocus } from "../dispatch";

export type SKButtonProps = SKElementProps & { text?: string };

export class SKButton extends SKElement {
  constructor({
    text = "",
    fill = Style.defaultColour,
    border = "black",
    ...elementProps
  }: SKButtonProps = {}) {
    super({ fill, border, ...elementProps });
    this.padding = Style.textPadding;
    this.text = text;
    if (!this.width) this.width = 80;
  }

  state: "idle" | "hover" | "down" = "idle";

  private _font = Style.font;
  get font() {
    return this._font;
  }
  set font(f: string) {
    this._font = f;
    this.sizeChanged();
  }

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

    const m = measureText(this.text, this._font);

    if (!m) {
      console.warn(`measureText failed in SKButton for ${this.text}`);
      return;
    }

    this.contentHeight = m.height;
    this.contentWidth = m.width;

    this.recalculateSize = false;
  }

  handleMouseEvent(me: SKMouseEvent) {
    switch (me.type) {
      case "mousedown":
        this.state = "down";
        requestMouseFocus(this);
        // return true;
        break;
      case "mouseup":
        this.state = "hover";
        // return true if a listener was registered
        if (
          this.sendEvent({
            source: this,
            timeStamp: me.timeStamp,
            type: "action",
          } as SKEvent)
        )
          return true;
        break;
      case "mouseenter":
        this.state = "hover";
        break;
      case "mouseexit":
        this.state = "idle";
        break;
    }

    if (super.handleMouseEvent(me)) return true;

    return false;
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();

    // save typing
    const w = this.paddingBox.width;
    const h = this.paddingBox.height;

    gc.translate(this.margin, this.margin);

    // thick highlight rect
    if (this.state == "hover" || this.state == "down") {
      gc.beginPath();
      gc.roundRect(this.x, this.y, w, h, 4);
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 8;
      gc.stroke();
    }

    // normal background
    gc.beginPath();
    gc.roundRect(this.x, this.y, w, h, 4);
    gc.fillStyle =
      this.state == "down" ? Style.highlightColour : this.fill;
    gc.strokeStyle = this.border;
    // change fill to show down state
    gc.lineWidth = this.state == "down" ? 4 : 2;
    gc.fill();
    gc.stroke();
    gc.clip(); // clip text if it's wider than text area

    // button label
    gc.font = this._font;
    gc.fillStyle = this.border;
    gc.textAlign = "center";
    gc.textBaseline = "middle";
    gc.fillText(this.text, this.x + w / 2, this.y + h / 2);

    gc.restore();

    // element draws debug viz if flag is set
    super.draw(gc);
  }

  public toString(): string {
    return `SKButton '${this.text}'`;
  }
}
