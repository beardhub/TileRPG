(function(){var s = document.createElement("script");s.setAttribute("src","template.js");document.head.appendChild(s);})()
function start(){
	Trpg.Populate(U);
}
	/*U.empty();
	U.bcolor = "black";
	U.color = "grey";
	U.w = 1200;
	U.h = 800;
	U.container.stretchfit(U);
	U.camera.reset();
	//U.camera.centerZero();
	//U.add(makeShortcut(new UI.TBox(U.x,U.y,U.w,U.h),"Tabs",true));
	
	U.newtab("TitleMenu");
	U.newtab("Gameplay");
	makeShortcut(U.get("Gameplay"),"Gameplay",true);
	var instrs = new UI.DBox();
	instrs.add(new (function(){
		this.render = function(g){
			g.font = "35px Arial";
			g.fillStyle = "white";
			Drw.drawBoxText(g,"Right click on a tile to open list of available actions.\n \n "+
			"Left clicking on a tile will default\n to the first action.\n \n "+
			"Clicking on an action in progress will cancel that action.\n \n "+
			"Use W A S D to move.\n \n "+
			"",600,150,600);
		}
	})());
	instrs.add(new UI.Button(550,450,100,50).sets({text:"Back",color:"yellow",onclick:function(){U.prevtab()}}));
	//instrs.add(new Utils.KeyListener("down","Escape",function(){console.log("F$RG%H");}));
	U.newtab("Instructions",instrs);
	
	Gameplay.add(makeShortcut(new UI.DBox(0,0,800,800),"Board",true),"Board");
	Gameplay.add(makeShortcut(new UI.DBox(800,0,400,800),"Hud",true),"Hud");
	Hud.add(Hud.invent = new UI.DBox(0,300,400,500));
	Hud.invent.color = "grey";
	Hud.color = Hud.bcolor = Board.bcolor = "black";
	U.add(new Utils.KeyListener("down","Escape",function(){U.prevtab()}));
	U.add(new Utils.KeyListener("down","l",function(){Trpg.invent.additem(new Trpg.Item("Log"))}));
	Board.add(new Utils.KeyListener("down","p",function(){U.settab("Instructions");}));
	U.settab("TitleMenu");
	U.add(new (function(){
		this.render = function(g){
			g.font = "100px Arial";
			g.fillStyle = "white";
			Drw.drawCText(g, "TileRPG", 600,200);
		}
	})(),"TitleMenu.");
	U.add(new UI.Button(500,300,200,50).sets({color:"green",text:"New Game",key:"n",onclick:function(){StartGame(true);}}),"TitleMenu.");
	U.add(new UI.Button(500,400,200,50).sets({color:"blue",text:"Load Game",key:"l",onclick:function(){StartGame(false);}}),"TitleMenu.");
	U.add(new UI.Button(500,500,200,50).sets({color:"red",text:"Instructions",key:"i",onclick:function(){U.settab("Instructions")}}),"TitleMenu.");
//	U.add(new UI.Button(-100,200,200,50).sets({color:"green",text:"New Game"}));
	*
	/*
	this.Default = function(){
		this.x = this.y = 0;
		this.getcoords = function(){
			return {x:this.x,y:this.y}
		}
		return this;
	}
	function Special(x,y,z){
		//console.log(this);
		this.x = x;
		this.y = y;
		this.z = z;
		this.getcoords2 = function(){
			var coords = this.getcoords();
			coords.z = this.z;
			return coords;
		}
		return this; // needed
	}
	
	function Tile(type){
		function Grass(){ //Default
			
		}
		function Tree(){
			this.stage = 4;
		}
		function Boulder(){
			
		}
		function Portal(){
			
		}
		console.log(type);
		//Function("console.log('"+type+"');")();
		//console.log([type]);
		return new Tree();
	}
	
	function stringToFunction(str){
		var params = str.substring(str.indexOf("(")+1,str.indexOf(")")).replace(/ /g,"").split(",");
		params.push(str.substring(str.indexOf("{")+1,str.lastIndexOf("}")));
		return Function.apply({},params);
	}
	var Tile2 = stringToFunction(Tile.toString());
	console.log(Tile);
	console.log(Tile2);
	
	//console.log(Tile.toString());//"a, b,  c ,d".replace(/ /g,""))
	//function TestThing(a,b)
	
	//new Tile("Grass");
	//new Tile("Tree");
	/*
	window.getFunctionFromString = function(string){
		var scope = window;
		var scopeSplit = string.split('.');
		for (i = 0; i < scopeSplit.length - 1; i++)
		{
			scope = scope[scopeSplit[i]];
			console.log(scope);
			if (scope == undefined) return;
		}

		return scope[scopeSplit[scopeSplit.length - 1]];
	}*
	var def = new Default();
	var spec = Special.call(new Default(),1,2,3);
	//var spec2 = (JSON.parse(JSON.stringify({con:spec.constructor.toString()})));//(4,5,6);
	console.log(def);
	console.log(spec);
	//var name = "start.Default";//+spec2.con.substring("function ".length,spec2.con.indexOf("("));
	//var func = getFunctionFromString()
	//(spec2.con.substring("function ".length,spec2.con.indexOf("(")));
	//console.log(name);//.getcoords2());
	//console.log(window["start"]);
	//console.log(getFunctionFromString("start"));
	/*
	/*U.container.add(new Utils.Listener(function(){
		return K.Keys.esc.down;
	},function(){
		U.empty();
		StartGame();
		//return true;
	}));*
	var p;
	U.add(p = new Utils.KeyListener("down","P",function(){
		U.empty();
		U.add(p)
		StartGame();
	}));
	U.add(new Utils.MouseListener("move",function(e,m){
		return e.x < 200;
	},function(){
		console.log("under 200");
	}));
	//Hud.color = "grey";
	//Hud.bcolor = "black";
	/*U.add(new UI.Button(10,10,50,50));
	U.add(new (function(){
		this.keydown = function(k){
			if (k.name=="esc"){
				if (slotTaken(galaxy.slot))
					deleteSlot(galaxy.slot);
				start();
			}
		}
	})());
	
	portal (link / dimensional)
	storage box
	underground
	buried chest
	camp fire
	search tile
	world gen / structures (1 chunk?)
	other dimensions
	home dimension
	ladders (add z direction)
	"seeds" when digging up tree stump
	larger than 1 tile objects
	more tile options
	
	
	
	
	
	
	
	*
	//StartGame();
}
function SaveGame(){
	if (Trpg.world.getChanges()!="none")
		localStorage.setItem("TRPGSaveSlot"/*+this.slot*,JSON.stringify(Trpg.world.getChanges()));
	return null;
}
function StartGame(newgame){
	//U.camera.reset();
	//0.4258795506243769
	//Math.seedrandom("test");
	//console.log(Math.random());
	//this.slot = 1;
	//U.add(makeShortcut(new UI.DBox(0,0,800,800),"Board",true));
	//Board.bcolor = "black";
	//Board.alphamod = .6;
	
	
	
	
	new Trpg.World("zack is cool");
	
	//U.newtab("Gameplay",Trpg.gamebox);
	
	Board.add(Trpg.board);
	Hud.invent.add(Trpg.invent);
	//Board.add(new UI.Button(0,0,100,100).sets({text:"back",onclick:function(){U.settab("TitleMenu")}}));
	if (newgame)
		localStorage.removeItem("TRPGSaveSlot");//+this.slot);
	if (localStorage.getItem("TRPGSaveSlot"/*+this.slot*)!=null)
		Trpg.world.loadChanges(JSON.parse(localStorage.getItem("TRPGSaveSlot"/*+this.slot*)));
	
	window.onbeforeunload = SaveGame;
	U.settab("Gameplay");
	//U.add(makeShortcut(new RClickMenu(),"rcm",true));
	//U.add(makeShortcut(new Hudbox(),"Hud",true));
	//Hud.add(Trpg.hud);
}
/*
function RClickMenu(){
	this.init = function(){
		this.menu = new UI.DBox(0,0,100,100);
		//this.menu.alphamod = .5;
		this.menu.cropped = true;
		var b = Trpg.board.player;
		b.settool("chop",1,1);
		b.settool("dig",0,1);
		b.settool("plant",1,1);
		b.settool("burn",0,1);
		var that = this;
		var toolnum = 0;
		for(var p in b.tools){
			var btn = new UI.Button(toolnum%2*50,Math.floor(toolnum/2)*50,50,50);
			btn.t = b.tools[p];
			//btn.key = "n"+"1234567890".charAt(toolnum);
			btn.tname = btn.t.action.charAt(0).toUpperCase()+btn.t.action.substring(1);
			btn.inrender = function(g){
				g.fillStyle = "darkgrey";
				if (b.tool == this.t.action)
					g.fillStyle = "black";
				g.font = "15px Arial";
				Drw.drawCText(g,this.tname,this.w/2,this.h/2);
				//if (this.key!="")	
				//	Drw.drawCText(g,this.key.substring(1),15,15);
			}
			btn.onclick = function(){
				if (b.tool == this.t.action)
					 b.tool = "none";
				else b.tool = this.t.action;
				that.menu.invisible = true;
				/*this.toggled = !this.toggled;
				if (this.toggled){
					b.tool = p;
					dig.toggled = false;
					plant.toggled = false;
					burn.toggled = false;
				} else b.tool = "none";*
			}
			this.menu.add(btn,btn.t.action);
			toolnum++;
		}
		this.menu.invisible = true;
		this.container.add(this.menu);
	}
	this.mousedown = function(e,m){
		if (e.button == 2){
			this.menu.x = m.relx(this.menu.container)/this.menu.container.cumZoom()-50;
			this.menu.y = m.rely(this.menu.container)/this.menu.container.cumZoom()-50;
			this.menu.invisible = false;
		} else if (e.button == 0){
			//if (this.menu)
			this.menu.invisible = true;
		}
		//return true;
	}
	this.mousemove = function(e,m){
		if (this.menu.mouseonbox(m) && !this.menu.invisible)
			return true;
		else this.menu.invisible = true;
	}
}*
function Hudbox(){
	var box = new UI.DBox(800,0,400,800);
	//box.bcolor = "black";
	/*var chop = new UI.Button(10,10,80,80);
	var dig = new UI.Button(110,10,80,80);
	var plant = new UI.Button(210,10,80,80);
	var burn = new UI.Button(310,10,80,80);
	box.add(chop,"chop");
	box.add(dig,"dig");
	box.add(plant,"plant");
	box.add(burn,"burn");*
	var b = Trpg.board.player;
	b.settool("chop",1,1);
	b.settool("dig",0,1);
	b.settool("plant",1,1);
	b.settool("burn",0,1);
	var toolnum = 0;
	for(var p in b.tools){
		var btn = new UI.Button(10+toolnum%4*100,10+Math.floor(toolnum/4)*100,80,80);
		btn.t = b.tools[p];
		btn.key = "n"+"1234567890".charAt(toolnum);
		btn.tname = btn.t.action.charAt(0).toUpperCase()+btn.t.action.substring(1);
		btn.inrender = function(g){
			g.fillStyle = "darkgrey";
			if (b.tool == this.t.action)
				g.fillStyle = "black";
			g.font = "20px Arial";
			Drw.drawCText(g,this.tname,this.w/2,this.h/2);
			if (this.key!="")	
				Drw.drawCText(g,this.key.substring(1),15,15);
		}
		btn.onclick = function(){
			if (b.tool == this.t.action)
				 b.tool = "none";
			else b.tool = this.t.action;
			/*this.toggled = !this.toggled;
			if (this.toggled){
				b.tool = p;
				dig.toggled = false;
				plant.toggled = false;
				burn.toggled = false;
			} else b.tool = "none";*
		}
		box.add(btn,btn.t.action);
		toolnum++;
	}
	/*
	chop.inrender = function(g){
		g.fillStyle = "darkgrey";
		if (this.toggled)
			g.fillStyle = "black";
		g.font = "20px Arial";
		Drw.drawCText(g,"Chop",this.w/2,this.h/2);
	}
	dig.inrender = function(g){
		g.fillStyle = "darkgrey";
		if (this.toggled)
			g.fillStyle = "black";
		g.font = "20px Arial";
		Drw.drawCText(g,"Dig",this.w/2,this.h/2);
	}
	plant.inrender = function(g){
		g.fillStyle = "darkgrey";
		if (this.toggled)
			g.fillStyle = "black";
		g.font = "20px Arial";
		Drw.drawCText(g,"Plant",this.w/2,this.h/2);
	}
	burn.inrender = function(g){
		g.fillStyle = "darkgrey";
		if (this.toggled)
			g.fillStyle = "black";
		g.font = "20px Arial";
		Drw.drawCText(g,"Burn",this.w/2,this.h/2);
	}
	chop.onclick = function(){
		this.toggled = !this.toggled;
		if (this.toggled){
			b.tool = "chop";
			dig.toggled = false;
			plant.toggled = false;
			burn.toggled = false;
		} else b.tool = "none";
	}
	dig.onclick = function(){
		this.toggled = !this.toggled;
		if (this.toggled){
			b.tool = "dig";
			chop.toggled = false;
			plant.toggled = false;
			burn.toggled = false;
		} else b.tool = "none";
	}
	plant.onclick = function(){
		this.toggled = !this.toggled;
		if (this.toggled){
			b.tool = "plant";
			dig.toggled = false;
			chop.toggled = false;
			burn.toggled = false;
		} else b.tool = "none";
	}
	burn.onclick = function(){
		this.toggled = !this.toggled;
		if (this.toggled){
			b.tool = "burn";
			dig.toggled = false;
			plant.toggled = false;
			chop.toggled = false;
		} else b.tool = "none";
	}*
	return box;
}*/