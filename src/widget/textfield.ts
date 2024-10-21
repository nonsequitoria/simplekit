import { SKKeyboardEvent, SKMouseEvent } from "../events";
import { measureText } from "../utility";
import { requestKeyboardFocus } from "../dispatch";
import { SKElement, SKElementProps } from "./element";
import { Style } from "./style";

export type SKTextfieldProps = SKElementProps & {
  text?: string;
};

export class SKTextfield extends SKElement {
  constructor({ text = "", ...elementProps }: SKTextfieldProps = {}) {
    super(elementProps);
    this.padding = Style.textPadding;
    this.text = text;
  }

  state: "idle" | "hover" = "idle";
  focus = false;

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
    const m = measureText(this.text, this._font);

    if (!m) {
      console.warn(
        `measureText failed in SKTextfield for ${this.text}`
      );
      return;
    }

    this.contentHeight = m.height;
    this.contentWidth = m.width;

    this.textWidth = m.width;
  }

  textWidth = 0;

  protected applyEdit(text: string, key: string): string {
    if (key == "Backspace") {
      return text.slice(0, -1);
    } else if (key.length == 1) {
      return text + key;
    } else return text;
  }

  handleKeyboardEvent(ke: SKKeyboardEvent) {
    switch (ke.type) {
      case "focusout":
        this.focus = false;
        break;
      case "focusin":
        this.focus = true;
        break;
      case "keydown":
        if (this.focus && ke.key) {
          this.text = this.applyEdit(this.text, ke.key);
        }
        if (
          this.sendEvent({
            source: this,
            timeStamp: ke.timeStamp,
            type: "textchanged",
          })
        )
          return true;
        break;
    }

    if (super.handleKeyboardEvent(ke)) return true;

    return false;
  }

  handleMouseEvent(me: SKMouseEvent) {
    switch (me.type) {
      case "mouseenter":
        this.state = "hover";
        break;
      case "mouseexit":
        this.state = "idle";
        break;
      case "click":
        break;
      case "mousedown":
        requestKeyboardFocus(this);
        return true;
        break;
      case "mouseup":
        break;
    }

    if (super.handleMouseEvent(me)) return true;

    return false;
  }

  draw(gc: CanvasRenderingContext2D) {
    const w = this.paddingBox.width;
    const h = this.paddingBox.height;

    gc.save();

    gc.translate(this.x, this.y);
    gc.translate(this.margin, this.margin);

    // thick highlight rect
    if (this.state == "hover") {
      gc.beginPath();
      gc.rect(0, 0, w, h);
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 8;
      gc.stroke();
    }

    // border
    gc.beginPath();
    gc.rect(0, 0, w, h);
    gc.fillStyle = "white";
    gc.fill();
    gc.lineWidth = 1;
    gc.strokeStyle = this.focus ? "mediumblue" : "black";
    gc.stroke();
    // clip text if it's wider than text area
    // TODO: could scroll text if it's wider than text area
    gc.clip();

    // text
    gc.font = this.font;
    gc.fillStyle = "black";
    gc.textBaseline = "middle";
    gc.textAlign = "left";
    gc.fillText(this.text, this.padding, h / 2);

    // simple cursor
    if (this.focus) {
      const cursorX = this.padding + this.textWidth + 1;
      const cursorHeight = h - Style.textPadding;
      gc.beginPath();
      gc.moveTo(cursorX, Style.textPadding / 2);
      gc.lineTo(cursorX, cursorHeight);
      gc.lineWidth = 1;
      gc.strokeStyle = "black";
      gc.stroke();
    }

    gc.restore();

    // element draws debug viz if flag is set
    super.draw(gc);
  }

  public toString(): string {
    return `SKTextfield '${this.text}'`;
  }
}
