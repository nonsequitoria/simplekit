// export class BoxModel {
//   constructor(private recalculateBasis: () => void) {}

//   onUpdate() {
//     invalidateLayout();
//   }

//   // // full box size (including margin)
//   // get fullWidth() {
//   //   return this.marginBox.width;
//   // }
//   // set fullWidth(w: number) {
//   //   w = Math.max(0, w);
//   //   this.contentWidth = w - 2 * this.padding - 2 * this.margin;
//   // }

//   // get fullHeight() {
//   //   return this.marginBox.height;
//   // }
//   // set fullHeight(h: number) {
//   //   h = Math.max(0, h);
//   //   this.contentHeight = h - 2 * this.padding - 2 * this.margin;
//   // }

//   // width and height include padding

//   // width
//   // set width(w: number) {
//   //   // width must be at least 2 * padding
//   //   w = Math.max(2 * this.padding, w);
//   //   this.contentWidth = w - 2 * this.padding;
//   // }
//   // get width() {
//   //   return this.contentWidth + 2 * this.padding;
//   // }

//   // // height
//   // set height(h: number) {
//   //   // height must be at least 2 * padding
//   //   h = Math.max(2 * this.padding, h);
//   //   this.contentHeight = h - 2 * this.padding;
//   // }
//   // get height() {
//   //   return this.contentHeight + 2 * this.padding;
//   // }

//   // toString(): string {
//   //   return (
//   //     "BoxModel\n" +
//   //     ` margin:${this.margin} (${this.marginBox.width}x${this.marginBox.height})\n` +
//   //     ` padding:${this.padding} (${this.paddingBox.width}x${this.paddingBox.height})\n` +
//   //     ` content (${this.contentWidth}x${this.contentHeight})\n` +
//   //     ` full (${this.fullWidth}x${this.fullHeight})\n` +
//   //     ` width:${this.width} height:${this.height}`
//   //   );
//   // }
// }
