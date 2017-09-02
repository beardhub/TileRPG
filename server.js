var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
app.use(express.static(__dirname));

var worlddata = {
	seed:"zack is cool",
	changed:[],
	changes:{}
}
var players = {}
var accounts = {}

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit("initworld",worlddata);
  
  socket.on("gooffline",function(){
	socket.disconnect();  
  })
  socket.on("trylogin", function(data){
	  console.log(data.u);
	  console.log(data.p);
	 if (typeof accounts[data.u] == "undefined" || accounts[data.u].password !== data.p)
		 return socket.emit("failedlogin");
	 //accounts[data.u] = {password:data.p};
	 socket.emit("enterserver",{p:players[data.u],w:worlddata});
  });
  socket.on("register",function(data){
	 if (typeof accounts[data.u] !== "undefined")
		 return socket.emit("usertaken");
	 accounts[data.u] = {password:data.p};
	 socket.emit("accountregistered",data);
  });
  socket.on("saveplayer",function(data){
	 players[data.username] = data;
  });
  
  
  
  
  
  socket.on("leave",function(data){
	  players[data.playername] = data.playerdata;
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

http.listen(port, function(){
  console.log('listening on '+port);
});