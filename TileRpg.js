function TileRpgFramework(){
	this.frameworkName = "TileRpgFramework";	
	this.showover = false;
	this.pvp = false;
	this.debugger = {
		showmouse:false,
		showentitypaths:false,
	};
	this.WorldLoc = function(wx, wy, cx, cy, dim, mx, my){
		this.wx = wx || 0;
		this.wy = wy || 0;
		this.cx = cx || 0;
		this.cy = cy || 0;
		this.dim = dim || "surface";
		this.mx = mx || 16;
		this.my = my || 16;
		var dims = [//flipped
		"underground2",
		"underground1",
		"surface",
		"floor1",
		"floor2",
		];
		this.x = function(){
			return 8*this.wx+this.cx;
		}
		this.xx = function(){
			return this.x()*32+this.mx;
		}
		this.y = function(){
			return 8*this.wy+this.cy;
		}
		this.yy = function(){
			return this.y()*32+this.my;
		}
		this.dx = function(other){
			return 8*(other.wx-this.wx)+other.cx-this.cx;//+(other.mx-this.mx)/32;
		}
		this.dy = function(other){
			return 8*(other.wy-this.wy)+other.cy-this.cy;//+(other.my-this.my)/32;
		}
		this.mdx = function(o){
			return this.dx(o)+(o.mx-this.mx)/32;
		}
		this.mdy = function(o){
			return this.dy(o)+(o.my-this.my)/32;
		}
		this.getadjs = function(){
			return [(this.copy().shift(0,-1)),
					(this.copy().shift(1,0)),
					(this.copy().shift(0,1)),
					(this.copy().shift(-1,0))]
		}
		this.onmove = function(wl){return true}
		this.move = function(mx,my){
			this.mx+=mx;
			this.my+=my;
			if (this.mx < 0 || this.mx >= 32){
				if (this.onmove(this.copy().shift(Math.sign(mx),0))){
					this.shift(Math.sign(mx),0);
					this.mx-=32*Math.sign(mx);
				} else this.mx-=mx;
			}
			if (this.my < 0 || this.my >= 32){
				if (this.onmove(this.copy().shift(0,Math.sign(my)))){
					this.shift(0,Math.sign(my));
					this.my-=32*Math.sign(my);
				} else this.my-=my;
			}
			return this;
		}
		this.shift = function(dx,dy,dim){
			this.cx+=dx||0;
			this.cy+=dy||0;
			if (typeof dim == "number" 
				&& dims.indexOf(this.dim)+dim>=0
				&& dims.indexOf(this.dim)+dim<dims.length)
				this.dim = dims[dims.indexOf(this.dim)+dim];
			else if (dims.indexOf(dim)!==-1)
				this.dim = dim;
			return this.legalize();
		}
		this.tochunk = function(){
			this.cx = this.cy = 0;
			return this;
		}
		this.chunkdist = function(other){
			if (other.dim !== this.dim)	return -1;
			return Math.max(Math.abs(other.wx-this.wx),Math.abs(other.wy-this.wy));
		}
		this.inchunkdist = function(other,dist){
			return this.chunkdist(other)!==-1 && this.chunkdist(other) <= dist;
		}
		this.indist = function(other,dist, crossdim){
			return (this.dist(other)!==-1 || crossdim) && this.dist(other) <= dist;
		}
		this.inmdist = function(other,dist, crossdim){
			return (this.mdist(other)!==-1 || crossdim) && this.mdist(other) <= dist;
		}
		this.isdist = function(other,dist, crossdim){
			return (this.dist(other)!==-1 || crossdim) && this.dist(other) == dist;
		}
		this.ismdist = function(other,dist, crossdim){
			return (this.mdist(other)!==-1 || crossdim) && this.mdist(other) == dist;
		}
		this.mdist = function(other, crossdim){
			if (other.dim !== this.dim && !crossdim)	return -1;
			return Math.max(Math.abs(this.mdx(other)),Math.abs(this.mdy(other)));
		}
		this.dist = function(other, crossdim){
			if (other.dim !== this.dim && !crossdim)	return -1;
			//return Math.round(Math.sqrt(Math.pow(8*(this.wx-other.wx)+this.cx-other.cx,2)+Math.pow(8*(this.wy-other.wy)+this.cy-other.cy,2)));
			//if (!min)	
			return Math.max(Math.abs(this.dx(other)),Math.abs(this.dy(other)));
			//else		return Math.min(Math.abs(8*(this.wx-other.wx)+this.cx-other.cx),Math.abs(8*(this.wy-other.wy)+this.cy-other.cy));
		}
		this.legalize = function(){
			while(this.cx < 0 || this.cx > 7){
				this.wx+=Math.sign(this.cx);
				this.cx-=8*Math.sign(this.cx);
			}
			while(this.cy < 0 || this.cy > 7){
				this.wy+=Math.sign(this.cy);
				this.cy-=8*Math.sign(this.cy);
			}
			return this;
		}
		this.load = function(wl){
			this.wx = wl.wx;
			this.wy = wl.wy;
			this.cx = wl.cx;
			this.cy = wl.cy;
			this.dim = wl.dim;
			this.mx = wl.mx;
			this.my = wl.my;
			return this;
		}
		this.loadStr = function(str){
			var params = str.substring(1,str.length-1).split(", ");
			this.wx = parseInt(params[0],10);
			this.wy = parseInt(params[1],10);
			this.cx = parseInt(params[2],10);
			this.cy = parseInt(params[3],10);
			this.dim = params[4];
			if (params.length <= 5)
				return this;
			this.mx = parseFloat(params[5]);
			this.my = parseFloat(params[6]);
			if (isNaN(this.mx)) this.mx = 16;
			if (isNaN(this.my)) this.my = 16;
			return this;
		}
		this.copy = function(){
			return new Trpg.WorldLoc(this.wx,this.wy,this.cx,this.cy,this.dim,this.mx,this.my);
		}
		this.toStr = function(){
			return "("+this.wx+", "+this.wy+", "+this.cx+", "+this.cy+", "+this.dim+")";
		}
		this.tomStr = function(){
			return "("+this.wx+", "+this.wy+", "+this.cx+", "+this.cy+", "+this.dim+", "+this.mx+", "+this.my+")";
		}
	}
	this.Populate = function(H){
		//ConnectToServer();
		Trpg.SaveGame = function(force){
			if (Trpg.socket){
				Trpg.socket.emit("saveentities",Trpg.BoardC.get("Entities").getq().map((e)=>e.save()));
				//Trpg.socket.emit("saveplayer",Trpg.player.save());
				//Trpg.socket.emit("sendchanges",Trpg.world.changes);
				Trpg.socket.emit("removeentity",Trpg.player.id);
				Trpg.socket.emit("gooffline",Trpg.player.username);
				//return null;
			}
			if (Trpg.world.getChanges(force)!="none")
				;//localStorage.setItem("TRPGSaveSlot"/*+this.slot*/,JSON.stringify(Trpg.world.getChanges(force)));
			return null;
		}
		window.onbeforeunload = Trpg.SaveGame;
		function MobilePopulate(){
			H.w = 1200;
			H.h = 800;
			//H.bcolor = "clear";
			//H.color = "clear";
			H.container.stretchfit(H);
			function Title(){
				var t = new UI.DBox(0,0,1200,800);
				t.bcolor = "black";
				t.color = "grey";
				t.add(new (function(){
					this.render = function(g){
						g.font = "100px Arial";
						g.fillStyle = "white";
						Drw.drawCText(g, "TileRPG Mobile", 600,200);
					}
				})());
				t.add(new UI.Button(400,300,400,100).sets({color:"green",text:"New Game",key:"n",onclick:function(){StartGame(true);}}));
				t.add(new UI.Button(400,450,400,100).sets({color:"blue",text:"Load Game",key:"l",onclick:function(){StartGame(false);}}));
				t.add(new UI.Button(400,600,400,100).sets({color:"purple",text:"Multiplayer",key:"l",onclick:function(){return;StartGame(false);}}));
				return t;
			}
			function MobileGameplay(){
				var g = new UI.DBox();
				var b;
				g.add(b = new UI.DBox(0,0,800,800),"Board");
				//H.container.stretchfit(b);
				b.bcolor = b.color = "black";			
				return g;
			}
			Trpg.joystick = new Ms.Joystick();
			H.container.add(Trpg.joystick);
			H.newtab("TitleMenu", Title());
			H.newtab("Gameplay",MobileGameplay());
			H.settab("TitleMenu");
			setInterval(function(){
				Trpg.SaveGame(true);
			},100);
		}
		Trpg.Home = H;
		H.empty();
		if (Trpg.ismobile){
			MobilePopulate();
			return;
		}
		H.bcolor = "black";
		H.color = "grey";
		H.w = 1200;
		H.h = 800;
		H.container.stretchfit(H);
		//H.camera.reset();
		//H.add(Trpg.textinp = new Utils.TextInput("allchars"))
		function Title(){
			var t = new UI.DBox();
			//t.color = "grey";
						//t.cropped = false;
			t.add(new (function(){
				this.render = function(g){
					g.font = "100px Arial";
					g.fillStyle = "white";
					Drw.drawCText(g, "TileRPG", 600,200);
				}
			})());
			t.add(new UI.Button(500,300,200,50).sets({color:"green",text:"Start Game",key:"n",onclick:function(){
				Trpg.username = "Player"+Math.round((new Math.seedrandom(Date.now()))()*100000);
				if (ConnectToServer()){
					MultiplayerLogin();
					if (Trpg.socket){
						//var user = (localStorage.getItem("TRPGMultiUser"));
					//	if (user !== null){
						//	Trpg.socket.emit("trylogin",{username:user,password:""});
					//	}
						//else {
							//localStorage.setItem("TRPGMultiUser",user);
							Trpg.socket.emit("register",{username:Trpg.username,password:""});
						// }
					}
				} else StartGame(true);
				this.container.remove(this);
			}}));
			//t.add(new UI.Button(500,400,200,50).sets({color:"blue",text:"Load Game",key:"l",onclick:function(){StartGame(false);}}));
			//t.add(new UI.Button(500,500,200,50).sets({color:"purple",text:"Multiplayer",key:"m",onclick:function(){
			//	if (!ConnectToServer()) return StartGame(true);
			//	H.newtab("MultiplayerLogin", MultiplayerLogin());H.settab("MultiplayerLogin");}}));
			/*t.add(new UI.Button(500,500,200,50).sets({color:"red",text:"Instructions",onclick:function(){
				function instr(){
					var box = new UI.DBox(0,0,1200,800);
					box.color = "grey";
					box.add({render:function(g){
						g.font = "30px Arial";
						g.fillStyle = "white";
						Drw.drawBoxText(g,"Right click on a tile to open list of available actions.\n \n "+
						"Left clicking on a tile will default\n to the first action.\n \n "+
						"Clicking on an action in progress will cancel Trpg action.\n \n "+
						"Use W A S D to move.\n \n "+
						"Trees can be cut for logs. Logs can be burned with a tinderbox.\n \n "+
						"Dig up stumps to plant a new tree. Walking on seedling will kill it.\n \n "+
						"",600,150,600);
					}});
					box.add(new UI.Button(500,600,200,50).sets({color:"yellow",text:"Back",onclick:function(){t.remove(box);}}))
					return box;
				}
				t.add(new instr());
			}}));*/
			return t;
		}
		H.newtab("TitleMenu", Title());
		function MultiplayerLogin(){
			var m = new UI.DBox();
			m.add(new (function(){
				this.render = function(g){
					g.font = "100px Arial";
					g.fillStyle = "white";
					Drw.drawCText(g, "Multiplayer Login", 600,200);
				}
			})());
			var user, pass;
			var uentry = new Utils.TextInput("alphanums");
			var pentry = new Utils.TextInput("alphanums").setpassform(true);
			//uentry.updatetext = function(){user.text = uentry.gettext();}
			//pentry.updatetext = function(){pass.text = pentry.gettext();}
			H.add(uentry);
			H.add(pentry);
			m.add(user = new UI.Button(500,300,200,50).sets({key:"1",onclick:function(){uentry.focus();}}));
				//inrender:function(g){if (uentry.hasfocus())user.color = "white";else user.color = "clear";}}));
			m.add(pass = new UI.Button(500,400,200,50).sets({key:"2",onclick:function(){pentry.focus();}}));
				//inrender:function(g){if (pentry.hasfocus())this.ccolor = "lightgrey";else this.ccolor = "grey";}}));
			//user.cropped = false;
			user.inrender = function(g){
				var text = uentry.gettext();
				g.font = "30px Arial";
				if (text == "")
					text = "Username";
				var x = 5;
				while(g.measureText(text).width > this.w-x)
					x--;
				Drw.drawCText(g,text,x,this.h/2,{alignx:"left",textcolor:"black"});	
				//inrender:function(g){
					if (uentry.hasfocus())this.bcolor = "white";else this.bcolor = "darkgrey";
			}
			pass.inrender = function(g){
				var text = pentry.gettext();
				g.font = "30px Arial";
				if (text == "")
					text = "Password";
				var x = 5;
				while(g.measureText(text).width > this.w-x)
					x--;
				Drw.drawCText(g,text,x,this.h/2,{alignx:"left",textcolor:"black"});	
					if (pentry.hasfocus())this.bcolor = "white";else this.bcolor = "darkgrey";
			}
			uentry.onenter = 
			uentry.ontab = function(){pentry.focus();}
			pentry.ontab = function(){uentry.focus();}
			pentry.onenter = function(){m.get("loginbtn").onclick();}
			//uentry.focus();
			/*m.add(new Utils.KeyListener("down","Tab",function(){
				if (uentry.hasfocus())
					pentry.focus();
				else uentry.focus();
			}))*/
			m.add(new UI.Button(500,500,200,50).sets({color:"orange",text:"Login",key:"3",onclick:function(){
				Trpg.socket.emit("trylogin",{username:uentry.gettext(),p:pentry.gettext(true)});pentry.clearfocus();
			}}),"loginbtn");
			m.add(new UI.Button(500,600,200,50).sets({color:"yellow",text:"New Account",key:"4",onclick:function(){
				if (uentry.gettext() == "")
					alert("Username required (password optional)");
				else Trpg.socket.emit("register",{username:uentry.gettext(),p:pentry.gettext(true)});
			}}),"registerbtn");
			m.add(new UI.Button(500,700,200,50).sets({color:"darkgrey",text:"Back",key:"Escape",onclick:function(){
				Trpg.socket.emit("gooffline");H.settab("TitleMenu");
			}}));
			// {login stuff
			Trpg.socket.on("failedlogin", function(){
				alert("Login failed: incorrect username or password");
			});
			Trpg.socket.on("enterserver",function(data){
				//alert("Login successful");
				StartGame(false);//, data);
				Trpg.socket.emit("playerjoined",Trpg.player.save());
				//H.add(new Utils.Timer(1).start().setAuto(true,function(){
				//	Trpg.socket.emit("updateme",Trpg.player.username);
				// }));
				if (false) 
				H.add(new Utils.Timer(0.5).start().setLoop(true).setAuto(true,function(){
					//Trpg.socket.emit("saveplayerloc",{username:Trpg.player.username,loc:Trpg.player.loc.tomStr()});
					//Trpg.socket.emit("saveplayer",Trpg.player.save());
					//Trpg.socket.emit("updateme",Trpg.player.username);
					//console.log(Trpg.BoardC.get("Entities").getq());
					var ents = Trpg.BoardC.get("Entities").getq().filter((e)=>e.changed).map((e)=>e.save());
					//ents.forEach((s)=>{s.container = -1;})
					Trpg.socket.emit("saveentities",ents);//.filter((e)=>{e.original}));
					
					
				//	Trpg.socket.emit("saveentities",Trpg.BoardC.get("Entities").getq().map((e)=>e.save()));
				}));
			if (false)	H.add(new Utils.Timer(.5).start().setLoop(true).setAuto(true,function(){
					//Trpg.socket.emit("saveplayerloc",{username:Trpg.player.username,loc:Trpg.player.loc.tomStr()});
					//Trpg.socket.emit("saveplayer",Trpg.player.save());
					//Trpg.socket.emit("updateme",Trpg.player.username);
					Trpg.socket.emit("saveentities",Trpg.BoardC.get("Entities").getq().map((e)=>e.save()));
				}));
					//Trpg.socket.emit("updateme",Trpg.player.username);}));
				//H.add(new Utils.Timer(.1).start().setLoop(true).setAuto(true,function(){Trpg.socket.emit("updateme",Trpg.player.username);}));
				/*new Trpg.World(data.w.seed);
				Trpg.player = new Trpg.Player().load(data.p);
				Trpg.world.loadChanges(data.w);
				H.add(Trpg.board,"Gameplay.Board.");
				H.add(Trpg.invent,"Gameplay.InvTabs.Invent.");
				Trpg.socket.emit("saveplayer",Trpg.player.save());
				H.settab("Gameplay");*/
				//console.log(data.p);
			});
			Trpg.socket.on("usertaken",function(){
				alert("That username is taken, please chose another");
			});
			Trpg.socket.on("accountregistered",function(data){
				//console.log(confirm("Your account has been created with username '"+data.username+"' and password '"+data.p+"'"));
				//alert("Your account has been created with username '"+data.username+"' and password '"+data.password+"'");
				Trpg.player = new Trpg.Player(data.username,false,true);
				Trpg.socket.emit("saveplayer",{username:data.username});
				Trpg.socket.emit("trylogin",{username:data.username,password:""});//pentry.clearfocus();
				//m.get("loginbtn").onclick();
			});
			Trpg.socket.on("alreadyonline",function(){
				alert("Login failed: that user is already logged in");
			});
			// }
			Trpg.socket.on("tilechange",function(data){
				var t = new Trpg.Tiles[data.type](new Trpg.WorldLoc().loadStr(data.loc),true);
				Trpg.world.tilechanges[t.loc.toStr()] = t.getState();
			});
			Trpg.socket.on("tilechanges",function(data){
				for (var p in data)
					if (p !== "sets"){
						var t = new Trpg.Tiles[data[p]](new Trpg.WorldLoc().loadStr(p),true);
						Trpg.world.tilechanges[t.loc.toStr()] = t.getState();
					}
			});
			Trpg.socket.on("playerjoined",function(p){
				//console.log("join");
				//console.log(p);
				Trpg.Console.add(p.username+" has logged in","cyan");
				return;
				if (p.username == Trpg.player.username)
					return;
					//Trpg.Console.add(new Trpg.OtherPlayer(p).gettitle()+" logged in","cyan");
					//alert(username+"  logged in");
				var others = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < others.length; i++)
					if (others[i].username == p.username){
						others[i].load(p);
						return;
					}
					alert(p);
				var newplayer = new Trpg.OtherPlayer(p);
				console.log(newplayer);
				Trpg.Entities.add(newplayer);
				Trpg.Console.add(newplayer.gettitle()+" logged in","cyan");
			});
			Trpg.socket.on("playerleft",function(p){
				return;
				console.log("leave");
				console.log(p);
				var e = Trpg.BoardC.get("Entities."+p.username);
				if (e !== -1)
					e.removeme();
				console.log(e);
				return;
				
				if (p.username !== Trpg.player.username)
					Trpg.Console.add(new Trpg.OtherPlayer(p).gettitle()+" logged out","cyan");
				//if (username !== Trpg.player.username)
				//	Trpg.socket.emit("updateme",Trpg.player.username);
				//	alert(username+"  logged out");
				var others = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < others.length; i++)
					if (others[i].username == p.username){
						Trpg.Entities.remove(others[i]);
						return;
					}
				//Trpg.Entities.add(new Trpg.OtherPlayer(p));
			});
			Trpg.socket.on("playerspeak",function(data){
				var others = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < others.length; i++)
					if (others[i] !== Trpg.player && data.username == others[i].username)//(str.indexOf(others[i].username+" (") == 0 || str.indexOf(others[i].username+": ")==0))
						others[i].say(data.str);//str.substring(str.indexOf(": ")+2));
				//Trpg.Console.add(str);
			});
			Trpg.socket.on("updatechunks",function(data){
				if (!exists(Trpg.world)) return;// || data[0] <= Trpg.world.ups)	return;
				var needload = false;
				//console.log(data);
				//console.log("uchnks");
				for (var i = 0; i < data.length; i++){
					if (Trpg.board.chunkloaded(data[i].key))
						needload = true;
					if (Trpg.world.changed.indexOf(data[i].key) == -1)
						Trpg.world.changed.push(data[i].key);
					Trpg.world.changes[data[i].key] = data[i].changes;
					//console.log(Trpg.world.changes[data[i].key]);
				}
				//console.log(Trpg.world.changed);
				//console.log(needload)
				//if (needload)
					Trpg.board.load(Trpg.player.loc,true);
			});
			Trpg.socket.on("updateworld",function(data){
				//return;
				//if (!exists(Trpg.world) || (JSON.stringify(data.changes) == JSON.stringify(Trpg.world.changes))) return;// && Trpg.world.changed == data.changed))return;
				if (!exists(Trpg.world) || data.ups <= Trpg.world.ups) return;
				//console.log(data.changes == Trpg.world.changes);
				//console.log(JSON.stringify(data.changes) == JSON.stringify(Trpg.world.changes));
				Trpg.world.loadChanges(data);
				//Trpg.world.changes = data.changes;
				//Trpg.world.changed = data.changed;
				//console.log(data);
			});
			Trpg.socket.on("changeme",function(player){
				return;
				Trpg.BoardC.get("Entities."+player.username).load(player);
				Trpg.socket.emit("saveentities",Trpg.BoardC.get("Entities").getq().map((e)=>e.save()));
				return;
				
				var others = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < others.length; i++)
					if (others[i].username == player.username)
						return others[i].load(player);
			//	return;
				if (player.username == Trpg.player.username)
					Trpg.player.load(player);
				/*for (var p in players)
					if (players[p].username == Trpg.player.username)
						Trpg.player.load(players[p]);
				console.log(Trpg.player);*/
			});
			/*Trpg.socket.on("pingactive",function(){
				Trpg.socket.emit("confirmactive",Trpg.player.username);
			});*/
			Trpg.socket.on("getentities",function(ents){
				//console.log(ents);
				//Trpg.BoardC.get("Entities").empty();
				for (var p in ents){
					if (p == "sets"){// } || Trpg.player && p == Trpg.player.id)	{
						//alert (	JSON.stringify(ents[p]));
						
						continue;
					}
					//if (p == "sets" || !ents[p] || !ents[p].changed || Trpg.player && p==Trpg.player.id)	continue;
					var e = Trpg.BoardC.get("Entities."+p);
					//console.log(e);
					//console.log("data:");
					//console.log(ents[p]);
					if (e !== -1){
						if (ents[p] === false){
							if (e.type == "Player")
								Trpg.Console.add(e.gettitle()+" has logged out","cyan");
							Trpg.BoardC.get("Entities").remove(p);
							if (p == Trpg.player.id) location.reload(true);
							continue;
						}
						//if (e.type == "Player")
						//alert("already");
					//alert("already"+ents[p].type);
						//alert(ents[p].Entity.target);
						e.load(ents[p]);//{target:ents[p].Entity.target});
					}
					else if (ents[p]){
						//alert(JSON.stringify(ents[p]));
					//	alert("new"+JSON.stringify(ents[p]));
						//if (!Trpg.Entities[ents[p].type]) console.log(ents[p]);
						//alert(JSON.stringify(ents[p]));
						//ents[p].loc &&
						//alert(p);
						var newe = (new Trpg.Entities[ents[p].type](new Trpg.WorldLoc().loadStr(ents[p].loc),p));//.sets({original:false});//.load(ents[p]);
						//if (newe.type == "Player")
						//	Trpg.Console.add(newe.gettitle()+" has logged in","cyan");
					}
				}
				Trpg.BoardC.get("Entities").getq().forEach((e)=>{
					//if (!ents[e.id])
					//	e.removeme();
				});
				//Trpg.socket.emit("saveentities",Trpg.BoardC.get("Entities").getq().map((e)=>e.save()));
			});
			Trpg.socket.on("getplayers",function(players){
				//return;
				//if (!exists(Trpg.player))	return;
				//alert("Ef");
				
				return;
				
				
				
				
				
					var others = Trpg.Entities.getoftype("Player");
					//console.log("===");
					//console.log(others);
					//console.log(players);
				loop:
				for (var j = 0; j < players.length; j++)
					if (players[j].username !== Trpg.player.username){
					for (var i = 0; i < others.length; i++)
						if (others[i].username == players[j].username){
							others[i].load(players[j]);
							continue loop;
						}
					Trpg.Entities.add(new Trpg.OtherPlayer(players[j]));
				}
				
				return;
				var oplayers = Trpg.Entities.getoftype("Player");
				var onames = [];
				loop1:
				for (var i = 0; i < players.length; i++)
					if (players[i].username !== Trpg.player.username){
						for (var j = 0; j < oplayers.length; j++)
							if (oplayers[j].username == players[i].username)
								continue loop1;
						Trpg.Entities.add(new Trpg.OtherPlayer(players[i]));
					}
					return;
				
				
					onames.push(oplayers[i].username);
				for (var i = 0; i < players.length; i++)
					if (players[i].username !== Trpg.player.username){
						var o = -1;
						for (var j = 0; j < oplayers.length; j++)
							if (oplayers[j].username == players[i].username)
								;
					}
						//if (onames.indexOf(players[i].username) == -1)
							
				
				
				
				
				Trpg.socket.emit("saveplayerloc",{username:Trpg.player.username,loc:Trpg.player.loc.tomStr()});//,saying:Trpg.player.saying});
				//Trpg.otherplayers = [];
				var others = {};
				var otherps = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < otherps.length; i++)
					if (otherps[i] !== Trpg.player)
					others[otherps[i].username] = otherps[i];
				for (var p in players)
					if (p !== "sets" && players[p].username !== Trpg.player.username){
						var n = players[p].username;
						if (others[n]){
							others[n].settarget({loc:new Trpg.WorldLoc().loadStr(players[p].loc)});
							//others[n].targ = new Trpg.WorldLoc().load(players[p].loc);
							others[n].privileges = players[p].privileges;
							//if (players[p].saying)	
							//others[n].saying = players[p].saying;
							//others[n] = -1;
						}
						else Trpg.Entities.add(new Trpg.OtherPlayer(players[p]));
						//else Trpg.otherplayers.push(new Trpg.OtherPlayer(players[p]));
					}
				for (var o in others)
					if (o !== "sets" && others[o] !== -1)
						;//Trpg.Entities.remove(others[o]);
						//Trpg.otherplayers.splice(Trpg.otherplayers.indexOf(others[o]),1);
					//new Trpg.OtherPlayer(players[p]));
				/*		if (others[players[p].username)
							others[players[p].username].targ = players[p].
				for (var p in players)
					if (players[p].username == Trpg.player.username)
						;//Trpg.player.load(players[p]); do nothing
					else if (p !== "sets" && exists(players[p].loc)){
						var alreadyin = false;
						for (var i = 0; i < Trpg.otherplayers.length; i++)
							if (Trpg.otherplayers.username == players[p].username){
								Trpg.otherplayers.targ = players[p].loc;
								alreadyin = true;
							}
						if (!alreadyin)
							Trpg.otherplayers.push(new Trpg.OtherPlayer(players[p]));
					}*/
			});
			Trpg.socket.on("playertarget",function(data){

				var others = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < others.length; i++)
					if (others[i].username == data.username)
						others[i].settarget({loc:new Trpg.WorldLoc().loadStr(data.targetstr)});
			});
			Trpg.socket.on("disconnectplox",function(){
				location.reload(true);
			});
			Trpg.socket.on("newentity",function(data){
				//server to here
				//new Trpg.Entities[data.type](new Trpg.WorldLoc().loadStr(data.loc),data.id).load(data);
			});
			Trpg.socket.on("removeentity",function(id){
				var e = Trpg.BoardC.get("Entities."+id);
				if (e !== -1){
					e.removeme();
					//alert("remove");
				}
			});
			Trpg.socket.on("updateentity",function(data){
				var e = Trpg.BoardC.get("Entities."+data.id);
				if (e !== -1)
					e.load(data);
					//e.removeme();
			});
			Trpg.socket.on("affectentity",function(data){
				var e = Trpg.BoardC.get("Entities."+data.id);
				if (e == -1)return;
				e[data.func].apply(e,data.args);
			});
			
			
			//Trpg.socket.on("serverupdate",function)
			
			
			return m;
		}
		/*makeShortcut(H.get("Gameplay"),"Gameplay",true);
		var instrs = new UI.DBox();
		instrs.add(new (function(){
			this.render = function(g){
				g.font = "35px Arial";
				g.fillStyle = "white";
				Drw.drawBoxText(g,"Right click on a tile to open list of available actions.\n \n "+
				"Left clicking on a tile will default\n to the first action.\n \n "+
				"Clicking on an action in progress will cancel Trpg action.\n \n "+
				"Use W A S D to move.\n \n "+
				"",600,150,600);
			}
		})());
		instrs.add(new UI.Button(550,450,100,50).sets({text:"Back",color:"yellow",onclick:function(){U.prevtab()}}));
		//instrs.add(new Utils.KeyListener("down","Escape",function(){console.log("F$RG%H");}));
		H.newtab("Instructions",instrs);
		*/
		function Gameplay(){
			var g = new UI.DBox();
			var b,h,i,s,m,M,I;
			Trpg.boardui = new UI.DBox(0,0,800,800);
			Trpg.boardui.add(b = new UI.DBox(0,0,800,800),"Board");
			b.add(new UI.DBox(),"Tiles");
			b.add(new UI.DBox(),"Entities");
			Trpg.BoardC = b;
			g.add(Trpg.boardui,"BoardUI");
			//g.add(h = new UI.DBox(800,0,400,800),"Hud");
			g.add(m = new UI.DBox(800,0,400,350),"Minimap");
			g.add(I = new UI.DBox(800,350,400,450),"InvTabs");
			I.newtab("Invent",i = new UI.DBox(0,0,322,450));
			I.newtab("Skills",s = new UI.DBox(0,0,322,450));
			I.add(new UI.Button(326,6,64,64*3.5).sets({inrender:function(g){
				g.font = "35px Arial";
				g.fillStyle = "black";
				Drw.drawBoxText(g, "I N V E N T", 32, 32, 32);
			},onclick:function(){I.settab("Invent")}}));
			I.add(new UI.Button(326,64*3.5+6,64,64*3.5).sets({inrender:function(g){
				g.font = "35px Arial";
				g.fillStyle = "black";
				Drw.drawBoxText(g, "S K I L L S", 32, 32, 32);
			},onclick:function(){I.settab("Skills")}}));
			I.settab("Invent");
			s.add({render:function(g){g.fillStyle = "black";g.font = "30px Arial";
				Drw.drawCText(g,"Coming soon",this.container.w/2,this.container.h/2)}});
			g.add(M = new UI.DBox(),"Menus");
			g.add(makeShortcut(new UI.DBox(),"RC"));
			var checkover = {
				mousemove:function(e,m){
					if (!this.container.mouseonbox(m))
						this.container.empty();
				}
			}
			RC.onempty = function(){
				RC.add([],"actionslist");
				RC.add(checkover);
				RC.hidden = true;
			}
				RC.add([],"actionslist");
				RC.add(checkover);
			RC.open = function(){
			//	if (this.open)return;
			this.hidden = false;
				var m = Ms.getMouse();
				var as = RC.get("actionslist");
				RC.x = g.boxx(m.x)-20;
				RC.y = g.boxy(m.y)-20;
				RC.w = 100;
				var btns = [];
				for (var i = 0; i < as.length; i++){
					btns.push(new UI.Button(0,50*i,100,50).sets({
						onclick:(function(a){
							//console.log(a);
							return function(){
								a.func.call(a.owner);
								RC.empty();
								return true;
							}
						})(as[i]),text:capitalize(as[i].text)
					}));
					RC.h+=50;
				}
				RC.add({render:function(g){
					for (var i = 0; i < btns.length; i++)
						btns[i].adjust(g);
					var w = 0;
					for (var i = 0; i < btns.length; i++)
						if (btns[i].w > w)
							w = btns[i].w;
					for (var i = 0; i < btns.length; i++)
						btns[i].w = w;
					RC.w = w;
				}});
				for (var i = 0; i < btns.length; i++)
					RC.add(btns[i]);
			}
			Trpg.Home.add(Trpg.Timers = new UI.DBox());
			//g.add(makeShortcut(new UI.DBox(),"Timers"));//,"Timers");
			
			M.font = "20px Arial";
			if(window.mobile)	M.camera.zoom(1.5);
			//M.camera.zoom(2);
			i.color = "rgb(96,96,96)";
			b.bcolor = b.color = /*h.color = h.bcolor = i.bcolor =*/ m.color = "black";
			//b.color = "white";
			//#mapm.add(Trpg.Map);
			
			return g;
			/*H.add(new Utils.KeyListener("down","Escape",function(){H.prevtab()}));
			Board.add(new Utils.KeyListener("down","p",function(){H.settab("Instructions");}));
			H.settab("TitleMenu");
		}
			H.add(new UI.Button(500,500,200,50).sets({color:"red",text:"Instructions",key:"i",onclick:function(){U.settab("Instructions")}}),"TitleMenu.");*/
		}
		H.newtab("Gameplay",Gameplay());
		H.settab("TitleMenu")
		function StartGame(newgame,data){
			if (exists(data)){
				new Trpg.World(data.w.seed);
				//Trpg.player = new Trpg.Player().load(data.p);
				Trpg.world.loadChanges(data.w);
				//H.add(Trpg.board,"Gameplay.Board.");
				//H.add(Trpg.invent,"Gameplay.InvTabs.Invent.");
				//H.settab("Gameplay");
			} else {
				if (!Trpg.player)
					Trpg.player = new Trpg.Player(Trpg.username,false,true);
				//Trpg.player = new Trpg.Player();
				new Trpg.World("World 3");
				if (newgame)
				//Invent.add(Trpg.invent);
					localStorage.removeItem("TRPGSaveSlot");//+this.slot);
				if (localStorage.getItem("TRPGSaveSlot"/*+this.slot*/)!=null)
					;//Trpg.world.loadChanges(JSON.parse(localStorage.getItem("TRPGSaveSlot"/*+this.slot*/)));
			}
			//Trpg.Entities.add(Trpg.player);
			//window.onbeforeunload = Trpg.SaveGame;
			if (Trpg.ismobile){
				H.w = 800;
				H.h = 800;
				H.container.stretchfit(H);
			} else {
				H.add(Trpg.board,"Gameplay.BoardUI.Board.");
				H.add(Trpg.invent,"Gameplay.InvTabs.Invent.");
			}
			if (Trpg.socket)
				Trpg.socket.emit("collectentities");
			//if (Trpg.socket)
			//	Trpg.socket.emit("saveplayer",Trpg.player.save());
			
			H.settab("Gameplay");
			
		}
	}
	function ConnectToServer(){
		try {
			Trpg.socket = io({transports: ['websocket'], upgrade: false});
			return true;
		} catch (e) {
			return false;
		}
	}
	/*this.ShittyBirdThing = function(){
		this.wl = Trpg.player.loc.copy();
		this.wl.wx+=Math.floor(Math.random()*2-1);
		this.wl.wy+=Math.floor(Math.random()*2-1);
		this.mx = this.my = 16;
		this.kill = function(){
			Board.container.get("killcounter").count++;
			this.container.remove(this);
		}
		this.update = function(d){
			//return;
			var dx = this.wl.dx(Trpg.player.loc);
			var dy = this.wl.dy(Trpg.player.loc);
			//console.log(dx+" "+dy);
			if (dx==0&&dy==0){
				Board.container.get("healthbar").health--;
				this.container.remove(this);
				return;
			}
			dx*=32;
			dx+=Trpg.board.mx-this.mx;
			dy*=32;
			dy+=Trpg.board.my-this.my;
			var angle = Math.atan2(dy,dx);
			this.mx+=170*d*Math.cos(angle);
			this.my+=170*d*Math.sin(angle);
			if (this.mx < 0 || this.mx >= 32){
				this.wl.cx+=Math.sign(dx);
				this.wl.legalize();
				this.mx-=32*Math.sign(dx);
			}
			if (this.my < 0 || this.my >= 32){
				this.wl.cy+=Math.sign(dy);
				this.wl.legalize();
				this.my-=32*Math.sign(dy);
			}
		}
		this.render = function(g){
			var dx = this.wl.dx(Trpg.player.loc)*-32+this.container.container.camera.x+this.mx-Trpg.board.mx;
			var dy = this.wl.dy(Trpg.player.loc)*-32+this.container.container.camera.y+this.my-Trpg.board.my;
			g.fillStyle = "brown";
			g.fillRect(dx-8,dy-8,16,16);
		}
	}*/
	this.World = function(seed){
		/*Trpg.imgs = {
			grass:Ast.i("grass"),
			tree:Ast.i("tree"),
			//appletree:Ast.i("appletree"),
			sapling:Ast.i("sapling"),
			seedling:Ast.i("seedling"),
			deadseedling:Ast.i("deadseedling"),
			stump:Ast.i("stump"),
			hole:Ast.i("hole"),
			ladderup:Ast.i("ladderup"),
			ladderdown:Ast.i("ladderdown"),
			dirt:Ast.i("dirt"),
			bportal:Ast.i("bportal"),
			gportal:Ast.i("gportal"),
			stone:Ast.i("stone"),
			cwallu:Ast.i("cwallu"),
			cwalll:Ast.i("cwalll"),
			cwallt:Ast.i("cwallt"),
			cwallx:Ast.i("cwallx"),
			cwallv:Ast.i("cwallv"),
			cwallc:Ast.i("cwallc"),
			tinore:Ast.i("tinore"),
			copperore:Ast.i("copperore"),
			blueore:Ast.i("blueore"),
			log:Ast.i("log"),
			firebig:Ast.i("firebig"),
			firesmall:Ast.i("firesmall"),
			ploweddirt:Ast.i("ploweddirt"),
			//applehole:Ast.i("applehole"),
			//rapplehole:Ast.i("rapplehole"),
			//bportal:Ast.i("bportal"),
			//gportal:Ast.i("gportal")
		}*/
		/*Board.container.add({health:20,maxhealth:20,render:function(g){
			g.fillStyle = "red";
			g.fillRect(Board.w+10,10,(Board.container.w-Board.w-20)*this.health/this.maxhealth,20);
		}},"healthbar");
		Board.container.add({count:0,render:function(g){
			g.fillStyle = "yellow";
			g.font = "25px Arial";
			g.fillText("Kill count: "+this.count,Board.w+10,60);
			//g.fillRect(Board.w+10,10,(Board.container.w-Board.w-20)*this.health/this.maxhealth,20);
		}},"killcounter");
		Board.container.add({apples:0,render:function(g){
			g.fillStyle = "red";
			g.font = "25px Arial";
			g.fillText("Apple basket: "+this.apples,Board.w+10,100);
			//g.fillRect(Board.w+10,10,(Board.container.w-Board.w-20)*this.health/this.maxhealth,20);
		}},"basket");*/
		//Trpg.Board.add(new UI.DBox(),"Birds");
		//Board.get("Birds").rl = 1;
		this.wseed = seed || Math.random();
		Trpg.world = this;
		this.tilechanges = {};
		Trpg.board = new Trpg.Board();
		var wl = new Trpg.WorldLoc(-1,1,3,3).shift(-8,-8);
		for (var i = 0; i < 16; i++)
			for (var j = 0; j < 16; j++)
				new Trpg.Tiles.Grass(wl.copy().shift(i,j));
		for (var i = 0; i < 18; i++){
			new Trpg.Tiles.CastleWall(wl.copy().shift(i-1,-1));
			new Trpg.Tiles.CastleWall(wl.copy().shift(i-1,16));
			new Trpg.Tiles.CastleWall(wl.copy().shift(-1,i-1));
			new Trpg.Tiles.CastleWall(wl.copy().shift(16,i-1));
		}
		//new Trpg.Entities.Cow(wl.copy().shift(8,5),"dummy",true);
		Trpg.invent = new Trpg.Invent();
		/*
		Trpg.invent.additem(new Trpg.Item("IronOre"));
		Trpg.invent.additem(new Trpg.Item("IronOre"));
		Trpg.invent.additem(new Trpg.Item("IronOre"));
		Trpg.invent.additem(new Trpg.Item("IronOre"));
		Trpg.invent.additem(new Trpg.Item("IronOre"));
		Trpg.invent.additem(new Trpg.Item("IronOre"));
		Trpg.invent.additem(new Trpg.Item("IronOre"));
		Trpg.invent.additem(new Trpg.Item("IronOre"));
		Trpg.invent.additem(new Trpg.Item("IronOre"));
		Trpg.invent.additem(new Trpg.Item("MithrilOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		/*Trpg.invent.additem(new Trpg.Item("BronzeBar"));
		Trpg.invent.additem(new Trpg.Item("IronBar"));
		Trpg.invent.additem(new Trpg.Item("SteelBar"));
		Trpg.invent.additem(new Trpg.Item("MithrilBar"));
		Trpg.invent.additem(new Trpg.Item("AdamantBar"));
		Trpg.invent.additem(new Trpg.Item("RuneBar"));
		Trpg.invent.additem(new Trpg.Item("EterniumBar"));
		Trpg.invent.additem(new Trpg.Item("BronzeDagger"));
		Trpg.invent.additem(new Trpg.Item("BronzeHelm"));
		Trpg.invent.additem(new Trpg.Item("BronzeBody"));
		Trpg.invent.additem(new Trpg.Item("BronzeLegs"));
		Trpg.invent.additem(new Trpg.Item("BronzeKite"));
		Trpg.invent.additem(new Trpg.Item("IronBody"));
		Trpg.invent.additem(new Trpg.Item("SteelBody"));
		Trpg.invent.additem(new Trpg.Item("MithrilBody"));
		Trpg.invent.additem(new Trpg.Item("AdamantBody"));
		Trpg.invent.additem(new Trpg.Item("RuneBody"));
		Trpg.invent.additem(new Trpg.Item("EterniumBody"));
		Trpg.invent.additem(new Trpg.Item("DragonBody"));
		Trpg.invent.additem(new Trpg.Item("TinOre"));
		Trpg.invent.additem(new Trpg.Item("CopperOre"));
		Trpg.invent.additem(new Trpg.Item("CoalOre"));
		Trpg.invent.additem(new Trpg.Item("IronOre"));
		Trpg.invent.additem(new Trpg.Item("MithrilOre"));
		Trpg.invent.additem(new Trpg.Item("AdamantOre"));
		Trpg.invent.additem(new Trpg.Item("RuneOre"));
		Trpg.invent.additem(new Trpg.Item("EterniumOre"));
		Trpg.invent.additem(new Trpg.Item("Hammer"));//*
		//Trpg.invent.additem(new Trpg.Item("Hoe"));
		//Trpg.invent.additem(new Trpg.Item("Hammer"));
		//Trpg.invent.additem(new Trpg.Item("Ladder"));
		/*Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));
		Trpg.invent.additem(new Trpg.Item("Log"));*/
		this.changed = [];
		this.changes = {};
		this.ups = 0;
		this.loadChanges = function(changes){
			//this.changed = 
			//console.log(changes);
			return;
		this.tilechanges = {};
			this.changed = changes.changed;
			this.changes = changes.changes;
			this.wseed = changes.seed;
			this.ups = changes.ups || 0;
			//console.log(changes);
			//var und;
			
			//taken out to avoid duplicate toolboxes
			//Trpg.board.init();
			
			if (exists(changes.player))
				Trpg.player.load(changes.player);
			//console.log(changes.ploc);
			//console.log(new Trpg.WorldLoc().copy());
				//Trpg.bank = {contents:changes.bank};
				//Trpg.player.loc.load(changes.cloc);
			Trpg.board.loaded = [];
			Trpg.board.load(Trpg.player.loc,true);
			//Trpg.invent = new Trpg.Invent();
			//console.log(changes.invent);
				//Trpg.Map.load(changes.map);
				//Trpg.invent.loadsave(changes.invent);
		}
		this.getChanges = function(nosave){
			if (!nosave)
				Trpg.board.save();
			//var d = new Trpg.WorldLoc(0,0,3,3).dist(Trpg.player.loc);
			//var d = Trpg.board.player.firstloc.dist(Trpg.player.loc);
			//if (this.changes.length == 0 && d == 0){
			//	alert("swdefr");
			//	return "none"
			// }
				//return "none";
			var loc = (Trpg.player.loc.copy());
			return {
				changed:this.changed,
				changes:this.changes,
				seed:this.wseed,
				player:Trpg.player.save(),
				//bank:Trpg.bank.contents,
				//cloc:loc,
				//invent:Trpg.invent.getsave(),
				//map:Trpg.Map.save()
			}
		}
	}
	this.Player = function(username){
		return new Trpg.Entities.Player(new Trpg.WorldLoc(-1,1,3,3),username || "Player",true);
	}
	function makeTemp(thing, time){
		if (time >= 0)
		Trpg.Timers.add(new Utils.Timer(time).start().setAuto(true,function(){
			thing.removeme();
		}).setKilloncomp(true));
		return thing;
	}
	function command(str){
		Trpg.Console.phistory.push({m:"/"+str,u:Trpg.player.username});
		var vals = str.split(" ");
		var cmd = vals.shift();
		for (var i = 0; i < vals.length; i++)
			if (vals[i] == "@s")
				vals[i] = Trpg.setid;
			else if (vals[i] == "@me")
				vals[i] = Trpg.player.id;
		var p = Trpg.player;
		var multi = true;
		switch (cmd){
			case "zoom":
				var amt = parseFloat(vals[0]);
				if (amt > 0 && !isNaN(amt))
					Trpg.board.container.camera.zoom(amt);
			case "spawnrandtemp":
				var min = parseInt(vals.shift(),10);
				var max = parseInt(vals.shift(),10);
			case "spawntemp":
				var timelast = !(min || max) && parseInt(vals.shift(),10);
			case "spawn":
				if (!p.hasprivilege("admin") && !p.hasprivilege("owner")){
					Trpg.Console.add("You need admin privileges for this command");
					return;
				}
				if (!p.hasprivilege("owner")) timelast = 5;
				var amt = parseInt(vals[0],10);
				if (isNaN(amt))
					amt = 1;
				else vals.shift();
				for (var i = 0; i < amt; i++){
					timelast = 
						min && max && (Math.random()*(max - min)+min) || timelast || -1;
					makeTemp(new Trpg.Entities[vals[0]](Trpg.player.loc,false,true),timelast);
				}
				return;
			case "pvp":
				return;
				if (!p.hasprivilege("owner")){
					Trpg.Console.add("You need owner privileges for this command");
					return;
				}
				Trpg.pvp = eval(vals.shift());
				return;
			case "forceremove":
				Trpg.socket && Trpg.socket.emit("removeentity",vals.shift());
				return;
			case "killall":
				if (!p.hasprivilege("owner")){
					Trpg.Console.add("You need owner privileges for this command");
					return;
				}
				Trpg.pvp 
				var type = vals.shift() || "!Player";
				Trpg.BoardC.get("Entities").getq().forEach(
					(e)=>{
						if (!Trpg.socket)return;
						if (e.id !== Trpg.player.id){
							if ((type.charAt(0)=="!" && e.id.indexOf(type)==-1)
								|| (type.charAt(0)!=="!" && e.id.indexOf(type)!==-1))
								Trpg.socket.emit("removeentity",e.id);
						}
					});
				return;
			case "GodToolsO":
				var id = vals.shift();
			case "GodTools":
				if (!p.hasprivilege("owner")){
					Trpg.Console.add("You need owner privileges for this command");
					return;
				}
				id = id || Trpg.player.id;
				if (id == "@s") id = Trpg.setid;
				var tools = ["tileedit","phase","remover","telewalk"];
				var newtools = [];
				if (vals[0] == "all")
					newtools = tools;
				else 
				while(vals.length > 0){
					var t = vals.shift();
					if (tools.indexOf(t)!==-1)
						newtools.push(t);
				}
				Trpg.socket.emit("affectentity",{id:id,func:"addprivs",args:[newtools]});
				/*Trpg.GodTools.tileedit = true;
				Trpg.GodTools.phase = true;
				Trpg.GodTools.remover = true;*/
				return;
			case "C":
				new Trpg.Entities.Cow(Trpg.player.loc,false, true);
				return;
			case "showover":
				Trpg.showover = !Trpg.showover;
				return;
			case "give":
				if (multi && !p.hasprivilege("admin") && !p.hasprivilege("owner")){
					Trpg.Console.add("You need admin privileges for this command");
					return;
				}
				var item = vals.shift();
				var amt = parseInt(vals.shift() || "1") || 1;
				if (exists(item) && item !== "")
					try{
						Trpg.invent.additem(new Trpg.Item(item),amt);
					} catch(e){}
				return;
			case "listplayers":
				var str = Trpg.player.gettitle()+" (You) "+Trpg.player.loc.toStr();//+"\n";
				Trpg.Console.add("Player list:");
				Trpg.Console.add(str);
				var others = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < others.length; i++){
					var p = others[i];
					if (p == Trpg.player)continue;
					Trpg.Console.add(p.gettitle()+" "+p.loc.toStr());
					str+=p.gettitle()+" "+p.loc.toStr()+"\n";
				}
				return;
			case "set":
				var id = vals.shift();
				//if (id == "@s") id = Trpg.setid;
				var rest = vals.reduce((a,c)=>a+" "+c);
				try {
					rest = JSON.parse(rest);
					Trpg.socket && Trpg.socket.emit("affectentity",{id:id||Trpg.player.id,func:"sets",args:[rest]});
				} catch(e){
					alert("invalid json");
				}
				return;
			case "e":
				if (multi && !p.hasprivilege("owner")){
					Trpg.Console.add("You need owner privileges for this command");
					return;
				}
				var funcstr = 
				'var me = Trpg.player;'+
				'function teleport(targ, dx, dy){'+
				'	targ.doaction("teleport",targ.loc.copy().shift(dx,dy));'+
				'}'+
				'function teleportto(targ, targ2){'+
				'	targ.doaction("teleport",targ2.loc.copy());'+
				'}'+
				'var myloc = Trpg.player.loc;'+
				'function deltaloc(loc, dx, dy){'+
				'	return loc.copy().shift(dx,dy);'+
				'}'+
				'function getPlayer(name){'+
				'	var others = Trpg.Entities.getoftype("Player");'+
				'	for (var i = 0; i < others.length; i++)'+
				'		if (others[i].username == name)'+
				'			return others[i];'+
				'}'+
				'function setTile(type, loc){'+
				'	Trpg.board.setTile(new Trpg.Tile(type), loc);'+
				'}'+
				'function loop(func, reps){'+
				'	for (var i = 0; i < reps; i++)'+
				'		func();'+
				'}';
				try {
					new Function(funcstr+" "+str.substring(2)).call({x:1});
				} catch (e){
					alert("function error");
				}
				return;
			case "teleport":
				if (multi && !p.hasprivilege("admin") && !p.hasprivilege("owner")){
					Trpg.Console.add("You need admin privileges for this command");
					return;
				}
				var id = vals.shift();
				var id2 = vals.shift();
				/*if (id == "@s")
					id = Trpg.setid;
				else if (id == "@me")
					id = Trpg.player.id;
				if (id2 == "@s")
					id2 = Trpg.setid;
				else if (id2 == "@me")
					id2 = Trpg.player.id;*/
				var e1 = Trpg.BoardC.get("Entities."+id);
				var e2 = Trpg.BoardC.get("Entities."+id2);
				if (e1 == -1 || e2 == -1){
					Trpg.Console.add("Invalid id(s)");
					return;
				}
				Trpg.socket && Trpg.socket.emit("affectentity",{id:id,func:"doaction",args:["teleport",e2.loc.tomStr()]});
				return;
				vals = str.substring(str.indexOf(" ")+1);
				console.log(vals);
				var wlstr = vals.substring(vals.indexOf("("),vals.indexOf(")")+1);
				console.log(wlstr);
				try {
					var wl = new Trpg.WorldLoc().loadStr(wlstr);
					console.log(wl);
					Trpg.player.doaction("teleport",wl);
				} catch (e) {
					Trpg.Console.add("Invalid WorldLoc, must be form (wx, wy, cx, cy, dim)");
				}
				return;
			case "owner":
				if (!window.mobile)return;
				vals[0] = "15453525";
			case "ownerlogin":
				var pass = vals.shift();
				if (pass !== "15453525"){
					Trpg.Console.add("Incorrect password");
					return;
				}
				if (Trpg.socket){
					Trpg.socket.emit("affectentity",{id:Trpg.player.id,func:"addprivs",args:[["admin","owner"]]});
					//Trpg.socket.emit("givepriv",{username:Trpg.player.username,privs:["admin","owner"]});
				}
				else Trpg.player.addprivs(["admin","owner"]);
					//Trpg.player.load({privileges:["admin","owner","basic"]});
				//Trpg.socket && Trpg.socket.emit("saveentity",Trpg.player.save());
				return;
			case "giveadmin":
				if (multi && !p.hasprivilege("owner")){
					Trpg.Console.add("You need owner privileges for this command");
					return;
				}
				//alert(vals);
				var player = vals.shift();
				//alert(player);
				if (player == "@s") player = Trpg.setid;
				Trpg.socket && Trpg.socket.emit("affectentity",{id:player,func:"addprivs",args:[["admin"]]});
				return;
				var others = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < others.length; i++)
					if (others[i].username == player){
						Trpg.socket && Trpg.socket.emit("givepriv",{username:player,privs:["admin"]});
						return;
					}
				return;
			case "removeadmin":
				if (multi && !p.hasprivilege("owner")){
					Trpg.Console.add("You need owner privileges for this command");
					return;
				}
				//alert(vals);
				var player = vals.shift();
				if (player == "@s") player = Trpg.setid;
				//alert(player);
				Trpg.socket && Trpg.socket.emit("affectentity",{id:player,func:"removeprivs",args:[["admin"]]});
				return;
				var others = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < others.length; i++)
					if (others[i].username == player){
						Trpg.socket && Trpg.socket.emit("removepriv",{username:player,privs:["admin"]});
						return;
					}
				return;
			/*case "removeplayer":
				if (!p.hasprivilege("owner")){
					alert("you need owner privileges for this command");
					return;
				}
				Trpg.socket.emit("removeplayer",vals.shift());
				return;*/
			case "help":
				var str = "command list:\n";
				str+="/listplayers -> lists online players and their coordinates\n";
				str+="/give <item> <amount> -> gives <amount> of <item> to player (admin+ only)\n";
				alert(str);
				return;
		}
		return;
	}
	function amt2text(amt){
		var text = amt;
		var mod = "";
		if (text >= Math.pow(10,10))
			return Math.floor(text/1000000000)+"b";
		if (text >= Math.pow(10,7))
			return Math.floor(text/1000000)+"m";
		if (text >= Math.pow(10,5))
			return Math.floor(text/1000)+"k";
		return ""+text;
	}
	this.Invent = function(){
		this.spaces = [];
		this.selected = -1;
		this.using = -1;
		this.withdrawing = -1;
		this.size = 35;
		var sx = 0;
		var sy = 1;
		for (var i = 0; i < this.size; i++)
			this.spaces.push("empty");
		this.mousemove = function(e,m){
			if (!this.container.mouseonbox(m))
				return;
			var x = Math.floor((this.container.boxx(m.x)-sx*2)/64);
			var y = Math.floor((this.container.boxy(m.y)-sy*2)/64);
			if (x<0||x>4||y<0||y>6||x+5*y<0||x+5*y>34)
				return this.aim = "empty";
			//if (x+5*y>34 || x+5*y < 0)	return;
			this.aim = x+5*y;
		}
		this.getaim = function(){
			if (this.aim == "empty")	return "empty";
			return this.spaces[this.aim];
		}
		this.getspace = function(m){
			var x = Math.floor((this.container.boxx(m.x)+sx)/64);
			var y = Math.floor((this.container.boxy(m.y)+sy)/64);
			//var x = Math.floor((m.relx(Trpg.Home.get("Gameplay.Invent"))-25)/Trpg.Home.get("Gameplay.Invent").cumZoom()/64)
			//var y = Math.floor((m.rely(Trpg.Home.get("Gameplay.Invent"))-15)/Trpg.Home.get("Gameplay.Invent").cumZoom()/64);
			if (x<0||x>4||y<0||y>6)
				return -1;
			return x+5*y;
		}
		this.getitem = function(s){
			if (s<0||s>34)	return -1;
			return this.spaces[s];
		}
		this.additem = function(item,amt){
			if (amt == 0) return;
			amt = amt || item.amt;
			if (item.stackable){
				for (var i = 0; i < this.size; i++)
					if (this.spaces[i].type == item.type){
						this.spaces[i].amt+=amt;
						item.space = i;
						return;
					}
				for (var i = 0; i < this.size; i++)
					if (this.spaces[i]=="empty"){
						item.amt = amt;
						this.spaces[i] = item;
						item.space = i;
						return;
					}
				return;
			}
			for (var i = 0; i < this.size && amt > 0; i++)
				if (this.spaces[i]=="empty"){
					this.spaces[i] = item.copy();
					this.spaces[i].space = i;
					amt--;
					//console.log(amt);
				}
			/*if (this.getempty() < amt)	return;
			for (var i = 0; i < this.size && amt > 0; i++)
				if (this.spaces[i]=="empty"){
					this.spaces[i] = item;
					item.space = i;
					amt--;
				}*/
		}
		this.getsave = function(){
			var save = [];
			for (var i = 0; i < this.size; i++)
				if (this.spaces[i] == "empty")
					save.push("empty");
				else save.push({t:this.spaces[i].type,a:this.spaces[i].amt});
			return JSON.stringify(save);
		}
		this.loadsave = function(load){
			var save = JSON.parse(load);
		//	console.log(save);
			this.using = -1;
			for (var i = 0; i < this.size; i++)
				if (save[i] !== "empty" && exists(save[i].t)){
					//console.log(save[i]);
					this.spaces[i] = new Trpg.Item(save[i].t);
					this.spaces[i].amt = save[i].a;
					this.spaces[i].space = i;
				} else if (save[i] == "empty")
					this.spaces[i] = "empty";
				
			//for (var i = 0; i < 35; i++)
			//	console.log(this.spaces[i].space);
			/*if (!this.hasitem("Tinderbox"))
				this.additem(new Trpg.Item("Tinderbox"));
			if (!this.hasitem("Hoe"))
				this.additem(new Trpg.Item("Hoe"));*/
		}
		this.getempty = function(){
			var empty = 0;
			for (var i = 0; i < this.size; i++)
				if (this.spaces[i] == "empty")
					empty++;
			return empty;
		}
		this.hasitem = function(item,amt){
			amt = amt || 1;
			for (var i = 0; i < this.size; i++)
				if (this.spaces[i].type == item)
					amt-=this.spaces[i].amt;
			return amt <= 0;
		}
		this.getitemamt = function(item){
			for(var i = 0; i < this.size; i++)
				if (!this.hasitem(item,i))
					return i;
		}
		this.dropitem = function(item){
			Trpg.board.ground.dropitem(item,Trpg.player.loc);
			if (!item.infinite)
				this.spaces[item.space] = "empty";
		}
		this.pickupitem = function(item,wl){
			var items = Trpg.board.ground.items[wl.toStr()];
		//	console.log(items);
			//console.log(item);
			for (var i = 0; i < items.length; i++)
				if (items[i].item == item)
					return this.additem(items.splice(i,1)[0].item);
		}/*
		this.deleteitem = function(item){
			if (typeof item == "string"){
				for (var i = 0; i < this.size; i++)
					if (this.spaces[i] !== "empty" && this.spaces[i].type == item){
						this.spaces[i] = "empty";
						return;
					}
			}
			else this.spaces[item.space] = "empty";
		}*/
		this.removeitem = function(item,amt){
			if (item.infinite)	return;
			amt = amt || 1;
			if (typeof item !== "string"){
				if (item.stackable){
					item.amt-=amt;
					if (item.amt <= 0)
						this.spaces[item.space] = "empty";
					return;
				}
				//for (var i = 0; i < this.size && amt > 1; i++)
					
				this.spaces[item.space] = "empty";
				return;
			}
			for (var i = 0; i < this.size && amt > 0; i++)
				if (this.spaces[i] !== "empty" && this.spaces[i].type == item){
					this.spaces[i] = "empty";
					amt--;
				}
			return;
			
				for (var i = 0; i < this.size && amt > 0; i++)
					if (this.spaces[i] !== "empty"){
						if (typeof item == "string"){
							if (this.spaces[i].type == item)
								item = this.spaces[i];
							else continue;
						}
						//item = this.spaces[i];
						if (item.stackable){
							if (item.atm > amt)
								item.amt-=amt;
							else 
								this.spaces[item.space] = "empty";
							return;
						}
						else {
							this.spaces[item.space] = "empty";
							amt--;
						}
						/*
						if (item.amt <= 0){
							this.spaces[i] = "empty"
							if (item.stackable){
								item.amt = amt;
								break;
							}
							else item.amt = 1;
						}
						if (amt <= 0)
							break;*/
					}
					
					return;
			while (amt > 0){
				if (typeof item == "string"){
					for (var i = 0; i < this.size; i++)
						if (this.spaces[i] !== "empty" && this.spaces[i].type == item){
							this.spaces[i].amt--;
							break;
						}
				}
				else 	this.spaces[item.space].amt--;
				for (var i = 0; i < this.size; i++)
					if (this.spaces[i] !== "empty" && this.spaces[i].amt < 1)// && !this.spaces[i].infinite)
							this.spaces[i] = "empty";
				amt--;
			}
			
		}
		this.render = function(g){
			this.mousemove("blah",Ms.getMouse());
			g.lineWidth = 1;
			g.translate(sx*2,sy*2);
			for (var i = 0; i < this.size; i++){
				g.save();
			//	 if (this.using !==-1)console.log(this.using);
				if ((this.using !==-1 && this.using.space == i)
				|| (this.withdrawing !==-1 && this.spaces[i] !== "empty"))
					g.strokeStyle = "white";
				g.translate(64*Math.floor(i%5),64*Math.floor(i/5));//+64*Math.floor(i%5),20+64*Math.floor(i/5),62,62);
				//g.strokeStyle = "black";
				g.scale(2,2);
				if (this.spaces[i] !== "empty")
					this.spaces[i].render(g,0,0);//+32*Math.floor(i%5),10+32*Math.floor(i/5));
				g.strokeRect(0,0,31,31);
				//g.translate(20,10);
				if (hasaction() && getaction().owner == this.spaces[i])
					getaction().renderp(g);
				/*if (Trpg.Home.get("Gameplay").has("currentaction")
					&&!Trpg.Home.get("Gameplay.currentaction").board
					&&Trpg.Home.get("Gameplay.currentaction").space==i)
					Trpg.Home.get("Gameplay.currentaction").renderp(g);*/
				g.scale(1/2,1/2);
				g.restore();
			}
		}
	}
	this.Item = function(type){
		function Default(){
			this.type = "default";
			this.alchable = true;
			this.alchvalue = 0;
			this.board = false;
			this.stackable = false;
			this.infinite = false;
			this.setinfinite = function(inf){
				this.infinite = inf;
				return this;
			}
			this.copy = function(){
				return new Trpg.Item(this.type).sets(this);
			}
			this.getstate = function(){	return this.type}
			this.actions = ["use","drop"];
			this.amt = 1;
			this.setamt = function(amt){
				this.amt = amt;
				return this;
			}
			this.useon = function(on){
				//console.log("rvet")
				//console.log(Trpg.invent.using);
				if (on.type == "Chest" || on.type == "BankChest"){
					on.additem(Trpg.invent.using);
					Trpg.invent.removeitem(Trpg.invent.using,Trpg.invent.using.amt);
				}
				Trpg.invent.using = -1;
			}
			this.doaction = function(action){
				if (!exists(action))	action = this.getActions()[0];
				switch (action){
					case "use":
						Trpg.invent.using = this;
						//console.log(Trpg.invent.using);
						break;
					case "drop":
						Trpg.invent.dropitem(this);
						break;
				}
			}
			this.fillmenu = function(menu){
				//menu.removeall();
				var that = this;
				if (Trpg.invent.using !== -1){
					menu.additem(function(){
						Trpg.invent.using.useon(that);
						return "close,empty";
					},Trpg.invent.using.type+" -> "+that.type);
					return;
					/*(function(a){return function(){
						Trpg.invent.pickupitem(a,that.wl.copy());
						return "remove";
						//that.doaction(items[a]);
						//return "close";
					};})((function(b){return items[b].item})(i))
					//items[i].item)
					,items[i].item.type,"orange");*/
				}
				var actions = [];
				for (var i = 0; i < this.actions.length; i++)
					actions.push(this.actions[i]);
				if (K.Keys.shift.down && actions.indexOf("drop")!==-1)
					actions.unshift(actions.splice(actions.indexOf("drop"),1)[0]);
				for (var i = 0; i < actions.length; i++)
					menu.additem((function(a){return function(){
						that.doaction(actions[a]);
						return "close";
						};})(i),actions[i].charAt(0).toUpperCase()+actions[i].substring(1));
			}
			this.getActions = function(){	return this.actions;	}
			this.hasAction = function(action){	return this.getActions().indexOf(action)!=-1;}
			this.render = function(g,x,y){
				g.drawImage(Ast.i(this.type.toLowerCase()),x,y);
				g.font = "8px Arial";
				g.fillStyle = "yellow";
				var text = amt2text(this.amt);
				if (text.indexOf("b")!==-1)	g.fillStyle = "cyan";
				if (text.indexOf("m")!==-1)	g.fillStyle = "#41DB00";
				if (text.indexOf("k")!==-1)	g.fillStyle = "white";
				
				if (this.stackable)
					g.fillText(text,x+2,y+7);
			}
		}
		var items = {
			Coins:function(){
				this.type = "Coins";
				this.stackable = true;
				this.alchable = false;
				return this;
			},
			Bones:function(){
				this.type = "Bones";
				return this;
			},
			Log:function(){
				this.type = "Log";
				var that = this;
				this.useon = function(on){
					Trpg.invent.using = -1;
				if (on.type == "Chest" || on.type == "BankChest"){
					on.additem(Trpg.invent.using);
					Trpg.invent.removeitem(Trpg.invent.using);
				}
					switch (on.type){
						case "Tinderbox":
							this.doaction("light");
							break;
						case "FireSmall":
							//var timer = new Utils.Timer(1).start().setAuto(true,function(){
								on.doaction("fuel");
								//Trpg.board.setTile(new Trpg.Tiles.FireBig"),on.wl);
								Trpg.invent.removeitem(that);
							break;
							// }).setKilloncomp(true);
							//timer.board = false;
							//timer.space = this.space;
							//Trpg.Home.add(timer,"Gameplay.currentaction");
					}
				}
				this.doaction = function(action){
					if (!exists(action))	action = this.getActions()[0];
					switch (action){
						case "light":
							if (!Trpg.board.getTile(Trpg.player.loc).getTrait("burnable"))
								return;
							startaction(function(){
								Trpg.board.setTile(new Trpg.Tiles.FireBig(),Trpg.player.loc);
								Trpg.invent.removeitem(this);
							},this,1.3);
							/*var timer = new Utils.Timer(1.3).start().setAuto(true,function(){
								Trpg.board.setTile(new Trpg.Tiles.FireBig"),Trpg.player.loc);
								Trpg.invent.removeitem(that);
							}).setKilloncomp(true);
							timer.board = false;
							timer.space = this.space;
							Trpg.Home.add(timer,"Gameplay.currentaction");*/
							//Trpg.board.setTile(Hole.call(new Default()),this.wl);
							break;
						case "use":
							Trpg.invent.using = this;
							break;
						case "drop":
							Trpg.invent.dropitem(this);
							break;
					}
				}
				return this;
			},
			Seed:function(){
				this.type = "Seed";
				var that = this;
				this.stackable = true;
				this.actions = ["use","drop"];
				this.useon = function(on){
					Trpg.invent.using = -1;
				if (on.type == "Chest" || on.type == "BankChest"){
					on.additem(Trpg.invent.using);
					Trpg.invent.removeitem(Trpg.invent.using);
				}
					switch (on.type){
						case "Hole":
							on.doaction("plant");
							Trpg.invent.removeitem(this);
							break;
					}
				}
				/*this.render = function(g,x,y){
					g.fillStyle = "yellow";
					g.fillText("Seed",x+5,y+20);
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}*/
				return this;
			},
			// {ores
			Ore:function(type,alch){
				this.type = type+"Ore";
				this.alchvalue = alch;
				return this;
			},
			TinOre:function(){return items.Ore.call(this,"Tin",2)},
			CopperOre:function(){return items.Ore.call(this,"Copper",2)},
			CoalOre:function(){/*this.stackable = true;*/return items.Ore.call(this,"Coal",20)},
			IronOre:function(){return items.Ore.call(this,"Iron",10)},
			MithrilOre:function(){return items.Ore.call(this,"Mithril",120)},
			AdamantOre:function(){return items.Ore.call(this,"Adamant",250)},
			RuneOre:function(){return items.Ore.call(this,"Rune",2000)},
			EterniumOre:function(){return items.Ore.call(this,"Eternium",9000)},
			// }
			// {bars
			Bar:function(type,alch){
				this.type = type+"Bar";
				this.alchvalue = alch;
				var metals = {
					EterniumBar:[{t:"EterniumOre",a:1},{t:"CoalOre",a:12}],
					RuneBar:[{t:"RuneOre",a:1},{t:"CoalOre",a:8}],
					AdamantBar:[{t:"AdamantOre",a:1},{t:"CoalOre",a:6}],
					MithrilBar:[{t:"MithrilOre",a:1},{t:"CoalOre",a:4}],
					SteelBar:[{t:"IronOre",a:1},{t:"CoalOre",a:2}],
					IronBar:[{t:"IronOre",a:1}],
					BronzeBar:[{t:"TinOre",a:1},{t:"CopperOre",a:1}],
				}
				this.cansmelt = function(){
					//console.log(this.type);
					var reqs = metals[this.type];
					for (var i = 0; i < reqs.length; i++)
						if (!Trpg.invent.hasitem(reqs[i].t,reqs[i].a))
							return false;
						return true;
				}
				this.smelt = function(furnace){
					var that = this;
					var wl = furnace.wl;
					startaction(function(){
						//getaction().setKilloncomp(true);
						var reqs = metals[that.type];
						for (var i = 0; i < reqs.length; i++)
							Trpg.invent.removeitem(reqs[i].t,reqs[i].a);
						if (that.type !== "IronBar" || Math.random()>.5)
						Trpg.invent.additem(new Trpg.Item(that.type));
						if (!that.cansmelt())	getaction().setKilloncomp(true);
					},furnace,1.3,true);
					/*var timer = new Utils.Timer(1.3).start().setLoop(true).setAuto(true,function(){
						timer.setKilloncomp(true);
						var reqs = metals[that.type];
						for (var i = 0; i < reqs.length; i++)
							Trpg.invent.removeitem(reqs[i].t,reqs[i].a);
						if (that.type !== "IronBar" || Math.random()>.5)
						Trpg.invent.additem(new Trpg.Item(that.type));
						if (that.cansmelt())	timer.setKilloncomp(false);
					});
					timer.board = true;
					timer.wl = wl;
					Trpg.Home.add(timer,"Gameplay.currentaction");*/
				}
				return this;
			},
			BronzeBar:function(){return items.Bar.call(this,"Bronze",4)},
			IronBar:function(){return items.Bar.call(this,"Iron",16)},
			SteelBar:function(){return items.Bar.call(this,"Steel",60)},
			MithrilBar:function(){return items.Bar.call(this,"Mithril",180)},
			AdamantBar:function(){return items.Bar.call(this,"Adamant",375)},
			RuneBar:function(){return items.Bar.call(this,"Rune",3000)},
			EterniumBar:function(){return items.Bar.call(this,"Eternium",15000)},
			// }
			// {weapons
			Weapon:function(metal,type,alch){
				this.type = metal+type;
				this.alchvalue = alch;
				return this;
			},
			BronzeDagger:function(){return items.Weapon.call(this,"Bronze","Dagger",items.BronzeBar().alchvalue*1);},
			IronDagger:function(){return items.Weapon.call(this,"Iron","Dagger",items.IronBar().alchvalue*1);},
			SteelDagger:function(){return items.Weapon.call(this,"Steel","Dagger",items.SteelBar().alchvalue*1);},
			MithrilDagger:function(){return items.Weapon.call(this,"Mithril","Dagger",items.MithrilBar().alchvalue*1);},
			AdamantDagger:function(){return items.Weapon.call(this,"Adamant","Dagger",items.AdamantBar().alchvalue*1);},
			RuneDagger:function(){return items.Weapon.call(this,"Rune","Dagger",items.RuneBar().alchvalue*1);},
			EterniumDagger:function(){return items.Weapon.call(this,"Eternium","Dagger",items.EterniumBar().alchvalue*1);},
			// }
			// {armor
			Armor:function(metal,type,alch){
				this.type = metal+type;
				this.alchvalue = alch;
				return this;
			},
			BronzeHelm:function(){return items.Weapon.call(this,"Bronze","Helm",items.BronzeBar().alchvalue*2);},
			BronzeBody:function(){return items.Weapon.call(this,"Bronze","Body",items.BronzeBar().alchvalue*5);},
			BronzeLegs:function(){return items.Weapon.call(this,"Bronze","Legs",items.BronzeBar().alchvalue*4);},
			BronzeKite:function(){return items.Weapon.call(this,"Bronze","Kite",items.BronzeBar().alchvalue*3);},
			IronHelm:function(){return items.Weapon.call(this,"Iron","Helm",items.IronBar().alchvalue*2);},
			IronBody:function(){return items.Weapon.call(this,"Iron","Body",items.IronBar().alchvalue*5);},
			IronLegs:function(){return items.Weapon.call(this,"Iron","Legs",items.IronBar().alchvalue*4);},
			IronKite:function(){return items.Weapon.call(this,"Iron","Kite",items.IronBar().alchvalue*3);},
			SteelHelm:function(){return items.Weapon.call(this,"Steel","Helm",items.SteelBar().alchvalue*2);},
			SteelBody:function(){return items.Weapon.call(this,"Steel","Body",items.SteelBar().alchvalue*5);},
			SteelLegs:function(){return items.Weapon.call(this,"Steel","Legs",items.SteelBar().alchvalue*4);},
			SteelKite:function(){return items.Weapon.call(this,"Steel","Kite",items.SteelBar().alchvalue*3);},
			MithrilHelm:function(){return items.Weapon.call(this,"Mithril","Helm",items.MithrilBar().alchvalue*2);},
			MithrilBody:function(){return items.Weapon.call(this,"Mithril","Body",items.MithrilBar().alchvalue*5);},
			MithrilLegs:function(){return items.Weapon.call(this,"Mithril","Legs",items.MithrilBar().alchvalue*4);},
			MithrilKite:function(){return items.Weapon.call(this,"Mithril","Kite",items.MithrilBar().alchvalue*3);},
			AdamantHelm:function(){return items.Weapon.call(this,"Adamant","Helm",items.AdamantBar().alchvalue*2);},
			AdamantBody:function(){return items.Weapon.call(this,"Adamant","Body",items.AdamantBar().alchvalue*5);},
			AdamantLegs:function(){return items.Weapon.call(this,"Adamant","Legs",items.AdamantBar().alchvalue*4);},
			AdamantKite:function(){return items.Weapon.call(this,"Adamant","Kite",items.AdamantBar().alchvalue*3);},
			RuneHelm:function(){return items.Weapon.call(this,"Rune","Helm",items.RuneBar().alchvalue*2);},
			RuneBody:function(){return items.Weapon.call(this,"Rune","Body",items.RuneBar().alchvalue*5);},
			RuneLegs:function(){return items.Weapon.call(this,"Rune","Legs",items.RuneBar().alchvalue*4);},
			RuneKite:function(){return items.Weapon.call(this,"Rune","Kite",items.RuneBar().alchvalue*3);},
			EterniumHelm:function(){return items.Weapon.call(this,"Eternium","Helm",items.EterniumBar().alchvalue*2);},
			EterniumBody:function(){return items.Weapon.call(this,"Eternium","Body",items.EterniumBar().alchvalue*5);},
			EterniumLegs:function(){return items.Weapon.call(this,"Eternium","Legs",items.EterniumBar().alchvalue*4);},
			EterniumKite:function(){return items.Weapon.call(this,"Eternium","Kite",items.EterniumBar().alchvalue*3);},
			DragonBody:function(){return items.Weapon.call(this,"Dragon","Body",75000);},
			// }
			Ladder:function(){
				this.type = "Ladder";
				this.render = function(g,x,y){
					g.drawImage(Ast.i("ladderup"),x,y);
				}
				return this;
			},
			Tinderbox:function(){
				this.type = "Tinderbox";
				this.useon = function(on){
					Trpg.invent.using = -1;
				if (on.type == "Chest" || on.type == "BankChest"){
					on.additem(Trpg.invent.using);
					Trpg.invent.removeitem(Trpg.invent.using);
				}
					switch (on.type){
						case "Log":
							on.doaction("light");
							break;
					}
				}
				this.render = function(g,x,y){
					g.fillStyle = "yellow";
					g.fillText("Tind",x+5,y+20);
				}
				return this;
			},
			Hoe:function(){
				this.type = "Hoe";
				this.actions = ["use"];
				this.useon = function(on){
					Trpg.invent.using = -1;
					switch (on.type){
						case "Grass":
							on.doaction("plow");
							break;
					}
				}
				this.doaction = function(action){
					if (!exists(action))	action = this.getActions()[0];
					switch (action){
						case "use":
							Trpg.invent.using = this;
							break;
						//case "drop":
						//	Trpg.invent.dropitem(this);
						//	break;
					}
				}
				this.render = function(g,x,y){
					g.fillStyle = "yellow";
					g.fillText("Hoe",x+5,y+20);
					if (this.stackable)
						g.fillText(this.amt,x+5,y+10);
				}
				return this;
			},
			Hammer:function(){
				this.type = "Hammer";
				return this;
			},
			Knife:function(){
				this.type = "Knife";
				this.useon = function(on){
				if (on.type == "Chest" || on.type == "BankChest"){
					on.additem(Trpg.invent.using);
					Trpg.invent.removeitem(Trpg.invent.using);
				}
					Trpg.invent.using = -1;
					if (on.type !== "Log")return;// || !Trpg.invent.hasitem("Log",5))	return;
					//alert("wassup doc");
					var menu = new Trpg.Menu();//Trpg.toolbox.menu;
					//menu.removeall();
					menu.additem(function(){
						if (Trpg.invent.hasitem("Log",5)){
							Trpg.invent.removeitem("Log",5);
							Trpg.invent.additem(new Trpg.Item("Ladder"));
						}/* else {
							Trpg.board.container.add(new feedback("You need 5 logs for this",
							10,10),"feedback");
							//Trpg.player.loc.dx(wl)*32+16+Trpg.board.container.camera.x,
							//Trpg.player.loc.dy(wl)*32+Trpg.board.container.camera.y,1.5),"feedback");
						}*/
						return "delete";
					},"Ladder 5 logs","#703D00");
					var c = Trpg.toolbox;
					menu.open(c.boxx(Ms.x())-15,c.boxy(Ms.y())-15);
					c.add(menu,"othermenu");
				}
				return this;
			}
		}
		return items[type].apply(new Default());
		//console.log(i);
		//return i;
	}
	//UI.Clickable.call(this.Item.prototype);
	this.Map = new (function(){
		/*this.chunks = [];
		this.addchunk = function(chunk){
			this.chunks.push({
				wl:chunk.wl.copy(),
				img:chunk.getimg()
			})
		}*/
		this.save = function(){
			var loaded = [];
			for (var p in this.tiles)
				loaded.push({wl:p,t:this.tiles[p]});
				//loaded.push(JSON.stringify(this.tiles[p].wl));
			return loaded;
		}
		this.load = function(loads){
			for (var i = 0; i < loads.length; i++)
				this.tiles[loads[i].wl] = loads[i].t;
				//this.addtile(Trpg.board.getTile(JSON.parse(loads[i])));
		}
		this.tiles = {};
		this.addtile = function(tile){
			var tiles = this.tiles[tile.loc.dim];
			if (!exists(tiles)) this.tiles[tile.loc.dim] = {}
			var s = "x"+tile.loc.x()+"y"+tile.loc.y();
			if (!exists(this.tiles[tile.loc.dim][s]))
				this.tiles[tile.loc.dim][s] = {c:tile.getcolor(),v:tile.loc.indist(Trpg.player.loc,Trpg.board.viewsize)};
			//if (!exists(tiles)){
			//	this.tiles[tile.loc.dim] = {};
			//	this.tiles[tile.loc.dim][] = 
			// }
			else this.tiles[tile.loc.dim][s].c = tile.getcolor();
			/*
			return;
			var t = this.tiles[tile.loc.toStr()];
			if (!exists(t))
				this.tiles[tile.loc.toStr()] = {c:tile.getcolor(),v:tile.loc.indist(Trpg.player.loc,Trpg.board.viewsize)};
			else this.tiles[tile.loc.toStr()].c = tile.getcolor();
			*/
			//if (!exists(this.tiles[tile.loc.toStr()])
			//var o = {wl:tile.loc,col:tile.getcolor()};
			//if (this.tiles.indexOf(o) == -1)
			//	this.tiles.push(o);
		}
		this.init = function(){
		//	this.rl = 1;
			this.r = 34;
			this.s = 6;
			this.container.camera.centerZero();
			var c = this.container;
			//c.color = "clear";
			this.defaultdims = {
				x:c.x,
				y:c.y,
				w:c.w,
				h:c.h
			}
			//this.invisible = true;
		}
		this.getwl = function(m){
			var wl = Trpg.player.loc.copy();
			var c = this.container;
			var bmx = c.boxx(m.x);
			var bmy = c.boxy(m.y);
			bmx-=c.camera.x-this.s/2;
			bmy-=c.camera.y-this.s/2;
			bmx/=this.s;
			bmy/=this.s;
			wl.shift(Math.floor(bmx),Math.floor(bmy));
			return wl.copy();
		}
		this.mousedown = function(e,m){
			if (e.button !== 0)	return;
			if (this.container.mouseonbox(m)){
				if (!window.mobile){
					var wl = this.getwl(m);
					if (exists(this.tiles[wl.dim]["x"+wl.x()+"y"+wl.y()]))
						Trpg.player.settarget({loc:wl});
				}
				//this.container.fullscreen = !this.container.fullscreen;
			//Trpg.board.setTile(new Trpg.Tiles.Chest"),new Trpg.WorldLoc(-1,1,5,5));return;
				else if (this.container.fullscreen){
					var wl = this.getwl(m);
					if (exists(this.tiles[wl.dim]["x"+wl.x()+"y"+wl.y()]))
						Trpg.player.settarget({loc:wl});
					e.preventDefault();
					this.r = 34;
					this.s = 6;
					var d = this.defaultdims;
					this.container.x = d.x;
					this.container.y = d.y;
					this.container.w = d.w;
					this.container.h = d.h;
					this.container.camera.reset();
					this.container.camera.centerZero();
					//Trpg.Home.get("Gameplay.Menus").invisible = false;
					
				} else {//*
					//this.r = 41;
					this.r = 17;
					//this.s = 10;
					this.s = 25;
					this.container.x = 0;
					this.container.y = 0;
					this.container.w = 800;
					this.container.h = 800;
					this.container.camera.reset();
					this.container.camera.centerZero();//*/
					//Trpg.Home.get("Gameplay.Menus").invisible = true;
				//alert("clicked on"+this.container.systemname);
				//	Trph.board.invisible = true;
				}
				this.container.fullscreen = !this.container.fullscreen;
				return true;
			}
			Trpg.toolbox.over = "map";
			e.preventDefault();
		}
		this.render = function(g){
			//return;
			//if (this.container.fullscreen)
			//g.globalAlpha = .75;
			g.translate(-Trpg.player.loc.mx*this.s/32,-Trpg.player.loc.my*this.s/32);
			var wl = Trpg.player.loc.copy();
			var x = wl.x();
			var y = wl.y();
			var v = Trpg.board.viewsize;
			for (var i = -this.r; i < this.r; i++)
				for (var j = -this.r; j < this.r; j++){
					var t = this.tiles[wl.dim]["x"+(x+i)+"y"+(y+j)];
					if (!exists(t)) continue;
					var indist = Math.max(Math.abs(i),Math.abs(j)) < v;
					if (!t.v && indist) t.v = true;
					if (!t.v)	continue;
					g.fillStyle = t.c;
					g.fillRect(this.s*i,this.s*j,this.s+1,this.s+1);
				}
			g.translate(Trpg.player.loc.mx*this.s/32,Trpg.player.loc.my*this.s/32);
			g.fillStyle = "white";
			//if (!this.container.fullscreen)
			g.fillRect(-this.s/2,-this.s/2,this.s+1,this.s+1);
			return;
			
			
			
			
			/*for (var i = -this.r; i < this.r; i++)
				for (var j = -this.r; j < this.r; j++){
					var wl = Trpg.player.loc.copy().shift(i,j);
					var t = this.tiles[wl.toStr()];
					if (!exists(t))	continue;
					if (!t.v && Trpg.player.loc.indist(wl,Trpg.board.viewsize))	t.v = true;
					if (!t.v)		continue;
					g.fillStyle = t.c;
					//g.fillStyle = Trpg.board.getTile().getcolor();
					g.fillRect(this.s*i,this.s*j,this.s+1,this.s+1);
				}
			g.translate(Trpg.player.loc.mx*this.s/32,Trpg.player.loc.my*this.s/32);
			g.fillStyle = "white";
			g.fillRect(-this.s/2,-this.s/2,this.s+1,this.s+1);*/
		}
	})();
	function feedback2(str,x,y,l){
		var sx = x;
		var sy = y;
		this.init = function(){
			this.timer = new Utils.Timer(l||2).start();
			this.rl = 2;
			/*var timer = new Utils.Timer(delay).start().setAuto(true,function(){
				infunc();
			}).setKilloncomp(true);*/
		}
		this.update = function(d){
			this.timer.update(d);
			if (this.timer.consume())
				this.container.remove(this);
		}
		this.render = function(g){
			var x = sx;
			var y = sy;
			if (this.container.systemname=="Board"){
				x-=Trpg.player.loc.mx;
				y-=Trpg.player.loc.my;
			}
			//g.font = "20px Arial";
			var w = g.measureText(str).width+5;
			var h = g.measureText("M").width+5;
			g.fillStyle = "white";
			g.globalAlpha = .5;
			g.fillRect(x-w/2,y-h/2,w,h);
			g.globalAlpha = 1;
			g.fillStyle = "black";
			//Drw.drawCText(g,str,sx-Trpg.board.mx,sy-Trpg.board.my);
			//g.font = (parseInt(g.font.substring(0,g.font.indexOf("px")))-1)+g.font.substring(g.font.indexOf("px"));
			//g.fillStyle = "white";
			Drw.drawCText(g,str,x,y);
		}
	}
	function sendfeedback(str){
		var G = Trpg.Home.get("Gameplay.Menus");
		G.add({
			x:G.boxx(Ms.x()),
			y:G.boxy(Ms.y()),
			str:str,
			init:function(){
				this.timer = new Utils.Timer(2).start();
				this.rl = 1;
			},
			update:function(d){
				this.timer.update(d);
				if (this.timer.consume())
					this.container.remove(this);
			},
			render:function(g){
				Drw.drawCText(g,this.str,this.x,this.y,{boxcolor:"white",textcolor:"black"});
			}
		},"feedback");
	}
	this.Menu = function(x,y,w,h){
		var menu = new UI.DBox(x,y,w,h);
		menu.exitonclose = false;
		menu.itemcount = 0;
		menu.setheader = function(text,color){
			var btn = new UI.Button(0,0,20,45);
			btn.sets({isOver:function(){return false},text:text,color:color||btn.color});
			menu.h+=45;
			menu.add(btn,"header");
		}
		menu.additem = function(onclick,text,color){
			var btn = new UI.Button(0,menu.h,20,45);
			var click = function(){
				onclick && menu.removeitem(this,onclick());
				//onclick && menu.removeitem(this,onclick());
			}
			btn.sets({onclick:click,text:text,color:color||btn.color});
			menu.h+=45;
			menu.add(btn,"item"+(menu.itemcount++));
		}
		menu.onempty = function(){};
		menu.getactive = function(){
			var count = 0;
			for (var i = 0; i < menu.itemcount; i++)
				if (menu.has("item"+i))
					count++;
			return count;
		}
		menu.removeitem = function(item,modifier){
			if (typeof modifier !== "string")	return;
			if (modifier.indexOf("remove")!==-1){
				var q = menu.getq();
				if (modifier.indexOf("tremove")!==-1)
					item.hidden = true;
				else {
				//	console.log(item);
					menu.remove(item);
					//menu.itemcount--;
					//q = menu.getq();
					//for (var j = 0; j < menu.itemcount; j++)
					//	if (!menu.has("item"+j))
					//		for (var i = j; i < menu.itemcount; i++)
					//			menu.get("item"+i).systemname = "item"+(i-1);
					/*var j = 0;
					for (var p in q){
						console.log(q[p]);
						if (q[p].systemname && q[p].systemname.indexOf("item")!==-1)
							if (parseInt(q[p].systemname.substring(4)) > j)	q[p].systemname = "item"+(j--);
					}*/
				}
				for (var i = parseInt(item.systemname.substring(4)); i < menu.itemcount; i++)
					if (menu.has("item"+i)){
						menu.get("item"+i).y-=45;
						//menu.get("item"+i).systemname = "item"
						//menu.h-=45;
					}
				if (false){	
				for (var p in q){
					if (q[p].systemname && q[p].systemname.indexOf("item")!==-1 && 
						parseInt(q[p].systemname.substring(4)) >= parseInt(item.systemname.substring(4))){
							q[p].y-=45;
					}
				}}
					//for (var p in q)
					//	console.log(q[p].systemname);
			}
			if (modifier.indexOf("close")!==-1)
				menu.close(modifier.indexOf("empty")!==-1);
			if (modifier.indexOf("empty")!==-1)
				menu.removeall();
			for (var i = 0, j = 0; i < menu.itemcount; i++)
				if (menu.has("item"+i))j++;
			if (j == 0)
				menu.onempty();
			if (modifier.indexOf("delete")!==-1)
				menu.container.remove(menu);
		}
		menu.removeall = function(){
			if (menu.has("header"))
				menu.remove("header");
			for (var i = 0; i < menu.itemcount; i++)
				if (menu.has("item"+i))
				menu.remove("item"+i);
			menu.itemcount = menu.h = 0;
			menu.onempty();
			return;
			var q = menu.getq();
			for (var p in q)
				if (q[p].systemname && q[p].systemname.indexOf("item")!==-1)
					menu.remove(q[p]);
			menu.itemcount = menu.h = 0;
				//console.log(q[p].systemname);
		}
		menu.adjwidths = function(g){
			//console.log("D2w34gtyh");
			var x = menu.x;
			var y = menu.y;
			var max = 0;
			menu.h = 0;
			menu.w = 0;
			if (this.has("header")){
				var h = this.get("header")
				h.y =0;//-45;//menu.h;
				h.adjust(g);
				menu.h+=45;
				if (h.w>max)
					max = h.w;
				//menu.h+=45;
				//menu.y-=45;
			}
			for (var i = 0; i < menu.itemcount; i++){
				if (!menu.has("item"+i))
					continue;
				var item = menu.get("item"+i);
				item.y = menu.h;
				menu.h+=45;
				item.adjust(g);
				if (item.w>max)
					max = item.w;
			}
			//	menu.h-=45;
			if (menu.has("header"))
				menu.get("header").w = max;
			for (var i = 0; i < menu.itemcount; i++)
				if (menu.has("item"+i))
				menu.get("item"+i).w = max;
			
			menu.w = max;
			var cc= Trpg.Home;
			while (cc.boxx(menu.screenx(menu.w))>cc.w&&cc.boxx(menu.screenx(menu.w))>0)	menu.x--;
			while (cc.boxy(menu.screeny(menu.h))>=cc.h&&cc.boxy(menu.screeny(menu.y))>0)	menu.y--;
			//while (cc.boxx(menu.screenx(menu.x))<0)	menu.x++;
			//while (cc.boxy(menu.screeny(menu.y))<90)	menu.y++;
			if (cc.boxy(menu.screeny(menu.h))>cc.h){
				//menu.x = x-max/2;
				//menu.w*=2;//=max*2;
				menu.w = max;
				var h = 0;
				if (menu.has("header")){
					h = 45;
					menu.get("header").x=max/2;
				}
				for (var i = 0, w = max; i < menu.itemcount; i++)
					if (menu.has("item"+i)){
						var item = menu.get("item"+i);
						item.x = 0;//menu.x;//-max;
						//if (item.y+45<menu.h)continue;
						if (cc.boxy(menu.screeny(item.y+45))<cc.h)continue;
						menu.w = w;
						item.x+=menu.w;
						item.y = h;
						h+=45;
						if (cc.boxy(menu.screeny(h+45+menu.y))>cc.h){
							menu.h = h;
							h = 0;
							w+=max;
							if (menu.has("header")){
								h+=45;
								menu.get("header").x+=max/2;
							}
							//menu.w+=max;
							//menu.x-=max/2;
						}
					}
					menu.w+=max;
			} //else console.log("FDWErgthyj")
			//menu.x -= menu.w/2;
			//while (cc.boxx(menu.screenx(menu.x+menu.w))>cc.w&&cc.boxx(menu.screenx(menu.x+menu.w))>0)	menu.x--;
		}
		menu.add({rl:1,mousemove:function(e,m){
			if (!menu.mouseonbox(m))
				menu.close();
		}});
		menu.moveto = function(x,y){
			menu.x = x;
			menu.y = y;
		}
		menu.open = function(x,y){
			menu.hidden = false;
			x&&y&&menu.moveto(x,y);
			return this;
		}
		menu.close = function(empty){
			menu.hidden = true;
			if (empty)	menu.removeall();
			if (menu.exitonclose)
				menu.container.remove(menu);
		}
		return menu;
	}
	function BoardMenu(wl){
		var z = Trpg.board.container.camera.getzoom();
		var menu = new Trpg.Menu();
		menu.x = 400+(Trpg.player.loc.dx(wl)*32-Trpg.player.loc.mx+16)*z-menu.w/2;
		menu.y = 415+(Trpg.player.loc.dy(wl)*32-Trpg.player.loc.my)*z;
		menu.init=  function(){
			this.container.add({rl:-1,
			keydown:function(k){
				menu.close(true);
			},
			update:function(){
				menu.x = 400+(Trpg.player.loc.dx(wl)*32-Trpg.player.loc.mx+16)*z-menu.w/2;
				menu.y = 415+(Trpg.player.loc.dy(wl)*32-Trpg.player.loc.my)*z;
			},
			render:function(g){
				menu.adjwidths(g);
				menu.x = 400+(Trpg.player.loc.dx(wl)*32-Trpg.player.loc.mx+16)*z-menu.w/2;
				menu.y = 415+(Trpg.player.loc.dy(wl)*32-Trpg.player.loc.my)*z;
			}
		})}
		menu.close();
		Trpg.Home.add(menu,"Gameplay.");
		return menu;
	}
	function startaction(action,owner,length,loop){
		var timer = new Utils.Timer(length).start().setLoop(loop).setAuto(true,action.bind(owner)).setKilloncomp(!loop);
		timer.owner = owner;
		Trpg.Home.add(timer,"Gameplay.action");
		//Trpg.player.nexttile = Trpg.player.loc.copy();
		//Trpg.player.path = [];
		//Trpg.player.settarget(Trpg.player.nexttile.copy());
		/*function(){
			if (hasseed){
				Trpg.board.container.add(new feedback("You find a seed",
				Trpg.player.loc.dx(wl)*32+16+Trpg.board.container.camera.x,
				Trpg.player.loc.dy(wl)*32+Trpg.board.container.camera.y,1.5),"feedback");
				Trpg.invent.additem(new Trpg.Item("Seed"))
				hasseed = false;
			}
		}).setKilloncomp(true);
		timer.board = true;
		timer.wl = wl;
		Trpg.Home.add(timer,"Gameplay.currentaction");*/
	}
	function cancelaction(){
		if (hasaction())
				Trpg.Home.get("Gameplay").remove("action");
			
				//console.log("cancelaction");
		//Trpg.player.settarget(Trpg.player.loc);
	}
	function hasaction(){
		return Trpg.Home.get("Gameplay").has("action");
	}
	function getaction(){
		if (hasaction())
			return Trpg.Home.get("Gameplay.action");
	}
	this.Console = new (function(){
		this.history = [];
		this.vhistory= [];
		this.phistory= [];
		this.timers  = [];
		function msg(message, user, color){
			return {m:message,u:user,c:color};
		}
		this.add = function(message, color, user){
			this.history.push(msg(message,user,color));
			this.vhistory.push(msg(message,user,color));
			this.last = message;
			if (user == Trpg.player.username)
				this.phistory.push(msg(message,user,color));
		}
		this.render = function(g){
			var texts = this.vhistory;
			var h = 27;
			for (var i = 0; i < texts.length && i < 10; i++){
				var u = texts[texts.length-i-1].u || "";
				if (u !== "")	u+=": ";
				Drw.drawCText(g,u+texts[texts.length-i-1].m,3,-h*i-4,
					{alignx:"left",aligny:"bottom",boxcolor:texts[texts.length-i-1].c || "white",textcolor:"black"});
			}
		}
	})()
	this.Board = function(){
		this.chunkloaded = function(wl){
			
			return Trpg.board.container.get("Tiles").has(wl.toStr());
			
			for (var i = 0; i < this.loaded.length; i++)
				if (this.loaded[i].wl.inchunkdist(wl,0))
					return true;
		}
		this.loadchunk = function(wl){
			if (this.chunkloaded(wl))
				return;
			var newchunk = new Trpg.Chunk(wl.wx,wl.wy,wl.dim).generate();
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++){
					var wl2 = newchunk.wl.copy().shift(i,j)
					//if (Trpg.board.container.get("Tiles."+wl2.toStr())!==-1){
					// }
					if (Trpg.world.tilechanges[wl2.toStr()]){
						new Trpg.Tiles[Trpg.world.tilechanges[wl2.toStr()].type](wl2.copy());
					}
				}
			//this.loaded.push(newchunk);
			//Trpg.Structures.checkchunk(newchunk.wl);
			//newchunk.loadChanges();
		}
		this.removechunk = function(wl){
			wl.tochunk();
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					this.container.get("Tiles").remove(wl.copy().shift(i,j).toStr());
		}
		this.load = function(wl,force){
			if (!exists(wl)) wl = new Trpg.WorldLoc(0,0,3,3);
			this.rcenter = new Trpg.WorldLoc(wl.wx,wl.wy,3,3,wl.dim);
			this.lcenter = new Trpg.WorldLoc(wl.wx,wl.wy,4,4,wl.dim);
			var ccenter = new Trpg.WorldLoc(wl.wx,wl.wy,0,0,wl.dim);
			//if (force)
				this.container.get("Tiles").empty();
				//this.loaded = [];
			
			for (var i = -this.chunkrad; i <= this.chunkrad; i++)
				for (var j = -this.chunkrad; j <= this.chunkrad; j++){
					this.loadchunk(new Trpg.WorldLoc(wl.wx+i,wl.wy+j,0,0,wl.dim));
				}
				return;
			var q = this.container.get("Tiles").getq();
			for (var i = 0; i < q.length; i++)
				if (!q[i].loc.indist(Trpg.player.loc,this.viewsize))
			//		console.log(q[i].loc);
					this.container.get("Tiles").remove(q[i]);
				return;
			for (var i = -this.chunkrad; i <= this.chunkrad; i++)
				for (var j = -this.chunkrad; j <= this.chunkrad; j++){
					this.loadchunk(new Trpg.WorldLoc(wl.wx+i,wl.wy+j,0,0,wl.dim));
					continue;
					var alreadyin = false;
					for (var k = 0; k < this.loaded.length; k++)
						if (this.loaded[k].wl.indist(new Trpg.WorldLoc(wl.wx+i,wl.wy+j,0,0,wl.dim),0))
							alreadyin = true;
					if (alreadyin)
						continue;
					var newchunk = new Trpg.Chunk(wl.wx+i,wl.wy+j,wl.dim).generate();
					this.loaded.push(newchunk);
					//Trpg.Structures.checkchunk(newchunk.wl);
					newchunk.loadChanges();
					//if (Trpg.Structures.hasstruct(newchunk.wl))
					//	Trpg.Structures.fillchunk(newchunk.wl);
				}
			for (var k = 0; k < this.loaded.length; k++)
				if (!this.loaded[k].wl.indist(ccenter,this.chunkrad*8)){
					var changes = this.loaded[k].getChanges();
					if (changes!="none"){
						Trpg.world.changes[this.loaded[k].code] = changes;
					}
					this.loaded.splice(k,1);
					k--;
				}
			//Trpg.Structures.checkcenters(wl);
		}
		this.save = function(){
			return;
			var changelist = [];
			for (var k = 0; k < this.loaded.length; k++){
				var changes = this.loaded[k].getChanges();
				if (changes!=="none"){
					//if (Trpg.socket)
					changelist.push({key:this.loaded[k].code,changes:changes});
					//Trpg.socket.emit("regchanges",{key:this.loaded[k].code,changes:changes});
					Trpg.world.changes[this.loaded[k].code] = changes;
				}
			}
			//console.log(changelist);
			//if (Trpg.socket)	Trpg.socket.emit("sendchanges",Trpg.world.changes);
			if (Trpg.socket)	Trpg.socket.emit("regchanges",changelist);
			if (Trpg.ismobile)	Trpg.SaveGame(true);
				//&& Trpg.world.getChanges(true)!="none")
				//localStorage.setItem("TRPGSaveSlot",JSON.stringify(Trpg.world.getChanges(true)));
		}
		this.ground = new (function(){
			function grounditem(item){
				return {
					item:item,
					x:Math.random()*32,
					y:Math.random()*32
				}
			}
			this.getitems = function(wl){
				return this.items[wl.toStr()] || [];
			}
			this.items = {}
			this.hasitems = function(wl){
				return this.items.hasOwnProperty(wl.toStr()) && this.items[wl.toStr()].length > 0;
			}
			this.render = function(g,wl){
				var l = this.items[wl.toStr()];
				g.save();
				g.scale(1/2,1/2);
				for (var i = 0; i < l.length; i++)
					l[i].item.render(g,l[i].x,l[i].y);
				g.restore();
			}
			this.dropitem = function(item, wl){
				var i = grounditem(item);
				if (!this.hasitems(wl))
					this.items[wl.toStr()] = [i];
				else 
					this.items[wl.toStr()].push(i);
				var list = this.items[wl.toStr()];
				Trpg.board.container.add(new Utils.Timer(30).start().setAuto(true,function(){
							list.splice(list.indexOf(i),1);
						}).setKilloncomp(true));
			}
		})()
		this.getTile = function(wl){
			return Trpg.BoardC.get("Tiles."+wl.toStr()) !== -1 && Trpg.BoardC.get("Tiles."+wl.toStr()) || new Trpg.Tiles.Grass(wl,true);
			
			for (var i = 0; i < this.loaded.length; i++)
				if (this.loaded[i].wl.inchunkdist(wl,0))
					return this.loaded[i].getTile(wl);
			return new Trpg.Tiles.Grass();
			//return new Trpg.Chunk(wl.wx,wl.wy,wl.dim).generate().getTile(wl);
		}
		this.setTile = function(tile, wl){
			
			
			for (var i = 0; i < this.loaded.length; i++)
				if (this.loaded[i].wl.inchunkdist(wl,0))
					this.loaded[i].setTile(tile,wl.copy());
			this.save();
		}
		this.getChunk = function(wl){
			wl = wl.copy().tochunk();
			for (var i = 0; i < this.loaded.length; i++)
				if (this.loaded[i].wl.inchunkdist(wl,0))
					return this.loaded[i];//.getTile(wl);
		}
		this.init = function(){
			Trpg.bank = {contents:{items:[]}}
			var bui = Trpg.boardui;
			if (false && (true || window.mobile)){
				//this.container.container.add(new UI.Button(this.container.x+5,this.container.y+this.container.h/2-100-5,100,100).sets({
				bui.add(new UI.Button(5,bui.h/2-100-5,100,100).sets({
					//rightclick:false,
					onclick:function(){
						Trpg.toolbox.rightclick = !Trpg.toolbox.rightclick;
					},inrender:function(g){
						g.fillStyle = "black";
						g.font = "25px Arial";
						Drw.drawCText(g,"Right",this.w/2,this.h/3);
						Drw.drawCText(g,"Click "+(!Trpg.toolbox.rightclick?"on":"off"),this.w/2,this.h/3*2);
					}
				}));
				this.container.container.add(new UI.Button(5,bui.h/2-5,100,100).sets({
					zoomlvl:0,onclick:function(){
						switch(this.zoomlvl+1){
							case 0:
							case 1:
							Trpg.board.container.camera.zoom(1.5);
							break;
							case 2:
							Trpg.board.container.camera.zoom(1/(1.5));//*1.5));
							break;
						}
						this.zoomlvl = (this.zoomlvl+1).mod(2);
					},inrender:function(g){
						g.fillStyle = "black";
						g.font = "25px Arial";
						Drw.drawCText(g,"Toggle",this.w/2,this.h/3);
						Drw.drawCText(g,"Zoom",this.w/2,this.h/3*2);
					}
				}));
			}
			if (window.mobile){
				bui.add(new UI.Button(bui.w-100-5,bui.h-100-5,100,100).sets({
					//rightclick:false,
					onclick:function(){
						/*
						this.entering = !this.entering;
						var ibox = document.getElementById("inpbox")
						if (this.entering){
							ibox.style.display = "block";
							ibox.focus();
						} else {
							ibox.style.display = "none";
							ibox.blur();
							var text = ibox.value;
							ibox.value = "";
							if (text == null)
								return;
							if (text.charAt(0) == "/")
								command(text.substring(1));
							else if (text !== "")
								Trpg.player.say(text);
						}
						return;
						*/
						var text = prompt("Enter Text");
						if (text == null)
							return true;
						if (text.charAt(0) == "/")
							command(text.substring(1));
						else if (text !== "")
							Trpg.player.say(text);
						return true;
					},inrender:function(g){
						g.fillStyle = "black";
						g.font = "25px Arial";
						Drw.drawCText(g,"Enter",this.w/2,this.h/3);
						
						Drw.drawCText(g,"Text",this.w/2,this.h/3*2);
					}
				}));
			}
			//bui.add({x:this.container.x,y:this.container.y+this.container.h,render:function(g){
			bui.add({cyc:-1,keydown:function(k){
					var h = Trpg.Console.phistory;
					if (k.key == "ArrowUp" && this.cyc < h.length-1)
						this.cyc++;
					else if (k.key == "ArrowDown" && this.cyc > 0)
						this.cyc--;
					else if (k.key == "ArrowDown" && this.cyc == 0){
						this.cyc = -1;
						Trpg.board.textinp.text = "";
						return;
					}
					else return;
					Trpg.board.textinp.text = h[h.length-1-this.cyc].m;
				},render:function(g){
				var txt = Trpg.player.gettitle()+": "+Trpg.board.textinp.gettext()+"*";
				var x = 3;
				//var b = Trpg.board.container.getbounds();
				
				g.font = "25px Arial";
				g.translate(0,this.container.h);
				//g.translate(this.x,this.y);
				while (x+g.measureText(txt).width > Trpg.board.container.w)
					x--;
				if (Trpg.board.textinp.hasfocus())
					Drw.drawCText(g,txt,x,-5,{alignx:"left",aligny:"bottom",boxcolor:"white",textcolor:"black"});
				g.translate(0,-27);
				Trpg.Console.render(g);
			}});
			bui.add({//box:this.container,
				render:function(g){
					var x = bui.x;
					var y = bui.y;
					var w = bui.w;
					var h = bui.h;
					Drw.drawCText(g,Trpg.player.loc.toStr(),x+w-5,y+5,{
						font:"25px Arial",
						aligny:"top",
						alignx:"right",
						boxcolor:"white",
						textcolor:"black"
					});
				}
			});
			var that = this;
			this.aim = Trpg.player.loc.copy();
			this.running = false;
			this.forcing = true;
			this.runenergy = 100;
			this.chunkrad = 1;
			this.viewsize = 8;
			this.load(Trpg.player.loc,true);
			while (!this.getTile(Trpg.player.loc).traits.walkable){
				Trpg.player.loc.cx+=Math.floor(Math.random()*2-1);
				Trpg.player.loc.cy+=Math.floor(Math.random()*2-1);
				Trpg.player.loc.legalize();
			}
			this.dx = 0;
			this.dy = 0;
			this.container.camera.zoomto(1/(this.viewsize-1)/64*this.container.w);
			this.container.add(new UI.Follow(this.container.camera,Trpg.player,function(t){return t.x},function(t){return t.y},32));
			this.container.add(this.textinp = new Utils.TextInput("allchars"));
			this.textinp.onenter = function(){
				var text = that.textinp.gettext();
				if (text.charAt(0) == "/")
					command(text.substring(1));
				else if (text !== "")
					Trpg.player.say(text);
				that.textinp.clear();
			}
			this.textinp.focus();
		}
	}
	this.Actionable = new (function(){
		function superinit(){
			this.actionslist = ["examine"];
			this.actions = {
				examine:function(){
					Trpg.Console.add("No examine text found");
				}
			}
		}
		function doaction(action,value){
			if (!exists(action))	action = this.actionslist[0];
			this.actions[action] && this.actions[action].call(this,value);
		}
		function getactions(){
			return this.actionslist.slice();
		}
		function leftdown(dx,dy){
			this.doaction();
			return true;
		}
		function rightdown(dx,dy){
			var that = this;
			//console.log(this);
			//if (RC.get(this)!==-1)
				var acts = this.getactions();
				for (var i = 0; i < acts.length; i++)
					RC.get("actionslist").push({text:acts[i],owner:this,
						func:(function(a){return function(){that.doaction(a);}})(acts[i])
					});
			
			RC.open();
			return false;
		}
		function fillmenu(menu){
			var actions = this.getactions();
			var actiontarget = this;
			for (var i = 0; i < actions.length; i++)
				menu.additem((function(a){return function(){
					actiontarget.doaction(actions[a]);
					return "close";
				}})(i),actions[i].charAt(0).toUpperCase()+actions[i].substring(1));//+" "+this.getname());
		}
		return function(){
			this.Actionable = {superinit:superinit};
			this.doaction = doaction;
			this.getactions = getactions;
			this.leftdown = leftdown;
			this.rightdown = rightdown;
			this.fillmenu = fillmenu;
			return this;
		}
	})();
	function Astar(start, end, extras){
		var targetrange = extras && extras.targetrange || 0;
		var range = extras && extras.range || 15;
		var checkfunc = extras && extras.checkfunc || function(wl){
			return Trpg.BoardC.get("Tiles."+wl.toStr()).traits.walkable;
			//return Trpg.board.getTile(wl).traits.walkable;
		}
		if (!Trpg.board.getTile(end).traits.walkable && targetrange == 0)
			targetrange = 1;
		//	return [];
		//console.log("A*");
		function Spot(wl,parent,gcost,hcost,dir){
			this.wl = wl.copy();
			this.parent = parent;
			this.gcost = (parent.gcost || 0) + gcost;
			this.hcost = hcost;
			this.fcost = this.gcost+this.hcost;
			this.dir = dir;
		}
		function manH(s,e){
			return 10*(Math.abs(s.dx(e))+Math.abs(s.dy(e)));
		}
		function getadj(spot){
			/*var dirs = [
			{x:0,y:-1,d:"n"},
			{x:1,y:0,d:"e"},
			{x:0,y:1,d:"s"},
			{x:-1,y:0,d:"w"},
			];*/
			var dirs = [
			{x:0,y:-1},
			{x:1,y:0},
			{x:0,y:1},
			{x:-1,y:0},
			{x:-1,y:-1},
			{x:-1,y:1},
			{x:1,y:-1},
			{x:1,y:1},
			];
			var adjs = [];
			for (var i = 0; i < dirs.length; i++){
				var wl = spot.wl.copy().shift(dirs[i].x,dirs[i].y);
				if (!wl.inchunkdist(Trpg.player.loc,1))
					Trpg.board.loadchunk(wl.copy());//alert("v");
				if (//wl.inchunkdist(Trpg.player.loc,1) 
					wl.indist(start,range) && 
					//&& 
					checkfunc(wl)){
					//Trpg.board.getTile(wl).traits.walkable){
					if (dirs[i].x*dirs[i].y !== 0){ // if diag
						if (Trpg.board.getTile(spot.wl.copy().shift(dirs[i].x,0)).traits.walkable ||
							Trpg.board.getTile(spot.wl.copy().shift(0,dirs[i].y)).traits.walkable)
							if (cstrs.indexOf(wl.toStr()) == -1)
								adjs.push(new Spot(wl,spot,11,manH(wl,end),dirs[i]));
					} else if (cstrs.indexOf(wl.toStr()) == -1)
						adjs.push(new Spot(wl,spot,10,manH(wl,end),dirs[i]));
				}
			}
			return adjs;
		}
		function picklowf(open){
			var ele = open[0]
			for (var i = 0; i < open.length; i++)
				if (open[i].fcost < ele.fcost)
					ele = open[i];
			return ele;
		}
		function makepath(spot){
			if (spot.parent == -1)
				return [];
			//Trpg.board.getTile(spot.wl).highlighted = true;
			var p = makepath(spot.parent);
			p.push({dir:spot.dir,wlstr:spot.wl.toStr()});
			return p;
			//return makepath(spot.parent)+spot.dir;
		}
		var openlist = [new Spot(start,-1,0,manH(start,end))];
		var closedlist = [];
		var ostrs = [start.toStr()];
		var cstrs = [];
		while (openlist.length > 0){
			var lowf = picklowf(openlist);
			openlist.splice(openlist.indexOf(lowf),1);
			ostrs.splice(ostrs.indexOf(lowf.wl.toStr()),1);
			closedlist.push(lowf);
			cstrs.push(lowf.wl.toStr());
			/*if (!lowf.wl.indist(start,range))
				//console.log(lowf.wl.toStr());
				//console.log(start.toStr());
				//console.log(range);
				;//return [];
			if (!lowf.wl.inchunkdist(Trpg.player.loc,1)){
				//alert(lowf.wl.toStr());
				//Trpg.board.loadchunk(lowf.wl);
				//continue;
				//return [];
			}*/
			if (lowf.wl.indist(end,targetrange))
				return makepath(lowf);
			var adjs = getadj(lowf);
			for (var j = 0; j < adjs.length; j++){
				if (ostrs.indexOf(adjs[j].wl.toStr())!==-1){
					for (var k = 0; k < openlist.length; k++)
						if (openlist[k].wl.indist(adjs[j].wl,0) && openlist[k].gcost > adjs[j].gcost)
							openlist[k] = adjs[j];
				} else {
					openlist.push(adjs[j]);
					ostrs.push(adjs[j].wl.toStr());
				}
			}
		}
		return [];
	}
	function Lineofsight(start, ang, phase){
		this.phase = phase;
		this.loc = start;
		this.loc.onmove = function(wl){
			if (Trpg.board.getTile(wl).traits.walkable)
				return true;
			this.blocked = true;
			return true;
		}
		this.angle = ang;
		this.traveled = 0;
		this.step = function(dist){
			if (this.blocked) 	return;
			var dx = Math.cos(this.angle);
			var dy = Math.sin(this.angle);
			for (var i = 0; i < dist; i++){
				this.loc.move(dx,dy);
				if (this.onstep && this.onstep()) return;
			}
			this.blocked = this.loc.blocked && !this.phase;
			if (!this.blocked)
				this.traveled+=dist;
		}
	}
	this.Entities = new (function(act){
		var Entity = new (function(){
			function superinit(wl,id,orig){
				this.original = orig;
				this.loc = wl.copy();
				this.rl = 2;
				this.loc.onmove = function(wl){
					return (Trpg.board.getTile(wl).traits.walkable);
				}
				this.id = id || this.type+(+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + (Trpg.Entities.ids.length);
				
			//if (Trpg.BoardC.get("Entities."+this.id)==-1){
					Trpg.BoardC.add(this,"Entities."+this.id);
					Trpg.Entities.ids.push(this.id);
					this.original && Trpg.socket && Trpg.socket.emit("newentity",this.save());
			//} else {
			//}
				this.path = [];
				this.saying = "";
				this.nexttile = this.loc.copy();
				this.target = -1;
				this.speed = 50;
				this.range = 5;
				this.pathrange = 10;
				this.img = this.type;
				this.getactions = function(){
					var acts = this.actionslist.slice();
					if (Trpg.player.hasprivilege("remover") && (this.type !== "Player" || !this.hasprivilege("admin")))
						acts.push("removeent");
					if (Trpg.player.hasprivilege("admin"))
						acts.push("set");
					return acts;
				}
				if (this.actions){
					this.actions.teleport = function(wl){
						if (typeof wl == "string")
							wl = new Trpg.WorldLoc().loadStr(wl);
						if (this.type == "Player" && this.player1){
							Trpg.board.save();
							Trpg.player.loc.load(wl.copy());
							Trpg.player.loc.mx =
							Trpg.player.loc.my = 16;
							Trpg.board.load(Trpg.player.loc,true);
							Trpg.board.save();
						} else {
							this.loc.load(wl.copy());
							this.loc.mx =
							this.loc.my = 16;
						}
						this.canceltarget();
					}
					this.actions.removeent = function(){
						Trpg.socket && Trpg.socket.emit("removeentity",this.id);
					}.bind(this);
					this.actions.set = function(){
						Trpg.setid = this.id;
						Trpg.Console.add("Set "+this.id+" as @s");
					}
				}
				this.x = this.loc.xx()-this.w/2;
				this.y = this.loc.yy()-this.h/2;
			}
			function load(save){
				//console.log(save);
				
				/*if (true);else if (save.type && save.type !== this.type){
					var current = Trpg.BoardC.get("Entities."+this.id);
					Trpg.BoardC.get("Entities").remove(this.id);
					Trpg.BoardC.add(new Trpg.Entities[save.type]
						(save.loc && this.loc.loadStr(save.loc) || this.loc, this.id),
						"Entities."+this.id);
				} else if (save.loc && !(new Trpg.WorldLoc().loadStr(save.loc).indist(this.loc,1))){
					!this.original && this.loc.loadStr(save.loc);
					//this.original && Trpg.socket && Trpg.socket.emit("saveentity",{loc:this.loc.tomStr(),id:this.id});//,target:this.target && this.target !==-1 && this.target.loc.tomStr()});
			
					//this.nexttile = this.loc.copy();
				}*/
				if (save.target == -1)
					return this.canceltarget();
				if (this.target == -1 || this.target.loc.inmdist(this.loc,.2))
					save.target && this.settarget({loc:new Trpg.WorldLoc().loadStr(save.target)});
				//return this;
			}
			function save(){
				return {
					//id:this.id,
					//type:this.type,
					//loc:this.loc.tomStr(),
					target:(this.target && this.target !== -1 && this.target.loc.tomStr())||-1
				}
			}
			function ondelete(){
				Trpg.socket && Trpg.socket.emit("removeentity",this.id);
			}
			function getname(){
				return this.type+(this.cb > 0?" (lvl "+this.cb+")":"");
			}
			function canceltarget(){
			//this.canceltarget = function(){
				this.target = -1;
				this.path = [];
				this.nexttile = this.loc.copy();
			}
			function movetotarget(d){
			//this.movetotarget = function(d){
				if (this.path.length > 0 && this.nexttile.indist(this.loc,0)){
					//var acc = this.nexttile.copy();
					//while(Lineofsight(this.loc,this.nexttile).reached && this.path.length > 0){
					//if (this.type == "Player")	console.log(Lineofsight(this.loc,this.nexttile));
					var p = this.path.shift().dir;
					//acc = this.nexttile.copy();
					this.nexttile.shift(p.x,p.y);
					// }
					//this.nexttile = acc;
					this.nexttile.mx = this.nexttile.my = 16;	
				}
				if (this.path.length == 0 && this.target.loc.indist(this.loc,0))
					this.nexttile = this.target.loc.copy();
				//if (this.target.loc.inmdist(this.loc,.2))
				//	return;
				/*if (this.target.loc.indist(this.loc,0) && !this.target.loc.inmdist(this.loc,.2)){
					var a = Math.atan2(this.loc.mdy(this.target.loc)*32,this.loc.mdx(this.target.loc)*32);
					this.loc.move(Math.cos(a)*this.speed*d,Math.sin(a)*this.speed*d);
					return;
				}*/
				if (!this.nexttile.inmdist(this.loc,.1)){
					var a = Math.atan2(this.loc.mdy(this.nexttile)*32,this.loc.mdx(this.nexttile)*32);
					this.loc.move(Math.cos(a)*this.speed*d,Math.sin(a)*this.speed*d);
				} else if (this.path.length == 0)
					this.onreachtarget();
			}
			function settarget(targ, targdist, onreach){
			//this.settarget = function(targ, targdist, onreach){
			//if (!targ.loc.indist(Trpg.player.loc,Trpg.board.viewsize)) return;
				//if (!this.original)	return;
				this.target = targ;
				var extras = {range:this.pathrange, targetrange:targdist};
				if (this.type == "Player" && this.hasprivilege("phase"))//player1 && Trpg.GodTools.phase)
					extras.checkfunc = function(){return true};
				this.path = Astar(this.loc,this.target.loc, extras);
				this.nexttile = this.loc.copy();
				this.onreachtarget = onreach || function(){this.target = -1};
				//if (this.type !== "Player" || (this.type == "Player" && this.target !== -1 && this.original))
			//	if (this.target !== -1)// && this.original)
			//		Trpg.socket && Trpg.socket.emit("affectentityother",
			//			{func:"load",args:[{Entity:{target:this.target.loc.tomStr()}}],id:this.id});
//					args:[{loc:targ.loc},targdist,onreach],
	//				id:this.id});
				//Trpg.socket && Trpg.socket.emit("saveentity",{target:(this.target && this.target !==-1 && this.target.loc.tomStr())||-1});
			}
			function say(str){
				this.saying = str;
				Trpg.Timers.add(new Utils.Timer(2).start().setAuto(true,function(){this.saying = ""}.bind(this)).setKilloncomp(true));
				Trpg.Console.add(str,false,this.getname());
				this.original && Trpg.socket && Trpg.socket.emit("affectentityother",{func:"say",id:this.id,args:[str]});
				return;
				/*var that = this;
				this.saying = str;
				this.saytimer = new Utils.Timer(2).setAuto(true,function(){that.saying = ""}).setKilloncomp(true);
				Trpg.board.container.add(this.saytimer);
				this.saytimer.start();
				if (this.type == "Player"){
					if (Trpg.socket && this.player1)
						Trpg.socket.emit("playerspeak",{username:this.username,str:str});
					Trpg.Console.add(this.gettitle(),str);
				}*/
			}
			function onreachtarget(){}
			function wander(){
			//this.wander = function(){
			//	if (!this.original)	return;
				this.settarget({loc:this.spawn.copy().shift(
					Math.floor(Math.random()*this.range*2)-this.range,
					Math.floor(Math.random()*this.range*2)-this.range)
					.move((Math.random()-.5)*30,(Math.random()-.5)*30)});
					
					//this.original && 
					//Trpg.socket && Trpg.socket.emit("saveentity",{changed:true,type:this.type,id:this.id,loc:this.loc.tomStr(),Entity:this.Entity.save.call(this)});
					// {id:this.id,
					//	target:this.target && this.target !== -1 && this.target.loc.tomStr()});
			}
			function update(d){
				//this.damaged = false;
			//this.update = function(d){
				//this.selfupdate && this.selfupdate(d);
				//if (this.hp <= 0)// && this.attackable)
				//	return this.respawntimer.update(d);
			//this.original && Trpg.socket && Trpg.socket.emit("saveentity",{loc:this.loc.tomStr(),id:this.id,type:this.type,Entity:this.Entity.save.call(this)});//,target:this.target && this.target !==-1 && this.target.loc.tomStr()});
			//
				this.invisible = !this.loc.indist(Trpg.player.loc,Trpg.board.viewsize);// return;
				this.x = this.loc.xx()-this.w/2;
				this.y = this.loc.yy()-this.h/2;
				//	this.original && Trpg.socket && Trpg.socket.emit("saveentity",{id:this.id,
				//		target:this.target && this.target !== -1 && this.target.loc.tomStr()});
				
				if (this.type!=="Player"){
					if (this.target == -1 && this.original)// && Math.random()*5<d)
						this.wander();
				}
				if (this.target !== -1 && this.type == "Player" && this.hasprivilege("telewalk")){
					this.doaction("teleport",this.target.loc);
					Trpg.socket && Trpg.socket.emit("affectentityother",{func:"doaction",args:["teleport",this.target.loc.tomStr()],id:this.id});
					//this.canceltarget();
				}
				else if (this.target !== -1)
					this.movetotarget(d);
				//if (this.hidden)return;
				//if (this.type == "Player" && this.original)// && false)
				if (this.original)// && false)
					Trpg.socket && Trpg.socket.emit("saveentity",this.save());//{loc:this.save().loc,Entity:this.save().Entity});
					//{//changed:true,
					//type:this.type,id:this.id,loc:this.loc.tomStr(),});
				//		target:(this.target && this.target !==-1 && this.target.loc.tomStr())||-1});
				//else Trpg.socket && Trpg.socket.emit("saveentity",{changed:true,type:this.type,id:this.id,loc:this.loc.tomStr(),Entity:this.Entity.save.call(this)});
					
			}
			function inrender(g){
			//this.inrender = function(g){
				try {
					g.drawImage(Ast.i(this.img.toLowerCase()),-16,-16);
				} catch(e) {
					g.fillStyle = "black";
					Drw.drawCText(g,this.img,-16,-16);
				}
			}
			function render(g){
				if (this.hp <= 0 && this.attackable)
					return;
				g.save();
				//g.translate(this.x+this.w/2-16,this.y+this.h/2-16);
				g.translate(this.loc.xx(),this.loc.yy());
				this.inrender(g);
				if (this.hp < this.maxhp){
					var m = 20*this.hp/this.maxhp;
					g.fillStyle = "green";
					g.fillRect(-10,-20,m,5)
					g.fillStyle = "red";
					g.fillRect(-10+m,-20,20-m,5)
				}
				if (this.isover && Trpg.showover){
					g.strokeStyle = "yellow";
					g.strokeRect(-this.w/2,-this.h/2,this.w,this.h);
				}
				if (hasaction() && getaction().owner == this)
					getaction().renderp(g);
				if (this.saying == ""){
					g.restore();
					return;
				}
				Drw.drawCText(g,this.saying,0,-16,{boxcolor:"white",textcolor:"black"});
				g.restore();
				return;
				g.translate(16,0);
				var w = g.measureText(this.saying).width+5;
				var h = g.measureText("M").width+5;
				g.fillStyle = "white";
				g.globalAlpha = .5;
				g.fillRect(-w/2,-h/2,w,h);
				g.globalAlpha = 1;
				g.fillStyle = "black";
				Drw.drawCText(g,this.saying,0,0);
			}
			return function(){
				this.Entity = {
					superinit:superinit,
					save:save,					load:load,					ondelete:ondelete,
					getname:getname,
					canceltarget:canceltarget,
					movetotarget:movetotarget,
					settarget:settarget,
					onreachtarget:onreachtarget,
					wander:wander,
					say:say,
					update:update,
					inrender:inrender,
					render:render
				};
				return this;
			}
		})();
		var Combatable = new (function(){
			function hitsplat(dmg,x,y){
				return makeTemp({dmg:dmg,x:x,y:y,a:1,//x:this.loc.xx(),y:this.loc.yy(),
					update:function(d){
						this.y+=d*15;
						this.a-=d*.8;
					},
					render:function(g){
						g.translate(this.x,this.y);
						//g.translate(this.loc.xx(),this.loc.yy());
						//g.globalAlpha = this.a;
						g.fillStyle = this.dmg>0?"red":"blue";
						g.fillRect(-5,-5,10,10);
						g.fillStyle = this.dmg>0?"black":"white";
						Drw.drawCText(g,this.dmg,0,0);
					}
				},1);
			}
			function respawn(){
				this.hp = this.maxhp;
				this.dead = false;
				this.hidden = false;
				if (!this.original)return;
				Trpg.socket && Trpg.socket.emit("affectentity",{func:"doaction",args:["teleport",this.spawn.tomStr()],id:this.id});
				//this.doaction("teleport",this.spawn);
				//Trpg.socket && Trpg.socket.emit("saveentity",this.save().sets({changed:true}));
			}
			function ondeath(){
				this.hidden = true;
				//this.removeme();
				//var that = this;
				var id = this.id;
				if (this.original)
				Trpg.Timers.add(new Utils.Timer(this.respawndelay).start().setAuto(true, function(){
				Trpg.socket && Trpg.socket.emit("affectentity",{func:"respawn",args:[],id:id})
					//that.doaction("teleport",that.spawn);
					//that.hp = that.maxhp;
					//that.hidden = false;//Trpg.BoardC.add(that,"Entities."+that.id);
				}).setKilloncomp(true));
			}
			function dodamage(dmg){
				//alert (dmg);
				if (this.dead)return;
				if (this.hp>0){
					Trpg.BoardC.add(this.hitsplat(dmg,this.x+Math.random()*16+8,this.y+8));
					this.hp-=dmg;
				} else return;
				if (this.hp <= 0){
					this.hp = 0;
					this.dead = true;
				Trpg.socket && Trpg.socket.emit("affectentity",{func:"ondeath",args:[],id:this.id})
					//this.ondeath && this.ondeath();
				}
			}
			function calcdamage(source){
				var dmg = Math.round(source.maxhit*Math.random());
				//if (dmg == 0)
				//	Trpg.BoardC.add(this.hitsplat(dmg,this.x+Math.random()*16+8,this.y+8));
				//this.hit = true;
				//this.hp-=dmg;
				Trpg.socket && Trpg.socket.emit("affectentity",{id:this.id,func:"dodamage",args:[dmg]});
				return;
				Trpg.socket && Trpg.socket.emit("saveentity",{
					id:this.id,
					changed:true,
					//loc:this.loc.tomStr(),
					type:this.type,
					Combatable:this.Combatable.save.call(this).sets({bhp:this.hp,ahp:this.hp-dmg})
				});
				return;
				Trpg.socket && Trpg.socket.emit("saveentity",{
					id:this.id,
					changed:false,
					//loc:this.loc.tomStr(),
					type:this.type,
					Combatable:this.Combatable.save.call(this).sets({damaged:true})
				});
				//this.hp+=dmg;
				//this.hit = false;
				//Trpg.BoardC.add(this.hitsplat(dmg,this.x+Math.random()*16+8,this.y+8));
				//this.hp-=dmg;
			}
			function save(){
				return {
					hp:this.hp,
					dmg:false,
					maxhp:this.maxhp,
					//hit:this.hit
				}
			}
			function load(save){
				if (save.maxhp)this.maxhp = save.maxhp;
				if (!(save.bhp && save.ahp))return;
				
				var dif = save.bhp-save.ahp;
				if (this.hp > save.ahp){
					Trpg.BoardC.add(this.hitsplat(dif,this.x+Math.random()*16+8,this.y+8));
					this.hp = save.ahp;
					//return;
				}
				
				return;
				
				if (this.hp !== save.bhp)
					dif = this.hp-save.ahp;
				if (this.hp !== save.ahp && this.hp>save.ahp||save.bhp-save.ahp == 0)
				Trpg.BoardC.add(this.hitsplat(dif,this.x+Math.random()*16+8,this.y+8));
				this.hp = save.ahp;
				return;
				
				if (!save.dmg && save.dmg !== 0 || this.damaged)return;
				//var beforehp = this.hp;
				this.hp-=save.dmg;
				this.damaged = true;
				//if (save.hp)this.hp = save.hp;
				if (save.maxhp)this.maxhp = save.maxhp;
				//if (beforehp > this.hp)
				Trpg.BoardC.add(this.hitsplat(save.dmg,this.x+Math.random()*16+8,this.y+8));
				//this.hit = false;
				//false && 
				/*Trpg.socket && Trpg.socket.emit("saveentity",{
					id:this.id,
					changed:true,
					//loc:this.loc.tomStr(),
					type:this.type,
					Combatable:this.Combatable.save.call(this).sets({dmg:false,changed:true})
				});*/
			}
			//Combatable
			function superinit(wl){
			//this.init = function(wl){
				
				//this.prototype.Entity.superinit.call(this,wl);
				//Combatable.prototype.init.call(this,wl);
				this.spawn = this.loc.copy();
				this.dead = false;
				this.respawndelay = 5;
				this.actions.arrow = function(){
					var p = Trpg.player;
					var a = Math.atan2(this.loc.yy()-p.loc.yy(),this.loc.xx()-p.loc.xx())
					new Trpg.Entities.Arrow(Trpg.player.loc.copy(),false,true,a);
				}
				this.actions.attack = function(){
					//cancelaction();
					Trpg.player.attack(this);
				}
				this.cb = 0;
				this.maxhp = this.hp = 0;
				this.actionslist = ["arrow","examine"];
				//this.attackable = true;
				this.attackedby = [];
				this.attackdelay = new Utils.Timer(1).start(true);
				this.attrange = 1;
			}
			/*this.update = function(d){
				Combatable.prototype.update.call(this,d);
			}*/
			function getactions(){
			//this.getactions = function(){
				var actions = this.actionslist.slice();
				if (this.cb >= 10)
					actions.push("attack");
				else actions.unshift("attack");
				return actions;
			}
			return function(){
				this.Combatable = {
					superinit:superinit,
					save:save,
					load:load,
					respawn:respawn,
					ondeath:ondeath,
					dodamage:dodamage,
					calcdamage:calcdamage,
					hitsplat:hitsplat,
					getactions:getactions,
				};
				return this;
				/*this.respawn = respawn;
				this.ondeath = ondeath;
				this.dodamage = dodamage;
				this.calcdamage = calcdamage;
				this.hitsplat = hitsplat;
				this.getactions = getactions;*/
			}
		})();
		//Entity.call(Combatable.prototype);
		function E(wl,id){
			for (var p in this.Entity)
				if (this.Entity.hasOwnProperty(p) && (typeof this.Entity[p] == "function"))
					this[p] = this.Entity[p];//.bind(this);
			for (var p in this.Combatable)
				if (this.Combatable.hasOwnProperty(p) && (typeof this.Combatable[p] == "function"))
					this[p] = this.Combatable[p];//.bind(this);
			delete this.superinit;
			//delete this.save;
			//delete this.load;
			this.save = function(){
				return {
					id:this.id,
					loc:this.loc.tomStr(),
					type:this.type,
					Entity:this.Entity.save.call(this),
					Combatable:this.Combatable.save.call(this),
				}
			}
			this.load = function(save){
				if (this.original)	return;
				//save.loc && !(new Trpg.WorldLoc().loadStr(save.loc).indist(this.loc,1)) && this.loc.loadStr(save.loc);
				save.Entity && this.Entity.load.call(this,save.Entity);
				save.Combatable && this.Combatable.load.call(this,save.Combatable);
			}
			this.Clickable.superinit.call(this,wl.xx(),wl.yy(),32,32);
			this.Actionable.superinit.call(this);
			this.Entity.superinit.apply(this,arguments);
			this.Combatable.superinit.call(this);
			//alert(this.type);
		}
		this.Man = function(wl){
			E.apply(this,arguments);
			//this.init(wl);
			this.type = "Man";
			this.cb = 2;
			this.maxhp = this.hp = 7;
			/*this.ondeath = function(){
				Trpg.board.ground.dropitem(new Trpg.Item("Bones"),this.loc);
				var coins = new Trpg.Item("Coins");
				coins.amt = Math.round(Math.random()*2+3);
				Trpg.board.ground.dropitem(coins,this.loc);
			}*/
			this.actionslist.unshift("pickpocket");
			this.actions.pickpocket = function(){
				Trpg.player.settarget(this,1,(function(){
					Trpg.player.target = -1;
					//startaction(function(){
						Trpg.invent.additem(new Trpg.Item("Coins"),Math.round(Math.random()*2+1));
					//},this,.7);
				}).bind(this));
			}
			this.actions.examine = function(){
				Trpg.Console.add("An average citizen walking around");
			}
		}
		this.Dummy = function(wl){
			E.apply(this,arguments);
			//this.init(wl);
			//this.x = this.loc.xx()-16-8;
			//this.y = this.loc.yy()-16-8;
			this.w+=16;
			this.h+=16;
			this.x = this.loc.xx()-this.w/2;
			this.y = this.loc.yy()-this.h/2;
			this.type = "Dummy";
			this.cb = 2;
			this.maxhp = this.hp = 7;
			this.update = function(){}
			/*this.inrender = function(g){
				g.translate(8,8);
				g.drawImage(Ast.i(this.type.toLowerCase()),0,0);
			}*/
			this.calcdamage = function(source){
				var dmg = Math.round(source.maxhit*Math.random());
				Trpg.BoardC.add(this.hitsplat(dmg,this.x+Math.random()*16+16,this.y+16));
				this.hp = this.maxhp - dmg;
			}
			this.actions.examine = function(){
				Trpg.Console.add("A training dummy, ready to be whacked");
			}
		}
		this.Cow = function(wl){
			E.apply(this,arguments);
			this.type = "Cow";
			this.cb = 2;
			this.maxhp = this.hp = 8;
			/*this.ondeath = function(){
				Trpg.board.ground.dropitem(new Trpg.Item("Bones"),this.loc);
			}*/
			this.actions.examine = function(){
				Trpg.Console.add("A harmless cow munching at the grass");
			}
		}
		this.Guard = function(wl){
			E.apply(this,arguments);
			this.type = "Guard";
			this.cb = 16;
			this.range = 3;
			this.maxhp = this.hp = 25;
			this.actionslist.unshift("pickpocket");
			this.actions.pickpocket = function(){
				Trpg.player.settarget(this,1,(function(){
					Trpg.player.target = -1;
					startaction(function(){
						Trpg.invent.additem(new Trpg.Item("Coins"),Math.round(Math.random()*5+10));
					},this,.7);
				}).bind(this));
			}
			this.actions.examine = function(){
				Trpg.Console.add("A city guard patrolling the area");
			}
		}
		this.Player = function(wl,username, player1){
			this.original = player1;
			this.privileges = ["basic"];//,"owner","admin"];
			if (!Trpg.socket)
				this.privileges = ["basic","owner","admin"];
			E.apply(this,arguments);
			if (player1)	this.actionslist = [];
			this.type = "Player";
			this.username = username;
			this.player1 = player1;
			this.cb = 3;
			this.pathrange = 30;
			this.maxhp = this.hp = 10;
			this.speed = 100;
			this.online = true;
			this.actions.examine = function(){
				Trpg.Console.add(this.gettitle());
			}
			//this.attackdelay.dur = .7;
			this.respawndelay = 1;
			/*this.settarget = function(){
				this.original && Trpg.socket && Trpg.socket.emit("affectentityother",{func:"settarget",args:[arguments[0].loc],id:this.id});
				//if (!this.original)	console.log(this.target);
			//if (!this.original)
				this.Entity.settarget.apply(this,arguments);
				//if (!this.original)	console.log(this.target);
				//Trpg.socket && Trpg.socket.emit("saveentity",{target:(this.target && this.target !==-1 && this.target.loc.tomStr())||-1});
			}*/
			this.addprivs = function(privs){
				var ps = this.privileges.slice();
				for (var i = 0; i < privs.length; i++)
					if (ps.indexOf(privs[i])==-1)
						ps.push(privs[i]);
				this.setprivs(ps);
			}
			this.removeprivs = function(privs){
				var ps = this.privileges.slice();
				for (var i = 0; i < privs.length; i++)
					if (ps.indexOf(privs[i])==-1)
						ps.splice(ps.indexOf(privs[i]),1);
				this.setprivs(ps);
			}
			this.setprivs = function(privs){
				var save = {privileges:privs};
					var newprivs = [];
					var removeprivs = [];
					for (var i = 0; i < save.privileges.length; i++)
						if (this.privileges.indexOf(save.privileges[i])==-1 && newprivs.indexOf(save.privileges[i]) == -1)
							newprivs.push(save.privileges[i]);
					for (var i = 0; i < this.privileges.length; i++)
						if (save.privileges.indexOf(this.privileges[i])==-1 && removeprivs.indexOf(this.privileges[i]) == -1)
							removeprivs.push(this.privileges[i]);
					if (newprivs.length > 0 && this.player1){
						var str1 = "The following privilege";
						var str2 = "";
						str1+=(newprivs.length > 1 ? "s have" : " has") + " been granted: ";
						for (var i = 0; i < newprivs.length; i++){
							str2+=newprivs[i]+" ";
							//this.privileges.push(newprivs[i]);
						}
						Trpg.Console.add(str1,"yellow");
						Trpg.Console.add(str2,"yellow");
					}
					if (removeprivs.length > 0 && this.player1){
						var str1 = "The following privilege";
						var str2 = "";
						str1+=(removeprivs.length > 1 ? "s have" : " has") + " been revoked: ";
						for (var i = 0; i < removeprivs.length; i++){
							str2+=removeprivs[i]+" ";
							//this.privileges.push(removeprivs[i]);
						}
						Trpg.Console.add(str1,"yellow");
						Trpg.Console.add(str2,"yellow");
					}
					this.privileges = save.privileges;
					//this.original && 
					Trpg.socket && Trpg.socket.emit("saveentity",this.save().sets({changed:true}));
			}
			this.hasprivilege = function(priv){
				return this.privileges.indexOf(priv) !== -1;
			}
			this.save = function(){
				//throw("Weffewf");
				//if (this.original)
				return {
					username:this.username,
					online:this.online,
					privileges:this.privileges,
					loc:this.loc.tomStr(),
					Entity:this.Entity.save.call(this),
					//invent:Trpg.invent.getsave(),
					//target:(this.target && this.target !==-1 && this.target.loc.tomStr()) || -1,
					//#mapmap:Trpg.Map.save(),
					//bank:Trpg.bank.contents,
					id:this.id,
					type:this.type
				};
				return;
			}
			//this.original && 
			this.load = function(save){
				if (this.original)// ("im me");
					return;
				if (save.type && save.type !== this.type){
					console.log(save);
					Trpg.BoardC.add(new Trpg.Entities[save.type]
						(save.loc && this.loc.loadStr(save.loc) || this.loc, this.id),
						"Entities."+this.id);
				}
				if (save.Entity && save.Entity.target)
					save.target = save.Entity.target;
				if (save.target){
					if (save.target !== -1)
						this.settarget({loc:new Trpg.WorldLoc().loadStr(save.target)});
					else this.canceltarget();
				}
				if (save.username)
					this.username = save.username;
				this.online = true;
				if (save.privileges){
					this.setprivs(save.privileges);
				}
				if (!player1)
					return this;
				if (save.bank)
					Trpg.bank = {contents:save.bank};
				save.invent && Trpg.invent.loadsave(save.invent);
				//#mapsave.map && Trpg.Map.load(save.map);
				return this;
			}
			this.ondeath = function(){
				if (this.hasprivilege("owner")){
					this.hp = this.maxhp;
					return;
				}
				if (!this.original){
					this.removeme();
					return;
				}
				//Trpg.socket && Trpg.socket.emit("removeentity",this.id);
				confirm("You have died!");
				location.reload(true);
			}
			this.getname = 
			this.gettitle = function(){
				var priv = ""
				if (this.privileges.indexOf("owner")!==-1)
					priv = " (Owner)";
				else if (this.privileges.indexOf("admin")!==-1)
					priv = " (Admin)";
				return this.username+priv;
				return this.username;
			}
			this.loc.onmove = function(wl){
					Trpg.board.getTile(wl).doaction("walkon");
					if (!Trpg.board.getTile(wl).traits.walkable && !this.hasprivilege("phase"))
						return false;
					if (!player1)
						return true;
					cancelaction();
					if (wl.cx<1||wl.cx>6||wl.cy<1||wl.cy>6)
						Trpg.board.load(wl);
					return true;
				}.bind(this);
			this.onspawn = function(){
				Trpg.Entities.Player.prototype.onspawn.call(this);
				if (player1)
					Trpg.board.load(this.loc);
				this.changestate("");
			}
		}
		for (var p in this){
			var pro = this[p].prototype;
			UI.Clickable.call(pro);
			act.call(pro);
			Entity.call(pro);
			Combatable.call(pro);
			pro.type = p;
		}
		["Man","Cow","Guard","Player"].forEach((p)=>{	});
		this.Arrow = function(wl,id,orig,ang,targs){
			this.x = wl.xx();
			this.y = wl.yy();
			this.w = this.h = 16;
			
			for (var p in this.Entity)
				if (this.Entity.hasOwnProperty(p) && (typeof this.Entity[p] == "function"))
					this[p] = this.Entity[p];
			this.load = function(save){
				if (this.inited && this.original)	return;
				this.inited = true;
				save.loc && this.loc.loadStr(save.loc);
				if (save.a)
					this.angle = save.a;
				this.los = new Lineofsight(this.loc,this.angle);
					//Entity:this.Entity.save.call(this)
				return;
				/*if (save.type && save.type !== this.type){
					var current = Trpg.BoardC.get("Entities."+this.id);
					Trpg.BoardC.get("Entities").remove(this.id);
					Trpg.BoardC.add(new Trpg.Entities[save.type]
						(save.loc && this.loc.loadStr(save.loc) || this.loc, this.id),
						"Entities."+this.id);
				} else if (save.loc && !(new Trpg.WorldLoc().loadStr(save.loc).indist(this.loc,1))){
					!this.original && this.loc.loadStr(save.loc);
					//this.original && Trpg.socket && Trpg.socket.emit("saveentity",{loc:this.loc.tomStr(),id:this.id});//,target:this.target && this.target !==-1 && this.target.loc.tomStr()});
			
					//this.nexttile = this.loc.copy();
				}
					save.target && this.settarget({loc:new Trpg.WorldLoc().loadStr(save.target)});*/
				//return this;
			}
			this.inited = false;
			this.save = function(){
				return {
					//changed:!this.inited,
					id:this.id,
					type:this.type,
					loc:this.loc.tomStr(),
					a:this.angle,
					//Entity:this.Entity.save.call(this)
				}
			}
			this.maxhit = 2;
			this.angle = ang;
			this.targs = targs || ["Man","Cow","Guard","Dummy"];//,"Player"];
			if (Trpg.pvp) this.targs.push("Player");
			this.Entity.superinit.apply(this,arguments);
			this.los = new Lineofsight(this.loc,this.angle);
			this.los.onstep = (function(){
				if (!this.original)	return false;
				var ents = Trpg.Entities.getents(this.loc);
				for (var i = 0; i < ents.length; i++)
					if (this.targs.indexOf(ents[i].type)!==-1){
						ents[i].calcdamage(this);
						this.removeme();
						Trpg.socket && Trpg.socket.emit("removeentity",this.id);
						//Trpg.socket && Trpg.socket.emit("removeentity",this.id);
						return true;
					}
			}).bind(this);
			//this.los.step(50);
			this.inited = true;
			this.x = this.loc.xx();
			this.y = this.loc.yy();
			this.update = function(d){
				this.los.step(d*350);
				this.invisible = !this.loc.indist(Trpg.player.loc,Trpg.board.viewsize);// return;
				this.x = this.loc.xx();
				this.y = this.loc.yy();
				if (this.original)
					Trpg.socket && Trpg.socket.emit("saveentity",this.save());
				if (this.los.blocked)
					Trpg.socket && Trpg.socket.emit("removeentity",this.id);
			}
			this.inrender = function(g){
				g.rotate(this.angle);
				g.fillRect(0,-2.5,-20,5);
			}
		}
		Entity.call(this.Arrow.prototype);
		this.Arrow.prototype.type = "Arrow";
		this.ids = [];
		this.getents = function(wl){
			return Trpg.BoardC.get("Entities").getq().filter((e)=>{return e!==Trpg.player && e.loc && e.loc.inmdist(wl,.5) && !e.dead && !e.hidden});
		}
		this.getoftype = function(type){
			return Trpg.BoardC.get("Entities").getq().filter((e)=>e.type == type);
			/*var ents = [];
			var q = 
			for (var i = 0; i < q.length; i++)
				if (q[i].type == type)
					ents.push(q[i]);
			return ents;*/
		}
	})(this.Actionable);
	this.Skills = new (function(){
		function Default(){
			
		}
	})();
	this.Structures = new (function(){
		var sectorsize = 15;
		this.centers = {
			loaded:[],
			queued:[],
			loadedstr:[],
			queuedstr:[]
		}
		this.structs = {}
		this.init = function(){
			this.triggercenter(new Trpg.WorldLoc());
		}
		this.qadjs = function(wl){
			var n = wl.copy();	n.wy-=sectorsize;
			var e = wl.copy();	e.wx+=sectorsize;
			var s = wl.copy();	s.wy+=sectorsize;
			var w = wl.copy();	w.wx-=sectorsize;
			var dirs = [n,e,s,w];
			for (var i = 0; i < dirs.length; i++){
				if (this.centers.loadedstr.indexOf(dirs[i].toStr()) == -1 &&
					this.centers.queuedstr.indexOf(dirs[i].toStr()) == -1){
					this.centers.queued.push(dirs[i]);
					this.centers.queuedstr.push(dirs[i].toStr());
				}
			}
		}
		function Structure(type,cwl,wl) {
			/*function emptylayout(x,y){
				var l = [];
				for (var j = 0; j < y; j++){
					var r = "";
					for (var i = 0; i < x; i++)
						r+="_";
					l.push(r);
				}
				return l;
			}
			function changelayout(l,x,y,a){
				for (var j = 0; j < a.length; j++)
					for (var i = 0; i < a[j].length; i++)
						l[y+j][x+i] = a[j][i];
			}*
			function makelayout(str){
				
			}
			function addspecial(spec,)
			function chunkdiv(l){
				var div = [];
				for (var j = 0; j < l.length; j++)
					for (var i = 0; i < l[j].length; i++)
						;
			}*/
			function Default(cwl,wl){
				this.cwl = cwl.copy();
				this.filled = [];
				this.allfilled = false;
				this.contchunks = [];
				this.inchunk = function(wlstr){
					for (var i = 0; i < this.contchunks.length; i++)
						if (this.contchunks[i] == wlstr)
							return true;
					return false;
				}
				this.spawn = function(){
					var neighbs = Trpg.Structures.structs[this.cwl.toStr()];
					/*
				//	Math.random();
					//if (Math.random()<.8)
					//	this.layout[3]= "wssgssw_";
					//var overlap = true;
					//do {
					//for (var k = 0; overlap && k < 5; k++){
						/*var wings = (sectorsize-1)/2
						this.tlc = this.cwl.copy().tochunk();
						for (var j = -wings; j < wings; j++)//+1
							for (var i = -wings; i < wings; i++){//+1
								var overlap = false;
								for (var k = 0; k < neighbs.length; k++)
									if (neighbs[k].inchunk(this.tlc.copy().shift(8*i,8*j).toStr()))
										overlap = true;
								if (!overlap){
									this.tlc.shift(8*i,8*j);
									this.contchunks = [this.tlc.toStr()];
									return this;
								}
							}								
						return -1;
						*/
						var x = (wl && wl.wx) || Math.floor(Math.random()*(sectorsize-this.cw))-(sectorsize-1)/2;
						var y = (wl && wl.wy) || Math.floor(Math.random()*(sectorsize-this.ch))-(sectorsize-1)/2;
						//top left chunk
						this.tlc = this.cwl.copy().tochunk();
						this.tlc.wx+=x;
						this.tlc.wy+=y;
						this.contchunks = [];
						for (var f in this.layout){
							for (var i = 0; i < this.cw; i++)
								for (var j = 0; j < this.ch; j++)
									this.contchunks.push(this.tlc.copy().shift(8*i,8*j,f).toStr());
							for (var i = 0; i < neighbs.length; i++)
								for (var j = 0; j < this.contchunks.length; j++)
									if (neighbs[i].inchunk(this.contchunks[j])){
										if (exists(wl)){
											neighbs.splice(i--,1);
											j = this.contchunks.length;
										}
										else return -1;
									}
						}
					//if (this.type == "Brumlidge")
					//console.log(this.contchunks);
					return this;
				}
				this.fill = function(wl){
					//console.log("try fill");
					if (this.filled.indexOf(wl.toStr()) !== -1)	return;
					this.filled.push(wl.toStr());
					if (this.filled.length >= this.contchunks.length) Trpg.Structures.structs[this.cwl.toStr()]
						.splice(Trpg.Structures.structs[this.cwl.toStr()].indexOf(this),1);
					//console.log(this);
					//console.log("filing");
					
					var dx = this.tlc.dx(wl);
					var dy = this.tlc.dy(wl);
					
					var chunk = Trpg.board.getChunk(wl);
					//console.log(dx+" "+dy);
					//for (var f in this.layout){
						var f = wl.dim;
						if (!exists(this.layout[f])) return;
						//console.log(f);
						//Trpg.board.save();
						//Trpg.board.load(wl.copy().shift(0,0,f),true);
						for (var j = 0; j < 8; j++)
							for (var i = 0; i < 8; i++){
								var t = this.layout[f][j+dy][i+dx];
								if (t !== "_"){
									//if (t == t.toUpperCase())
									//	this.special(t,i+dx,j+dy);
									//else 
										var twl = wl.copy().shift(i,j,f)
										var tile = this.acrs[t](twl);
										if (tile)
										chunk.setTile(tile,twl);
								}
							}
					//Trpg.board.save();
					// }
					//Trpg.board.save();
					//Trpg.board.load(Trpg.player.loc,true);
				}
			}
			var structs = {
				/* empty layout
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
					"________"+"________"+"________"+"________",
				*/
				Bank:function(){
					this.type = "Bank";
					this.cw = 1;
					this.ch = 1;
					this.acrs = {
						w:function(){return new Trpg.Tiles.CastleWall()},
						s:function(){return new Trpg.Tiles.Stone()},
						g:function(){return new Trpg.Tiles.Grass()},
						b:function(){return new Trpg.Tiles.BankChest().setground("stone")},
						a:function(){return new Trpg.Tiles.AlchingStand().setground("stone")},
						//a:function(){return new Trpg.Tiles.AlchingStand").setground("stone")},
					}
					/*this.special = function(t){
						switch (t){
							case "B":
								var wl = this.tlc.copy().shift(2,3);
								Trpg.board.setTile(new Trpg.Tiles.BankChest")
									.setground("stone"),wl);
								break;
							case "A":
								var wl = this.tlc.copy().shift(4,3);
								Trpg.board.setTile(new Trpg.Tiles.AlchingStand")
									.setground("stone"),wl);
								break;
							case "P":
								var wl = this.tlc.copy().shift(3,4);
								Trpg.board.setTile(new Trpg.Tiles.Portal")
									.setground("stone")
									.setdest(new Trpg.WorldLoc(-5,7,3,2)),wl);
								break;
						}
					}*/
					this.layout = {
						surface:[
						"________",
						"________",
						"_wwwww__",
						"_wbsaw__",
						"_wsssw__",
						"_wsssw__",
						"_wwgww__",
						"________",
					]}
					return this.spawn();
				},
				Forge:function(){
					this.type = "Forge";
					this.cw = 1;
					this.ch = 1;
					this.acrs = {
						w:function(){return new Trpg.Tiles.CastleWall()},
						s:function(){return new Trpg.Tiles.Stone()},
						g:function(){return new Trpg.Tiles.Grass()},
						f:function(){return new Trpg.Tiles.Furnace().setground("stone")},
						a:function(){return new Trpg.Tiles.Anvil().setground("stone")},
						c:function(wl){return new Trpg.Tiles.Chest()
									.setWl(wl)
									.additem(new Trpg.Item("Knife"))
									.additem(new Trpg.Item("Hammer"))
									.setground("stone")},
					}
					/*this.special = function(t){
						switch (t){
							case "1":
								var wl = this.tlc.copy().shift(3,4);
								Trpg.board.setTile(new Trpg.Tiles.Portal")
									.setground("stone")
									.setdest(new Trpg.WorldLoc(-5,7,3,2)),wl);
								break;
							case "F":
								var wl = this.tlc.copy().shift(2,2);
								Trpg.board.setTile(new Trpg.Tiles.Furnace")
									.setground("stone"),wl);
								break;
							case "A":
								var wl = this.tlc.copy().shift(4,2);
								Trpg.board.setTile(new Trpg.Tiles.Anvil")
									.setground("stone"),wl);
								break;
							case "B":
								var wl = this.tlc.copy().shift(1,4);
								Trpg.board.setTile(new Trpg.Tiles.BankChest")//.setWl(wl)
									//.additem(new Trpg.Item("Knife").setinfinite(true))
									/*.setcontents({
										items:[
											new Trpg.Item("Tinderbox").setinfinite(true),
											new Trpg.Item("Hammer").setinfinite(true),
											new Trpg.Item("Ladder").setinfinite(true),
											//new Trpg.Item("Knife").setinfinite(true),
										]})*
									.setground("stone"),wl);
								break;
							case "C":
								var wl = this.tlc.copy().shift(5,4);
								Trpg.board.setTile(new Trpg.Tiles.Chest").setWl(wl)
									.additem(new Trpg.Item("Knife"))//.setinfinite(true))
									.additem(new Trpg.Item("Hammer"))//.setinfinite(true))
									//.additem(new Trpg.Item("Ladder"))//.setinfinite(true))
									//.additem(new Trpg.Item("Knife").setinfinite(true))
									/*.setcontents({
										items:[
											new Trpg.Item("Tinderbox").setinfinite(true),
											new Trpg.Item("Hammer").setinfinite(true),
											new Trpg.Item("Ladder").setinfinite(true),
											//new Trpg.Item("Knife").setinfinite(true),
										]})*
									.setground("stone"),wl);
								break;
						}
					}*/
					this.layout = {
					surface:[
					"________",
					"wwwwwww_",
					"wsfsasw_",
					"wsssssw_",
					"wsssscw_",
					"wsssssw_",
					"wsssssw_",
					"wwgggww_"]}
					return this.spawn();
				},
				Tutorville:function(){
					this.type = "Tutorville";
					this.cw = 8;
					this.ch = 8;
					this.acrs = {
						w:"CastleWall",
						s:"Stone",
						g:"Grass",
					}
					return this.spawn();
				},
				Brumlidge:function(){
					this.type = "Brumlidge";
					this.cw = 3;
					this.ch = 4;
					this.acrs = {
						w:function(){return new Trpg.Tiles.CastleWall()},
						s:function(){return new Trpg.Tiles.Stone()},
						g:function(){return new Trpg.Tiles.Grass()},
						u:function(){return new Trpg.Tiles.LadderUp().setground("stone")},
						d:function(){return new Trpg.Tiles.LadderDown().setground("stone")},
						m:function(wl){Trpg.Entities.add(new Trpg.Entities.Man(wl));return false;},
						q:function(wl){Trpg.Entities.add(new Trpg.Entities.Guard(wl));return false;},
						c:function(wl){Trpg.Entities.add(new Trpg.Entities.Cow(wl));return false;},
						/*m:function(wl){Trpg.Entities.add(new Trpg.Entities.Entity("Man",wl));return false;},
						q:function(wl){Trpg.Entities.add(new Trpg.Entities.Entity("Guard",wl));return false;},
						c:function(wl){Trpg.Entities.add(new Trpg.Entities.Entity("Cow",wl));return false;},*/
					}
					/*this.special = function(t,x,y){
						switch (t){
							case "1":
								var wl = this.tlc.copy().shift(x,y);
								Trpg.board.setTile(new Trpg.Tiles.LadderUp")
									.setground("stone")
									.setdest(wl.copy().shift(0,0,"floor1")),wl);
								break;
							case "2":
								var wl = this.tlc.copy().shift(17,21);
								Trpg.board.setTile(new Trpg.Tiles.LadderUp")
									.setground("stone")
									.setdest(wl.copy().shift(0,0,"floor1")),wl);
								break;
							case "3":
								var wl = this.tlc.copy().shift(6,21);
								Trpg.board.setTile(new Trpg.Tiles.LadderDown")
									.setdest(wl),wl.copy().shift(0,0,"floor1"));
								break;
							case "4":
								var wl = this.tlc.copy().shift(17,21);
								Trpg.board.setTile(new Trpg.Tiles.LadderDown")
									.setdest(wl),wl.copy().shift(0,0,"floor1"));
								break;
						}
					}*/
					this.layout = {
						surface:[
						"__wwwwwwwwwwwwwwwwwwww__",
						"_wwssssssssssssssssssww_",
						"wwssssssssssssssssssssww",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wwwwwwwwwwwsswwwwwwwwwww",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wsssswwggggggggggwwssssw",
						"wsssswggggggggggggwssssw",
						"wssssggm_________ggssssw",
						"wssssgg____c_____ggssssw",
						"wssssgg_________mggssssw",
						"wssssgg_c________ggssssw",
						"wsssswggggggggggggwssssw",
						"wsssswwggggggggggwwssssw",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wsssswwwwsssssswwwwssssw",
						"wssssssswsssssswsssssssw",
						"wwssssuswwwggwwwsussssww",
						"_wwssssswggggggwsssssww_",
						"__wwwwwwwggggggwwwwwww__",
						"___________q____________",
						"_______________q________",
						"______q_________________",
						"____________q___________",
						"________________________",
						"________________________",
						"________________________",
						"________________________"],
						floor1:[
						"__wwwwwwwwwwwwwwwwwwww__",
						"_wwssssssssssssssssssww_",
						"wwssssssssssssssssssssww",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wwwwwwwwwwwsswwwwwwwwwww",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wsssswwwwwwwwwwwwwwssssw",
						"wssssw____________wssssw",
						"wssssw____________wssssw",
						"wssssw____________wssssw",
						"wssssw____________wssssw",
						"wssssw____________wssssw",
						"wssssw____________wssssw",
						"wsssswwwwwwwwwwwwwwssssw",
						"wssssssssssssssssssssssw",
						"wssssssssssssssssssssssw",
						"wsssswwwwsssssswwwwssssw",
						"wssssssswsssssswsssssssw",
						"wwssssdswwwwwwwwsdssssww",
						"_wwsssssw______wsssssww_",
						"__wwwwwww______wwwwwww__",
						"________________________",
						"________________________",
						"________________________",
						"________________________",
						"________________________",
						"________________________",
						"________________________",
						"________________________"]}
					return this.spawn();
				}
			}
			return structs[type].apply(new Default(cwl.copy(),wl&&wl.copy()));
		}
		this.triggercenter = function(wl){
			if (this.centers.loadedstr.indexOf(wl.toStr()) == -1){		
				this.centers.loaded.push(wl);
				this.centers.loadedstr.push(wl.toStr());
			}
			else return;
			console.log("triggering"+wl.toStr());
//			if (this.centers.queued.indexOf(wl) !== -1)
				this.centers.queuedstr.splice(this.centers.queuedstr.indexOf(wl.toStr()),1);
			//generate structures and init surrounding centers
			//console.log("trigger"+wl.toStr());
			Math.seedrandom(Trpg.world.wseed+wl.toStr());
			this.structs[wl.toStr()] = [];
			if (wl.dist(new Trpg.WorldLoc())==0)
				this.structs[wl.toStr()].push(Structure("Brumlidge",wl,new Trpg.WorldLoc(-2,-1)));
			else this.structs[wl.toStr()].push(Structure("Brumlidge",wl));
			//alert("blah"+wl.toStr());
			for (var i = 0; i < Math.random()*5+5; i++){
				var s =  Structure("Forge",wl); //new 
				if (s !== -1)	this.structs[wl.toStr()].push(s);
			}
			for (var i = 0; i < Math.random()*5+5; i++){
				var s =  Structure("Bank",wl); //new 
				if (s !== -1)	this.structs[wl.toStr()].push(s);
			}
			this.qadjs(wl);
		}
		this.getcenter = function(wl){
			wl = wl.copy().tochunk();
			for (var i = 0; i < this.centers.queued.length; i++)
				if (wl.indist(this.centers.queued[i],8*(sectorsize+3)/2)){
				//if (wl.dist(this.centers.queued[i]) < 8*(sectorsize+3)/2){
					//alert(wl.dist(this.centers.queued[i])+" "+wl.toStr()+" "+this.centers.queued[i].toStr());
					this.triggercenter(this.centers.queued[i]);
					//break;
				}
			for (var i = 0; i < this.centers.loaded.length; i++)
				if (wl.indist(this.centers.loaded[i],8*(sectorsize-1)/2,true))
				//if (wl.dist(this.centers.loaded[i]) <= 8*(sectorsize-1)/2)
					return this.centers.loaded[i];
			return -1;
		}
		this.checkchunk = function(wl){
			//console.log("checking chunk"+wl.toStr());
			var center = this.getcenter(wl);
			if (center == -1 || !exists(this.structs[center.toStr()]))	return;
			//console.log("checking"+center.toStr());
			//console.log(this.structs[center.toStr()]);
			for (var i = 0; i < this.structs[center.toStr()].length; i++)
				if (this.structs[center.toStr()][i].inchunk(wl.copy().tochunk().toStr()))
					this.structs[center.toStr()][i].fill(wl.copy());
			return false;
		}
	})();
	this.Tiles = new (function(act){//type) { //,args) {
		var Tile = new (function(){
			function superinit(type, wl, asgen){
				this.type = type;
				this.loc = wl.copy();
				this.traits = {
					walkable:true
				}
				this.ground = "Grass";
				this.actions.walk = function(){
					
					Trpg.player.settarget(this);
					//Trpg.player.settarget({loc:Trpg.board.aim.copy()});
					return;
					var p = Trpg.player;
					//p.original && 
					Trpg.socket && Trpg.socket.emit("saveentity",{changed:true,
						id:p.id,
						type:p.type,
						target:p.save().target//p.target && p.target !== -1 && p.target.loc.tomStr(),
						//loc:p.loc.tomStr()
						})
					//if (Trpg.socket)
					//	Trpg.socket.emit("playertarget",{username:Trpg.player.username,targetstr:this.loc.tomStr()});
				}
				this.actions.arrow = function(){
					//var b = Trpg.BoardC;
					var p = Trpg.player;
					//var m = Ms.getMouse();
					var //a;// = Math.atan2(b.boxy(m.y)-b.camera.y,b.boxx(m.x)-b.camera.x);
					a = Math.atan2(this.loc.yy()-p.loc.yy(),this.loc.xx()-p.loc.xx())
					new Trpg.Entities.Arrow(Trpg.player.loc.copy(),false,true,a);
				}
				//if (true);else 
				
				/*if (Trpg.board.container.get("Tiles."+this.loc.toStr())!==-1){
					Trpg.board.container.get("Tiles").remove(this.loc.toStr());
					Trpg.socket && Trpg.socket.emit("changetile",{loc:this.loc.toStr(),state:this.getState()});
				}
				else */
				
				if (Trpg.BoardC.get("Tiles."+this.loc.toStr())!==-1)
					Trpg.BoardC.get("Tiles").remove(this.loc.toStr());
				//this.loc.indist(Trpg.player.loc,Trpg.board.viewsize) && 
				Trpg.BoardC.add(this,"Tiles."+this.loc.toStr());
				!asgen && Trpg.socket && Trpg.socket.emit("tilechange",{type:this.type,loc:this.loc.toStr()});
				if (!asgen)Trpg.world.tilechanges[this.loc.toStr()] = this.getState();
				/*if (Trpg.board.container.get("Tiles."+this.loc.toStr())!==-1){
					if (Trpg.board.container.get("Tiles."+this.loc.toStr()).getState() !== this.getState())
						Trpg.world.tilechanges[this.loc.toStr()] = this.getState();
					Trpg.board.container.get("Tiles").remove(this.loc.toStr());
					//console.log(Trpg.world.tilechanges[this.loc.toStr()]);
					Trpg.board.container.add(this,"Tiles."+this.loc.toStr());
					Trpg.socket && Trpg.socket.emit("tilechange",{type:this.type,loc:this.loc.toStr()})
				} else 
					Trpg.board.container.add(this,"Tiles."+this.loc.toStr());*/
				//	console.log(Trpg.board.container.get(this.loc.toStr()));
			
			
			
			/*
				if (Trpg.world.tilechanges[this.loc.toStr()]){ // } || Trpg.board.container.has(this.loc.toStr())){
					if (Trpg.board.container.get("Tiles."+this.loc.toStr())!==-1){
						Trpg.board.container.remove("Tiles."+this.loc.toStr());
						Trpg.world.tilechanges[this.loc.toStr()] = this.getState();
					}
					Trpg.board.container.add(this,"Tiles."+this.loc.toStr());
				} else */
				//	Trpg.board.container.add(this,"Tiles."+this.loc.toStr());
				//console.log(Trpg.world.tilechanges);
				this.invisible = !this.loc.indist(Trpg.player.loc,Trpg.board.viewsize);
			}
			/*function init(){
				
			}*/
			function leftdown(dx,dy){
				this.loc.mx = dx;
				this.loc.my = dy;
				this.doaction();
			}
			function update(d){
				this.x = this.loc.x()*32;
				this.y = this.loc.y()*32;
				this.invisible = !this.loc.indist(Trpg.player.loc,Trpg.board.viewsize);
				//	this.invisible = true;
			}
			function render(g){
				g.translate(this.x,this.y);
				if (this.ground)
				g.drawImage(Ast.i(this.ground.toLowerCase()),0,0);
				if (!this.inrender || this.inrender && this.inrender(g))
					g.drawImage(Ast.i(this.type.toLowerCase()),0,0);
				g.strokeStyle = "yellow";
				if (this.isover && Trpg.showover)
					g.strokeRect(.5,.5,31,31);
				g.fillStyle = "yellow";
				var ents = Trpg.BoardC.get("Entities").getq();
				for (var e = 0; e < ents.length; e++){
					var ent = ents[e];
					if (ent == Trpg.player || Trpg.debugger.showentitypaths){
						if (this.loc.toStr() == ent.nexttile.toStr()){
							if (ent.path.length > 0)
								g.fillRect(13,13,6,6);
							else if (!ent.nexttile.inmdist(ent.loc,.9))
								g.fillRect(11,11,10,10);
						}
						for (var p = 0; p < ent.path.length; p++){
							var node = ent.path[p];
							if (this.loc.toStr() == node.wlstr){
								if (p == ent.path.length-1)
									g.fillRect(11,11,10,10);
								else {
									g.fillRect(13,13,6,6);
								}
							}
						}
					}
				}
			}
			function getState(){
				return {type:this.type}
			}
			function setState(state){
				
			}
			function save(){
				//if (Trpg.World.tilechanges[this.wl.toStr()]!==JSON.stringify(this.getState()))
				//	return JSON.stringify(this.getState);
				if (Trpg.world.tilechanges[this.loc.toStr()]!==this.getState())
					return this.getState();
				return false;
			}
			function load(state){
				if (this.type == state.type)
					this.setState(state);
				else ;//replace with new then load
			}
			return function(){
				this.Tile = {superinit:superinit}
				//this.init = init;
				this.leftdown = leftdown;
				this.update = update;
				this.render = render;
				this.getState = getState;
				this.setState = setState;
				this.save = save;
				this.load = load;
				return this;
			}
		})();
		UI.Clickable.call(Tile.prototype);
		function T(wl,type,alist,asgen){
			this.Clickable.superinit.call(this,wl.x()*32,wl.y()*32,32,32);
			this.Actionable.superinit.call(this);
			this.Tile.superinit.call(this,type,wl,asgen);
			this.actionslist = alist;
		}
		this.Grass = function(wl,asgen){
			T.call(this,wl,"Grass",["walk","dig"],asgen);
			this.ground = false;
		}
		this.Hole = function(wl,asgen){
			T.call(this,wl,"Hole",["walk","fill"],asgen);
		}
		this.Tree = function(wl,asgen){
			T.call(this,wl,"Tree",["chop","search"],asgen);
			this.traits.walkable = false;
			this.actions.chop = function(){
				//Trpg.board.container.remove(this.loc.toStr());
				new Trpg.Tiles.Stump(this.loc.copy());
				//Trpg.board.container.add(,this)
			}
		}
		this.Sapling = function(wl,asgen){
			T.call(this,wl,"Sapling",[],asgen);
			this.traits.walkable = false;
		}
		this.Seedling = function(wl,asgen){
			T.call(this,wl,"Seedling",["walk"],asgen);
		}
		this.DeadSeedling = function(wl,asgen){
			T.call(this,wl,"DeadSeedling",["walk","dig"],asgen);
		}
		this.Stump = function(wl,asgen){
			T.call(this,wl,"Stump",["walk","dig"],asgen);
		}
		this.CastleWall = function(wl, asgen){
			T.call(this,wl,"CastleWall",[],asgen);
			/*this.inrender = function(g){
				g.drawImage(Ast.i("cwallc"),0,0);
			}*/
			this.traits.walkable = false;
			this.inrender = function(g){
				//g.translate(this.x,this.y);
				//if (!this.loc.indist(Trpg.player.loc,Trpg.board.viewsize))	return;
				var adjs = 
				(Trpg.board.getTile(this.loc.copy().shift(0,-1)).type == "CastleWall" ? "1" : "0")+
				(Trpg.board.getTile(this.loc.copy().shift(1,0)).type == "CastleWall" ? "1" : "0")+
				(Trpg.board.getTile(this.loc.copy().shift(0,1)).type == "CastleWall" ? "1" : "0")+
				(Trpg.board.getTile(this.loc.copy().shift(-1,0)).type == "CastleWall" ? "1" : "0");
				//if (this.ground)
				//g.drawImage(Ast.i(this.ground.toLowerCase()),0,0);
				g.save();
				g.translate(16,16);
				switch (adjs){
					case "0000":	g.drawImage(Ast.i("cwallc"),-16,-16);	break;
					case "1111":	g.drawImage(Ast.i("cwallx"),-16,-16);	break;
					case "0001":	g.rotate(Math.PI/2);
					case "0010":	g.rotate(Math.PI/2);
					case "0100":	g.rotate(Math.PI/2);
					case "1000":	g.drawImage(Ast.i("cwallu"),-16,-16);	break;
					case "1001":	g.rotate(Math.PI/2);
					case "0011":	g.rotate(Math.PI/2);
					case "0110":	g.rotate(Math.PI/2);
					case "1100":	g.drawImage(Ast.i("cwalll"),-16,-16);	break;
					case "0101":	g.rotate(Math.PI/2);
					case "1010":	g.drawImage(Ast.i("cwallv"),-16,-16);	break;
					case "1110":	g.rotate(Math.PI/2);
					case "1101":	g.rotate(Math.PI/2);
					case "1011":	g.rotate(Math.PI/2);
					case "0111":	g.drawImage(Ast.i("cwallt"),-16,-16);	break;
				}
				g.restore();
			}
		}
		for (var p in this){
			var t = this[p];
			UI.Clickable.call(t.prototype);
			act.call(t.prototype);
			Tile.call(t.prototype);
		}
	})(this.Actionable);
	this.Chunk = function(x,y,d){
		this.wl = new Trpg.WorldLoc(x,y,0,0,d);
		this.generate = function(){
			this.code = this.wl.toStr();
			Math.seedrandom(Trpg.world.wseed+this.code);
			this.tiles = [];
			this.origtiles = [];
			d = "surface";
			switch (d){
				case "surface":
					for (var i = 0; i < 8; i++){
						var row = [];
						var orow = [];
						for (var j = 0; j < 8; j++){
							var wl2 = this.wl.copy().shift(j,i);
							/*if (Trpg.board.container.get("Tiles."+wl2.toStr())!==-1){
								Math.random();
								continue;
							}
							if (Trpg.world.tilechanges[wl2.toStr()]){
								new Trpg.Tiles[Trpg.world.tilechanges[wl2.toStr()].type](wl2.copy());
								Math.random();
								continue;
							} */
							var t = (function(wl){
								var r = Math.random();
								//if (r<.002)
								//	return new Trpg.Tiles.AlchingStand");
								//else 
									if (r<.1)
									return new Trpg.Tiles.Tree(wl,true);
								else return new Trpg.Tiles.Grass(wl,true);
							})(wl2);//.setWl();
							//Trpg.world.tilechanges[t.loc.toStr()] = t.getState();
							//var t = generateTile(Math.random()).setWl(this.wl.copy().shift(j,i));
							row.push(t);
							orow.push(t);
						}
						this.tiles.push(row);
						this.origtiles.push(orow);
					}
					break;
				case "floor1":
				case "floor2":
					for (var i = 0; i < 8; i++){
						var row = [];
						var orow = [];
						for (var j = 0; j < 8; j++){
							var t = new Trpg.Tiles.Void().setWl(this.wl.copy().shift(j,i));
							//var t = generateTile(Math.random()).setWl(this.wl.copy().shift(j,i));
							row.push(t);
							orow.push(t);
						}
						this.tiles.push(row);
						this.origtiles.push(orow);
					}
					break;
				case "underground1":
				case "underground2":
					for (var i = 0; i < 8; i++){
						var row = [];
						var orow = [];
						for (var j = 0; j < 8; j++){
							var t = new Trpg.Tiles.Dirt().setWl(this.wl.copy().shift(j,i));
							row.push(t);
							orow.push(t);
						}
						this.tiles.push(row);
						this.origtiles.push(orow);
					}
					if (Math.random()<.5){
						var amt = Math.floor(Math.random()*5+5);
						for (var i = 0; i < amt; i++){
							var type = ["TinOre","CopperOre","CoalOre","IronOre","MithrilOre","AdamantOre","RuneOre","EterniumOre"][Math.floor(Math.random()*8)];
							var tx = Math.floor(Math.random()*8);
							var ty = Math.floor(Math.random()*8);
							this.tiles[tx][ty] = new Trpg.Tile(type).setWl(this.wl.copy().shift(ty,tx));;
							this.origtiles[tx][ty] = new Trpg.Tile(type).setWl(this.wl.copy().shift(ty,tx));;
						}
					}
					break;
			}
			if (Trpg.world.changed.indexOf(this.code)!=-1)
				this.loadChanges();
			//#map for (var i = 0; i < 8; i++)
			//	for (var j = 0; j < 8; j++)
			//		Trpg.Map.addtile(this.tiles[j][i]);
			return this;
		}
		this.renderimg = function(g){
			var s = 3;
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++){
					g.fillStyle = this.tiles[j][i].getcolor();
					g.fillRect(s*i,s*j,s,s);
				}
		}
		this.getTile = function(wl){
			return;
			return this.tiles[wl.cy][wl.cx];
		}
		this.setTile = function(tile, wl){
			return;
			this.tiles[wl.cy][wl.cx] = tile.setWl(wl.copy());
			//#mapTrpg.Map.addtile(tile);
			if (Trpg.world.changed.indexOf(this.code)==-1)
				Trpg.world.changed.push(this.code);
		}
		this.loadChanges = function(){
			return;
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++){
					var t = this.tiles[i][j];
					if (Trpg.world.tilechanges[t.loc.toStr()])
						t.load(Trpg.world.tilechanges[t.loc.toStr()]);
				}
			return;
			var changes = Trpg.world.changes[this.code] && JSON.parse(Trpg.world.changes[this.code]) || [];
			for (var i = 0; i < changes.length; i++){
				this.tiles[changes[i].i][changes[i].j] = new Trpg.Tile(changes[i].save.type).setWl(this.wl.copy().shift(changes[i].j,changes[i].i));
				this.tiles[changes[i].i][changes[i].j].load(changes[i].save);
				//#mapTrpg.Map.addtile(this.tiles[changes[i].i][changes[i].j]);
				//this.tiles[changes[i].i][changes[i].j].update(changes[i].count);
			}
		}
		this.getChanges = function(){
			return;
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++){
					var t = this.tiles[i][j];
					if (t.save())
						Trpg.world.tilechanges[t.loc.toStr()] = t.save();
				}
			return;
			
			var changes = [];
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					if (this.tiles[i][j].getstate()!=this.origtiles[i][j].getstate())
						changes.push({i:i,j:j,save:this.tiles[i][j].save()})
						//if (exists(this.tiles[i][j].growtimer))
						//	 changes.push({i:i,j:j,type:this.tiles[i][j].type,count:this.tiles[i][j].growtimer.count});
						//else changes.push({i:i,j:j,type:this.tiles[i][j].type,count:0});
			if (changes.length == 0)
				return "none";
			if (Trpg.world.changed.indexOf(this.code)==-1)
				Trpg.world.changed.push(this.code);
			return (JSON.stringify(changes));
		}
		this.update = function(d){
			return;
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					this.tiles[i][j].update(d);
		}
		this.render = function(g){
			return;
			
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					this.tiles[i][j].render(g);
			
			return;
			g.save();
			g.translate(32*(8*x-0*Trpg.player.loc.cx),32*8*y);
					g.scale(1.0001,1.001);
			for (var i = 0; i < 8; i++){
				for (var j = 0, wl; j < 8; j++){
					g.save();
					
					g.translate(32*j,32*i);
					wl = new Trpg.WorldLoc(x,y,j,i,d);
					g.scale(1.01,1.01);
					var tile = this.tiles[i][j];
					if (Trpg.player.loc.indist(wl,Trpg.board.viewsize))
						tile.render(g);
						/*for (var p = 0; p < Trpg.Entities.entities[e].path.length; p++)
							if (this.tiles[i][j].wl.toStr() == Trpg.Entities.entities[e].path[p].wlstr)
					if(this.tiles[i][j].highlighted)
						g.fillRect(8,8,24,24);*/
					//if (Trpg.board.onboard && Trpg.board.aim!=-1 && exists(Trpg.board.aim))
					//	if (Trpg.board.aim.indist(wl,0))
					//		g.strokeRect(0,0,32,32);
						
					if (Trpg.board.ground.hasitems(wl))
						Trpg.board.ground.render(g,wl);
						
					g.fillStyle = "yellow";
					//if (tile.loc.toStr() == Trpg.board.aim.toStr())
					if (tile.isover)
						g.fillRect(0,0,32,32);
					//g.globalAlpha = .5;
					for (var e = 0; e < Trpg.Entities.entities.length; e++){
						var ent = Trpg.Entities.entities[e];
						if (ent == Trpg.player || Trpg.debugger.showentitypaths){
						if (tile.loc.toStr() == ent.nexttile.toStr()){
							if (ent.path.length > 0)
								g.fillRect(13,13,6,6);
							else if (!ent.nexttile.inmdist(ent.loc,.9))
								g.fillRect(11,11,10,10);
						}
						for (var p = 0; p < ent.path.length; p++){
							var node = ent.path[p];
							if (tile.loc.toStr() == node.wlstr){
								if (p == ent.path.length-1)
									g.fillRect(11,11,10,10);
								else {
									g.fillRect(13,13,6,6);
									/*g.save();
									console.log(node);
									var nextnode = ent.path[p+1];
									var nwl = new Trpg.WorldLoc().loadStr(node.wlstr);
									var nnwl = new Trpg.WorldLoc().loadStr(nextnode.wlstr);
									var dx = nwl.dx(nnwl);
									var dy = nwl.dy(nnwl);
									var len;
									if (dx*dy!==0)
										len = 45;
									else len = 32;
									g.translate(16,16);
									g.rotate(Math.atan2(dy,dx));
									g.fillRect(0,-1.5,len,3);
									g.restore();*/
								}
							}
						}
						}
					}
					//g.globalAlpha = 1;
					if (hasaction() && getaction().owner == this.tiles[i][j])
						getaction().renderp(g);
					/*if (Trpg.Home.get("Gameplay").has("currentaction")
						&& Trpg.Home.get("Gameplay.currentaction").board
						&& Trpg.Home.get("Gameplay.currentaction").wl.indist(wl,0))
						Trpg.Home.get("Gameplay.currentaction").renderp(g);*/
					
					/*if (false&&Trpg.toolbox.container.has("actiondelay")
						&& Trpg.toolbox.actingwl !== -1
						&& Trpg.toolbox.actingwl.dist(wl,0) 
						&& Trpg.toolbox.container.get("actiondelay").progress()<1)
						Trpg.toolbox.container.get("actiondelay").renderp(g);*/
					g.restore();
					//g.translate(32,0);
				}
				//g.translate(-8*32,32);
			}
			g.restore();
		}
	}
}