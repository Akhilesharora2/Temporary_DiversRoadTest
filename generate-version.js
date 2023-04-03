const fs = require('fs');

const version = Date.now();
fs.writeFileSync('./public/version.txt', version.toString());