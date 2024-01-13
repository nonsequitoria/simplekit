import { FundamentalEvent } from ".";

// /**
//  * Coalesces some fundamental events into a single event of the same type
//  * @param events the array of events to coalesce (mutates the list)
//  *  */
// export function coalesceEvents(
//   events: FundamentalEvent[],
//   eventTypes = ["mousemove", "resize"]
// ): FundamentalEvent[] {
//   let coalescedEvents: FundamentalEvent[] = [];
//   events.forEach((e) => {
//     if (e.type in eventTypes) {
//       const i = coalescedEvents.findIndex((e) => e.type in eventTypes);
//       if (i > -1) {
//         coalescedEvents[i] = e;
//       } else {
//         coalescedEvents.push(e);
//       }
//     } else {
//       coalescedEvents.push(e);
//     }
//   });

//   return coalescedEvents;
// }

/**
 * Coalesces some fundamental events into a single event of the same type
 * @param events the array of events to coalesce (mutates the list)
 *  */
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
