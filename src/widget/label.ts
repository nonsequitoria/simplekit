import { measureText } from "../utility";

import { SKElement } from "./element";
import * as Style from "./style";

export class SKLabel extends SKElement {
  align: "centre" | "left" | "right" = "centre";
  font = Style.font;

  constructor(text: string, x = 0, y = 0, width?: number, height?: number) {
    super(x, y, width, height);
    this.box.padding = Style.textPadding;
    // defaults
    this.fill = "";
    this.border = "";
    this.text = text;
  }

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
      console.warn(`measureText failed in SKLabel for ${this.text}`);
      return;
    }

    this.box.height =
      height ||
      m.fontBoundingBoxAscent + m.fontBoundingBoxDescent + this.box.padding * 2;

    this.box.width = width || m.width + this.box.padding * 2;
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();

    gc.translate(this.x, this.y);
    gc.translate(this.box.margin, this.box.margin);

    if (this.fill) {
      gc.fillStyle = this.fill;
      gc.fillRect(0, 0, this.box.width, this.box.height);
    }

    if (this.border) {
      gc.strokeStyle = this.border;
      gc.lineWidth = 1;
      gc.strokeRect(0, 0, this.box.width, this.box.height);
    }

    // render text
    gc.font = Style.font;
    gc.fillStyle = "black";
    gc.textBaseline = "middle";

    switch (this.align) {
      case "left":
        gc.textAlign = "left";
        gc.fillText(this.text, this.box.padding, this.box.height / 2);

        break;
      case "centre":
        gc.textAlign = "center";
        gc.fillText(this.text, this.box.width / 2, this.box.height / 2);

        break;
      case "right":
        gc.textAlign = "right";
        gc.fillText(
          this.text,
          this.box.width - this.box.padding,
          this.box.height / 2
        );

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
