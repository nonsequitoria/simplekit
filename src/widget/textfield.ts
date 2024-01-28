import { SKKeyboardEvent, SKMouseEvent } from "../events";
import { measureText } from "../utility";
import { requestKeyboardFocus } from "../dispatch";
import { SKElement, SKElementProps } from "./element";
import { Style } from "./style";

type SKTextfieldProps = SKElementProps & {
  text?: string;
};

export class SKTextfield extends SKElement {
  constructor({ text, ...elementProps }: SKTextfieldProps = {}) {
    super(elementProps);
    this.box.padding = Style.textPadding;
    this.text = text || "";
  }

  state: "idle" | "hover" = "idle";
  focus = false;
  font = Style.font;

  protected _text = "";
  get text() {
    return this._text;
  }
  set text(t: string) {
    this._text = t;
    this.setMinimalSize(this.width, this.height);
  }

  setMinimalSize(width?: number, height?: number) {
    // need this if w or h not specified
    const m = measureText(this.text || " ", this.font);

    if (!m) {
      console.warn(
        `measureText failed in SKTextfield for ${this.text}`
      );
      return;
    }

    this.height = height || m.height + this.box.padding * 2;

    this.box.width = width || m.width + this.box.padding * 2;
  }

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
        return true;
        break;
      case "focusin":
        this.focus = true;
        return true;
        break;
      case "keydown":
        if (this.focus && ke.key) {
          this._text = this.applyEdit(this.text, ke.key);
        }
        return this.dispatch({
          source: this,
          timeStamp: ke.timeStamp,
          type: "textchanged",
        });
        break;
    }

    return false;
  }

  handleMouseEvent(me: SKMouseEvent) {
    switch (me.type) {
      case "mouseenter":
        this.state = "hover";
        return true;
        break;
      case "mouseexit":
        this.state = "idle";
        return true;
        break;
      case "click":
        requestKeyboardFocus(this);
        return true;
        break;
      case "mousedown":
        return false;
        break;
      case "mouseup":
        return false;
        break;
    }
    return false;
  }

  draw(gc: CanvasRenderingContext2D) {
    const w = this.box.width;
    const h = this.box.height;

    gc.save();

    gc.translate(this.x, this.y);
    gc.translate(this.box.margin, this.box.margin);

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
    gc.clip(); // clip text if it's wider than text area

    // highlight
    // gc.fillStyle = SKStyle.highlightColor;
    // gc.fillRect(
    //   this.x + padding,
    //   this.y + padding / 2,
    //   50,
    //   this.height - padding
    // );

    // text
    gc.font = Style.font;
    gc.fillStyle = "black";
    gc.textBaseline = "middle";
    gc.textAlign = "left";
    gc.fillText(this.text, this.box.padding, h / 2);

    gc.restore();

    // element draws debug viz if flag is set
    super.draw(gc);
  }

  public toString(): string {
    return `SKTextfield '${this.text}'`;
  }
}
