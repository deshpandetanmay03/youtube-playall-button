const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'output', 'firefox');
const SRC_DIR = path.join(ROOT_DIR, 'firefox');
const EXT_NAME = 'youtube-playall-button';
const VERSION = require('../package.json').version;

// Clean and create output directory
fs.emptyDirSync(DIST_DIR);

// Copy files to output directory
fs.copySync(SRC_DIR, DIST_DIR);

// Copy additional required files
const filesToCopy = [
  'logo.png',
  'Screenshot.png'
];

filesToCopy.forEach(file => {
  const src = path.join(ROOT_DIR, file);
  const dest = path.join(DIST_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  } else {
    console.warn(`Warning: ${file} not found in root directory`);
  }
});

// Fix manifest paths
const manifestPath = path.join(DIST_DIR, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Update icon paths to be relative to the extension root
  if (manifest.icons) {
    Object.keys(manifest.icons).forEach(key => {
      if (manifest.icons[key].startsWith('../')) {
        manifest.icons[key] = manifest.icons[key].replace('../', '');
      }
    });
  }
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

// Create XPI file (Firefox extension package)
const xpiFile = path.join(__dirname, '..', 'output', `${EXT_NAME}-${VERSION}.xpi`);
const output = fs.createWriteStream(xpiFile);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  console.log(`XPI file created: ${xpiFile} (${archive.pointer()} bytes)`);
  
  // Rename .zip to .xpi
  const zipFile = xpiFile.replace(/\.xpi$/, '.zip');
  if (fs.existsSync(zipFile)) {
    fs.renameSync(zipFile, xpiFile);
  }
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Archive warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(DIST_DIR, false);
archive.finalize();

console.log('Firefox extension build complete!');
