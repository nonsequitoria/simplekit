# 🧰 SimpleKit

A very simple user interface toolkit for teaching UI architecture.

- TypeScript and ES Modules only
- Unbundled and uncompressed exports are original source to make it easy to "Go To Definition" and trace

## Setup

There are three main ways to use SimpleKit.

### 1. Official npm package

The npm package is updated less frequently than the GitHub repo, but it's still a good way to use SimpleKit, especially if you already have a TypeScript build process.

Once you have a node project setup, just:

`npm install simplekit`

Notes on this approach:

- Very easy to setup.
- A bit less intuitive to navigate SimpleKit source code since its all in a deep `node_modules/` subfolder.
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

Add SimpleKit as a submodule to your project repo. This way it'll be in a known folder path relative to your project source, a good place to put it is in the root. So instead, of digging into `node_modules/` you can just examine the simplekit folder of your project.

To import, you can just use a relative path like:
`import * from "../../simplekit/src/canvas-mode"`

Or, even better, you can setup your build environment to have a path to the simplekit folder. For example in Vite:

- << (Vite config setup TBD) explain how to setup paths in vite config and typescript config.>>

Git doesn't automatically init and update submodules automatically, so you'll need to do it on command line the first time you clone your main repo.

- << git cloning instructions TBD >>



