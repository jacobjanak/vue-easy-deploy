const fs = require('fs')

// Read the build index.html file from the /dist folder
fs.readFile('./dist/index.html', 'utf-8', function(err, data) {
  if (err) throw err;

  // all the parenthese can be removed except the first group
  // $1 returns the first group
  // probably don't need m for multiline
  var newValue = data.replace(/(href=")(\/)(.*?)(\/)/gm, $1./);

  fs.writeFile('filelistAsync.txt', newValue, 'utf-8', function(err) {
    if (err) throw err;
    console.log('filelistAsync complete')
  })
})

// Rename /dist to /docs because gh-pages can be set to look for /docs
fs.rename('./dist', './docs', function(err) {
  if (err) throw err;
})