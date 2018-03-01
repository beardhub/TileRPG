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
	seed:"world1",
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
});*
setInterval(function(){
	var clients = findClientsSocket();
	
},1000);
*function sendupdates(){
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
	}*
}*/
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
setInterval(function(){
	//send location
	//return;
	io.emit("getentities",entitydatas);
	//console.log(entitydatas);
	return;
	for (var p in entitydatas)
		if (p !== "sets")
			entitydatas[p].changed = false;
},100);
var ticks = 0;
var tiledatas = {};
var entitydatas = {};
var nextentitydatas = {};
var host;
var hostq = [];
var socketq = [];
io.on('connection', function(socket){
	console.log('a user connected');
	/*if (!host){
		host = socket;
		console.log("made host");
	} else {
		hostq.push(socket);
	}*/
	socketq.push(socket);
	//socket.emit("initworld",worlddata);
	socket.on("gooffline",function(username){
		socket.disconnect();
		entitydatas[username] = false;
		if (!accounts[username])
			return;
		if (username)
			accounts[username].online = false;
		//console.log(username);
		io.emit("removeentity",username);
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
		socket.emit("loginsuccess");
		if (data.lobby)	return;
		socket.emit("enterserver",{username:data.username,account:accounts[data.username]});//,w:worlddata});
		//socket.emit("updateworld",worlddata);
		socket.emit("tilechanges",tiledatas);
		//socket.emit("getentities",entitydatas);
		//io.emit("playerjoined",players[data.username]);
		accounts[data.username].online = true;
		entitydatas[data.username] = accounts[data.username].save;
	});
	socket.on("consoleadd",function(data){
		io.emit("consoleadd",data);
	});
	socket.on("collectentities",function(){
		socket.emit("getentities",entitydatas);
	});
	socket.on("playerjoined",function(p){
		socket.broadcast.emit("playerjoined",p);
	});
	socket.on("register",function(data){
		if (typeof accounts[data.username] !== "undefined")
		return socket.emit("usertaken");
		accounts[data.username] = {password:data.password,online:false,inactivity:0,save:{}};
		socket.emit("accountregistered",data);
	});
	/*socket.on("saveplayer",function(data){
		players[data.username] = data;
	});
	socket.on("saveplayerloc",function(data){
		if (!players[data.username])	return;
		players[data.username].loc = data.loc;
		//players[data.username].saying = data.saying;
	});*/
	socket.on("removeentity",function(id){
		//console.log(id);
		//console.log(entitydatas[id]);
		entitydatas[id] = false;
		if (accounts[id])	accounts[id].online = false;
		io.emit("removeentity",id);
		//io.emit("getentities",entitydatas);
	});
	socket.on("removeentities",function(ids){
		for (var i = 0; i < ids.length; i++){
			if (accounts[id])	accounts[id].online = false;
			//delete entitydatas[ids[i]];// = false;
			entitydatas[ids[i]] = false;
		}
		//io.emit("removeentity",id);
		io.emit("getentities",entitydatas);
	});
	/*socket.on("regchanges",function(data){
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
		*worlddata.changes = data;
		worlddata.ups++;
		//sendupdates();
	});*/
	socket.on("tilechange",function(data){
		tiledatas[data.loc] = data.type;
		socket.broadcast.emit("tilechange",data);
	});
	/*socket.on("confirmactive",function(username){
		players[username].online = true;
	});*/
	socket.on("newentity",function(data){
		//host.emit("newentity",data);
		entitydatas[data.id] = data;
		//socket.broadcast.emit("")
		//console.log(entitydatas[data.id]);
		//socket.broadcast.emit("newentity",data);
	});
	/*socket.on("playerspeak",function(str){
		socket.broadcast.emit("playerspeak",str);
	});*/
	socket.on("saveentities",function(data){
		//return;
		//if (socket !== host)return;
		
		data.filter((e)=>(e && e.id && entitydatas[e.id] !== false)).forEach((e)=>{
			//if (e&&e.id)
				entitydatas[e.id] = e;
				if (accounts[e.id])
					for (p in e)
						if (p !== "sets")
							accounts[e.id].save[p] = e[p];
					
				//if (accounts[e.id])	accounts[e.id].online = false;
			});
		//socket.broadcast.emit("getentities",entitydatas);
		//socket.emit("getentities",entitydatas);
	});
	/*socket.on("xferoriginals",function(origids){
		origids.forEach((id)=>{
			var socket = socketq[Math.floor(Math.random()*socketq.length)];
			socket.emit("")
		});
	});*/
	socket.on("affectentity",function(data){
		io.emit("affectentity",data);
	});
	socket.on("affectentityother",function(data){
		socket.broadcast.emit("affectentity",data);
	});
	socket.on("saveentity",function(data){
		//if (socket === host || data.type !== "Player")return;
		//host && host.emit("updateentity",data);
		//return;
		//if (socket !== host && data.type !== "Player")return;
		if (data.type == "Player"){
			if (accounts[data.id] && !accounts[data.id].save)
				accounts[data.id].save = {};
			for (p in data)
				if (p !== "sets")
					accounts[data.id].save[p] = data[p];
		}
		if (!entitydatas[data.id])
			entitydatas[data.id] = {};
		for (var p in data)
			if (p !== "sets" && data[p]) // } && !entitydatas[data.id].changed){
				entitydatas[data.id][p] = data[p];
			
		//entitydatas[data.id].changed = true;
	});
	/*socket.on("updateme",function(username){
		/*for (var p in players)
			if (p !== "sets")// && players[p].online)
				players[p].online = false;
			//plays.push(players[p]);
		io.emit("pingactive");*
		//console.log(accounts);
		if (!accounts[username]){
			socket.emit("disconnectplox");
			return;
		}
		accounts[username].inactivity = 0;
		accounts[username].online = true;
		return;
		socket.emit("getentities",entitydatas);
		
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
	});*
	socket.on("givepriv",function(data){
		//if (players[data.username])
		//console.log(entitydatas[data.username]);
		if (entitydatas[data.username])
			for (var i = 0; i < data.privs.length; i++)
				entitydatas[data.username].privileges.push(data.privs[i]);
			entitydatas[data.username].changed = true;
			socket.emit("affectentity",{id:data.username,func:"setprivs",args:entitydatas[data.username].privileges})
		//console.log(entitydatas[data.username]);
		//io.emit("getentities",entitydatas);
			return;
		/*var plays = [];
		for (var p in players)
			if (p !== "sets" && players[p].online)
				//plays.push(players[p]);
				plays.push({username:players[p].username,privileges:players[p].privileges});*
		//console.log(players[data.username]);
		var d = entitydatas[data.username];
		console.log(d);
		d.privileges = players[data.username].privileges;
		io.emit("changeme",d);
		//io.emit("changeme",{username:data.username,privileges:players[data.username].privileges});
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
		io.emit("changeme",plays);*
	});*
	socket.on("playertarget",function(data){
		socket.broadcast.emit("playertarget",data);
	});
	*socket.on("removeplayer",function(username){
		if (players[username])
			players[username].online = false;
	});*
	*socket.on("leave",function(data){
		players[data.playername] = data.playerdata;
	});*/
	socket.on('disconnect', function(){
		console.log('user disconnected');
		socketq.splice(socketq.indexOf(socket),1);
		/*if (hostq.indexOf(socket)!==-1)
			hostq.splice(hostq.indexOf(socket),1);
		if (socket === host){
			console.log("host left");
			if (hostq.length > 0){
				host = hostq.shift();
				console.log("new host");
			} else {
				host = false;
				console.log("out of hosts");
			}
		}*/
	});
});
http.listen(port, function(){
console.log('listening on '+port);
});