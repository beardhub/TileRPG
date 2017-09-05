var express = require('express');
var app = express();
var http = require('http').Server(app);
//console.log(http);
http.transports = [ 'websocket' ];
var io = require('socket.io')(http);
io.set('transports', ['websocket']);//============
//var io = require('socket.io', { rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] })(http);//.listen(8080);
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
/*io.configure(function () {
	io.set('transports', ['flashsocket', 'xhr-polling']);
});*/
setInterval(function(){
	var clients = findClientsSocket();
	
},1000);

function sendupdates(){
	//var clients = findClientsSocket();
	//var clients = Object.keys(io.sockets.sockets);
	var plays = [];
	for (var p in players)
		if (p !== "sets" && players[p].online)
			plays.push(players[p]);
	io.emit("updateworld",worlddata);
	io.emit("getplayers",plays);
	/*	return;
	for (var i = 0; i < clients.length; i++){
		clients[i].emit("updateworld",worlddata);
		//var others = [];
		//for (var j = 0; j < clients.length; j++)
		//	if (j !== i)
		//		others.push(clients[j]);
		clients[i].emit("getplayers",plays);
	}*/
}
//setInterval(sendupdates,100);
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
		console.log(username);
		io.emit("playerleft",username);
	})
	socket.on("trylogin", function(data){
		console.log(data.u);
		console.log(data.p);
		if (typeof accounts[data.u] == "undefined" || accounts[data.u].password !== data.p)
		return socket.emit("failedlogin");
		//accounts[data.u] = {password:data.p};
		socket.emit("enterserver",{p:players[data.u],w:worlddata});
		socket.emit("updateworld",worlddata);
		io.emit("playerjoined",data.u);
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
		if (!players[data.username])	return;
		players[data.username].loc = data.loc;
		players[data.username].saying = data.saying;
	});
	socket.on("regchanges",function(data){
		for (var i = 0; i < data.length; i++)
			worlddata.changes[data[i].key] = data[i].changes;
		//data.unshift(worlddata.ups)
		io.emit("updatechunks",data)
		worlddata.ups++;
		//console.log(worlddata.changes[data.key]);
		//if (worlddata.changed.indexOf(data.key) == -1)
		//	worlddata.changed.push(data.key);
	});
	socket.on("sendchanges",function(data){
		//			not used
		/*if (
		JSON.stringify(data) == 
		JSON.stringify(worlddata.changes)
		)	return console.log("same");
		*/worlddata.changes = data;
		worlddata.ups++;
		//sendupdates();
	});
	/*socket.on("confirmactive",function(username){
		players[username].online = true;
	});*/
	socket.on("updateme",function(){
		/*for (var p in players)
			if (p !== "sets")// && players[p].online)
				players[p].online = false;
			//plays.push(players[p]);
		io.emit("pingactive");*/
		
		
		
		var plays = [];
		for (var p in players)
			if (p !== "sets" && players[p].online)
				plays.push(players[p]);
		//socket.emit("updateworld",worlddata);
		socket.emit("getplayers",plays);
		//socket.emit("updateself",plays);
	});
	socket.on("givepriv",function(data){
		if (players[data.u])
			for (var i = 0; i < data.p.length; i++)
				players[data.u].privileges.push(data.p[i]);
		/*var plays = [];
		for (var p in players)
			if (p !== "sets" && players[p].online)
				//plays.push(players[p]);
				plays.push({username:players[p].username,privileges:players[p].privileges});*/
		//console.log(players[data.u]);
		io.emit("changeme",{username:data.u,privileges:players[data.u].privileges});
	});
	socket.on("removepriv",function(data){
		if (players[data.u])
			for (var i = 0; i < data.p.length; i++){
				var ps = players[data.u].privileges;
				ps.splice(ps.indexOf(data.p[i]),1);
			}
		io.emit("changeme",{username:data.u,privileges:players[data.u].privileges});
				//players[data.u].privileges.splice()(data.p[i]);
		/*var plays = [];
		for (var p in players)
			if (p !== "sets" && players[p].online)
				plays.push(players[p]);
		io.emit("changeme",plays);*/
	});
	/*socket.on("removeplayer",function(username){
		if (players[username])
			players[username].online = false;
	});*/
	
	/*socket.on("leave",function(data){
		players[data.playername] = data.playerdata;
	});*/
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(port, function(){
console.log('listening on '+port);
});