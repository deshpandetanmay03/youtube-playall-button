const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, '..', 'output', 'chrome');
const SRC_DIR = path.join(__dirname, '..', 'chrome');
const EXT_NAME = 'youtube-playall-button';
const VERSION = require('../package.json').version;

// Clean and create output directory
fs.emptyDirSync(DIST_DIR);

// Copy files to output directory
fs.copySync(SRC_DIR, DIST_DIR);

// Generate CRX file (requires Chrome)
try {
  const crxFile = path.join(__dirname, '..', 'output', `${EXT_NAME}-${VERSION}.crx`);
  const keyFile = path.join(__dirname, '..', 'key.pem');
  
  // Create a key if it doesn't exist
  if (!fs.existsSync(keyFile)) {
    console.log('Creating new private key...');
    execSync(`openssl genrsa -out "${keyFile}" 2048`);
  }
  
  console.log('Creating CRX file...');
  execSync(`npx crx pack "${DIST_DIR}" -o "${crxFile}" -p "${keyFile}"`);
  console.log(`CRX file created: ${crxFile}`);
} catch (error) {
  console.warn('Could not create CRX file. Make sure you have Chrome installed and the crx package available.');
  console.warn('Falling back to ZIP file.');
}

// Create ZIP file
const zipFile = path.join(__dirname, '..', 'output', `${EXT_NAME}-${VERSION}.zip`);
const output = fs.createWriteStream(zipFile);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  console.log(`ZIP file created: ${zipFile} (${archive.pointer()} bytes)`);
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

console.log('Chrome extension build complete!');
