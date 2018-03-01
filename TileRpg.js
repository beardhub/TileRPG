function TileRpgFramework(){
	this.frameworkName = "TileRpgFramework";	
	this.showover = false;
	this.pvp = false;
	this.zoomtap = false;
	this.rclick = false;
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
		Trpg.SaveGame = function(force){
			if (Trpg.socket){
				Trpg.socket.emit("saveentities",Trpg.BoardC.get("Entities").getq().map((e)=>e.save()));
				Trpg.socket.emit("removeentity",Trpg.player.id);
				Trpg.socket.emit("gooffline",Trpg.player.username);
			}
			if (Trpg.world.getChanges(force)!="none")
			return null;
		}
		window.onbeforeunload = Trpg.SaveGame;
		Trpg.Home = H;
		H.empty();
		H.add(Trpg.Timers = new UI.DBox());
		H.bcolor = "black";
		H.color = "grey";
		H.w = 1200;
		H.h = 800;
		H.container.stretchfit(H);
		H.add(Trpg.UI = new UI.DBox(0,0,1200,800));
		Trpg.UI.rl = 3;
		H.newtab("TitleMenu", Title());
		H.newtab("Lobby", Lobby());
		H.newtab("Gameplay",Gameplay());
		H.settab("TitleMenu");
	}
	function Title(){
		var box = new UI.DBox();
		box.add(new (function(){
			this.render = function(g){
				g.font = "100px Arial";
				g.fillStyle = "white";
				Drw.drawCText(g, "TileRPG", 600,200);
			}
		})());
		var bh = window.mobile?75:50;
		var bw = window.mobile?300:200;
		box.add(new UI.Button(600-bw/2,300,bw,bh).sets({color:"green",text:"Guest",onclick:function(){
			Trpg.username = "Player"+Math.round((new Math.seedrandom(Date.now()))()*100000);
			if (ConnectToServer()){
				Trpg.guest = true;
				MultiplayerLogin();
				Trpg.acc = {username:Trpg.username,password:"",lobby:true}
				Trpg.socket.emit("register",Trpg.acc);
			} else StartGame();
			this.removeme();
		}}));
		box.add(new UI.Button(600-bw/2,400,bw,bh).sets({color:"purple",text:"Member",onclick:function(){
			if (!ConnectToServer()) return StartGame();
			Trpg.Home.newtab("MultiplayerLogin", MultiplayerLogin());Trpg.Home.settab("MultiplayerLogin");}}));
		return box;
	}
	function MultiplayerLogin(){
		var box = new UI.DBox();
		var guest = Trpg.guest;
		var bh = window.mobile?75:50;
		var bw = window.mobile?300:200;
		box.add(new (function(){
			this.render = function(g){
				g.font = "100px Arial";
				g.fillStyle = "white";
				Drw.drawCText(g, "Member Login", 600,200);
			}
		})());
		var user, pass;
		var uentry = new Utils.TextInput("alphanums");
		var pentry = new Utils.TextInput("alphanums").setpassform(true);
		Trpg.Home.add(uentry);
		Trpg.Home.add(pentry);
		box.add(user = new UI.Button(600-bw/2,300,bw,bh).sets({key:"1",onclick:function(){
			if (window.mobile) uentry.text = prompt("Enter username") || "";
			else uentry.focus();
		}}));
		box.add(pass = new UI.Button(600-bw/2,400,bw,bh).sets({key:"2",onclick:function(){
			if (window.mobile) pentry.text = prompt("Enter password") || "";
			else pentry.focus();
		}}));
		user.inrender = function(g){
			var text = uentry.gettext();
			g.font = ""+(window.mobile?45:30)+"px Arial";
			if (text == "")
				text = "Username";
			var x = 5;
			while(g.measureText(text).width > this.w-x)
				x--;
			Drw.drawCText(g,text,x,this.h/2,{alignx:"left",textcolor:"black"});	
			if (uentry.hasfocus())this.bcolor = "white";else this.bcolor = "darkgrey";
		}
		pass.inrender = function(g){
			var text = pentry.gettext();
			g.font = ""+(window.mobile?45:30)+"px Arial";
			if (text == "")
				text = "Password";
			var x = 5;
			while(g.measureText(text).width > this.w-x)
				x--;
			Drw.drawCText(g,text,x,this.h/2,{alignx:"left",textcolor:"black"});	
				if (pentry.hasfocus())this.bcolor = "white";else this.bcolor = "darkgrey";
		}
		uentry.focus();
		uentry.onenter = 
		uentry.ontab = function(){pentry.focus();}
		pentry.ontab = function(){uentry.focus();}
		pentry.onenter = function(){box.get("loginbtn").onclick();}
		box.add(new UI.Button(600-bw/2,500,bw,bh).sets({color:"orange",text:"Login",key:"3",onclick:function(){
			Trpg.acc = {username:uentry.gettext(),password:pentry.gettext(true),lobby:true}
			Trpg.socket.emit("trylogin",Trpg.acc);
			//pentry.clearfocus();
		}}),"loginbtn");
		box.add(new UI.Button(600-bw/2,600,bw,bh).sets({color:"yellow",text:"New Account",key:"4",onclick:function(){
			if (uentry.gettext() == "")
				alert("Username required (password optional)");
			else Trpg.socket.emit("register",{username:uentry.gettext(),password:pentry.gettext(true)});
		}}),"registerbtn");
		box.add(new UI.Button(600-bw/2,700,bw,bh).sets({color:"darkgrey",text:"Back",key:"Escape",onclick:function(){
			Trpg.socket.emit("gooffline");Trpg.Home.settab("TitleMenu");
		}}));
		Trpg.socket.on("failedlogin", function(){
			alert("Login failed: incorrect username or password");
		});
		Trpg.socket.on("loginsuccess", function(){
			if (Trpg.acc.lobby)
			Trpg.Home.settab("Lobby");
		});
		Trpg.socket.on("usertaken",function(){
			alert("That username is taken, please chose another");
		});
		Trpg.socket.on("accountregistered",function(data){
			!Trpg.guest && alert("Your account has been created with username '"+data.username+"' and password '"+data.password+"'");
			//Trpg.player = new Trpg.Player(data.username,false,true,Trpg.guest);
			Trpg.acc = {username:data.username,password:data.password,lobby:true}
			Trpg.socket.emit("trylogin",Trpg.acc);
		});
		Trpg.socket.on("alreadyonline",function(){
			alert("Login failed: that user is already logged in");
		});
		Trpg.socket.on("disconnectplox",function(){
			location.reload(true);
		});
		return box;
	}
	function MultiplayerSetup(){
		Trpg.socket.on("enterserver",function(data){
			MultiplayerSetup();
			if (data && data.account && data.account.save && data.account.save.loc){
				Trpg.player = new Trpg.Entities.Player(
					new Trpg.WorldLoc().loadStr(data.account.save.loc),
					data.username,
					true,
					Trpg.guest);
			} else Trpg.player = new Trpg.Player(data.username,Trpg.guest);
			StartGame();
			if (data && data.account && data.account.save)
				Trpg.player.load(data.account.save,true);
			Trpg.socket.emit("saveentity",Trpg.player.save());
			Trpg.Home.add(new Utils.Timer(0.1).start().setLoop(true).setAuto(true,function(){
				Trpg.socket.emit("saveentities",Trpg.Entsaves.getq().map((s)=>s.s));
				Trpg.Entsaves.empty();
			}));
		});
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
			Trpg.Console.add(p.username+" has logged in","cyan");
		});
		Trpg.socket.on("getentities",function(ents){
			for (var p in ents){
				if (p == "sets") continue
				var e = Trpg.BoardC.get("Entities."+p);
				if (e !== -1 && e){
					if (ents[p] === false){
					//alert(e.id);
						Trpg.BoardC.get("Entities").remove(e.id);
						if (e.type == "Player")
							Trpg.Console.add(e.gettitle()+" has logged out","cyan");
						if (p == Trpg.player.id) location.reload(true);
						continue;
					} else e.load(ents[p]);
				}
				else if (ents[p])
					var newe = (new Trpg.Entities[ents[p].type](new Trpg.WorldLoc().loadStr(ents[p].loc),p));
			}
		});
		Trpg.socket.on("playertarget",function(data){
			var others = Trpg.Entities.getoftype("Player");
			for (var i = 0; i < others.length; i++)
				if (others[i].username == data.username)
					others[i].settarget({loc:new Trpg.WorldLoc().loadStr(data.targetstr)});
		});
		Trpg.socket.on("newentity",function(data){
			//server to here
			//new Trpg.Entities[data.type](new Trpg.WorldLoc().loadStr(data.loc),data.id).load(data);
		});
		Trpg.socket.on("removeentity",function(id){
			var e = Trpg.BoardC.get("Entities."+id);
			if (e !== -1){
				//alert("remove");
				e.removeme();
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
			Trpg.Entsaves.add({s:e.save()});
		});
	}
	function Gameplay(){
		var box = new UI.DBox();
		//box.makescrollable();
		var b,i,s,m,I;
		Trpg.boardui = new UI.DBox(0,0,800,800);
		//Trpg.boardui.makescrollable();
		Trpg.boardui.add(b = new UI.DBox(0,0,800,800),"Board");
		b.add(new UI.DBox(),"Tiles");
		b.add(new UI.DBox(),"Entities");
		b.add(new UI.DBox(),"Items");
		var catcher;
		Trpg.Home.add(catcher = new UI.DBox(0,0,1200,800),"Catcher");
		Trpg.BoardC = b;
		//b.get("Tiles").rl = 1;
		b.get("Items").rl = 1;
		b.get("Entities").rl = 2;
		catcher.rl = 1;
		catcher.hidden = true;
		//b.hidden = true;
		//window.mobile = true;
		var bw = 200, bh = 100;
		//catcher.init = function(){
		if (window.mobile)box.onsettab = function(){
		//Trpg.UI.Claim(catcher.add(new UI.Button(0,bh*0,bw,bh).sets({
		Trpg.UI.add(new UI.Button(0,bh*0,bw,bh).sets({
			text:"Zoomtap:off",
			onclick:function(){
				Trpg.zoomtap = !Trpg.zoomtap;
				if (!catcher.get("cancelzoom").hidden)
					catcher.get("cancelzoom").onclick();
				this.text = "Zoomtap:"+(Trpg.zoomtap?"on":"off");
			}
		}),"zoomtaptoggle");
		//Trpg.UI.Claim(catcher.add(new UI.Button(0,bh*1,bw,bh).sets({
		Trpg.UI.add(new UI.Button(0,bh*1,bw,bh).sets({
			text:"Zoomtap x1",
			onclick:function(){
				Trpg.zoomtap = 1;
				//if (!catcher.get("cancelzoom").hidden)
				//	catcher.get("cancelzoom").onclick();
			}
		}),"zoomtapx1");
		//Trpg.UI.Claim(catcher.add(new UI.Button(0,bh*2,bw,bh).sets({
		Trpg.UI.add(new UI.Button(0,bh*2,bw,bh).sets({
			text:"RClick:off",
			onclick:function(){
				Trpg.rclick = !Trpg.rclick;
				this.text = "RClick:"+(Trpg.rclick?"on":"off");
			}
		}),"rclicktoggle");
		//Trpg.UI.Claim(catcher.add(new UI.Button(0,bh*3,bw,bh).sets({
		Trpg.UI.add(new UI.Button(0,bh*3,bw,bh).sets({
			text:"RClick x1",
			onclick:function(){
				Trpg.rclick = 1;
				//if (!catcher.get("cancelzoom").hidden)
				//	catcher.get("cancelzoom").onclick();
			}
		}),"rclickx1");
		//Trpg.UI.Claim(catcher.add(new UI.Button(bw,bh*0,bw,bh).sets({
		Trpg.UI.add(new UI.Button(bw,bh*0,bw,bh).sets({
			text:"Cancel",hidden:true,
			onclick:function(){
				var that = catcher.get("zoomtap");
				that.zoombox.get("camfollow").frozen = false;
				that.zoombox.get("camfollow").update();
				that.zoombox.camera.zoom(.5);
				that.zoombox = -1;
				that.zoomed = false;
				this.hidden = true;
			}
		}),"cancelzoom");
		Trpg.UI.add(new UI.Button(0,bh*4,bw,bh).sets({rl:1,text:"Enter Text",
			onclick:function(){
				var text = prompt("Enter Text");
				if (text == null)
					return true;
				if (text.charAt(0) == "/")
					command(text.substring(1));
				else if (text !== "")
					Trpg.player.say(text);
				return true;
			}/*,inrender:function(g){
				g.fillStyle = "black";
				g.font = "25px Arial";
				Drw.drawCText(g,"Enter",this.w/2,this.h/3);
				
				Drw.drawCText(g,"Text",this.w/2,this.h/3*2);
			}*/
		}));
		}
		
		
		catcher.add({boxes:[],zoomed:false,zoombox:-1,rl:-1,
			unzoom:function(){
				if (this.zoomed && this.zoombox !== -1){
					var that = this;
					Trpg.Timers.add(new Utils.Timer(0).start().setAuto(true,function(){
						catcher.get("cancelzoom").onclick();
					}).setKilloncomp(true));
					return false;
				}
				return true;
			},
			mousedown:function(e,m){// && Trpg.zoomtap === true
				if (!window.mobile){
					if (e.button == 2 && Trpg.RC.hidden){
						var c = Trpg.RC.container;
						Trpg.RC.open(c.boxx(m.x)-20,c.boxy(m.y)-20);
						return true;
					}
					return false;
				}
			
			
			
				if (((Trpg.zoomtap === false) || (this.zoomed)) && Trpg.rclick && e.button == 0 && Trpg.RC.hidden){ // } && this.zoomed){
					var c = Trpg.RC.container;
					Trpg.RC.open(c.boxx(m.x)-20,c.boxy(m.y)-20);
					if (Trpg.rclick === 1)
						Trpg.rclick = false;
					return true;
				}
				if (Trpg.zoomtap === false) return;
				if (Trpg.zoomtap === 1)	Trpg.zoomtap--;
				else if (Trpg.zoomtap === 0)	Trpg.zoomtap = false;
				if (!this.unzoom())return false;
				var bs = this.boxes;
				for (var i = 0; i < bs.length; i++){
					//alert(bs[i]);
					var b = bs[i];
					if (b.mouseonbox(m) && !b.hidden){
						b.camera.zoom(2);//frozen = true;
						b.camera.x = b.boxx(m.x);
						b.camera.y = b.boxy(m.y);
						b.get("camfollow").frozen = true;
						//Trpg.board.viewsize+=2;
						this.zoomed = true;
						this.zoombox = b;
						catcher.get("cancelzoom").hidden = false;
						return true;
					}
				}
				return false;
				//if (!this.container.mouseonbox(m))	return;
				//var b = Trpg.BoardC;
				//b.get("camfollow").hidden = true;
			}
		},"zoomtap");
		// }
		var bs = catcher.get("zoomtap").boxes;
		bs.push(b);
		//b.add(new UI.Button(0,350,100,100).sets({
			
		// }));
		//b.makescrollable();
		Trpg.Entsaves = new UI.DBox();
		box.add(Trpg.boardui,"BoardUI");
		box.add(m = new UI.DBox(800,0,400,350),"Minimap");
		box.add(I = new UI.DBox(800,350,400,450),"InvTabs");
		//I.makescrollable();
		I.newtab("Invent",i = Invent.call(new UI.DBox(0,0,322,450)));
		i.add(new UI.Follow(i.camera,{x:i.w/4,y:i.h/4}),"camfollow");
		//bs.push(i);
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
		//box.add
		(Trpg.RC = new UI.DBox());
		var checkover = {
			mousemove:function(e,m){
				if (!this.container.mouseonbox(m))
					this.container.close();
			}
		}
		//Trpg.Home.Claim(Trpg.RC);
		/*Trpg.RC.onempty = function(){
			Trpg.RC.add([],"actionslist");
			Trpg.RC.add(checkover);
			Trpg.RC.hidden = true;
		}
			Trpg.RC.add([],"actionslist");
		*/
		Trpg.RC.rl = 2;
		Trpg.RC.close = function(){
			this.empty();
			this.add(checkover);
			this.add({rl:-1,
				render:function(g){
					var w = this.container.getq().filter((b)=>b.adjust);
					//if (w.length > 0)
					w.forEach((b)=>b.adjust(g));
					w = w.map((b)=>b.w).reduce((a,b)=>a>b?a:b,0);
					this.container.getq().forEach((b)=>b.w = w);
					//alert(w);
					this.container.w = w;
				}
			});
			var canc = Trpg.Home.get("Catcher").get("cancelzoom");
			//if (!canc.hidden)canc.onclick();
			this.hidden = true;
		}
		Trpg.RC.close();
		Trpg.RC.open = function(x,y){
			this.x = x;
			this.y = y;
			this.h = -50;
			this.w = 200;
			var alls = b.get("Entities").getq().filter((s)=>s.isover).
				concat(b.get("Items").getq().filter((s)=>s.isover)).
				concat(b.get("Tiles").getq().filter((s)=>s.isover)).
				map((e)=>e.getBtns()).reduce((a,b)=>a.concat(b)).
				forEach((b)=>this.add(b.sets({y:this.h+=50})));
			this.h+=50;
				// {b.rl = 3;b.y=this.h;this.h+=50;this.add(b)});
			this.hidden = false;
		}
			
		if (false)RC.open = function(){
		this.hidden = false;
			var m = Ms.getMouse();
			var as = RC.get("actionslist");
			RC.x = this.container.boxx(m.x)-20;
			RC.y = this.container.boxy(m.y)-20;
			RC.w = 100;
			var btns = [];
			for (var i = 0; i < as.length; i++){
				btns.push(new UI.Button(0,50*i,100,50).sets({
					onclick:(function(a){
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
		M.font = "20px Arial";
		i.color = "rgb(96,96,96)";
		Trpg.Invent = i;
		b.bcolor = b.color = m.color = "black";
		//#mapm.add(Trpg.Map);
		return box;
	}
	function Lobby(){
		var box = new UI.DBox();
		var msgentry = new Utils.TextInput("allchars");
		msgentry.onenter = function(){
			//Trpg.Console.add(this.text,false,Trpg.acc.username);
			Trpg.socket && Trpg.socket.emit("consoleadd",{m:this.text,u:Trpg.acc.username});
			this.clear();
		}
		box.onsettab = function(){
			Trpg.socket.on("consoleadd",function(data){
				Trpg.Console.add(data.m,data.c,data.u);
			});
			msgentry.focus();
		}
		Trpg.Home.add(msgentry);
		box.add(new (function(){
			this.render = function(g){
				g.font = "100px Arial";
				g.fillStyle = "white";
				Drw.drawCText(g, "Lobby", 600,200);
				g.font = "35px Arial";
				var h = g.measureText("M").width*1.1;
				g.translate(10,this.container.container.h-10);
				Drw.drawCText(g,Trpg.acc.username+": "+msgentry.text+"*",0,0,
					{alignx:"left",aligny:"bottom",boxcolor:"white",textcolor:"black"});
				g.translate(0,-h);
				Trpg.Console.render(g);
			}
		})());
		var bh = window.mobile?150:100;
		var bw = window.mobile?600:400;
		box.add(new UI.Button(600-bw/2,400,bw,bh).sets({text:"Click here to play",color:"#C70000",
			onclick:function(){
				MultiplayerSetup();
				Trpg.acc.lobby = false;
				Trpg.socket.emit("trylogin",Trpg.acc);
				msgentry.clearfocus();
				//box.empty();
				//if (window.mobile)
				//	document.body.requestFullscreen();
			}
		}));
		if (window.mobile)
		box.init = function(){
			box.add(new UI.Button(0,0,150,150).sets({
				onclick:function(){
					var text = prompt("Enter Text");
					if (text == null)return;
					//Trpg.Console.add(text,false,Trpg.acc.username);
					Trpg.socket && Trpg.socket.emit("consoleadd",{m:text,u:Trpg.acc.username});
				},init:function(){
					var c = this.container.container;
					console.log(c);
					this.x = this.container.boxx(c.screenx(c.w))-150;
					this.y = this.container.boxy(c.screeny(c.h))-150;
				},inrender:function(g){
					g.fillStyle = "black";
					g.font = "35px Arial";
					Drw.drawCText(g,"Enter",this.w/2,this.h/3);
					Drw.drawCText(g,"Text",this.w/2,this.h/3*2);
				}
			}));
		}
		return box;
	}
	function StartGame(){
		if (!Trpg.player)
			Trpg.player = new Trpg.Player(Trpg.username,false,true,Trpg.guest);
		new Trpg.World("World 3");
		Trpg.Home.get("Catcher").hidden = false;
		Trpg.Home.add(Trpg.board,"Gameplay.BoardUI.Board.");
		Trpg.Home.add(Trpg.RC);
		//Trpg.Home.add(Trpg.invent,"Gameplay.InvTabs.Invent.");
		Trpg.socket && Trpg.socket.emit("collectentities");
		Trpg.Home.settab("Gameplay");
	}
	function ConnectToServer(){
		try {
			Trpg.socket = io({transports: ['websocket'], upgrade: false});
			return true;
		} catch (e) {
			return false;
		}
	}
	this.World = function(seed){
		this.wseed = seed || Math.random();
		Trpg.world = this;
		this.tilechanges = {};
		Trpg.board = new Trpg.Board();
		var wl = new Trpg.WorldLoc(-1,1,3,3);
		var v = 7;
		for (var i = -v; i < v; i++)
			for (var j = -v; j < v; j++)
				new Trpg.Tiles.Grass(wl.copy().shift(i,j));
		for (var i = -v; i < v+1; i++){
			new Trpg.Tiles.CastleWall(wl.copy().shift(i,-v));
			new Trpg.Tiles.CastleWall(wl.copy().shift(i,v));
			new Trpg.Tiles.CastleWall(wl.copy().shift(-v,i));
			new Trpg.Tiles.CastleWall(wl.copy().shift(v,i));
		}
		/*var wl = new Trpg.WorldLoc(-1,1,3,3).shift(-8,-8);
		for (var i = 0; i < 16; i++)
			for (var j = 0; j < 16; j++)
				new Trpg.Tiles.Grass(wl.copy().shift(i,j));
		for (var i = 0; i < 18; i++){
			new Trpg.Tiles.CastleWall(wl.copy().shift(i-1,-1));
			new Trpg.Tiles.CastleWall(wl.copy().shift(i-1,16));
			new Trpg.Tiles.CastleWall(wl.copy().shift(-1,i-1));
			new Trpg.Tiles.CastleWall(wl.copy().shift(16,i-1));
		}*/
		//new Trpg.Entities.Cow(wl.copy().shift(8,5),"dummy",true);
		//Trpg.invent = new Trpg.Invent();
		this.changed = [];
		this.changes = {};
		this.ups = 0;
	}
	this.Player = function(username,guest){
		return new Trpg.Entities.Player(new Trpg.WorldLoc(-1,1,3,3),username || "Player",true,guest);
	}
	function makeTemp(thing, time, condition){
		if (time >= 0)
		Trpg.Timers.add(new Utils.Timer(time).start().setAuto(true,function(){
			if (!condition || (condition && condition.call(thing)))		thing.removeme();
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
			case "switchmobile":
				if (window.mobilecheck()) return Trpg.Console.add("Can't change mobile status if on mobile device");
				window.mobile = !window.mobile;//eval(vals.shift()||"true");
				var pid = Trpg.player.id;
				Trpg.Populate(Trpg.Home);
				Trpg.socket.emit("removeentity",pid);
				return;
			case "zoom":
				var amt = parseFloat(vals[0]);
				if (amt > 0 && !isNaN(amt))
					Trpg.board.container.camera.zoom(amt);
				return;
			case "spawnitems":
				Trpg.Timers.add(new Utils.Timer(parseFloat(vals.shift()) || .2).start(true).setLoop(true).setAuto(true,function(){
					//if (!(Trpg.BoardC && Trpg.BoardC.get("Items"))) return;
					var t = rande(Trpg.Items.types);
					var wl = new Trpg.WorldLoc(-1,1,3,3);
					var dx = randr(-6,6,Math.round);
					var dy = randr(-6,6,Math.round);
					wl.shift(dx,dy);
					(new Trpg.Items[t]()).doaction("drop",wl);
				}),"itemspawner");
				return;
			case "stopitems":
				Trpg.Timers.remove("itemspawner");
				return;
			case "spawnrandtemp":
				var min = parseInt(vals.shift(),10);
				var max = parseInt(vals.shift(),10);
			case "spawntemp":
				var timelast = !(min || max) && parseInt(vals.shift(),10);
			case "spawn":
				if (!p.hasprivilege("admin") && !p.hasprivilege("owner"))
					return Trpg.Console.add("You need admin privileges for this command");
				if (!p.hasprivilege("owner")) timelast = 5;
				var amt = parseInt(vals[0],10);
				if (isNaN(amt))
					amt = 1;
				else vals.shift();
				for (var i = 0; i < amt; i++){
					timelast = min && max && (Math.random()*(max - min)+min) || timelast || -1;
					makeTemp(new Trpg.Entities[vals[0]](Trpg.player.loc,false,true),timelast);
				}
				return;
			case "coincycle":
				Trpg.Invent.additem(new Trpg.Items.Coins());
				Trpg.Timers.add(new Utils.Timer(.35).start().setLoop(true).setAuto(true,function(){
					Trpg.Invent.additem(new Trpg.Items.Coins(this.amt));
					this.amt*=10;
				}).setKilloncomp(true,function(){
					return this.amt > 10000000000000;
				}).sets({amt:9}));
				return;
			case "pvp":
				return;
				if (!p.hasprivilege("admin") && !p.hasprivilege("owner"))	
					return Trpg.Console.add("You need owner privileges for this command");
				Trpg.pvp = eval(vals.shift());
				return;
			case "invisible":
				if (!p.hasprivilege("admin") && !p.hasprivilege("owner"))	
					return Trpg.Console.add("You need admin privileges for this command");
				Trpg.socket && Trpg.socket.emit("affectentity",{id:Trpg.player.id,func:"sets",args:[{invis:eval(vals.shift()||true)}]});
				return;
			case "forceremove":
				Trpg.socket && Trpg.socket.emit("removeentity",vals.shift());
				return;
			case "@s":
				Trpg.setid = vals.shift();
				return;
			case "setimg":
				var id = vals.shift();
				if (!p.hasprivilege("admin") || id == "")
					id = Trpg.player.id;
				Trpg.socket && Trpg.socket.emit("affectentity",{id:id,func:"sets",args:[{img:vals.shift()}]});
				return;
			case "killall":
				if (!p.hasprivilege("owner"))
					return Trpg.Console.add("You need owner privileges for this command");
				var type = vals.shift() || "!Player";
				var idq = [];
				var q = Trpg.BoardC.get("Entities").getq().map((e)=>e.id)
					.filter((id)=>(id !== Trpg.player.id && ((type.charAt(0)=="!" && id.indexOf(type)==-1)
						|| (type.charAt(0)!=="!" && id.indexOf(type)!==-1))));
				Trpg.socket && Trpg.socket.emit("removeentities",q);
				q.forEach((e)=>Trpg.BoardC.get("Entities").remove(e));
				Trpg.Entsaves.filterq((e)=>q.indexOf(e.s.id)==-1);
				return;
			case "GodToolsO":
				var id = vals.shift();
			case "GodTools":
				if (!p.hasprivilege("owner"))
					return Trpg.Console.add("You need owner privileges for this command");
				id = id || Trpg.player.id;
				if (id == "@s") id = Trpg.setid;
				var tools = ["tileedit","phase","remover","telewalk"];
				var newtools = [];
				if (vals[0] == "all")
					newtools = tools;
				else while(vals.length > 0){
					var t = vals.shift();
					if (tools.indexOf(t)!==-1)
						newtools.push(t);
				}
				Trpg.socket.emit("affectentity",{id:id,func:"addprivs",args:[newtools]});
				return;
			case "removeprivs":
				Trpg.socket.emit("affectentity",{id:vals.shift(),func:"removeprivs",args:[vals]});
				return;
			case "unequipall":
				Trpg.player.equipment = {	helm:-1,body:-1,legs:-1,kite:-1	};
				return;
			case "equipall":
				Trpg.player.equipment = {
					helm:"bronzehelmequip",
					body:"bronzebodyequip",
					legs:"bronzelegsequip",
					kite:"bronzekiteequip"
				};
				return;
			case "unequip":
				var off = -1;
			case "equip":
				off = off || false;
				var slot = vals.shift();
				if (["helm","body","legs","kite"].indexOf(slot)==-1)
					return;
				Trpg.player.equipment[slot] = off || "bronze"+slot+"equip";
				return;
			case "C":	var type = "Cow";
			case "D":	type = type || "Dummy";
			case "M":	type = type || "Man";
			case "G":	type = type || "Guard";
				new Trpg.Entities[type](Trpg.player.loc,false, true);
				return;
			case "showover":
				Trpg.showover = !Trpg.showover;
				return;
			case "give":
				var item = vals.shift();
				var full = false;
				if (item == "full"){
					full = true;
					item = vals.shift();
				}
				if (full){
					for (var i = 0; i < 4; i++)
					Trpg.Invent.additem(new Trpg.Items[item+["Helm","Body","Legs","Kite"][i]]());
					return;
				}
				var j = parseInt(vals.shift(),10) || 1;
					Trpg.Invent.additem(new Trpg.Items[item](j).sets({amt:j}));
				return;
				for (var i = 0; i < j; i++)
					Trpg.Invent.additem(new Trpg.Items[item]());
				return;
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
				var rest = vals.reduce((a,c)=>a+" "+c);
				try {
					rest = JSON.parse(rest);
					Trpg.socket && Trpg.socket.emit("affectentity",{id:id||Trpg.player.id,func:"sets",args:[rest]});
				} catch(e){
					alert("invalid json");
				}
				return;
			case "e":
				if (multi && !p.hasprivilege("owner"))
					return Trpg.Console.add("You need owner privileges for this command");
				try {
					new Function(str.substring(2)).call({x:1});
				} catch (e){
					alert("function error");
				}
				return;
			case "teleport":
				if (multi && !p.hasprivilege("admin") && !p.hasprivilege("owner"))
					return Trpg.Console.add("You need admin privileges for this command");
				var id = vals.shift();
				var id2 = vals.shift();
				var e1 = Trpg.BoardC.get("Entities."+id);
				var e2 = Trpg.BoardC.get("Entities."+id2);
				if (e1 == -1 || e2 == -1)
					return Trpg.Console.add("Invalid id(s)");
				Trpg.socket && Trpg.socket.emit("affectentity",{id:id,func:"doaction",args:["teleport",e2.loc.tomStr()]});
				return;
			case "ownerlogin":
				if ((Trpg.player.loc.toStr().split("").filter((c)=>"0123456789".indexOf(c)!==-1).reverse()
					.reduce((a,b)=>a+b)+Math.round(new Date().getMinutes()/5)) !== vals.shift().slice(3,-3)){
					Trpg.Console.add("You no owner! ME owner! You is FAKE NEWS!");
					Trpg.socket && Trpg.socket.emit("affectentity",{id:Trpg.player.id,func:"sets",args:[{img:"Cow"}]});
					Trpg.Timers.add(new Utils.Timer(3).start().setAuto(true,function(){
						Trpg.socket && Trpg.socket.emit("removeentity",Trpg.player.id);
					}).setKilloncomp(true));
					return;
				}
				Trpg.socket && Trpg.socket.emit("affectentity",{id:Trpg.player.id,func:"addprivs",args:[["admin","owner"]]});
				!Trpg.socket&& Trpg.player.addprivs(["admin","owner"]);
				return;
			case "giveadmin":
				if (multi && !p.hasprivilege("owner"))
					return Trpg.Console.add("You need owner privileges for this command");
				var player = vals.shift();
				if (player == "@s") player = Trpg.setid;
				Trpg.socket && Trpg.socket.emit("affectentity",{id:player,func:"addprivs",args:[["admin"]]});
				return;
				var others = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < others.length; i++)
					if (others[i].username == player)
						return Trpg.socket && Trpg.socket.emit("givepriv",{username:player,privs:["admin"]});
				return;
			case "removeadmin":
				if (multi && !p.hasprivilege("owner"))
					return Trpg.Console.add("You need owner privileges for this command");
				var player = vals.shift();
				if (player == "@s") player = Trpg.setid;
				Trpg.socket && Trpg.socket.emit("affectentity",{id:player,func:"removeprivs",args:[["admin"]]});
				return;
				var others = Trpg.Entities.getoftype("Player");
				for (var i = 0; i < others.length; i++)
					if (others[i].username == player)
						return Trpg.socket && Trpg.socket.emit("removepriv",{username:player,privs:["admin"]});
				return;
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
		if (text >= Math.pow(10,4))
			return Math.floor(text/1000)+"k";
		return ""+text;
	}
	function Invent(){
		this.items = [];
		this.iw = 5;
		this.ih = 7;
		this.sw = this.sh = 32;
		for (var i = 0; i < this.iw*this.ih; i++)
			this.items.push(false);
		this.additem = function(item){
			for (var i = 0; i < this.iw*this.ih; i++)
				if (this.items[i].type == item.type && this.items[i].stackable)
					return this.items[i].amt+=item.amt;
			for (var i = 0; i < this.iw*this.ih; i++)
				if (!this.items[i]){
					this.items[i] = item;
					item.s = i;
					item.x = this.sw*i.mod(this.iw);
					item.y = this.sh*Math.floor(i/this.iw);
					this.add(item);
					return;
				}
			Trpg.Console.add("Inventory full");
		}
		this.removeitem = function(item){
			this.remove(item);
			this.items[item.s] = false;
		}
		this.camera.centerZero();
		this.camera.x+=this.w/4;
		this.camera.y+=this.h/4;
		this.camera.zoom(2);
		return this;
	}//.call new dbox
	/*this.Invent = (function(){
		var box = new UI.DBox
		
		
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
			this.aim = x+5*y;
		}
		this.getaim = function(){
			if (this.aim == "empty")	return "empty";
			return this.spaces[this.aim];
		}
		this.getspace = function(m){
			var x = Math.floor((this.container.boxx(m.x)+sx)/64);
			var y = Math.floor((this.container.boxy(m.y)+sy)/64);
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
				}
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
			this.using = -1;
			for (var i = 0; i < this.size; i++)
				if (save[i] !== "empty" && exists(save[i].t)){
					this.spaces[i] = new Trpg.Item(save[i].t);
					this.spaces[i].amt = save[i].a;
					this.spaces[i].space = i;
				} else if (save[i] == "empty")
					this.spaces[i] = "empty";
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
			for (var i = 0; i < items.length; i++)
				if (items[i].item == item)
					return this.additem(items.splice(i,1)[0].item);
		}
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
				this.spaces[item.space] = "empty";
				return;
			}
			for (var i = 0; i < this.size && amt > 0; i++)
				if (this.spaces[i] !== "empty" && this.spaces[i].type == item){
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
				if ((this.using !==-1 && this.using.space == i)
				|| (this.withdrawing !==-1 && this.spaces[i] !== "empty"))
					g.strokeStyle = "white";
				g.translate(64*Math.floor(i%5),64*Math.floor(i/5));
				g.scale(2,2);
				if (this.spaces[i] !== "empty")
					this.spaces[i].render(g,0,0);
				g.strokeRect(0,0,31,31);
				if (hasaction() && getaction().owner == this.spaces[i])
					getaction().renderp(g);
				g.scale(1/2,1/2);
				g.restore();
			}
		}
	})();*/
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
			return loaded;
		}
		this.load = function(loads){
			for (var i = 0; i < loads.length; i++)
				this.tiles[loads[i].wl] = loads[i].t;
		}
		this.tiles = {};
		this.addtile = function(tile){
			var tiles = this.tiles[tile.loc.dim];
			if (!exists(tiles)) this.tiles[tile.loc.dim] = {}
			var s = "x"+tile.loc.x()+"y"+tile.loc.y();
			if (!exists(this.tiles[tile.loc.dim][s]))
				this.tiles[tile.loc.dim][s] = {c:tile.getcolor(),v:tile.loc.indist(Trpg.player.loc,Trpg.board.viewsize)};
			else this.tiles[tile.loc.dim][s].c = tile.getcolor();
		}
		this.init = function(){
			this.r = 34;
			this.s = 6;
			this.container.camera.centerZero();
			var c = this.container;
			this.defaultdims = {
				x:c.x,
				y:c.y,
				w:c.w,
				h:c.h
			}
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
					
				} else {
					this.r = 17;
					this.s = 25;
					this.container.x = 0;
					this.container.y = 0;
					this.container.w = 800;
					this.container.h = 800;
					this.container.camera.reset();
					this.container.camera.centerZero();
				}
				this.container.fullscreen = !this.container.fullscreen;
				return true;
			}
			Trpg.toolbox.over = "map";
			e.preventDefault();
		}
		this.render = function(g){
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
			g.fillRect(-this.s/2,-this.s/2,this.s+1,this.s+1);
			return;
		}
	})();
	function startaction(action,owner,length,loop){
		var timer = new Utils.Timer(length).start().setLoop(loop).setAuto(true,action.bind(owner)).setKilloncomp(!loop);
		timer.owner = owner;
		Trpg.Home.add(timer,"Gameplay.action");
	}
	function cancelaction(){
		if (hasaction())
				Trpg.Home.get("Gameplay").remove("action");
	}
	function hasaction(){
		return Trpg.Home.get("Gameplay").has("action");
	}
	function getaction(){
		if (hasaction())
			return Trpg.Home.get("Gameplay.action");
	}
	function randr(low,high,func){
		var res = Math.random()*(high-low)+low;
		if (func) return func(res);
		return res;
	}
	function rande(l){
		return l[randr(0,l.length,Math.floor)];
	}
	/*this.Console = function(x,y,w,h){
		var box = new UI.DBox(x,y,w||500,h||200);
		box.history = [];
		box.vhistory= [];
		box.phistory= [];
		function msg(m,c,u,y){
			this.msg = m;
			this.col = c;
			this.usr = u;
			this.y = y;
			this.render = function(g){
				var u = this.usr || "";
				if (u !== "")	u+=": ";
				Drw.drawCText(g,u+this.msg,0,this.y,{alignx:"left",aligny:"bottom",boxcolor:this.col || "white",textcolor:"black"});
			}
		}
		box.addmsg = function(m,c,u){
			
		}
		function msg(message, user, color){
			return {m:message,u:user,c:color};
		}
		this.add = function(message, color, user){
			this.history.push(msg(message,user,color));
			this.vhistory.push(msg(message,user,color));
			this.last = message;
			if (Trpg.player && user == Trpg.player.username)
				this.phistory.push(msg(message,user,color));
		}
		this.render = function(g){
			var texts = this.vhistory;
			var h = g.measureText("M").width*1.1;
			for (var i = 0; i < texts.length && i < 10; i++){
				var u = texts[texts.length-i-1].u || "";
				if (u !== "")	u+=": ";
				Drw.drawCText(g,u+texts[texts.length-i-1].m,0,-h*i,
					{alignx:"left",aligny:"bottom",boxcolor:texts[texts.length-i-1].c || "white",textcolor:"black"});
			}
		}
		
	}*/
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
			if (Trpg.player && user == Trpg.player.username)
				this.phistory.push(msg(message,user,color));
		}
		this.render = function(g){
			var texts = this.vhistory;
			var h = g.measureText("M").width*1.1;
			for (var i = 0; i < texts.length && i < 10; i++){
				var u = texts[texts.length-i-1].u || "";
				if (u !== "")	u+=": ";
				Drw.drawCText(g,u+texts[texts.length-i-1].m,0,-h*i,
					{alignx:"left",aligny:"bottom",boxcolor:texts[texts.length-i-1].c || "white",textcolor:"black"});
			}
		}
	})()
	this.Board = function(){
		this.chunkloaded = function(wl){
			return Trpg.board.container.get("Tiles").has(wl.toStr());
		}
		this.loadchunk = function(wl){
			if (this.chunkloaded(wl))
				return;
			var newchunk = new Trpg.Chunk(wl.wx,wl.wy,wl.dim).generate();
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++){
					var wl2 = newchunk.wl.copy().shift(i,j)
					if (Trpg.world.tilechanges[wl2.toStr()]){
						new Trpg.Tiles[Trpg.world.tilechanges[wl2.toStr()].type](wl2.copy());
					}
				}
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
			for (var i = -this.chunkrad; i <= this.chunkrad; i++)
				for (var j = -this.chunkrad; j <= this.chunkrad; j++){
					this.loadchunk(new Trpg.WorldLoc(wl.wx+i,wl.wy+j,0,0,wl.dim));
				}
				return;
			var q = this.container.get("Tiles").getq();
			for (var i = 0; i < q.length; i++)
				if (!q[i].loc.indist(Trpg.player.loc,this.viewsize))
					this.container.get("Tiles").remove(q[i]);
				return;
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
					return this.loaded[i];
		}
		this.init = function(){
			Trpg.bank = {contents:{items:[]}}
			var bui = Trpg.boardui;
			if (false && (true || window.mobile)){
				bui.add(new UI.Button(5,bui.h/2-100-5,100,100).sets({
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
							Trpg.board.container.camera.zoom(1/(1.5));
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
			if (false && window.mobile){
				Trpg.Home.Claim(bui.add(new UI.Button(bui.w-100-5,bui.h-100-5,100,100).sets({rl:1,
					onclick:function(){
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
				})));
			}
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
				g.font = "25px Arial";
				g.translate(0,this.container.h);
				while (x+g.measureText(txt).width > Trpg.board.container.w)
					x--;
				if (Trpg.board.textinp.hasfocus())
					Drw.drawCText(g,txt,x,-5,{alignx:"left",aligny:"bottom",boxcolor:"white",textcolor:"black"});
				g.translate(0,-27);
				Trpg.Console.render(g);
			}});
			bui.add({
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
			this.container.add(new UI.Follow(this.container.camera,Trpg.player,function(t){return t.loc.xx()},function(t){return t.loc.yy()},32),"camfollow");
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
	function xferfuncs(me, obj){
		for (var p in obj)
			if (obj.hasOwnProperty(p) && (typeof obj[p] == "function"))
				me[p] = obj[p];
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
			if (!exists(action))	action = this.getactions()[0];
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
			var acts = this.getactions();
			return;
			for (var i = 0; i < acts.length; i++)
				RC.get("actionslist").push({text:acts[i],owner:this,
					func:(function(a){return function(){that.doaction(a);}})(acts[i])
				});
			RC.open();
			return false;
		}
		function getactioncolor(a){
			return "clear";
		}
		function getBtns(){
			return this.getactions().slice().map((a)=>new UI.Button(0,0,200,50).sets({
				text:capitalize(a),color:this.getactioncolor(a),
				onclick:function(){
					this.doaction(a);
					Trpg.RC.close();
					return true;
				}.bind(this)
			}))
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
			this.getactioncolor = getactioncolor;
			this.getBtns = getBtns;
			this.getactions = getactions;
			this.leftdown = leftdown;
			this.rightdown = rightdown;
			this.fillmenu = fillmenu;
			return this;
		}
	})();
	function Astar(start, end, extras){
		function aastar(s, e, es){
			var targetrange = es && es.targetrange || 0;
			var range = es && es.range || 15;
			var checkfunc = es && es.checkfunc || function(wl){
				return Trpg.BoardC.get("Tiles."+wl.toStr()).traits.walkable;
			}
			if (!Trpg.board.getTile(e).traits.walkable && targetrange == 0)
				targetrange = 1;
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
						Trpg.board.loadchunk(wl.copy());
					if (wl.indist(s,range) && checkfunc(wl)){
						if (dirs[i].x*dirs[i].y !== 0){ // if diag
							if (checkfunc(spot.wl.copy().shift(dirs[i].x,0)) ||
								checkfunc(spot.wl.copy().shift(0,dirs[i].y)))
								if (cstrs.indexOf(wl.toStr()) == -1)
									adjs.push(new Spot(wl,spot,11,manH(wl,e),dirs[i]));
						} else if (cstrs.indexOf(wl.toStr()) == -1)
							adjs.push(new Spot(wl,spot,10,manH(wl,e),dirs[i]));
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
				var p = makepath(spot.parent);
				p.push({dir:spot.dir,wlstr:spot.wl.toStr()});
				return p;
			}
			var openlist = [new Spot(s,-1,0,manH(s,e))];
			var closedlist = [];
			var ostrs = [s.toStr()];
			var cstrs = [];
			this.step = function(){
				if (openlist.length > 0){
					var lowf = picklowf(openlist);
					openlist.splice(openlist.indexOf(lowf),1);
					ostrs.splice(ostrs.indexOf(lowf.wl.toStr()),1);
					closedlist.push(lowf);
					cstrs.push(lowf.wl.toStr());
					if (lowf.wl.indist(e,targetrange))
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
					return false;
				} else return [];
			}
		}
		var forward = new aastar(start,end,extras);
		var backward = new aastar(end,start,extras);
		var f = false, b = false;
		while (!f && !b){
			f = forward.step();
			b = backward.step();
		}
		return f || b.reverse().forEach((p)=>p.dir = {x:p.dir.x*-1,y:p.dir.y*-1}) || [];
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
				//this.rl = 2;
				this.loc.onmove = function(wl){
					return (Trpg.board.getTile(wl).traits.walkable) || this.type == "Player" && this.hasprivilege("phase");
				}
				this.id = id || this.type+(+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + (Trpg.Entities.ids.length);
				Trpg.BoardC.add(this,"Entities."+this.id);
				Trpg.Entities.ids.push(this.id);
				this.original && Trpg.socket && Trpg.socket.emit("newentity",this.save());
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
				if (save.target == -1)
					return this.canceltarget();
				if (this.target == -1 || this.target.loc.inmdist(this.loc,.2))
					save.target && this.settarget({loc:new Trpg.WorldLoc().loadStr(save.target)});
			}
			function save(){
				return {target:(this.target && this.target !== -1 && this.target.loc.tomStr())||-1};
			}
			function ondelete(){
				//Trpg.socket && Trpg.socket.emit("removeentity",this.id);
			}
			function getname(){
				return this.type+(this.cb > 0?" (lvl "+this.cb+")":"");
			}
			function canceltarget(){
				this.target = -1;
				this.path = [];
				this.nexttile = this.loc.copy();
			}
			function movetotarget(d){
				if (this.path.length > 0 && this.nexttile.indist(this.loc,0)){
					var p = this.path.shift().dir;
					this.nexttile.shift(p.x,p.y);
					this.nexttile.mx = this.nexttile.my = 16;	
				}
				if (this.path.length == 0 && this.target.loc.indist(this.loc,0))
					this.nexttile = this.target.loc.copy();
				if (!this.nexttile.inmdist(this.loc,.1)){
					var a = Math.atan2(this.loc.mdy(this.nexttile)*32,this.loc.mdx(this.nexttile)*32);
					this.loc.move(Math.cos(a)*this.speed*d,Math.sin(a)*this.speed*d);
				} else if (this.path.length == 0)
					this.onreachtarget();
			}
			function settarget(targ, targdist, onreach){
				if (typeof targ.loc == "string") targ.loc = new Trpg.WorldLoc().loadStr(targ.loc);
				this.target = targ;
				var extras = {range:this.pathrange, targetrange:targdist};
				if (this.type == "Player" && this.hasprivilege("phase"))
					extras.checkfunc = function(){return true};
				this.path = Astar(this.loc,this.target.loc, extras);
				this.nexttile = this.loc.copy();
				this.onreachtarget = function(){
					onreach && onreach();
					this.target = -1;
				};
			}
			function setsaying(str,srcid){
				this.saying = str;
			}
			function say(str){
				this.saying = str;
				Trpg.Timers.add(new Utils.Timer(2).start().setAuto(true,function(){
					this.saying = "";
					Trpg.socket.emit("affectentityother",{func:"setsaying",id:this.id,args:["",this.id]});
				}.bind(this)).setKilloncomp(true));
				if (this.type == "Player" && this.original && Trpg.socket){
					Trpg.socket.emit("consoleadd",{m:str,u:this.getname()});
					Trpg.socket.emit("affectentityother",{func:"setsaying",id:this.id,args:[str,this.id]});
					//Trpg.socket && Trpg.socket.emit("affectentityother",{func:"say",id:this.id,args:[str]});
				}
			}
			function onreachtarget(){}
			function wander(){
				this.settarget({loc:this.spawn.copy().shift(
					Math.floor(Math.random()*this.range*2)-this.range,
					Math.floor(Math.random()*this.range*2)-this.range)
					.move((Math.random()-.5)*30,(Math.random()-.5)*30)});
			}
			function update(d){
				this.invisible = !this.loc.indist(Trpg.player.loc,Trpg.board.viewsize) ||
					(this.invis && (!(this.original || Trpg.player.hasprivilege("admin")) 
						|| (this.hasprivilege("owner") && !Trpg.player.hasprivilege("owner"))));
				this.x = this.loc.xx()-this.w/2;
				this.y = this.loc.yy()-this.h/2;
				if (this.type!=="Player"){
					if (this.target == -1 && this.original)// && Math.random()*5<d)
						this.wander();
				}
				if (this.target !== -1 && this.type == "Player" && this.hasprivilege("telewalk")){
					Trpg.socket && Trpg.socket.emit("affectentityother",{func:"doaction",args:["teleport",this.target.loc.tomStr()],id:this.id});
					this.doaction("teleport",this.target.loc);
				}
				else if (this.target !== -1)
					this.movetotarget(d);
				if (this.original)
					Trpg.Entsaves.add({s:this.save()});
			}
			function inrender(g){
				try {
					g.drawImage(Ast.i(this.img.toLowerCase()),-16,-16);
				} catch(e) {
					g.fillStyle = "black";
					Drw.drawCText(g,this.img,0,0);
				}
			}
			function render(g){
				if (this.hp <= 0 && this.attackable)
					return;
				g.save();
				g.translate(this.loc.xx(),this.loc.yy());
				if (this.invis && !(!(this.original || Trpg.player.hasprivilege("admin")) 
						|| (this.hasprivilege("owner") && !Trpg.player.hasprivilege("owner"))))
				//if (this.invis && (this.original || Trpg.player.hasprivilege("admin")))
					g.globalAlpha = .5;
				this.inrender(g);
				g.globalAlpha = 1;
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
					save:save,					load:load,					//ondelete:ondelete,
					getname:getname,
					canceltarget:canceltarget,
					movetotarget:movetotarget,
					settarget:settarget,
					onreachtarget:onreachtarget,
					wander:wander,
					setsaying:setsaying,
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
				return makeTemp({dmg:dmg,x:x,y:y,a:1,rl:1,
					update:function(d){
						this.y+=d*15;
						this.a-=d*.8;
					},
					render:function(g){
						g.translate(this.x,this.y);
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
			}
			function ondeath(){
				this.hidden = true;
				var id = this.id;
				if (this.original)
				Trpg.Timers.add(new Utils.Timer(this.respawndelay).start().setAuto(true, function(){
				Trpg.socket && Trpg.socket.emit("affectentity",{func:"respawn",args:[],id:id})
				}).setKilloncomp(true));
			}
			function dodamage(dmg,dmgid){
				if (this.dead)return;
				if (this.hp>0){
					if (this.dmgid == dmgid)return;// alert("already hit");
					this.dmgid = dmgid;
					//alert("hit");
					Trpg.BoardC.add(this.hitsplat(dmg,this.x+Math.random()*16+8,this.y+8),"Entities.");
					this.hp-=dmg;
				} else //return;
				if (this.hp <= 0){
					this.hp = 0;
					this.dead = true;
					Trpg.socket && Trpg.socket.emit("affectentity",{func:"ondeath",args:[],id:this.id})
				}
			}
			function calcdamage(source){
				var dmg = Math.round(source.maxhit*Math.random());
				//if (source.firsthit)
				var dmgid = source.id;//(Math.random()*100000).toString(16);
				Trpg.socket && Trpg.socket.emit("affectentity",{id:this.id,func:"dodamage",args:[dmg,dmgid]});
				//source.firsthit = false;
			}
			function save(){
				return {
					hp:this.hp,
					dmg:false,
					maxhp:this.maxhp,
				}
			}
			function load(save){
				if (save.maxhp)this.maxhp = save.maxhp;
				return;
				if (!(save.bhp && save.ahp))return;
				var dif = save.bhp-save.ahp;
				if (this.hp > save.ahp){
					Trpg.BoardC.add(this.hitsplat(dif,this.x+Math.random()*16+8,this.y+8));
					this.hp = save.ahp;
				}
			}
			function superinit(wl){
				this.spawn = this.loc.copy();
				this.dead = false;
				this.respawndelay = 5;
				this.actions.arrow = function(){
					var p = Trpg.player;
					var a = Math.atan2(this.loc.yy()-p.loc.yy(),this.loc.xx()-p.loc.xx())
					new Trpg.Entities.Arrow(Trpg.player.loc.copy(),false,true,a);
				}
				this.actions.attack = function(){
					Trpg.player.attack(this);
				}
				this.cb = 0;
				this.maxhp = this.hp = 0;
				this.actionslist = ["arrow","examine"];
				this.attackedby = [];
				this.attackdelay = new Utils.Timer(1).start(true);
				this.attrange = 1;
			}
			function getactions(){
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
			}
		})();
		function E(wl,id){
			xferfuncs(this,this.Entity);
			xferfuncs(this,this.Combatable);
			delete this.superinit;
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
				save.Entity && this.Entity.load.call(this,save.Entity);
				save.Combatable && this.Combatable.load.call(this,save.Combatable);
			}
			this.Clickable.superinit.call(this,wl.xx(),wl.yy(),32,32);
			this.Actionable.superinit.call(this);
			this.Entity.superinit.apply(this,arguments);
			this.Combatable.superinit.call(this);
		}
		this.Man = function(wl){
			E.apply(this,arguments);
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
					// },this,.7);
				}).bind(this));
			}
			this.actions.examine = function(){
				Trpg.Console.add("An average citizen walking around");
			}
		}
		this.Dummy = function(wl){
			E.apply(this,arguments);
			this.w+=16;
			this.h+=16;
			this.x = this.loc.xx()-this.w/2;
			this.y = this.loc.yy()-this.h/2;
			this.type = "Dummy";
			this.cb = 2;
			this.maxhp = this.hp = 7;
			this.update = function(){}
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
		this.Player = function(wl,username, player1, guest){
			this.original = player1;
			this.privileges = [];
			this.guest = guest;
			if (!Trpg.socket)
				this.privileges = ["owner","admin"];
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
			if (this.original)	this.leftdown = function(){return false}
			this.actions.examine = function(){
				Trpg.Console.add(this.gettitle());
			}
			this.equipment = {
				helm:-1,
				body:-1,
				legs:-1,
				kite:-1
			};
			this.inrender = function(g){
				try {
					g.drawImage(Ast.i(this.img.toLowerCase()),-16,-16);
				} catch(e) {
					g.fillStyle = "black";
					Drw.drawCText(g,this.img,0,0);
				}
				for (var p in this.equipment)
					if (p !== "sets" && this.equipment[p] !== -1)
						try {
							g.drawImage(Ast.i(this.equipment[p].equipimg.toLowerCase()),-16,-16);
						} catch (e){}
			}
			this.respawndelay = 1;
			this.addprivs = function(privs){
				var ps = this.privileges.slice();
				for (var i = 0; i < privs.length; i++)
					if (ps.indexOf(privs[i])==-1)
						ps.push(privs[i]);
				this.setprivs(ps);
			}
			this.removeprivs = function(privs){
				var ps = [];
				for (var i = 0; i < this.privileges.length; i++)
					if (privs.indexOf(this.privileges[i]) == -1)
						ps.push(this.privileges[i]);
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
						}
						Trpg.Console.add(str1,"yellow");
						Trpg.Console.add(str2,"yellow");
					}
					this.privileges = save.privileges;
					Trpg.Entsaves.add({s:this.save()});
			}
			this.hasprivilege = function(priv){
				return this.privileges.indexOf(priv) !== -1;
			}
			this.save = function(){
				return {
					img:this.img,
					username:this.username,
					privileges:this.privileges,
					loc:this.loc.tomStr(),
					guest:this.guest,
					invis:this.invis,
					equipment:{
						helm:this.equipment.helm==-1?-1:this.equipment.helm.type,
						body:this.equipment.body==-1?-1:this.equipment.body.type,
						legs:this.equipment.legs==-1?-1:this.equipment.legs.type,
						kite:this.equipment.kite==-1?-1:this.equipment.kite.type
					},
					//Entity:this.Entity.save.call(this),
					//invent:Trpg.invent.getsave(),
					//#mapmap:Trpg.Map.save(),
					//bank:Trpg.bank.contents,
					id:this.id,
					type:this.type
				};
			}
			this.load = function(save,force){
				if (this.original && !force)// ("im me");
					return;
				if (exists(save.invis)) this.invis = save.invis;
				if (save.equipment){
					for (var p in save.equipment)
						if (p !== "sets"){
							var e = save.equipment[p];
							this.equipment[p] = e==-1?-1:new Trpg.Items[e]()
						}
				}
				if (exists(save.guest))this.guest = save.guest;
				if (save.img)this.img = save.img;
				if (save.type && save.type !== this.type){
					Trpg.BoardC.add(new Trpg.Entities[save.type]
						(save.loc && this.loc.loadStr(save.loc) || this.loc, this.id),
						"Entities."+this.id);
				}
				if (save.privileges){
					this.setprivs(save.privileges);
				}
				this.invisible = 
					(this.invis && (!(this.original || Trpg.player.hasprivilege("admin")) 
						|| (this.hasprivilege("owner") && !Trpg.player.hasprivilege("owner"))));
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
		//["Man","Cow","Guard","Player"].forEach((p)=>{	});
		this.Arrow = function(wl,id,orig,ang,targs){
			this.x = wl.xx();
			this.y = wl.yy();
			this.w = this.h = 16;
			//this.firsthit = true;
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
			}
			this.inited = false;
			this.save = function(){
				return {
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
						//this.removeme();
						Trpg.socket && Trpg.socket.emit("removeentity",this.id);
						return true;
					}
			}).bind(this);
			this.inited = true;
			this.x = this.loc.xx();
			this.y = this.loc.yy();
			this.update = function(d){
				this.los.step(d*350);
				this.invisible = !this.loc.indist(Trpg.player.loc,Trpg.board.viewsize);
				this.x = this.loc.xx();
				this.y = this.loc.yy();
				if (this.original)
					Trpg.Entsaves.add({s:this.save()});
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
		}
	})(this.Actionable);
	this.Tiles = new (function(act){
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
					Trpg.socket && Trpg.socket.emit("affectentityother",{
						func:"settarget",
						args:[{loc:this.loc.tomStr()}],
						id:Trpg.player.id
					});
				}
				this.actions.arrow = function(){
					var p = Trpg.player;
					var a = Math.atan2(this.loc.yy()-p.loc.yy(),this.loc.xx()-p.loc.xx())
					new Trpg.Entities.Arrow(Trpg.player.loc.copy(),false,true,a);
				}
				if (Trpg.BoardC.get("Tiles."+this.loc.toStr())!==-1)
					Trpg.BoardC.get("Tiles").remove(this.loc.toStr());
				
				Trpg.BoardC.add(this,"Tiles."+this.loc.toStr());
				!asgen && Trpg.socket && Trpg.socket.emit("tilechange",{type:this.type,loc:this.loc.toStr()});
				if (!asgen)Trpg.world.tilechanges[this.loc.toStr()] = this.getState();
				this.invisible = !this.loc.indist(Trpg.player.loc,Trpg.board.viewsize);
			}
			function leftdown(dx,dy){
				this.loc.mx = dx;
				this.loc.my = dy;
				this.doaction();
			}
			function update(d){
				this.x = this.loc.x()*32;
				this.y = this.loc.y()*32;
				if (!this.loc.inchunkdist(Trpg.player.loc,1))
					this.removeme();
				this.invisible = !this.loc.indist(Trpg.player.loc,Trpg.board.viewsize);
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
			T.call(this,wl,"Grass",["walk","tree"],asgen);
			this.ground = false;
			this.actions.tree = function(){
				new Trpg.Tiles.Tree(this.loc.copy());
			}
		}
		this.Hole = function(wl,asgen){
			T.call(this,wl,"Hole",["walk","fill"],asgen);
		}
		this.Tree = function(wl,asgen){
			T.call(this,wl,"Tree",["chop","search"],asgen);
			this.traits.walkable = false;
			this.actions.chop = function(){
				new Trpg.Tiles.Stump(this.loc.copy());
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
			this.traits.walkable = false;
			this.inrender = function(g){
				var adjs = 
				(Trpg.board.getTile(this.loc.copy().shift(0,-1)).type == "CastleWall" ? "1" : "0")+
				(Trpg.board.getTile(this.loc.copy().shift(1,0)).type == "CastleWall" ? "1" : "0")+
				(Trpg.board.getTile(this.loc.copy().shift(0,1)).type == "CastleWall" ? "1" : "0")+
				(Trpg.board.getTile(this.loc.copy().shift(-1,0)).type == "CastleWall" ? "1" : "0");
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
	this.Items = new (function(act){
		var Item = new (function(){
			function superinit(){
				this.stackable = false;
				this.amt = 1;
				this.alchvalue = -1;
				this.actionslist = ["use","drop","examine"];
				this.getactions = function(){
					var acts = this.actionslist.slice();
					if (K.Keys.shift.down && acts.indexOf("drop")!==-1){
						acts.splice(acts.indexOf("drop"),1)
						acts.unshift("drop");
					}
					return acts;
				}
				this.getinventacts = function(){
					return ["use","drop","examine"];
				}
				this.getgroundacts = function(){
					return ["pickup"];
				}
				this.actions.drop = function(wl){
					this.loc = wl || Trpg.player.loc;
					this.loc = this.loc.copy();
					if (this.container && this.container.systemname == "Invent")
						Trpg.Invent.removeitem(this);
					Trpg.BoardC.add(this,"Items.");
					this.actionslist = this.getgroundacts();
					this.loc.mx = this.loc.my = 16;
					this.x = this.loc.xx()+randr(-32,0);
					this.y = this.loc.yy()+randr(-32,0);
					makeTemp(this,10,function(){
						return this.container.systemname == "Items";
					});
				}
				this.actions.pickup = function(){
					Trpg.player.settarget(this,0,function(){
						console.log(this);
						Trpg.BoardC.get("Items").remove(this);
						Trpg.Invent.additem(this);
						this.actionslist = this.getinventacts();
						delete this.loc;
					}.bind(this));
					
				}
				this.actions.examine = function(){
					Trpg.Console.add(this.type+(this.stackable?" x"+this.amt:""));
				}
			}
			function inrender(g){
				try {
					g.drawImage(Ast.i(this.img.toLowerCase()),0,0);
				} catch(e) {
					g.fillStyle = "black";
					Drw.drawCText(g,this.img,16,16);
				}
			}
			function render(g){
				g.translate(this.x,this.y);
				g.save();
				if (this.container.systemname == "Items"){
					g.translate(this.w/4,this.h/4);
					g.scale(.5,.5);
				}
				this.inrender(g);
				g.restore();
				g.strokeStyle = "yellow";
				if (this.isover && Trpg.showover)
					g.strokeRect(.5,.5,this.w-1,this.h-1);
				g.font = "8px Arial";
				g.fillStyle = "yellow";
				var text = amt2text(this.amt);
				if (text.indexOf("b")!==-1)	g.fillStyle = "cyan";
				if (text.indexOf("m")!==-1)	g.fillStyle = "#41DB00";
				if (text.indexOf("k")!==-1)	g.fillStyle = "white";
				if (text.length > 5)text = "Nice hax";
				if (this.stackable && this.container.systemname == "Invent")
					g.fillText(text,2,7);
			}
			return function(){
				this.Item = {
					superinit:superinit,
					inrender:inrender,
					render:render,
				}
				return this;
			}
		})();
		var Equipable = new (function(){
			function superinit(){
				this.slot = ["Helm","Body","Legs","Kite"].filter((e)=>this.type.indexOf(e)!==-1)[0];
				if (!this.slot)	return;
				this.slot = this.slot.toLowerCase();
				this.equipimg = this.type+"Equip";
				this.actionslist.unshift("equip");
				this.getinventacts = function(){
					var acts = ["use","drop","examine"];
					if (Trpg.player.equipment[this.slot]==this)
						acts.unshift("unequip");
					else acts.unshift("equip");
					return acts;
				}
				this.actions.equip = function(){
					if (Trpg.player.equipment[this.slot]!==-1)
						Trpg.player.equipment[this.slot].doaction("unequip");
					Trpg.player.equipment[this.slot] = this;
					this.actionslist.shift();
					this.actionslist.unshift("unequip");
				}
				this.actions.unequip = function(){
					if (Trpg.player.equipment[this.slot]==this)
						Trpg.player.equipment[this.slot] = -1;
					this.actionslist.shift();
					this.actionslist.unshift("equip");
				}
			}
			function inrender(g){
				this.Item.inrender.call(this,g);
				g.strokeStyle = "white";
				if (Trpg.player.equipment[this.slot] == this)
					g.strokeRect(.5,.5,this.w-1,this.h-1);
			}
			return function(){
				this.Equipable = {
					superinit:superinit,
					inrender:inrender
				}
				return this;
			}
		})();
		function I(x,y){
			xferfuncs(this,this.Item);
			xferfuncs(this,this.Equipable);
			this.Clickable.superinit.call(this,x,y,32,32);
			this.Actionable.superinit.call(this);
			this.Item.superinit.call(this);
			this.Equipable.superinit.call(this);
			this.img = this.type;
		}
		this.Coins = function(amt){
			I.call(this);
			this.stackable = true;
			this.amt = amt || 1;
		}
		
		
		
		
		
		
		this.Bones = function(){		I.call(this);	}
		this.Log = function(){			I.call(this);	}
		this.Hammer = function(){		I.call(this);	}
		this.Knife = function(){		I.call(this);	}
		this.BronzeBar = function(){	I.call(this);	}
		this.IronBar = function(){		I.call(this);	}
		this.SteelBar = function(){		I.call(this);	}
		this.MithrilBar = function(){	I.call(this);	}
		this.AdamantBar = function(){	I.call(this);	}
		this.RuneBar = function(){		I.call(this);	}
		this.EterniumBar = function(){	I.call(this);	}
		this.BronzeDagger = function(){	I.call(this);	}
		this.IronDagger = function(){	I.call(this);	}
		this.SteelDagger = function(){	I.call(this);	}
		this.MithrilDagger = function(){I.call(this);	}
		this.AdamantDagger = function(){I.call(this);	}
		this.RuneDagger = function(){	I.call(this);	}
		this.EterniumDagger =function(){I.call(this);	}
		this.BronzeHelm = function(){	I.call(this);	}
		this.BronzeBody = function(){	I.call(this);	}
		this.BronzeLegs = function(){	I.call(this);	}
		this.BronzeKite = function(){	I.call(this);	}
		this.IronHelm = function(){		I.call(this);	}
		this.IronBody = function(){		I.call(this);	}
		this.IronLegs = function(){		I.call(this);	}
		this.IronKite = function(){		I.call(this);	}
		this.SteelHelm = function(){	I.call(this);	}
		this.SteelBody = function(){	I.call(this);	}
		this.SteelLegs = function(){	I.call(this);	}
		this.SteelKite = function(){	I.call(this);	}
		this.MithrilHelm = function(){	I.call(this);	}
		this.MithrilBody = function(){	I.call(this);	}
		this.MithrilLegs = function(){	I.call(this);	}
		this.MithrilKite = function(){	I.call(this);	}
		this.AdamantHelm = function(){	I.call(this);	}
		this.AdamantBody = function(){	I.call(this);	}
		this.AdamantLegs = function(){	I.call(this);	}
		this.AdamantKite = function(){	I.call(this);	}
		this.RuneHelm = function(){		I.call(this);	}
		this.RuneBody = function(){		I.call(this);	}
		this.RuneLegs = function(){		I.call(this);	}
		this.RuneKite = function(){		I.call(this);	}
		this.EterniumHelm = function(){	I.call(this);	}
		this.EterniumBody = function(){	I.call(this);	}
		this.EterniumLegs = function(){	I.call(this);	}
		this.EterniumKite = function(){	I.call(this);	}
		this.DragonHelm = function(){	I.call(this);	}
		this.DragonBody = function(){	I.call(this);	}
		this.DragonLegs = function(){	I.call(this);	}
		this.DragonKite = function(){	I.call(this);	}
		
		
		
		
		
		
		
		var types = [];
		for (var p in this)
			if (p !== "sets"){
				var pro = this[p].prototype;
				UI.Clickable.call(pro);
				act.call(pro);
				Item.call(pro);
				Equipable.call(pro);
				pro.type = p;
				types.push(p);
			}
		this.types = types;
		return;
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
						break;
					case "drop":
						Trpg.invent.dropitem(this);
						break;
				}
			}
			this.fillmenu = function(menu){
				var that = this;
				if (Trpg.invent.using !== -1){
					menu.additem(function(){
						Trpg.invent.using.useon(that);
						return "close,empty";
					},Trpg.invent.using.type+" -> "+that.type);
					return;
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
								on.doaction("fuel");
								Trpg.invent.removeitem(that);
							break;
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
				return this;
			},
			Ore:function(type,alch){
				this.type = type+"Ore";
				this.alchvalue = alch;
				return this;
			},
			TinOre:function(){return items.Ore.call(this,"Tin",2)},
			CopperOre:function(){return items.Ore.call(this,"Copper",2)},
			CoalOre:function(){return items.Ore.call(this,"Coal",20)},
			IronOre:function(){return items.Ore.call(this,"Iron",10)},
			MithrilOre:function(){return items.Ore.call(this,"Mithril",120)},
			AdamantOre:function(){return items.Ore.call(this,"Adamant",250)},
			RuneOre:function(){return items.Ore.call(this,"Rune",2000)},
			EterniumOre:function(){return items.Ore.call(this,"Eternium",9000)},
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
						var reqs = metals[that.type];
						for (var i = 0; i < reqs.length; i++)
							Trpg.invent.removeitem(reqs[i].t,reqs[i].a);
						if (that.type !== "IronBar" || Math.random()>.5)
						Trpg.invent.additem(new Trpg.Item(that.type));
						if (!that.cansmelt())	getaction().setKilloncomp(true);
					},furnace,1.3,true);
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
					if (on.type !== "Log")return;
					var menu = new Trpg.Menu();
					menu.additem(function(){
						if (Trpg.invent.hasitem("Log",5)){
							Trpg.invent.removeitem("Log",5);
							Trpg.invent.additem(new Trpg.Item("Ladder"));
						}
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
					return this;
				}
				this.fill = function(wl){
					if (this.filled.indexOf(wl.toStr()) !== -1)	return;
					this.filled.push(wl.toStr());
					if (this.filled.length >= this.contchunks.length) Trpg.Structures.structs[this.cwl.toStr()]
						.splice(Trpg.Structures.structs[this.cwl.toStr()].indexOf(this),1);
					var dx = this.tlc.dx(wl);
					var dy = this.tlc.dy(wl);
					var chunk = Trpg.board.getChunk(wl);
						var f = wl.dim;
						if (!exists(this.layout[f])) return;
						for (var j = 0; j < 8; j++)
							for (var i = 0; i < 8; i++){
								var t = this.layout[f][j+dy][i+dx];
								if (t !== "_"){
										var twl = wl.copy().shift(i,j,f)
										var tile = this.acrs[t](twl);
										if (tile)
										chunk.setTile(tile,twl);
								}
							}
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
					}
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
					}
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
			this.centers.queuedstr.splice(this.centers.queuedstr.indexOf(wl.toStr()),1);
			Math.seedrandom(Trpg.world.wseed+wl.toStr());
			this.structs[wl.toStr()] = [];
			if (wl.dist(new Trpg.WorldLoc())==0)
				this.structs[wl.toStr()].push(Structure("Brumlidge",wl,new Trpg.WorldLoc(-2,-1)));
			else this.structs[wl.toStr()].push(Structure("Brumlidge",wl));
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
					this.triggercenter(this.centers.queued[i]);
				}
			for (var i = 0; i < this.centers.loaded.length; i++)
				if (wl.indist(this.centers.loaded[i],8*(sectorsize-1)/2,true))
					return this.centers.loaded[i];
			return -1;
		}
		this.checkchunk = function(wl){
			var center = this.getcenter(wl);
			if (center == -1 || !exists(this.structs[center.toStr()]))	return;
			for (var i = 0; i < this.structs[center.toStr()].length; i++)
				if (this.structs[center.toStr()][i].inchunk(wl.copy().tochunk().toStr()))
					this.structs[center.toStr()][i].fill(wl.copy());
			return false;
		}
	})();
	this.Chunk = function(x,y,d){
		this.wl = new Trpg.WorldLoc(x,y,0,0,d);
		this.generate = function(){
			Math.seedrandom(Trpg.world.wseed+this.wl.toStr());
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					if (Math.random()<.1)
						new Trpg.Tiles.Tree(this.wl.copy().shift(j,i),true);
					else 
						new Trpg.Tiles.Grass(this.wl.copy().shift(j,i),true);
			return this;
		}
	}
}