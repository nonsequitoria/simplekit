import { startSimpleKit } from "canvas-mode";

test("basic test", () => {
  expect(startSimpleKit()).toBe(false);
});

test("placeholder test", () => {
  expect(undefined).toBeUndefined();
});
