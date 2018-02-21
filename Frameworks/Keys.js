function KeysFramework(){
	this.frameworkName = "KeysFramework";
	function Key(keyname, keycode){this.name = keyname;this.code = keycode;this.down = false;}
	var keys = "";
	for (var i = 0; i < 26; i++)keys+="-"+"abcdefghijklmnopqrstuvwxyz".charAt(i)+","+(i+97)+".";
	for (var i = 0; i < 26; i++)keys+="-"+"ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(i)+","+(i+65)+".";
	for (var i = 0; i < 10; i++)keys+="-n"+i+","+(48+i)+".";
	keys+="-space,32.-semicolon,186.-squote,222.-shift,16.-ctrl,17.-alt,18."+
		"-enter,13.-up,38.-down,40.-left,37.-right,39.-equal,187."+
		"-dash,189.-backspace,8.-tab,9.-esc,27.-caps,20.-del,46.-comma,188."+
		"-period,190.-fslash,191.-bslash,220.-obracket,219.-cbracket,221.-nak,0.";
	this.Keys = (function addKeys(str){var Keys={};
		do {Keys[str.substring(1,str.indexOf(","))]
		= new Key(str.substring(1,str.indexOf(",")),
		parseInt(str.substring(str.indexOf(",")+1,str.substring(1).indexOf(".")+1)));
		str = str.substring(str.substring(1).indexOf(".")+2);
		}while (str.indexOf("-")!==-1);return Keys})(keys);
	var Keys = this.Keys;
	this.get = function(g, keyitself){
		if (typeof keyitself !== "boolean") keyitself = false;
		var x = (function (g){switch (typeof g){
			case "number": return {get:"code",give:"name",fail:"NotAKey"}
			case "string": return {get:"name",give:"code",fail:0}
			default: return {get:"code",give:"name",fail:"NotAKey"}}})(g);
		for (var p in this.Keys)if (this.Keys[p][x.get]==g){if (keyitself)	
				return this.Keys[p];return this.Keys[p][x.give];}
		if (keyitself) return this.Keys.nak;return x.fail;}
	/*this.dpad = function(wasd,s){
		wasd=wasd.toUpperCase();
		this.keys = [];
		for (var i = 0; i < 4; i++)
			this.keys.push(Keys[wasd.charAt(i)]);*/
	this.dpad = function(keys,s){
		this.keys = [];
		for (var i = 0; i < 4; i++)
			this.keys.push(Keys[keys[i]]);
		this.s = s || 1;
		this.dx=this.dy=0;
		this.update = function(){
			this.dx=this.dy=0;
			for (var i = 0; i < 4; i++)
				if (this.keys[i].down){
					this.dx+=([0,-1,0,1])[i];
					this.dy+=([-1,0,1,0])[i];
				}
			this.dx*=this.s;
			this.dy*=this.s;
		}
	}
		
	this.setupListeners = function(keyhub, div){div.addEventListener("keydown",(function(c){this.get(c.keyCode,true).down=true;
		//if (c.code.charAt(0)=="F")return;
       // c.preventDefault();c.stopPropagation();
		}).bind(this));div.addEventListener("keyup",(function(c){this.get(c.keyCode,true).down=false;
		//if (c.code.charAt(0)=="F")return;
      //  c.preventDefault();c.stopPropagation();
		}).bind(this));
	for(var i=0;i<3;i++)div.addEventListener("key"+(["down","up","press"])[i],keyhub.dup.bind(keyhub,this,i));}
	this.KeyHub = function(){this.down = function(){};this.up = function(){};this.pressed = function(){};
	this.dup = function(k,e,c){(([this.down,this.up,this.pressed])[e])(c/*k.get(c.keyCode,true)*/);}}
}
		
	//this.refresh = function(){this.dup = function(k,e,c){(([this.down,this.up,this.pressed])[e])(k.get(c,true));}}}
		//this.down = function(){console.log("down");}
		//this.up = function(){console.log("up");}
		//this.pressed = function(){console.log("press");}
		//window.addEventListener("keydown", keyhub.dub.bind(this,0));//keydown("r"));keydown ("r", c); = blah(x)
		//window.addEventListener("keyup", keyhub.dup.bind(undefined,this,1));
		//alert (this.get);
		//window.addEventListener("keypress", keyhub.dup.bind(undefined,this,2));
	/*
	
	
	
	
	
		
		
		function blah(x, c){
			
		}
		
		
		function keyevent(e){
			return 
		}
		function keydown(c){
			keyhub.keyevent
		}
		function keyup(c){
			
		}
		function keypressed(c){
			
		}
		var preventcodes = [8,9,37,38,39,40,46];
		for (var i = 0; i < preventcodes.length; i++)
			if (e.keyCode == preventcodes[i])
				e.preventDefault();
		var that = this;
		function keyevent(event){
			return (function(c){
				c = that.get(c,true);
				switch (event){
					case "down": keydownP(key); return;
					case "up": keyupP(key); return;
					case "pressed": keypressedP(key); return;
				}
			})
			
			
			//keyhub["key"+event](this.get(keycode,true));
		}*/
		//var events = [keydownP,keyupP,keypressedP];
		// var that = this;
		//function gen (e){
		//	return (function(k){
				
		//	})
		//}
		//dup.bind(undefined, this, 1);
		//this.keyevent = function(key, e){
		//	var f = ([this.keydown,this.keyup,this.keypressed])[e]
		//	if (typeof f == "function") return f(key)||false;
		/*}/*
		function keydownP(key){
			if (typeof this.keydown == "function")
				return this.keydown() || false;
			return false;
		}
		function keyupP(key){
			if (typeof this.keyup == "function")
				return this.keyup() || false;
			return false;
		}
		function keypressedP(key){
			if (typeof this.keypressed == "function")
				return this.keypressed() || false;
			return false;
		}
	function addKey(name, code){
		this.Keys[name] = new Key(name, code);
	}
	for (var i = 0; i < 26; i++)	addKey.call(this,"abcdefghijklmnopqrstuvwxyz".charAt(i),65+i);
	for (var i = 0; i < 10; i++)	addKey.call(this,"n"+i,48+i);
	addKey.call(this,"space",);
	addKey.call(this,"semicolon",);
	addKey.call(this,"squote",);
	addKey.call(this,"shift",);
	addKey.call(this,"ctrl",);
	addKey.call(this,"alt",);
	addKey.call(this,"enter",);
	addKey.call(this,"up",);
	addKey.call(this,"down",);
	addKey.call(this,"left",);
	addKey.call(this,"right",);
	addKey.call(this,"equal",);
	addKey.call(this,"",);
	addKey.call(this,"",);
	addKey.call(this,"",);
	addKey.call(this,"",);
	addKey.call(this,"",);
	addKey.call(this,"",);
	addKey.call(this,"",);
	addKey.call(this,"",);
	addKey.call(this,"",);
		 : false,
		 : false,
		 : false,
		 : false,
		 : false,
		 : false,
		 : false,
		 : false,
		 : false,
		 : false,
		 : false,
		 : false,
		dash : false,
		backspace : false,
		tab : false,
		esc : false,
		caps : false,
		del : false,
		comma : false,
		period : false,
		fslash : false,
		bslash : false,
	this.Keys = {};
	
		a : false,
		b : false,
		c : false,
		d : false,
		e : false,
		f : false,
		g : false,
		h : false,
		i : false,
		j : false,
		k : false,
		l : false,
		m : false,
		n : false,
		o : false,
		p : false,
		q : false,
		r : false,
		s : false,
		t : false,
		u : false,
		v : false,
		w : false,
		x : false,
		y : false,
		z : false,
		n0 : false,
		n1 : false,
		n2 : false,
		n3 : false,
		n4 : false,
		n5 : false,
		n6 : false,
		n7 : false,
		n8 : false,
		n9 : false,
		space : false,
		semicolon : false,
		squote : false,
		shift : false,
		ctrl : false,
		alt : false,
		enter : false,
		up : false,
		down : false,
		left : false,
		right : false,
		equal : false,
		dash : false,
		backspace : false,
		tab : false,
		esc : false,
		caps : false,
		del : false,
		comma : false,
		period : false,
		fslash : false,
		bslash : false,
	}
	iskeycode : function(keycode){
					return this.getkey(keycode) !== "nak";},
				iskey : function(key){
					return this.getkeycode(key) !== 0;},
				getkeycode : function(key){
					for (var i = 0; i <= 222; i++)
						if (this.getkey(i) == key && key !== "nak")
							return i;
					return 0;},
				getkey : function(keyCode){
					switch (keyCode){
						
						
						
						case 8:		return "backspace";	
						case 9:		return "tab";		
						case 13:	return "enter";		
						case 16:	return "shift";		
						case 17:	return "ctrl";		
						case 18:	return "alt";		
						case 20:	return "caps";		
						case 27:	return "esc";		
						case 32:	return "space";
						case 37:	return "left";		
						case 38:	return "up";		
						case 39:	return "right";		
						case 40:	return "down";		
						case 46:	return "del";		
						case 48:	return "n0";		
						case 49:	return "n1";		
						case 50:	return "n2";		
						case 51:	return "n3";		
						case 52:	return "n4";		
						case 53:	return "n5";		
						case 54:	return "n6";		
						case 55:	return "n7";		
						case 56:	return "n8";		
						case 57:	return "n9";		
						case 65:case 97:	return "a";			
						case 66:case 98:	return "b";			
						case 67:case 99:	return "c";			
						case 68:case 100:	return "d";			
						case 69:case 101:	return "e";			
						case 70:case 102:	return "f";			
						case 71:case 103:	return "g";			
						case 72:case 104:	return "h";			
						case 73:case 105:	return "i";			
						case 74:case 106:	return "j";			
						case 75:case 107:	return "k";			
						case 76:case 108:	return "l";			
						case 77:case 109:	return "m";			
						case 78:case 110:	return "n";			
						case 79:case 111:	return "o";			
						case 80:case 112:	return "p";			
						case 81:case 113:	return "q";			
						case 82:case 114:	return "r";			
						case 83:case 115:	return "s";			
						case 84:case 116:	return "t";			
						case 85:case 117:	return "u";			
						case 86:case 118:	return "v";			
						case 87:case 119:	return "w";			
						case 88:case 120:	return "x";			
						case 89:case 121:	return "y";			
						case 90:case 122:	return "z";	
						case 186:	return "semicolon";	
						case 187:	return "equal"; 	
						case 188:	return "comma";		
						case 189:	return "dash"; 		
						case 190:	return "period"; 	
						case 191:	return "fslash"; 	
						case 219:	return "obracket"; 	
						case 220:	return "bslash";	
						case 221:	return "cbracket";	
						case 222:	return "squote";
						default: 	return "nak";}
				}
				*/