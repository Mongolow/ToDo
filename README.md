# ToDo (Electron)

A simple desktop ToDo application built with Electron and Electron Forge.

## Features

- Add tasks
- Mark tasks as `Done` / `Pending`
- Delete tasks
- View task details in a separate window
- Edit task title and description
- Export tasks to a JSON file
- Import tasks from a JSON file
- Local data storage in `localStorage` (no database)

## Requirements

- Node.js (LTS recommended)
- npm
- Linux / Windows / macOS

## Installation

```bash
npm install
```

## Run in Development Mode

```bash
npm start
```

This launches the Electron window with the ToDo interface.

## Build / Package

### Package the App (without installer)

```bash
npm run package
```

### Generate Installer Packages

```bash
npm run make
```

Build artifacts are generated in the `out/` directory.

## Available npm Scripts

- `npm start` - run the app in development mode
- `npm run package` - package the app
- `npm run make` - create distributable artifacts
- `npm run publish` - publish build artifacts (if configured)
- `npm run lint` - placeholder (`No linting configured`)

## Project Structure

```text
.
├── forge.config.js
├── package.json
└── src/
    ├── index.js         # Electron main process
    ├── preload.js       # secure IPC bridge (window.api)
    ├── index.html       # main app view
    ├── task_desc.html   # task details window
    ├── scripts.js       # task logic (CRUD + import/export)
    └── index.css        # styles
```

## Notes

- Task data is stored locally in `localStorage`.
- Import supports either a JSON array of tasks or an object containing a `tasks` array.
- DevTools are not opened automatically on startup.

## Author and License

- Author: Michał Gniadek
- License: MIT
