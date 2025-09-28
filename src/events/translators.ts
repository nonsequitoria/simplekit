import type { FundamentalEvent } from "../windowing-system";
import { distance } from "../utility";

// SimpleKit events
import {
  SKEvent,
  SKMouseEvent,
  SKKeyboardEvent,
  SKResizeEvent,
} from "./events";

export type EventTranslator = {
  update: (fe: FundamentalEvent) => SKEvent | undefined;
};

export const fundamentalTranslator = {
  update(fe: FundamentalEvent): SKEvent | undefined {
    switch (fe.type) {
      case "mousedown":
      case "mouseup":
      case "mousemove":
        const { x = 0, y = 0 } = fe; // pull x and y with default 0
        return new SKMouseEvent(fe.type, fe.timeStamp, x, y);
        break;
      case "keydown":
      case "keyup":
        return new SKKeyboardEvent(fe.type, fe.timeStamp, fe.key);
        break;
      case "resize":
        return new SKResizeEvent(
          fe.type,
          fe.timeStamp,
          document.body.clientWidth,
          document.body.clientHeight
        );
      // null events are used for translators to check time
      // but, we don't want to actually emit them
      case "null":
        return;
      default:
        console.warn(`unhandled fundamental event type ${fe.type}`);
        return new SKEvent(fe.type, fe.timeStamp);
    }
  },
};

export const clickTranslator = {
  state: "IDLE",
  // parameters for transitions
  movementThreshold: 10,
  timeThreshold: 800, // milliseconds
  // for tracking thresholds
  startX: 0,
  startY: 0,
  startTime: 0,

  // returns a click event if found
  update(fe: FundamentalEvent): SKMouseEvent | undefined {
    // only applies to fundamental mouse events (those with x,y)
    if (fe.x === undefined || fe.y === undefined) {
      return;
    }

    switch (this.state) {
      case "IDLE":
        if (fe.type == "mousedown") {
          this.state = "DOWN";
          this.startX = fe.x;
          this.startY = fe.y;
          this.startTime = fe.timeStamp;
        }
        break;

      case "DOWN":
        if (fe.timeStamp - this.startTime > this.timeThreshold) {
          this.state = "IDLE";
        } else if (
          distance(fe.x, fe.y, this.startX, this.startY) >
          this.movementThreshold
        ) {
          this.state = "IDLE";
        } else if (fe.type == "mouseup") {
          this.state = "IDLE";
          return new SKMouseEvent("click", fe.timeStamp, fe.x, fe.y);
        }
        break;
    }
    return;
  },
};

export const dblclickTranslator = {
  // internal click translator for dblclick
  // note this is a copy of main clickTranslator object
  internalClickTranslator: { ...clickTranslator },

  state: "IDLE",
  // parameters for transitions
  timeThreshold: 500, // milliseconds
  // for tracking thresholds
  startTime: 0,

  // returns a dblclick event if found
  // needs a click event as well, the fe event is for time
  update(fe: FundamentalEvent): SKMouseEvent | undefined {
    // only applies to fundamental mouse events (those with x,y)
    if (fe.x === undefined || fe.y === undefined) {
      return;
    }

    // update internal clickTranslator
    const e = this.internalClickTranslator.update(fe);

    switch (this.state) {
      case "IDLE":
        if (e && e.type == "click") {
          this.state = "READY";
          this.startTime = e.timeStamp;
        }
        break;

      case "READY":
        if (fe.timeStamp - this.startTime > this.timeThreshold) {
          this.state = "IDLE";
        } else if (e && e.type == "click") {
          this.state = "IDLE";
          return new SKMouseEvent(
            "dblclick",
            fe.timeStamp,
            fe.x,
            fe.y
          );
        }
        break;
    }
    return;
  },
};

export const dragTranslator = {
  state: "IDLE",
  // parameters for transitions
  movementThreshold: 10,
  // for tracking thresholds
  startX: 0,
  startY: 0,

  // returns a drag event if found
  update(fe: FundamentalEvent): SKMouseEvent | undefined {
    // only applies to fundamental mouse events (those with x,y)
    if (fe.x === undefined || fe.y === undefined) {
      return;
    }

    switch (this.state) {
      case "IDLE":
        if (fe.type == "mousedown") {
          this.state = "DOWN";
          this.startX = fe.x;
          this.startY = fe.y;
        }
        break;

      case "DOWN":
        if (fe.type == "mouseup") {
          this.state = "IDLE";
        } else if (
          fe.type == "mousemove" &&
          distance(fe.x, fe.y, this.startX, this.startY) >
            this.movementThreshold
        ) {
          this.state = "DRAG";
          return new SKMouseEvent(
            "dragstart",
            fe.timeStamp,
            fe.x,
            fe.y
          );
        }

        break;

      case "DRAG":
        if (fe.type == "mousemove") {
          return new SKMouseEvent("drag", fe.timeStamp, fe.x, fe.y);
        } else if (fe.type == "mouseup") {
          this.state = "IDLE";
          return new SKMouseEvent(
            "dragend",
            fe.timeStamp,
            fe.x,
            fe.y
          );
        }

        break;
    }
    return;
  },
};
