import { SKMouseEvent } from "../events";
import { SKElement, SKContainer } from "../widget";

const debug = false;

if (debug) console.log("load dispatch-mouse module");

// returns list of elements under mouse (from back to front)
function buildTargetRoute(
  mx: number,
  my: number,
  element: SKElement
): SKElement[] {
  const route: SKElement[] = [];
  // only SKContainers have children to traverse
  if ("children" in element) {
    (element as SKContainer).children.forEach((child) =>
      route.push(
        ...buildTargetRoute(
          // translate to child coord system
          mx - element.x - element.box.padding - element.box.margin,
          my - element.y - element.box.padding - element.box.margin,
          child
        )
      )
    );
  }

  if (element.hitTest(mx, my)) {
    return [element, ...route];
  } else {
    return route;
  }
}

// dispatch mouse events to elements
export function mouseDispatch(me: SKMouseEvent, root: SKElement) {
  // focus dispatch
  if (focusedElement) {
    focusedElement.handleMouseEvent(me);
    if (me.type == "mouseup") {
      if (debug) console.log(`lost mouse focus ${focusedElement}`);
      focusedElement = null;
    }
    return;
  }

  // positional dispatch
  const route = buildTargetRoute(me.x, me.y, root);

  // update mouseenter/mouseexit
  if (me.type == "mousemove") {
    const topElement = route.slice(-1)[0];
    updateEnterExit(me, topElement);
  }

  // capture
  const stopPropagation = !route.every((element) => {
    const handled = element.handleMouseEventCapture(me);
    return !handled;
  });

  if (stopPropagation) return;

  // bubble
  route.reverse().every((element) => {
    const handled = element.handleMouseEvent(me);
    return !handled;
  });
}

// last element entered by mouse
let lastElementEntered: SKElement | undefined;

// dispatch mouseenter/mouseexit with element mouse is on
function updateEnterExit(me: SKMouseEvent, el?: SKElement) {
  if (el != lastElementEntered) {
    if (lastElementEntered) {
      console.log(`exit ${lastElementEntered}`);
      lastElementEntered.handleMouseEvent({
        ...me,
        type: "mouseexit",
      });
    }
    if (el) {
      console.log(`enter ${el}`);
      el.handleMouseEvent({ ...me, type: "mouseenter" });
    }
    lastElementEntered = el;
  }
}

// mouse focus
let focusedElement: SKElement | null = null;

export function requestMouseFocus(element: SKElement) {
  if (focusedElement == element) return;
  focusedElement = element;
  if (debug) console.log(`gained mouse focus ${focusedElement}`);
}

//#region old dispatch code

// route.every((element) => {
//   if (me.type == "mousemove" && this.lastElement != element) {
//     console.log(`exit ${this.lastElement}`);
//     if (this.lastElement) {
//       this.lastElement.handleMouseEvent(
//         copySKMouseEvent(me, "mouseexit")
//       );
//     }
//     console.log(`enter ${element}`);
//     element.handleMouseEvent(copySKMouseEvent(me, "mouseenter"));
//     this.lastElement = element;
//   }

//   const handled = element.handleMouseEvent(me);

//   if (handled && me.type == "mousedown")
//     this.mouseFocus = element;
//   return handled;
// });

// mouse event outside of any element, send mouseexit
// NOT NEEDED since root element always covers entire canvas
// if (route.length == 0 && this.lastElement) {
//   // console.log(`exit ${lastElement}`);
//   this.lastElement.handleMouseEvent(
//     copySKMouseEvent(me, "mouseexit")
//   );
//   // console.log(`enter ${null}`);
//   this.lastElement = null;
// }

//#endregion
