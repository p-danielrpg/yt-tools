const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const ytdl = require('ytdl-core');
//var appHttp = require('http').createServer(app);  
const { createServer } = require("http");
//var io = require('socket.io').listen(appHttp);
const { Server } = require("socket.io");
const { callbackify } = require('util');
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
io.on("connection", (socket) => {
  //console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.on("downloadPressed", (arg, callback) => {
        console.log("pressed " + arg);
        callback({
            text: "FINISHED HERE"
        });
        //sendBack(arg);
        //socket.emit("sendText", "testt test");
    })

    
    // function sendBack(argu) {
    //     console.log("it was sent back");
    //     io.sockets.emit("sendText", argu);
    // }   

});




httpServer.listen(PORT);

// Get the request to render the INDEX.HTML
app.get('/', (req, res) => {
//   res
//     .status(200)
//     .send('Hello server is running')
//     .end();
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  var subName = req.body.email;
//   res.set('content-disposition', `attachment; filename="${ req.body.subName }"`);
  // download youtube video
  let download = ytdl(subName).pipe(fs.createWriteStream('video2.mp3'));
  let videoInfo = ytdl.getInfo(subName);

  download.on("finish", ()=> {
    let videoTitle = 0;
    videoInfo.then(function(result) {
        return result.videoDetails.title;
       // videoTitle = result.videoDetails.title;
    }).then(function(neww) {
        videoTitle = neww;
        res.download('video2.mp3', String(videoTitle)+".mp3");
        

    })

    // res.writeHead(200, {
    //     "Content-Type": "audio/mpeg",
    //     "Content-Disposition" : "attachment; filename=" + 
    //     "audioNow.mp3"   });
    //"Content-Type": "audio/mpeg";
    console.log("finished stream");
  })

  //console.log(download);
 //res.send("Hello " + subName + ", Thank you for subcribing. ");
});







// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
//   console.log('Press Ctrl+C to quit.');
// });