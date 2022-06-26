// Imports
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');


// Run 'npm run build' to compile the production vue.js project
const buildCmd = spawn('npm', ['run', 'build']);
buildCmd.stdout.on('data', data => console.log(data.toString()));
buildCmd.stderr.on('data', data => console.log(data.toString()));
buildCmd.on('error', err => handleError(err));
buildCmd.on('exit', exitCode => {
  if (exitCode !== 0) handleError();

  // Read the compiled index.html file from the /dist directory
  fs.readFile('./dist/index.html', 'utf-8', function(err, data) {
    if (err) handleError(err);

    // Use Regex to make file imports relative to index.html
    const cssRe = /(href=")\/.*?\//g;
    const jsRe = /(src=")\/.*?\//g;
    const result = data.replace(cssRe, '$1./').replace(jsRe, '$1./');

    // Update HTML
    fs.writeFile('./dist/index.html', result, 'utf-8', function(err) {
      if (err) handleError(err);

      // Rename /dist to /docs because gh-pages can be set to look for /docs
      const src = path.join(__dirname, 'dist');
      const dest = path.join(__dirname, 'docs');
      copyDir(src, dest, () => {

        // Remove old /dist directory
        fs.rmSync('./dist', { recursive: true, force: true });

        // Finish
        success();
      });
    });
  });
});


// Prints error messages to console
function handleError(err) {
  if (!err) err = "";
  else err += "\n";
  err += "\nFor help using vue-easy-deploy, please visit:\n\x1b[36mhttps://github.com/jacobjanak/vue-easy-deploy/blob/main/README.md\x1b[0m\n";
  throw err;
}


// Prints success message to console
function success() {
  console.log(`
Ready to deploy!

Next steps:
                
  1. git add, commit, and push as you normally would.

If this is your first time deploying this repo to GitHub pages:
                
  2. go to the pages settings of your repo and set it to deploy from the /docs folder.
    https://github.com/<USER NAME>/<REPO NAME>/settings/pages
  `);
}


// Read all files in a directory and call copyAllFiles
function copyDir(src, dest, cb=false) {
  fs.mkdir(dest, { recursive: true }, err => {
    if (err) handleError(err);
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) handleError(err);
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
      if (err) handleError(err);
      if (i === files.length - 1) cb();
      else copyAllFiles(src, dest, files, i+1, cb);
    });
  }
}
