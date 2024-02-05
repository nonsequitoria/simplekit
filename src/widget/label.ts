import { measureText } from "../utility";

import { SKElement, SKElementProps } from "./element";
import { Style } from "./style";

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

    this.height = height || m.height + this.padding * 2;

    this.width = width || m.width + this.padding * 2;
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
    gc.font = Style.font;
    gc.fillStyle = "black";
    gc.textBaseline = "middle";

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
