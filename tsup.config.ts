import { defineConfig } from "tsup";

export default defineConfig({
  entry: { canvas: "src/canvas.ts", imperative: "src/imperative.ts" },
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
});
