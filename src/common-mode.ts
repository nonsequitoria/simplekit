/**
 * Checks if HTML document hosting SimpleKit is setup correctly
 * @returns true if good, false otherwise
 */
export function checkHtml() {
  let isGood = true;
  // document body checks
  if (document.body.children.length !== 1) {
    console.error(
      `document body has ${document.body.children.length} children, expecting 1`
    );
    isGood = false;
  }
  if (!document.body.querySelector("body>script")) {
    console.error("document body must have a script");
    isGood = false;
  }
  // document head check
  if (document.head.querySelector("link, style")) {
    console.error("document head must not have link or style tags");
    isGood = false;
  }
  return isGood;
}

export function setupCanvas(colour = "whitesmoke") {
  // SimnpleKit will draw everything in this single canvas
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  // set some styles to make it easier to see the canvas
  // canvas.style.setProperty("border", "1px solid blue");
  canvas.style.setProperty("background", colour);

  // set up canvas to fill window
  // sizing method from https://codepen.io/tran2/pen/VYJWZw

  // set style on html
  document.documentElement.style.setProperty("width", "100%");
  document.documentElement.style.setProperty("height", "100%");
  document.documentElement.style.setProperty("margin", "0");
  document.documentElement.style.setProperty("padding", "0");

  // set style on body
  document.body.style.setProperty("width", "100%");
  document.body.style.setProperty("height", "100%");
  document.body.style.setProperty("margin", "0");
  document.body.style.setProperty("padding", "0");

  canvas.style.setProperty("width", "100%");
  canvas.style.setProperty("height", "100%");
  canvas.style.setProperty("display", "block");

  // set to current window
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  // resize when window resizes
  window.addEventListener("resize", () => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  });

  console.info(` created ${canvas.width} by ${canvas.height} canvas`);

  return canvas;
}
