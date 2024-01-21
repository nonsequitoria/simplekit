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
// TODO: FundamentalEvent type could better

function createFundamentalEvent(
  domEvent: Event
): FundamentalEvent | undefined {
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
    if (ke.repeat) return; // filter out key repeats
    return {
      type: domEvent.type,
      timeStamp: domEvent.timeStamp,
      key: ke.key,
    };
  } else {
    console.warn(
      `event ${domEvent.type} not supported as FundamentalEvent`
    );
    return;
  }
}

/**
 * UI toolkit run loop callback
 * @eventQueue - queue of simulated fundamental events from system,
 * the toolkit run loop must pop events off this shared queue
 * @time - current time from the simulated windowing system
 */
export type RunLoopHandler = (
  eventQueue: FundamentalEvent[],
  time: DOMHighResTimeStamp
) => void;

/**
 * Creates a simulated windowing system event loop
 * @param {RunLoopHandler} runLoop - Callback function for UI toolkit run loop
 */
export function createWindowingSystem(runLoop: RunLoopHandler) {
  // create the fundamental event queue
  // the toolkit run loop must process these events and remove them from
  // this shared queue
  const eventQueue: FundamentalEvent[] = [];

  // callback used for all events we want to add to the queue
  function saveEvent(domEvent: Event) {
    const fundamentalEvent = createFundamentalEvent(domEvent);
    if (!fundamentalEvent) return;
    eventQueue.push(fundamentalEvent);
  }

  // listen for "fundamental events" to simulate a low-level
  // system event queue in a windowing system
  window.addEventListener("mousedown", saveEvent);
  window.addEventListener("mouseup", saveEvent);
  window.addEventListener("mousemove", saveEvent);
  window.addEventListener("keydown", saveEvent);
  window.addEventListener("keyup", saveEvent);
  window.addEventListener("resize", saveEvent);

  // push a resize event to send on first frame of run loop
  const initialResizeEvent = createFundamentalEvent(
    new Event("resize")
  );
  if (initialResizeEvent) eventQueue.push(initialResizeEvent);

  // the simulated windowing system event loop
  function loop(time: DOMHighResTimeStamp) {
    skTime = time;
    runLoop(eventQueue, time);
    // schedule to run again
    window.requestAnimationFrame(loop);
  }
  // start it
  window.requestAnimationFrame(loop);
}

/**
 * Global time from windowing system
 * (when possible, use time from events or animation callback)
 */
export let skTime = 0;
