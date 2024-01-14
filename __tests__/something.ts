import { startSimpleKit } from "canvas";

test("basic test", () => {
  expect(startSimpleKit()).toBe(false);
});

test("placeholder test", () => {
  expect(undefined).toBeUndefined();
});
