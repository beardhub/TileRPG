var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
app.use(express.static(__dirname));
var worlddata = {
	seed:"zack is cool",
	changed:[],
	changes:{},
	ups:0
}
var players = {}
var accounts = {}

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
function sendupdates(){
	var clients = findClientsSocket();
	//var clients = Object.keys(io.sockets.sockets);
	var plays = [];
	for (var p in players)
		if (p !== "sets" && players[p].online)
			plays.push(players[p]);
	for (var i = 0; i < clients.length; i++){
		clients[i].emit("updateworld",worlddata);
		//var others = [];
		//for (var j = 0; j < clients.length; j++)
		//	if (j !== i)
		//		others.push(clients[j]);
		clients[i].emit("getplayers",plays);
	}
}
setInterval(sendupdates,100);
function findClientsSocket(roomId, namespace) {
    var res = []
    // the default namespace is "/"
    , ns = io.of(namespace ||"/");

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId);
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}
io.on('connection', function(socket){
	console.log('a user connected');
	socket.emit("initworld",worlddata);
	socket.on("gooffline",function(username){
		socket.disconnect();
		if (username)
			players[username].online = false;
	})
	socket.on("trylogin", function(data){
		console.log(data.u);
		console.log(data.p);
		if (typeof accounts[data.u] == "undefined" || accounts[data.u].password !== data.p)
		return socket.emit("failedlogin");
		//accounts[data.u] = {password:data.p};
		socket.emit("enterserver",{p:players[data.u],w:worlddata});
		socket.emit("updateworld",worlddata);
		players[data.u].online = true;
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
	socket.on("saveplayerloc",function(data){
		players[data.username].loc = data.loc;
		players[data.username].saying = data.saying;
	});
	socket.on("regchanges",function(data){
		worlddata.changes[data.key] = data.changes;
		worlddata.ups++;
		//console.log(worlddata.changes[data.key]);
		//if (worlddata.changed.indexOf(data.key) == -1)
		//	worlddata.changed.push(data.key);
	});
	socket.on("sendchanges",function(data){
		/*if (
		JSON.stringify(data) == 
		JSON.stringify(worlddata.changes)
		)	return console.log("same");
		*/worlddata.changes = data;
		worlddata.ups++;
		sendupdates();
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