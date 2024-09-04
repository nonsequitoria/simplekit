/**
 * SimpleKit Canvas Mode
 */

// events
export * from "./events";
// functions
export {
  startSimpleKit,
  setSKDrawCallback,
  setSKEventListener,
  setSKAnimationCallback,
  addSKEventTranslator,
};
export {
  skTime, // global time from windowing system
} from "./windowing-system";
export type {
  FundamentalEvent, // needed for custom translators
} from "./windowing-system";

//  - - - - - - - - - - - - - - - - - - - - - - -

import {
  FundamentalEvent,
  createWindowingSystem,
  coalesceEvents,
} from "./windowing-system";

// simple simulated UI Kit events
import { SKEvent } from "./events";

import {
  EventTranslator,
  fundamentalTranslator,
  clickTranslator,
  dblclickTranslator,
  dragTranslator,
} from "./events";

import { checkHtml, setupCanvas } from "./common";

/**
 * The SimpleKit toolkit run loop (for canvas mode)
 * @param eventQueue fundamental events from simulated windowing system
 * @param time the windowing system frame time
 */
function runLoop(eventQueue: FundamentalEvent[], time: number) {
  // fundamental event queue coalescing
  coalesceEvents(eventQueue);

  // list of translated events to dispatch
  let events: SKEvent[] = [];

  // if no fundamental events, push a single "null" fundamental event
  // this is because some translators trigger events based on time
  // (like long press)
  if (eventQueue.length == 0) {
    eventQueue.push({
      type: "null",
      timeStamp: time,
    } as FundamentalEvent);
  }

  // translate fundamental events to generate SKEvents
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

  // global dispatch all events
  if (eventListener) events.forEach((e) => eventListener(e));

  // update animations
  if (animateCallback) animateCallback(time);

  // draw on canvas
  if (drawCallback) drawCallback(gc);
}

// the single canvas rendering context
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
 * Sets function to draw graphics each frame
 * @param draw the draw callback
 */
function setSKDrawCallback(draw: DrawCallback) {
  drawCallback = draw;
}
type DrawCallback = (gc: CanvasRenderingContext2D) => void;
let drawCallback: DrawCallback;

/**
 * Sets function to update animations each frame
 * @param animate the animation callback
 */
function setSKAnimationCallback(animate: AnimationCallback) {
  animateCallback = animate;
}
type AnimationCallback = (time: number) => void;
let animateCallback: AnimationCallback;

import * as npmPackage from "../package.json";

/**
 * Must be called once to start the SimpleKit run loop. It adds a
 * single canvas to the body for drawing and creates
 * the simulated windowing system to call the SimpleKit run loop
 * @returns { width, height } canvas size if successful, false otherwise
 */
function startSimpleKit(): { width: number; height: number } | false {
  console.info(
    `🧰 SimpleKit v${npmPackage.version} *Canvas Mode* startup`
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

  return { width: gc.canvas.width, height: gc.canvas.height };
}
