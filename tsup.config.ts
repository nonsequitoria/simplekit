import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "canvas-mode": "src/canvas-mode.ts",
    "imperative-mode": "src/imperative-mode.ts",
    utility: "src/utility/index.ts",
  },
  format: ["esm"], // Build for ESmodules only
  // dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
});
