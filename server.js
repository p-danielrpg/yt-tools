const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const ytdl = require('ytdl-core');
const app = express();
 
app.use(express.static(__dirname));

// get our app to use body parser 
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
//   res
//     .status(200)
//     .send('Hello server is running')
//     .end();
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  var subName = req.body.email;
  // download youtube video
  ytdl(subName)
  .pipe(fs.createWriteStream('video2.mp3'));
  console.log(ytdl.getInfo(subName));
 res.send("Hello " + subName + ", Thank you for subcribing. ");
});






// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});