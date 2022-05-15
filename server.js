const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const ytdl = require('ytdl-core'); 
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);  
const io = new Server(httpServer, {
    cors: {
        origin: "https://localhost",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});


// Start the server
const PORT = process.env.PORT || 8080;

// Let's make the CSS work by making a static page 
app.use(express.static(__dirname));

// Use the body parser to our app 
app.use(bodyParser.urlencoded({ extended: true }))


// Listen for port and connect to socket
let isDownloadFinished = false;
let sockt = 0;
io.on("connection", (socket) => {
    socket.on("downloadPressed", (arg, callback) => {
        console.log("pressed " + arg);
        callback({
            text: "FINISHED HERE"
        });
    })

    sockt = socket.id;

    socket.on("videoQue", (arg) => {
      let videoInfo = ytdl.getInfo(arg);
      videoInfo.then(function(result) {
        return [result.videoDetails.title, result.videoDetails.lengthSeconds, result.videoDetails.thumbnails[result.videoDetails.thumbnails.length - 1]];
      }).then(function(finalResult) {
        videoTitle = finalResult;
        socket.emit("sendText", videoTitle)
      });
   })

  

});


io.on("disconnect", function () {
  console.log("client disconnected");
})


// Get the request to render the INDEX.HTML
app.get('/', (req, res) => {
  res.render(__dirname + "/index");
});



app.post("/", (req, res) => {
  var subName = req.body.email;
  // download youtube video
  let download = ytdl(subName).pipe(fs.createWriteStream('video2.mp3'));
  let videoInfo = ytdl.getInfo(subName);
  download.on("finish", ()=> {
    let videoTitle = 0;
    videoInfo.then(function(result) {
      return result.videoDetails.title;
    }).then(function(neww) {
      videoTitle = neww;
      console.log("still loaded until here " + sockt);
      res.download('video2.mp3', String(videoTitle)+".mp3");
    })
    })
  });
  
  
  
  httpServer.listen(PORT);