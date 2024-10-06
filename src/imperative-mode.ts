/**
 * SimpleKit Imperative UI Mode
 */

// events
export * from "./events";
// functions
export {
  startSimpleKit,
  setSKEventListener,
  sendSKEvent,
  setSKAnimationCallback,
  setSKDrawCallback,
  addSKEventTranslator,
  setSKRoot,
  invalidateLayout,
};
export {
  skTime, // global time from windowing system
} from "./windowing-system";
export type {
  FundamentalEvent, // needed for custom translators
} from "./windowing-system";
// widgets
export * from "./widget";
// layout
export * from "./layout";
// settings
export * from "./settings";
// dispatch
export { requestKeyboardFocus, requestMouseFocus } from "./dispatch";

//  - - - - - - - - - - - - - - - - - - - - - - -

import {
  FundamentalEvent,
  createWindowingSystem,
  coalesceEvents,
} from "./windowing-system";

// simple simulated UI Kit events
import { SKEvent, SKKeyboardEvent, SKMouseEvent } from "./events";

// dispatchers
import { mouseDispatch, keyboardDispatch } from "./dispatch";

import {
  EventTranslator,
  fundamentalTranslator,
  clickTranslator,
  dblclickTranslator,
  dragTranslator,
} from "./events";

import { SKElement } from "./widget";
import { checkHtml, setupCanvas } from "./common";

// merges b into a, preserves order of each and puts "a" events first if same time
// assumes a and b are sorted by timestamp prop
function mergeEventQueues(a: SKEvent[], b: SKEvent[]): SKEvent[] {
  let result: SKEvent[] = [];
  let j = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i].timeStamp <= b[j].timeStamp) {
      result.push(a[i]);
    } else {
      while (j < b.length && b[j].timeStamp < a[i].timeStamp) {
        result.push(b[j]);
        j++;
      }
      result.push(a[i]);
    }
  }
  // push any later events still in b
  while (j < b.length) {
    result.push(b[j]);
    j++;
  }

  return result;
}

/**
 * The SimpleKit toolkit run loop (for imperative toolkit mode)
 * @param eventQueue fundamental events from simulated windowing system
 * @param time the windowing system frame time
 */
function runLoop(eventQueue: FundamentalEvent[], time: number) {
  // fundamental event queue coalescing
  coalesceEvents(eventQueue);

  // list of events to dispatch
  let events: SKEvent[] = [];

  // translate fundamental events

  // if no fundamental events, send  a null event with time for
  // translators that trigger events based on time
  if (eventQueue.length == 0) {
    const nullEvent = {
      type: "null",
      timeStamp: time,
    } as FundamentalEvent;
    translators.forEach((t) => {
      const translatedEvent = t.update(nullEvent);
      if (translatedEvent) {
        events.push(translatedEvent);
      }
    });
  }

  // if no fundamental events, push a single "null" fundamental event
  // this is because some translators trigger events based on time
  // (like long press)
  if (eventQueue.length == 0) {
    eventQueue.push({
      type: "null",
      timeStamp: time,
    } as FundamentalEvent);
  }

  // use fundamental events to generate SKEvents
  while (eventQueue.length > 0) {
    const fundamentalEvent = eventQueue.shift();
    if (!fundamentalEvent) continue;
    translators.forEach((t) => {
      const translatedEvent = t.update(fundamentalEvent);
      if (translatedEvent) {
        events.push(translatedEvent);
      }
    });
  }

  // merge any other events
  // (assumes otherEvents sorted by timeStamp prop)
  events =
    otherEvents.length > 0
      ? mergeEventQueues(events, otherEvents)
      : events;

  // dispatch events
  events.forEach((e) => {
    // handle resize for layout
    if (e.type == "resize" && uiTreeRoot) {
      invalidateLayout();
    }

    // widget dispatchers
    if (e instanceof SKMouseEvent && uiTreeRoot) {
      mouseDispatch(e, uiTreeRoot);
    }
    if (e instanceof SKKeyboardEvent) {
      keyboardDispatch(e);
    }

    // global app dispatch
    if (eventListener) eventListener(e);
  });

  // animation
  if (animateCallback) animateCallback(time);

  // draw on canvas
  if (drawCallback) drawCallback(gc);

  // if we have a UI tree, layout widgets if needed
  if (uiTreeRoot && layoutRequested) {
    if (Settings.debugLayout) console.log(`*** LAYOUT REQUESTED ***`);
    layoutRoot();
    layoutRequested = false;
  }

  // draw UI
  if (uiTreeRoot) {
    gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);
    uiTreeRoot.draw(gc);
  }
}

// SimpleKit draws everything in this canvas graphics context
let gc: CanvasRenderingContext2D;

// standard fundamental event translators
const translators: EventTranslator[] = [
  fundamentalTranslator,
  clickTranslator,
  dblclickTranslator,
  dragTranslator,
];

/**
 * Adds an fundamental event translator to the list of translators
 * @param translator the translator to add
 */
function addSKEventTranslator(translator: EventTranslator) {
  translators.push(translator);
  console.log(
    `added event translator, now ${translators.length} translators`
  );
}

/**
 * Sets a global event listener
 * @param listener the event listener callback
 */
function setSKEventListener(listener: EventListener) {
  eventListener = listener;
}
type EventListener = (e: SKEvent) => void;
let eventListener: EventListener;

/**
 * Sets function to update animations each frame
 * @param animate the animation callback
 */
function setSKAnimationCallback(animate: AnimationCallback) {
  animateCallback = animate;
}
type AnimationCallback = (time: number) => void;
let animateCallback: AnimationCallback;

// method to send other events
const otherEvents: SKEvent[] = [];

function sendSKEvent(e: SKEvent) {
  otherEvents.push(e);
}

/**
 * Sets function to draw graphics each frame
 * @param draw the draw callback
 */
function setSKDrawCallback(draw: DrawCallback) {
  if (uiTreeRoot) {
    console.error("No draw callback when widget tree root is set.");
    return;
  }
  console.warn(
    "setSKDrawCallback only for testing or concept demos: use setSKRoot to build an imperative UI."
  );
  drawCallback = draw;
}
type DrawCallback = (gc: CanvasRenderingContext2D) => void;
let drawCallback: DrawCallback | null;

// root of the widget tree
let uiTreeRoot: SKElement | null;

/**
 * Sets the root of the widget tree that describes the UI.
 * This is typically set once during startup
 * @param root the root widget, usually a SKContainer
 */
function setSKRoot(root: SKElement | null) {
  uiTreeRoot = root;
  if (root) {
    invalidateLayout();
    if (drawCallback) {
      drawCallback = null;
      console.warn(
        `Draw callback cleared when setting widget tree root.`
      );
    }
  }
}

// flag to run layout process next frame
let layoutRequested = false;
// widgets call this to trigger layout next frame
function invalidateLayout() {
  layoutRequested = true;
}

function layoutRoot() {
  if (uiTreeRoot && gc) {
    // no margin allowed on root
    if (uiTreeRoot.margin !== 0) {
      console.warn(
        `No margin allowed for root widget, setting margin to 0.`
      );
      uiTreeRoot.margin = 0;
    }

    // 1. calculate ”intrinsic size" of all widgets
    uiTreeRoot.measure();
    // 2. set position and size of all widgets
    uiTreeRoot.layout(gc.canvas.width, gc.canvas.height);
  }
}

import * as npmPackage from "../package.json";
import { Settings } from "./settings";

/**
 * Must be called once to start the SimpleKit run loop. It adds a
 * single canvas to the body for drawing and creates
 * the simulated windowing system to call the SimpleKit run loop
 * @returns true if successful, false otherwise
 */
function startSimpleKit(): boolean {
  console.info(
    `🧰 SimpleKit v${npmPackage.version} *Imperative UI Mode* startup`
  );

  // check the HTML document hosting SimpleKit
  if (!checkHtml()) return false;

  // setup canvas
  let canvas = setupCanvas();

  // save graphics context to local module variable
  const graphicsContext = canvas.getContext("2d");
  // this should never happen, but we need to check
  if (!graphicsContext) {
    console.error("Unable to get graphics context from canvas");
    return false;
  }
  gc = graphicsContext;

  // start the toolkit run loop
  createWindowingSystem(runLoop);

  return true;
}
