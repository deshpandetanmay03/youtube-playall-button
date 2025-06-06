# Building the Extensions

This guide explains how to build the Chrome and Firefox extensions.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- For Chrome extension building (optional):
  - Google Chrome browser
  - `crx` npm package (installed globally)
  - OpenSSL (for generating keys)

## Installation

1. Install the required dependencies:
   ```bash
   npm install
   ```

2. (Optional) Install the CRX tool globally for Chrome extension packaging:
   ```bash
   npm install -g crx
   ```

## Building Extensions

### Build Both Extensions

```bash
npm run build
```

This will create both Chrome and Firefox extensions in the `output` directory.

### Build Chrome Extension Only

```bash
npm run build:chrome
```

This will create:
- `output/chrome/` - Unpacked extension directory
- `output/youtube-playall-button-{version}.crx` - Packed Chrome extension (if Chrome is installed)
- `output/youtube-playall-button-{version}.zip` - Packed extension for manual installation

### Build Firefox Extension Only

```bash
npm run build:firefox
```

This will create:
- `output/firefox/` - Unpacked extension directory
- `output/youtube-playall-button-{version}.xpi` - Packed Firefox extension

## Testing the Extensions

### Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked" and select the `output/chrome` directory

### Firefox

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file in the `output/firefox` directory

## Cleaning Up

To remove all build artifacts:

```bash
npm run clean
```

This will delete the `output` directory and all its contents.
