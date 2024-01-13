import { SKMouseEvent } from "../events";
import { SKElement, SKContainer } from "../widget";

function copySKMouseEvent(me: SKMouseEvent, type: string = ""): SKMouseEvent {
  return {
    timeStamp: me.timeStamp,
    type: type || me.type,
    x: me.x,
    y: me.y,
  } as SKMouseEvent;
}

export class MouseDispatcher {
  // root of UI widget tree
  constructor(public root: SKElement) {}

  mouseFocus: SKElement | null = null;

  lastElement: SKElement | null = null;

  // returns list of elements under mouse (from back to front)
  buildTargetRoute(mx: number, my: number, element: SKElement): SKElement[] {
    const route: SKElement[] = [];
    // only SKContainers have children to traverse
    if ("children" in element) {
      (element as SKContainer).children.forEach((child) =>
        route.push(
          ...this.buildTargetRoute(
            mx - element.x - element.box.padding - element.box.margin, // translate to child coord system
            my - element.y - element.box.padding - element.box.margin,
            child
          )
        )
      );
    }

    if (element.hittest(mx, my)) {
      return [element, ...route];
    } else {
      return route;
    }
  }

  dispatch(me: SKMouseEvent, root?: SKElement) {
    if (!root) root = this.root;
    if (this.mouseFocus) {
      this.mouseFocus.handleMouseEvent(me);
      if (me.type == "mouseup") this.mouseFocus = null;
    } else {
      const route = this.buildTargetRoute(me.x, me.y, root).reverse();
      route.every((element) => {
        if (me.type == "mousemove" && this.lastElement != element) {
          // console.log(`exit ${this.lastElement}`);
          if (this.lastElement) {
            this.lastElement.handleMouseEvent(
              copySKMouseEvent(me, "mouseexit")
            );
          }
          // console.log(`enter ${element}`);
          element.handleMouseEvent(copySKMouseEvent(me, "mouseenter"));
          this.lastElement = element;
        }

        const handled = element.handleMouseEvent(me);
        if (handled && me.type == "mousedown") this.mouseFocus = element;
        return handled;
      });
      if (route.length == 0 && this.lastElement) {
        // console.log(`exit ${lastElement}`);
        this.lastElement.handleMouseEvent(copySKMouseEvent(me, "mouseexit"));
        // console.log(`enter ${null}`);
        this.lastElement = null;
      }
    }
  }
}
