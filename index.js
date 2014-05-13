var express = require('express');
var fork = require("child_process")
var app = express();
var pump = require('pump');

var address= 'rtsp://admin:admin@83.166.215.254:554/cam/realmonitor?channel=';

app.get('/cam/:index', function(req, res){

  res.writeHead(200,{'Content-Type':'video/mp4'});
  var cameraStream = fork.spawn("./ffmpeg", [
                        "-i",address+req.params.index,
                        "-codec:v", "copy",
                        "-bufsize","100k",
                        "-threads","5",
                        "-codec:a","libfdk_aac",
                        "-f","mp4",
                        "-movflags","frag_keyframe",
                        "-"
                        ],  {detached: false});
  pump(cameraStream.stdout,res);
  res.on("close",function(){
      cameraStream.kill();
  });

});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
