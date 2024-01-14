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
  setSKRoot,
  setSKAnimationCallback,
  addSKEventTranslator,
  invalidateLayout,
};
// widgets
export * from "./widget";
// layout
export * from "./layout";

//  - - - - - - - - - - - - - - - - - - - - - - -

import {
  FundamentalEvent,
  createWindowingSystem,
  coalesceEvents,
} from "./windowing-system";

// simple simulated UI Kit events
import { SKEvent, SKKeyboardEvent, SKMouseEvent } from "./events";

// dispatchers
import { MouseDispatcher, keyboardDispatcher } from "./dispatch";

import {
  EventTranslator,
  fundamentalTranslator,
  clickTranslator,
  keypressTranslator,
  dblclickTranslator,
  dragTranslator,
} from "./events";

import { SKElement } from "./widget";
import { checkHtml, setupCanvas } from "./common-mode";

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
 * @param eventQueue fundamental events from simulated winodwing system
 * @param time the windowing system frame time
 */
function runloop(eventQueue: FundamentalEvent[], time: number) {
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
    otherEvents.length > 0 ? mergeEventQueues(events, otherEvents) : events;

  // dispatch events
  events.forEach((e) => {
    // handle resize for layout
    if (e.type == "resize" && uiTreeRoot) {
      // console.log(`resize event ${events.length}`);
      // should be safe to invalidate, then update layout after all events processed
      invalidateLayout();
      // layoutRoot(); // can force layout if bugs show up
    }

    // widget dispatchers

    if (mouseDispatcher && e instanceof SKMouseEvent) {
      const me = e as SKMouseEvent;
      mouseDispatcher.dispatch(me);
    }
    if (e instanceof SKKeyboardEvent) {
      const ke = e as SKKeyboardEvent;
      keyboardDispatcher.dispatch(ke);
    }

    // global app dispatch
    if (eventListener) eventListener(e);
  });

  // animation
  if (animateCallback) animateCallback(time);

  // if we have a UI tree, layout widgets if needed
  if (uiTreeRoot && layoutDirty) {
    // console.log(`layout dirty, doing layout`);
    layoutRoot();
    layoutDirty = false;
  }

  // draw UI
  if (uiTreeRoot) {
    // uiTreeRoot.doLayout();
    gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);
    uiTreeRoot.draw(gc);
  }
}

// SimpleKit draws everything in this canvas graphics context
let gc: CanvasRenderingContext2D;

// standard fundamental event translators
const translators: EventTranslator[] = [
  fundamentalTranslator,
  keypressTranslator,
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
  console.log(`added event translator, now ${translators.length} translators`);
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

// root of the widget tree
let uiTreeRoot: SKElement | null;

let mouseDispatcher: MouseDispatcher | null;
// import { global } from "./global";
// let keyboardDispatcher = new KeyboardDispatcher();
// global.keyboardDispatcher = keyboardDispatcher;

/**
 * Sets the root of the widget tree that describes the UI.
 * This is typically set once during startup
 * @param root the root widget, usually a SKContainer
 */
function setSKRoot(root: SKElement) {
  uiTreeRoot = root;
  if (root) {
    mouseDispatcher = new MouseDispatcher(root);
  } else mouseDispatcher = null;
}

// flag to tell SimpleKit to run layout process next frame
let layoutDirty = false;

function layoutRoot() {
  if (uiTreeRoot && gc) {
    // make sure root fills canvas
    uiTreeRoot.x = 0;
    uiTreeRoot.y = 0;
    uiTreeRoot.box.margin = 0; // no margin allowed on root
    uiTreeRoot.box.width = gc.canvas.width;
    uiTreeRoot.box.height = gc.canvas.height;
    // layout root and all children
    uiTreeRoot.doLayout();
    layoutDirty = false;
  }
}

// widgets will call this to tell SimpleKit to run layout process next frame
function invalidateLayout() {
  // console.log(`invalidateLayout`);
  layoutDirty = true;
}

/**
 * Must be called to once to start the SimpleKit run loop. It adds a
 * single canvas to the body for drawing and creates
 * the simulated windowing system to call the SimpleKit run loop
 * @returns true if successful, false otherwise
 */
function startSimpleKit(): boolean {
  console.info(`🧰 SimpleKit *Imperative UI Mode* startup`);

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
  createWindowingSystem(runloop);

  return true;
}
