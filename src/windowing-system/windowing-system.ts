/**
 * Creates a simulated window system event loop
 * @module create-loop
 *
 */

export interface FundamentalEvent {
  type:
    | "resize"
    | "keydown"
    | "keyup"
    | "mousemove"
    | "mousedown"
    | "mouseup"
    | "null";
  timeStamp: DOMHighResTimeStamp;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  key?: string;
}

function createFundamentalEvent(domEvent: Event): FundamentalEvent | undefined {
  if (domEvent.type == "resize") {
    return {
      type: domEvent.type,
      timeStamp: domEvent.timeStamp,
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    };
  } else if (
    domEvent.type == "mouseup" ||
    domEvent.type == "mousedown" ||
    domEvent.type == "mousemove"
  ) {
    const me = domEvent as MouseEvent;
    return {
      type: domEvent.type,
      timeStamp: domEvent.timeStamp,
      x: me.x,
      y: me.y,
    };
  } else if (domEvent.type == "keyup" || domEvent.type == "keydown") {
    const ke = domEvent as KeyboardEvent;
    if (ke.repeat) return;
    return {
      type: domEvent.type,
      timeStamp: domEvent.timeStamp,
      key: ke.key,
    };
  } else {
    console.warn(`event ${domEvent.type} not supported as FundamentalEvent`);
    return;
  }
}

export type RunLoopHandler = (
  eventQueue: FundamentalEvent[],
  time: DOMHighResTimeStamp
) => void;

/**
 * Creates a simulated windowing system event loop
 * @param {RunLoopHandler} loopFunction - Callback function on each loop iteration.
 */
export function createWindowingSystem(loopFunction: RunLoopHandler) {
  const options = {
    coalesceEvents: false,
    log: false,
  };

  // setup fundamental event queue
  const eventQueue: FundamentalEvent[] = [];

  // callback used for all events we want to add to the queue
  function saveEvent(domEvent: Event) {
    const fundamentalEvent = createFundamentalEvent(domEvent);

    if (!fundamentalEvent) {
      return;
    }

    // coalesce frequent continuous events
    if (options.coalesceEvents) {
      const i = eventQueue.findIndex(
        (e) => e.type == "mousemove" || e.type == "resize"
      );
      if (i > -1) {
        eventQueue[i] = fundamentalEvent;
      } else {
        eventQueue.push(fundamentalEvent);
      }
      if (options.log) {
        console.log(
          `enqueue ${fundamentalEvent.type}, ${eventQueue.length} ${
            i < 0 ? "(new)" : i
          }`
        );
      }
    } else {
      eventQueue.push(fundamentalEvent);
    }
  }

  // listen for "fundamental events" to simulate a low-level
  // system event queue in a windowing system
  window.addEventListener("mousedown", saveEvent);
  window.addEventListener("mouseup", saveEvent);
  window.addEventListener("mousemove", saveEvent);
  window.addEventListener("keydown", saveEvent);
  window.addEventListener("keyup", saveEvent);
  window.addEventListener("resize", saveEvent);

  // push a resize event to send when toolkit loop first run
  const initialResizeEvent = createFundamentalEvent(new Event("resize"));
  if (initialResizeEvent) eventQueue.push(initialResizeEvent);

  // the simulated windowing system event loop
  function loop(time: DOMHighResTimeStamp) {
    loopFunction(eventQueue, time);
    // schedule to run again
    window.requestAnimationFrame(loop);
  }
  // start it
  window.requestAnimationFrame(loop);
}
