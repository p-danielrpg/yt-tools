const express = require('express');
const bodyParser = require("body-parser");
const ytdl = require("youtube-dl.js");
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
 res.send("Hello " + subName + ", Thank you for subcribing. ");
});



// ------------------
// Get youtube info
let url = "https://www.youtube.com/watch?v=xEbNMPCYlOM",
    filename = `${new Date().getTime()}.%(ext)s`,
    args = ["-o", filename, "-x", "--audio-format=mp3", "--restrict-filenames", "--external-downloader=ffmpeg", "--audio-quality=96k"];
 
ytdl(url, args)
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error(err);
});
	



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});