import { insideHitTestRectangle, measureText } from "../utility";
import { SKElement } from "./element";
import { Style } from "./style";
import { SKEvent, SKMouseEvent } from "../events";

export class SKButton extends SKElement {
  state: "idle" | "hover" | "down" = "idle";

  font = Style.font;

  constructor(
    text: string,
    x = 0,
    y = 0,
    width?: number,
    height?: number
  ) {
    super(x, y, width, height);
    this.box.padding = Style.textPadding;
    this.text = text;
  }

  protected _text = "";
  get text() {
    return this._text;
  }
  set text(t: string) {
    this._text = t;
    // console.log(`SKButton text = ${this.text} ${this.width} ${this.height}`);
    this.setMinimalSize(this.width, this.height);
  }

  setMinimalSize(width?: number, height?: number) {
    width = width || this.width;
    height = height || this.height;
    // need this if w or h not specified
    const m = measureText(this.text, this.font);

    if (!m) {
      console.warn(`measureText failed in SKButton for ${this.text}`);
      return;
    }

    this.box.height =
      height ||
      m.fontBoundingBoxAscent +
        m.fontBoundingBoxDescent +
        this.box.padding * 2;

    this.box.width = width || m.width + this.box.padding * 2;
    // enforce a minimum width here (if no width specified)
    if (!width) this.box.width = Math.max(this.box.width, 80);
  }

  handleMouseEvent(me: SKMouseEvent) {
    // console.log(`${this.text} ${me.type}`);

    switch (me.type) {
      case "mousedown":
        this.state = "down";
        return true;
        break;
      case "mouseup":
        this.state = "hover";
        // return true if a bubble listener was registered
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

  hitTest(mx: number, my: number): boolean {
    return insideHitTestRectangle(
      mx,
      my,
      this.x,
      this.y,
      this.box.paddingBox.width,
      this.box.paddingBox.height
    );
  }

  draw(gc: CanvasRenderingContext2D) {
    // to save typing "this" so much
    const box = this.box;

    gc.save();

    const w = box.paddingBox.width;
    const h = box.paddingBox.height;

    gc.translate(this.box.margin, this.box.margin);

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
      this.state == "down" ? Style.highlightColour : "lightgrey";
    gc.strokeStyle = "black";
    // change fill to show down state
    gc.lineWidth = this.state == "down" ? 4 : 2;
    gc.fill();
    gc.stroke();
    gc.clip(); // clip text if it's wider than text area

    // button label
    gc.font = Style.font;
    gc.fillStyle = "black";
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
