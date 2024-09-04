/**
 * Checks that HTML document hosting SimpleKit is setup correctly
 * @returns true if good, false otherwise
 */
export function checkHtml() {
  let isGood = true;
  // only one child in body
  if (document.body.children.length !== 1) {
    console.error(
      `document body has ${document.body.children.length} children, must have 1`
    );
    isGood = false;
  }
  // the single child in body must be a script
  if (!document.querySelector("body>script")) {
    console.error("document body must be a single <script> element");
    isGood = false;
  }
  // no style tags
  if (document.querySelector("link[rel=stylesheet]")) {
    console.error("no <style> tags allowed");
    isGood = false;
  }
  // only script tag in head is vite/client
  const scripts = document.querySelectorAll(
    "head>script"
  ) as NodeListOf<HTMLScriptElement>;
  if (
    scripts.length > 1 ||
    !scripts[0]?.src.includes("vite/client")
  ) {
    console.error(
      "only 1 <script> tag allowed in head for Vite client"
    );
    isGood = false;
  }
  // no link tags other than a favicon link[rel=icon]
  if (document.querySelector("link:not([rel=icon])")) {
    console.error(
      `only <link> allowed is 1 <link rel="icon" ...> in head`
    );
    isGood = false;
  }
  if (!isGood) {
    console.log(
      "🛑 SimpleKit will not run with issues above. Fix HTML page hosting SimpleKit and/or disable browser plug-ins."
    );
  }
  return isGood;
}

export function setupCanvas(colour = "whitesmoke") {
  // SimpleKit will draw everything in this single canvas
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
