#!/usr/bin/env node

// Imports
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');


// Run 'npm run build' to compile the production vue.js project
const buildCmd = spawn('npm', ['run', 'build']);
buildCmd.stdout.on('data', data => console.log(data.toString()));
buildCmd.stderr.on('data', data => console.log(data.toString()));
buildCmd.on('error', err => handleErr(err));
buildCmd.on('exit', exitCode => {
  if (exitCode !== 0) handleErr();

  // Read the compiled index.html file from the /dist directory
  fs.readFile('./dist/index.html', 'utf-8', function(err, data) {
    if (err) handleErr(err);

    // Use Regex to make file imports relative to index.html
    const cssRe = /(href=")\/.*?\//g;
    const jsRe = /(src=")\/.*?\//g;
    const result = data.replace(cssRe, '$1./').replace(jsRe, '$1./');

    // Update HTML
    fs.writeFile('./dist/index.html', result, 'utf-8', function(err) {
      if (err) handleErr(err);

      // Rename /dist to /docs because gh-pages can be set to look for /docs
      const src = path.join(process.cwd(), 'dist');
      const dest = path.join(process.cwd(), 'docs');
      copyDir(src, dest, () => {

        // Remove old /dist directory
        fs.rmSync('./dist', { recursive: true, force: true });

        // Finish
        success();
      });
    });
  });
});


// Prints error and help messages to the console.
function handleErr(err, msgOnly) {
  if (!err) err = "";
  else err += "\n";
  err += `\nFor${msgOnly ? ' more' : ''} help using vue-easy-deploy, please visit:\n\x1b[36mhttps://github.com/jacobjanak/vue-easy-deploy/blob/main/README.md\x1b[0m\n`;
  if (msgOnly) console.log(err);
  else throw err;
}


// Prints success message to console
function success() {
  handleErr(`
\x1b[32mReady to deploy to GitHub pages!\x1b[0m

\x1b[1mNext steps:\x1b[0m
                
  1. Simply git add, commit, and push as you normally would.


\x1b[1mIf this is your first time deploying this repo:\x1b[0m
                
  2. Go to your GitHub pages settings (replace values between brackets):
  \x1b[36mhttps://github.com/[USER NAME]/[REPO NAME]/settings/pages\x1b[0m

  3. Set GitHub pages to deploy from the /docs folder.\n`, true);
}


// Read all files in a directory and call copyAllFiles
function copyDir(src, dest, cb=false) {
  fs.mkdir(dest, { recursive: true }, err => {
    if (err) handleErr(err);
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) handleErr(err);
      copyAllFiles(src, dest, files, 0, cb);
    });
  });
}


// Copies all files in a list
function copyAllFiles(src, dest, files, i, cb=false) {
  const srcPath = path.join(src, files[i].name);
  const destPath = path.join(dest, files[i].name);
  if (files[i].isDirectory()) {
    copyDir(srcPath, destPath, () => {
      if (i === files.length - 1) cb();
      else copyAllFiles(src, dest, files, i+1, cb);
    });
  } else {
    fs.copyFile(srcPath, destPath, err => {
      if (err) handleErr(err);
      if (i === files.length - 1) cb();
      else copyAllFiles(src, dest, files, i+1, cb);
    });
  }
}
