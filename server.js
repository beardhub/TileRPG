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
setInterval(function(){
	for (var a in accounts)
		if (a !== "sets" && accounts[a].online)
			if (accounts[a].inactivity < 60*.5)
				accounts[a].inactivity++;
			else accounts[a].online = false;
},1000);
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
		if (!accounts[username])
			return;
		if (username)
			accounts[username].online = false;
		console.log(username);
		io.emit("playerleft",players[username]);
	})
	socket.on("trylogin", function(data){
		console.log("username: "+data.username);
		console.log("password: "+data.password);
		if (typeof accounts[data.username] == "undefined" || accounts[data.username].password !== data.password)
		return socket.emit("failedlogin");
		//accounts[data.username] = {password:data.password};
		if (accounts[data.username].online)
		return socket.emit("alreadyonline");
		socket.emit("enterserver",{p:players[data.username],w:worlddata});
		socket.emit("updateworld",worlddata);
		//io.emit("playerjoined",players[data.username]);
		accounts[data.username].online = true;
	});
	socket.on("playerjoined",function(p){
		socket.broadcast.emit("playerjoined",p);
	});
	socket.on("register",function(data){
		if (typeof accounts[data.username] !== "undefined")
		return socket.emit("usertaken");
		accounts[data.username] = {password:data.password,online:false,inactivity:0};
		socket.emit("accountregistered",data);
	});
	socket.on("saveplayer",function(data){
		players[data.username] = data;
	});
	socket.on("saveplayerloc",function(data){
		if (!players[data.username])	return;
		players[data.username].loc = data.loc;
		//players[data.username].saying = data.saying;
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
	socket.on("playerspeak",function(str){
		socket.broadcast.emit("playerspeak",str);
	});
	socket.on("updateme",function(username){
		/*for (var p in players)
			if (p !== "sets")// && players[p].online)
				players[p].online = false;
			//plays.push(players[p]);
		io.emit("pingactive");*/
		//console.log(accounts);
		if (!accounts[username]){
			socket.emit("disconnectplox");
			return;
		}
		accounts[username].inactivity = 0;
		accounts[username].online = true;
		
		var plays = [];
		for (var p in players){
			//console.log(players);
			if (p !== "sets" && accounts[p] && accounts[p].online)
				plays.push(players[p]);
		}
		//console.log(plays);
		//socket.emit("updateworld",worlddata);
		socket.emit("getplayers",plays);
		//socket.emit("updateself",plays);
	});
	socket.on("givepriv",function(data){
		if (players[data.username])
			for (var i = 0; i < data.privs.length; i++)
				players[data.username].privileges.push(data.privs[i]);
		/*var plays = [];
		for (var p in players)
			if (p !== "sets" && players[p].online)
				//plays.push(players[p]);
				plays.push({username:players[p].username,privileges:players[p].privileges});*/
		//console.log(players[data.username]);
		io.emit("changeme",{username:data.username,privileges:players[data.username].privileges});
	});
	socket.on("removepriv",function(data){
		if (players[data.username])
			for (var i = 0; i < data.password.length; i++){
				var ps = players[data.username].privileges;
				ps.splice(ps.indexOf(data.password[i]),1);
			}
		io.emit("changeme",{username:data.username,privileges:players[data.username].privileges});
				//players[data.username].privileges.splice()(data.password[i]);
		/*var plays = [];
		for (var p in players)
			if (p !== "sets" && players[p].online)
				plays.push(players[p]);
		io.emit("changeme",plays);*/
	});
	socket.on("playertarget",function(data){
		socket.broadcast.emit("playertarget",data);
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