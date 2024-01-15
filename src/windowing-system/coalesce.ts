import { FundamentalEvent } from ".";

/**
 * Coalesces some fundamental events into a single event of the same type
 * @param events the array of events to coalesce (mutates the list)
 */
export function coalesceEvents(
  events: FundamentalEvent[],
  eventTypes = ["mousemove", "resize"]
) {
  const original = [...events];
  events.length = 0;
  original.forEach((e) => {
    if (e.type in eventTypes) {
      const i = events.findIndex((ee) => ee.type in eventTypes);
      if (i > -1) {
        events[i] = e;
      } else {
        events.push(e);
      }
    } else {
      events.push(e);
    }
  });
}
//TODO this function implementation could be improved
