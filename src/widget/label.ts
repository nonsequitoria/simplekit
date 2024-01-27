import { measureText } from "../utility";

import { SKElement, SKElementProps } from "./element";
import { Style } from "./style";

type LabelAlign = "centre" | "left" | "right";

type SKLabelProps = SKElementProps & {
  text?: string;
  align?: LabelAlign;
};

export class SKLabel extends SKElement {
  constructor({ text, align, ...elementProps }: SKLabelProps = {}) {
    super(elementProps);

    this.box.padding = Style.textPadding;
    this.text = text || "?";
    this.align = align || "centre";

    // defaults
    this.fill = "";
    this.border = "";
  }

  font = Style.font;
  align: LabelAlign;

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

    this.box.height = height || m.height + this.box.padding * 2;

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
        gc.fillText(
          this.text,
          this.box.width / 2,
          this.box.height / 2
        );

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
