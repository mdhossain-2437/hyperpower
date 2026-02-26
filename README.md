
# Hyperpower

Particle effects extension for **VS Code** and **Hyper terminal** — type with power!

![hyper](https://cloud.githubusercontent.com/assets/13041/16820268/13c9bfe6-4905-11e6-8fe4-baf8fc8d9293.gif)

## Features

- ⚡ **Particle effects** — Colorful particles spawn at your cursor as you type
- 🔥 **WOW Mode** — Toggle enhanced particles with more colors and symbols
- 🎯 **Status bar control** — Click the status bar to toggle WOW mode
- 🎨 **Multiple particle styles** — Circles, diamonds, squares, stars and more

## VS Code Extension

### Install from Source

```bash
npm install
npm run compile
```

Then press `F5` in VS Code to launch the Extension Development Host with Hyperpower active.

### Package as VSIX

```bash
npm install -g @vscode/vsce
vsce package
```

Then install the generated `.vsix` file in VS Code via **Extensions > Install from VSIX**.

### Commands

| Command | Description |
|---------|-------------|
| `Hyperpower: Toggle WOW Mode` | Toggle enhanced particle effects |
| `Hyperpower: Enable` | Enable particle effects |
| `Hyperpower: Disable` | Disable particle effects |

## Hyper Terminal Plugin

Install [Hyper](https://hyper.is) and add `hyperpower`
to `plugins` in `~/.hyper.js`.

The Hyper plugin entry point is `index.js`. Type `wow` at the terminal prompt to toggle WOW mode with screen shaking.

## Credits

Based on [`power-mode`](https://atom.io/packages/power-mode) and
[`rage-power`](https://github.com/itszero/rage-power).

## License

MIT
