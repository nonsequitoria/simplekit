import { SKKeyboardEvent } from "../events";
import { SKElement } from "../widget";

const debug = false;

if (debug) console.log("load dispatch-keyboard module");

let focusedElement: SKElement | null = null;

export function requestKeyboardFocus(element: SKElement) {
  if (focusedElement == element) return;
  if (focusedElement) {
    focusedElement.handleKeyboardEvent({
      type: "focusout",
      timeStamp: performance.now(),
      key: null,
    } as SKKeyboardEvent);
    if (debug) console.log(`lost keyboard focus ${focusedElement}`);
  }
  element.handleKeyboardEvent({
    type: "focusin",
    timeStamp: performance.now(),
    key: null,
  } as SKKeyboardEvent);
  focusedElement = element;
  if (debug) console.log(`gained keyboard focus ${focusedElement}`);
}

export function keyboardDispatch(ke: SKKeyboardEvent) {
  if (debug)
    console.log(
      `keyboardDispatch ${ke} ${focusedElement || "no focus"}`
    );
  focusedElement?.handleKeyboardEvent(ke);
}
