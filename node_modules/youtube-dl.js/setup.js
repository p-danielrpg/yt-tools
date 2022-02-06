const ytdl = require("./index.js");

console.log("Updating youtube-dl binary...");

ytdl.updateBinary()
  .then(output => {
    console.log(`youtube-dl updated to version ${output.version} (${output.time}s)`);
  })
  .catch(console.error);