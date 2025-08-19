# 🧰 SimpleKit

A very simple user interface toolkit designed specifically for teaching UI architecture concepts.

## What is SimpleKit?

SimpleKit is **not** meant for building production applications. Instead, it's a pedagogical tool used to demonstrate the fundamental mechanics of how user interfaces work in an upper-year computer science course. It was originally designed for [CS 349 "User Interfaces" at the University of Waterloo](https://student.cs.uwaterloo.ca/~cs349).

SimpleKit doesn't use any HTML elements, CSS styling, or browser widgets. A `SKButton` is just a drawing on the canvas, but it behaves like a real button through SimpleKit's event handling, hit testing, and layout systems. This makes the entire UI implementation completely transparent and understandable - you can see exactly how every interaction works.

## Why "Simple"?

The "simple" in SimpleKit refers to its educational purpose:

- **Conceptual clarity**: Each component is stripped down to its essential functionality, making it easier to understand the core concepts
- **Transparent implementation**: No hidden magic or complex abstractions - you can see exactly how everything works
- **Focused learning**: Simulates features that modern user interfaces already provide (like event handling, layout, and widgets) so students can study the underlying mechanics

## What You'll Learn

By studying SimpleKit's code, you'll explore:

- **Canvas rendering** - How graphics are drawn and updated
- **State management** - How UI state flows through the system
- **Event translation and dispatch** - How user input becomes application events
- **Widget architecture** - How reusable components are designed and implemented
- **Layout systems** - How UI elements are positioned and arranged

## Technical Approach

- **TypeScript and ES Modules only** - Modern, type-safe development
- **Unbundled and uncompressed** - Original source code for easy debugging and "Go To Definition"
- **Single HTML canvas rendering** - Everything is drawn on one canvas element, no other HTML/CSS involved

## Modes

SimpleKit provides different modes to progressively introduce UI architecture paradigms and concepts:

### Canvas Mode
**Goal**: Introduction to manual interactive application creation

Canvas mode gives you a blank canvas with a draw loop and global event handler. Apps built in this mode must implement everything from scratch:
- Define shapes (circles, rectangles, etc.)
- Implement hit testing for user interaction
- Create visual feedback for UI elements
- Manage the entire application state

This mode is typically used at the start of the course for initial assignments, helping students understand the fundamental building blocks before moving to higher-level abstractions.

**Example Usage:**

```js
import { startSimpleKit, setSKDrawCallback, setSKEventListener } from "simplekit/canvas-mode";

// Set up your event handler
setSKEventListener((event) => {
    if (event.type === "click") {
    console.log("🎯 Canvas clicked!");
    }
});

// Set up your draw function
setSKDrawCallback((gc) => {
  // Draw your UI elements here 
  gc.fillStyle = "blue";
  gc.fillRect(100, 100, 50, 50);
});

// Start SimpleKit
startSimpleKit();
```

### Imperative Mode
**Goal**: Understanding full toolkit architecture

Imperative mode introduces a complete widget toolkit with:
- **Widget tree** - Hierarchical component structure
- **Event dispatch system** - How events flow through the UI
- **Built-in widgets** - Buttons, labels, text fields, etc.
- **Layout systems** - How components are positioned and arranged

The style follows classic UI toolkits like JavaFX and Microsoft Forms. Students learn how all the parts work together before moving to modern declarative reactive toolkits.

**Example Usage:**

```js
import { startSimpleKit, setSKRoot, SKContainer, SKButton } from "simplekit/imperative-mode";

// Create a container to hold our widgets
const root = new SKContainer();

// Create a button
const button = new SKButton({
  text: "Click me!"
});

// Handle button clicks
button.addEventListener("action", () => {
  console.log("🎉 Button clicked!");
});

// Add button to root
root.addChild(button);

// Set the container as the root widget
setSKRoot(root);

// Start SimpleKit
startSimpleKit();
```

### Declarative Mode (Future)
**Goal**: Modern reactive UI patterns

A bare-bones implementation of a React-like system with:
- Functional components
- Hooks
- Signals for state management

*Coming soon - stay tuned!*

## Setup

There are three main ways to use SimpleKit.

### 1. Official npm package

The npm package is updated less frequently than the GitHub repo, but it's still a good way to use SimpleKit, especially if you already have a TypeScript build process.

Once you have a node project set up, just:

`npm install simplekit`

Notes on this approach:

- Very easy to set up.
- A bit less intuitive to navigate SimpleKit source code since it's all in a deep `node_modules/` subfolder.
- You have to remember to update the package.
- Easy to share the project with someone else, just grab the files and run `npm install`.

### 2. npm link

Clone the SimpleKit repo and install everything with `npm install`.

From the root folder of the SimpleKit repo, run:

`npm link`

This adds a simulated global npm package called "simplekit" (it's literally a symbolic link to the repo folder).

To use the linked package, run the following from your project:

`npm link simplekit`

Now it will behave as though an official npm package was installed.

Notes on this approach:

- It's easier to look at the source code since you can open the SimpleKit repo in a separate VSCode directory.
- If you change something in SimpleKit, sometimes VS Code loses track of the linked package types (imports have red squiggles with warnings the type is `any`). A workaround is to run "TypeScript: Restart TS Server" from the Command Palette.
- You can't easily share your project since a linked global module won't appear in your package.json.

### 3. Git submodule

If your repo is a collection of Node.js projects that all use SimpleKit, and you want them all to use exactly the same version of SimpleKit, then you can add SimpleKit as a *submodule*. This creates a "monorepo" with SimpleKit and all your projects:

```
monorepo/
├── simplekit/
├── project1/
├── project2/
└── project3/
```

#### Set up SimpleKit as a git submodule

To add SimpleKit as a submodule, execute this from the root of your monorepo:

```sh
git submodule add https://github.com/nonsequitoria/simplekit.git simplekit
```

**First-time setup**: Adding a submodule doesn't add all the code, it only adds a link. You need to initialize and update the submodule:

```sh
git submodule init
git submodule update
```

**Streamlined updates**: Add a custom git alias to pull both the main repo and submodules:

```sh
git config --global alias.pullall '!git pull && git submodule update --init --recursive'
```

**Daily workflow**: Update everything with one command:

```sh
git pullall
```

Now SimpleKit code is easily accessible in the `simplekit/` folder, and you'll see it listed in VS Code's source control tab.

#### To use the SimpleKit submodule in a project

With the recommended monorepo directory structure above, it's easy to add SimpleKit to your project's `package.json` dependencies using a relative file path:

```json
{
  "dependencies": {
    "simplekit": "file:../simplekit"
  }
}
```

**Note**: The `file:../simplekit` path assumes your project is in a subdirectory of the monorepo root (like `project1/`, `project2/`, etc.). Adjust the path based on your actual directory structure.

## License

SimpleKit is licensed under the **GNU General Public License v3.0** (GPL-3.0). This means you are free to:

- Use SimpleKit for any purpose
- Study how it works and change it
- Distribute copies
- Distribute modified versions

**Important**: If you distribute a modified version, you must also distribute the source code under the same license.

For the full license text, see the [LICENSE](LICENSE) file in this repository.






