import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    canvas: "src/canvas-mode.ts",
    imperative: "src/imperative-mode.ts",
    utility: "src/utility/index.ts",
    // widget: "src/widget/index.ts",

    // "./widget": {
    //   "import": "./dist/widget.js",
    //   "require": "./dist/widget.cjs",
    //   "types": "./dist/widget.d.ts"
    // }
  },
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
});
