addScripts("Frameworks/",[
"Main.js",
"Keys.js",
"UI.js",
"Assets.js",
"Drawing.js",
"Mouse.js",
"Utils.js",
//"Physics.js"
]);
window.onload=init;
function addScripts(path,srcs){for(var p in srcs){var script=document.createElement("script");script.setAttribute("src",path+srcs[p]);document.head.appendChild(script);}}
function init(){
	registerFrameworks([
	{f:MainFramework,n:"M"},
	{f:KeysFramework,n:"K"},
	{f:UIFramework,n:"UI"},
	{f:UtilsFramework,n:"Utils"},
	// {f:PhysicsFramework,n:"Physics"},
	{f:AssetsFramework,n:"Ast"},
	{f:DrawingFramework,n:"Drw"},
	{f:MouseFramework,n:"Ms"},
	{f:TileRpgFramework,n:"Trpg"}
	]);
	/*if (true || window.mobile){
		var inp = document.createElement("input");
		inp.setAttribute("text");
		inp.setAttribute("z-index:101");
		document.head.appendChild(inp);
	}*/
//<input type="text" style="z-index:101; position:absolute; top:10px; left:10px;"/>
	assetsbit();
	window.scrollTo(0, 1);
	document.body.style.margin="0px";
	M.createCanvas(window.innerWidth,window.innerHeight);
	var smaller=M.canvas.width,larger=M.canvas.height;
	if(smaller > M.canvas.height){smaller = M.canvas.height;larger = M.canvas.width;}
	var UU=new UI.DBox(0,0,M.canvas.width,M.canvas.height);
	//UU.camera.centerZero();
	//UU.camera.zoomto(smaller/1000);
	//UU.add({rl:1,render:function(g){g.fillStyle = "yello";g.fillRect(this.container.camera.x,this.container.camera.y,10,10)}})
	//UU.add({rl:1,render:function(g){g.fillStyle = "yello";g.fillRect(0,0,10,10)}})
	// main dbox
	makeShortcut(new UI.DBox(00,00,1000,1000),"U");
	U.color="black";
	//U.camera.centerZero();
	UU.add(U);
	U.hidden = true;
	/*window.onresize = function(){
		M.canvas.width = UU.w = window.innerWidth;
		M.canvas.height = UU.h = window.innerHeight;
		U.container.stretchfit(U);
	}*/
	var lasttime=Date.now()/1000;
	var adt = 0;
	M.setLoop(function(){
		M.canvas.width = UU.w = window.innerWidth;
		M.canvas.height = UU.h = window.innerHeight;
		U.container.stretchfit(U);
		var before=Date.now()/1000;
		//var before=window.performance.now()/1000;
		var dt=before-lasttime;
		lasttime=before;
		adt+=dt;
		var t = 1/25;
		//if (adt < t)	return;
		while (adt >= t){
			if (adt>.25){
				UU.update(.25);
				adt = 0;
				//adt-=5;
				//UU.update(5);
			}
			adt-=t;
			UU.update(t);
			

		}
		var g=M.canvas.getContext("2d");
		g.mozImageSmoothingEnabled = false;
		g.webkitImageSmoothingEnabled = false;
		g.msImageSmoothingEnabled = false;
		g.imageSmoothingEnabled = false;
		g.clearRect(0,0,M.canvas.width,M.canvas.height);
		UU.render(g);
		if (Trpg.debugger.showmouse){
			g.fillStyle = "white";
			g.fillRect(Ms.x()-5,Ms.y()-5,10,10);
		}
		//UU.update(dt);
		
	});
	Ms.setcanvas(M.canvas);
	Ms.setupListeners({down:UU.mousedown.bind(UU),up:UU.mouseup.bind(UU),move:UU.mousemove.bind(UU)/*up:function(m){U.mouseup(m);},moved:function(){},rclick:function(m){U.mouserclick(m);}*/});
	var hub=new K.KeyHub();
	hub.down=U.keydown.bind(U);
	hub.up=U.keyup.bind(U);
	K.setupListeners(hub,document.body);
	M.startLoop();
}
addScripts("Libraries/",["seedrandom.js"]);
addScripts("",["TileRpg.js"]);
function assetsbit(){
	var materials = ["Bronze","Iron","Steel","Mithril","Adamant","Rune","Eternium","Dragon"];
	var slots = ["Helm","Body","Legs","Kite"];
	function makeasset(name){
		Ast.loadImage(name.toLowerCase(),name+".png");
	}
	//{armor
	Ast.setPath("assets/Armor/");
	for (var i = 0; i < materials.length; i++)
		for (var j = 0; j < slots.length; j++)
			makeasset(materials[i]+slots[j]);
	//{armorequip
	/*Ast.setPath("assets/ArmorEquip/");
	for (var i = 0; i < materials.length; i++)
		for (var j = 0; j < slots.length; j++)
			makeasset(materials[i]+slots[j]+"Equip");*/
	//}
	//{entities
	Ast.setPath("assets/Entities/");
	makeasset("Cow");
	makeasset("Guard");
	makeasset("Man");
	makeasset("Dummy");
	makeasset("PlayerHead");
	makeasset("PlayerTorso");
	makeasset("PlayerLegs");
	//Ast.loadImage("player","PlayerS.png");
	//}
	//{items
	Ast.setPath("assets/Items/");
	makeasset("Seed");
	makeasset("Bones");
	makeasset("Coins");
	makeasset("Log");
	makeasset("BronzeBar");
	makeasset("IronBar");
	makeasset("SteelBar");
	makeasset("MithrilBar");
	makeasset("AdamantBar");
	makeasset("RuniteBar");
	makeasset("EterniumBar");
	makeasset("TinOre");
	makeasset("CopperOre");
	makeasset("CoalOre");
	makeasset("IronOre");
	makeasset("MithrilOre");
	makeasset("AdamantOre");
	makeasset("RuniteOre");
	makeasset("EterniumOre");
	makeasset("Hammer");
	makeasset("Knife");
	makeasset("BronzeArrow")
	//}
	//{tiles
	Ast.setPath("assets/Tiles/");
	makeasset("Hole");
	makeasset("AlchingStand");
	makeasset("DeadSeedling");
	makeasset("Seedling");
	makeasset("Sapling");
	makeasset("Tree");
	makeasset("Stump");
	makeasset("Grass");
	makeasset("Dirt");
	makeasset("Stone");
	makeasset("Furnace");
	makeasset("Anvil");
	makeasset("BankChest");
	makeasset("BankChestOpen");
	makeasset("BronzeChest");
	makeasset("BronzeChestOpen");
	makeasset("IronChest");
	makeasset("IronChestOpen");
	makeasset("LadderDown");
	makeasset("LadderUp");
	makeasset("BluePortal");
	Ast.loadImage("cwallu","CastleWallUp.png");
	Ast.loadImage("cwalll","CastleWallL.png");
	Ast.loadImage("cwallt","CastleWallT.png");
	Ast.loadImage("cwallx","CastleWallX.png");
	Ast.loadImage("cwallv","CastleWallVert.png");
	Ast.loadImage("cwallc","CastleWallCenter.png");
	makeasset("FireBig");
	makeasset("FireSmall");
	makeasset("PlowedDirt");
	//}
	//{weapons
	Ast.setPath("assets/Weapons/");
	makeasset("BronzeDagger");
	makeasset("IronDagger");
	makeasset("SteelDagger");
	makeasset("MithrilDagger");
	makeasset("AdamantDagger");
	makeasset("RuneDagger");
	makeasset("EterniumDagger");
	makeasset("Shortbow");
	//}
	/*unused
	makeasset("playerN","PlayerN");
	makeasset("playerE","PlayerE");
	makeasset("playerW","PlayerW");
	*/
	Ast.load();
}