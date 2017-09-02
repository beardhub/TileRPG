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
	assetsbit();
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
	var lasttime=Date.now()/1000;
	var adt = 0;
	M.setLoop(function(){
		var before=Date.now()/1000;
		//var before=window.performance.now()/1000;
		var dt=before-lasttime;
		lasttime=before;
		adt+=dt;
		var t = 1/50;
		if (adt < t)	return;
		while (adt >= t){
			adt-=t;
			UU.update(t);
			if (adt>.5){
				UU.update(.5);
				adt = 0;
				//adt-=5;
				//UU.update(5);
			}
			

		}
		var g=M.canvas.getContext("2d");
		g.clearRect(0,0,M.canvas.width,M.canvas.height);
		UU.render(g);
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
	Ast.setPath("assets/");
	//{entities
	Ast.loadImage("cow","Cow.png");
	Ast.loadImage("guard","Guard.png");
	//}
	//{misc
	Ast.loadImage("hole","Hole.png");
	Ast.loadImage("seed","Seed.png");
	Ast.loadImage("bones","Bones.png");
	Ast.loadImage("alchingstand","AlchingStand.png");
	Ast.loadImage("coins","Coin.png");//}
	//{woodcutting
	Ast.loadImage("deadseedling","DeadSeedling.png");
	Ast.loadImage("seedling","Seedling.png");
	Ast.loadImage("sapling","Sapling.png");
	Ast.loadImage("tree","Tree.png");
	Ast.loadImage("stump","Stump.png");
	Ast.loadImage("log","Log.png");//}
	//{grounds
	Ast.loadImage("grass","Grass.png");
	Ast.loadImage("dirt","Dirt.png");
	Ast.loadImage("stone","Stone.png");//}
	//{smithing
	Ast.loadImage("furnace","Furnace.png");
	Ast.loadImage("anvil","Anvil.png");
	//{bars
	Ast.loadImage("bronzebar","BronzeBar.png");
	Ast.loadImage("ironbar","IronBar.png");
	Ast.loadImage("steelbar","SteelBar.png");
	Ast.loadImage("mithrilbar","MithrilBar.png");
	Ast.loadImage("adamantbar","AdamantBar.png");
	Ast.loadImage("runitebar","RuniteBar.png");
	Ast.loadImage("eterniumbar","EterniumBar.png");
	//}
	//{armor
	Ast.loadImage("bronzehelm","BronzeHelm.png");
	Ast.loadImage("bronzebody","BronzeBody.png");
	Ast.loadImage("bronzelegs","BronzeLegs.png");
	Ast.loadImage("bronzekite","BronzeKite.png");
	
	Ast.loadImage("ironhelm","IronHelm.png");
	Ast.loadImage("ironbody","IronBody.png");
	Ast.loadImage("ironlegs","IronLegs.png");
	Ast.loadImage("ironkite","IronKite.png");
	
	Ast.loadImage("steelhelm","SteelHelm.png");
	Ast.loadImage("steelbody","SteelBody.png");
	Ast.loadImage("steellegs","SteelLegs.png");
	Ast.loadImage("steelkite","SteelKite.png");
	
	Ast.loadImage("mithrilhelm","MithrilHelm.png");
	Ast.loadImage("mithrilbody","MithrilBody.png");
	Ast.loadImage("mithrillegs","MithrilLegs.png");
	Ast.loadImage("mithrilkite","MithrilKite.png");
	
	Ast.loadImage("adamanthelm","AdamantHelm.png");
	Ast.loadImage("adamantbody","AdamantBody.png");
	Ast.loadImage("adamantlegs","AdamantLegs.png");
	Ast.loadImage("adamantkite","AdamantKite.png");
	
	Ast.loadImage("runehelm","RuneHelm.png");
	Ast.loadImage("runebody","RuneBody.png");
	Ast.loadImage("runelegs","RuneLegs.png");
	Ast.loadImage("runekite","RuneKite.png");
	
	Ast.loadImage("eterniumhelm","EterniumHelm.png");
	Ast.loadImage("eterniumbody","EterniumBody.png");
	Ast.loadImage("eterniumlegs","EterniumLegs.png");
	Ast.loadImage("eterniumkite","EterniumKite.png");
	
	//Ast.loadImage("dragonhelm","DragonHelm.png");
	Ast.loadImage("dragonbody","DragonBody.png");
	//Ast.loadImage("dragonlegs","DragonLegs.png");
	//Ast.loadImage("dragonkite","DragonKite.png");
	//}
	//{weapons
	Ast.loadImage("bronzedagger","BronzeDagger.png");
	Ast.loadImage("irondagger","IronDagger.png");
	Ast.loadImage("steeldagger","SteelDagger.png");
	Ast.loadImage("mithrildagger","MithrilDagger.png");
	Ast.loadImage("adamantdagger","AdamantDagger.png");
	Ast.loadImage("runedagger","RuneDagger.png");
	Ast.loadImage("eterniumdagger","EterniumDagger.png");
	//}
	//}
	//{mining
	//{ores
	Ast.loadImage("tinore","TinOre.png");
	Ast.loadImage("copperore","CopperOre.png");
	Ast.loadImage("coalore","CoalOre.png");
	Ast.loadImage("ironore","IronOre.png");
	Ast.loadImage("mithrilore","MithrilOre.png");
	Ast.loadImage("adamantore","AdamantOre.png");
	Ast.loadImage("runeore","RuniteOre.png");
	Ast.loadImage("eterniumore","EterniumOre.png");//}
	//}
	//{tools
	Ast.loadImage("hammer","Hammer.png");
	Ast.loadImage("knife","Knife.png");
	//}
	//{chests
	Ast.loadImage("bankchestC","BankChest.png");
	Ast.loadImage("bankchestO","BankChestOpen.png");
	Ast.loadImage("bronzechestC","BronzeChest.png");
	Ast.loadImage("bronzechestO","BronzeChestOpen.png");
	Ast.loadImage("ironchestC","IronChest.png");
	Ast.loadImage("ironchestO","IronChestOpen.png");
	//}
	//{portals
	Ast.loadImage("ladderdown","LadderDown.png");
	Ast.loadImage("ladderup","LadderUp.png");
	Ast.loadImage("portal","BluePortal.png");
	//Ast.loadImage("gportal","GreyPortal.png");
	//}
	//{walls
	Ast.loadImage("cwallu","CastleWallUp.png");
	Ast.loadImage("cwalll","CastleWallL.png");
	Ast.loadImage("cwallt","CastleWallT.png");
	Ast.loadImage("cwallx","CastleWallX.png");
	Ast.loadImage("cwallv","CastleWallVert.png");
	Ast.loadImage("cwallc","CastleWallCenter.png");//}
	//{fires
	Ast.loadImage("firebig","FireBig.png");
	Ast.loadImage("firesmall","FireSmall.png");//}
	//{farming
	Ast.loadImage("ploweddirt","PlowedDirt.png");//}
	//{player
	Ast.loadImage("playerN","PlayerN.png");
	Ast.loadImage("playerS","PlayerS.png");
	Ast.loadImage("playerE","PlayerE.png");
	Ast.loadImage("playerW","PlayerW.png");//}
	
	Ast.load();
}