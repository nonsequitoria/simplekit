import { invalidateLayout } from "../imperative";

type Size = { width: number; height: number };

export class BoxModel {
  onUpdate() {
    invalidateLayout();
  }

  // margin
  private _margin = 0;
  set margin(m: number) {
    m = Math.max(0, m);
    this._margin = m;
    this.onUpdate();
  }
  get margin() {
    return this._margin;
  }
  get marginBox(): Size {
    return {
      width: this.contentWidth + 2 * this.padding + 2 * this.margin,
      height: this.contentHeight + 2 * this.padding + 2 * this.margin,
    };
  }

  // padding
  private _padding = 0;
  set padding(p: number) {
    p = Math.max(0, p);
    this._padding = p;
    // adjust width and height to account for padding
    this.width = this.width;
    this.height = this.height;
    this.onUpdate();
  }
  get padding() {
    return this._padding;
  }
  get paddingBox(): Size {
    return {
      width: this.contentWidth + 2 * this.padding,
      height: this.contentHeight + 2 * this.padding,
    };
  }

  // content
  private _contentWidth = 0;
  set contentWidth(w: number) {
    w = Math.max(0, w);
    this._contentWidth = w;
    this.onUpdate();
  }
  get contentWidth() {
    return this._contentWidth;
  }
  private _contentHeight = 0;
  set contentHeight(h: number) {
    h = Math.max(0, h);
    this._contentHeight = h;
    this.onUpdate();
  }
  get contentHeight() {
    return this._contentHeight;
  }
  get contentBox(): Size {
    return { width: this.contentWidth, height: this.contentHeight };
  }

  // full box size (including margin)
  get fullWidth() {
    return this.marginBox.width;
  }
  set fullWidth(w: number) {
    w = Math.max(0, w);
    this.contentWidth = w - 2 * this.padding - 2 * this.margin;
  }

  get fullHeight() {
    return this.marginBox.height;
  }
  set fullHeight(h: number) {
    h = Math.max(0, h);
    this.contentHeight = h - 2 * this.padding - 2 * this.margin;
  }

  // width and height include padding

  // width
  set width(w: number) {
    // width must be at least 2 * padding
    w = Math.max(2 * this.padding, w);
    this.contentWidth = w - 2 * this.padding;
  }
  get width() {
    return this.contentWidth + 2 * this.padding;
  }

  // height
  set height(h: number) {
    // height must be at least 2 * padding
    h = Math.max(2 * this.padding, h);
    this.contentHeight = h - 2 * this.padding;
  }
  get height() {
    return this.contentHeight + 2 * this.padding;
  }

  // draw box model for debugging
  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.lineWidth = 1;

    // margin
    if (this.margin > 0) {
      gc.strokeStyle = "red";
      gc.setLineDash([2, 2]);
      gc.strokeRect(0, 0, this.marginBox.width, this.marginBox.height);
    }

    // padding
    if (this.padding > 0) {
      gc.strokeStyle = "green";
      gc.setLineDash([2, 2]);
      gc.strokeRect(
        this.margin,
        this.margin,
        this.paddingBox.width,
        this.paddingBox.height
      );
    }

    // content
    gc.strokeStyle = "blue";
    gc.setLineDash([2, 2]);
    gc.strokeRect(
      this.margin + this.padding,
      this.margin + this.padding,
      this.contentBox.width,
      this.contentBox.height
    );

    gc.restore();
  }

  toString(): string {
    return (
      "BoxModel\n" +
      ` margin:${this.margin} (${this.marginBox.width}x${this.marginBox.height})\n` +
      ` padding:${this.padding} (${this.paddingBox.width}x${this.paddingBox.height})\n` +
      ` content (${this.contentWidth}x${this.contentHeight})\n` +
      ` full (${this.fullWidth}x${this.fullHeight})\n` +
      ` width:${this.width} height:${this.height}`
    );
  }
}
