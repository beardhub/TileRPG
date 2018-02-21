function UtilsFramework(){
	this.frameworkName = "UtilsFramework";
	var that = this;
	this.Listener = function(func, oncomp){
		this.condition = func || function(){return true;}
		this.oncomp = oncomp || function(){}
		this.update = function(){
			if (this.condition())
				if (this.oncomp())
					this.container.remove(this);
		}
	}
	this.KeyListener = function(type, key, oncomp){
		oncomp = oncomp || function(){};
		this.init = function(){
			if (!(type == "down" || type == "up")){
				this.container.remove(this);
				return;
			}
			this["key"+type] = function(k){
				if (k.key == key){
					if (oncomp())
						this.container.remove(this);
				}
			}
		}
	}
	this.MouseListener = function(type, func, oncomp){
		oncomp = oncomp || function(){};
		this.init = function(){
			if (["down","up","move"].indexOf(type)==-1){
				this.container.remove(this);
				return;
			}
			this["mouse"+type] = function(e,m){
				if (func(e,m))
					if (oncomp())
						this.container.remove(this);
			}
		}
	}
	var inputs = [];
	this.TextInput = function(valids){
		var sects = new (function(){
			this.lowers = "abcdefghijklmnopqrstuvwxyz";
			this.uppers = this.lowers.toUpperCase();
			this.letters = this.lowers+this.uppers;
			this.lettersws = this.letters+" ";
			this.nums = "0123456789";
			this.lowalphanums = this.lowers+this.nums;
			this.lowalphanumsws = this.lowers+this.nums+" ";
			this.alphanums = this.letters+this.nums;
			this.alphanumsws = this.letters+this.nums+" ";
			this.symbols = "!@#$%^&*()_+-=[]\\{}|;':\",./<>?`~";
			this.symbolsws = "!@#$%^&*()_+-=[]\\{}|;':\",./<>?`~ ";
			this.allchars = this.alphanums+this.symbols+" ";
		})();
		var validchars = sects[valids] || valids;
		this.text = "";
		this.rl = 3;
		var hasfocus = false;
		this.setpassform = function(pass){
			this.ispass = pass;
			return this;
		}
		this.hasfocus = function(){
			return true && hasfocus;
		}
		this.clearfocus = function(){
			hasfocus = false;
			
				document.getElementById("inpbox").blur();
				document.getElementById("inpbox").style.display = "none";
		}
		this.focus = function(){
			for (var i in inputs)
				if (i !== "sets")
					inputs[i].clearfocus();
			hasfocus = true;
			//if (window.mobile)
				document.getElementById("inpbox").style.display = "block";
				document.getElementById("inpbox").focus();
			return this;
		}
		this.updatetext = function(){}
		this.keydown = function(k){
			if (!hasfocus)return false;
			if (k.key == "Backspace"){
				this.text = this.text.slice(0,-1);
				this.updatetext(this.text);
				return true;
			}
			if (validchars.indexOf(k.key)!==-1){
				this.text+=k.key;
				this.updatetext(this.text);
				return true;
			}
			if (k.key == "Enter")
				return this.onenter() || true;
			if (k.key == "Tab")
				return this.ontab() || true;
			return false;
		}
		this.onenter = function(){}
		this.ontab = function(){}
		this.clear = function(){
			this.text = "";
			this.updatetext(this.text);
		}
		this.gettext = function(force){
			if (this.ispass && !force){
				var pass = "";
				for (var i = 0; i < this.text.length; i++)
					pass+="*";
				return pass;
			}
			return ""+this.text;
		}
		inputs.push(this);
	}
	var that = this;
	new that.TextInput();
	this.TimedSequence = function(seq){
		this.seq = seq;
		this.timer = new that.Timer(this.seq[0].c).start();
		this.update = function(delta){
			this.timer.update(delta);
			if (this.seq[0] == undefined){
				this.container.remove(this);
				return;
			}
			if (typeof this.seq[0].c != "number" || typeof this.seq[0].e != "function"){
				if (this.seq.shift() == undefined)
					this.container.remove(this);
				return;
			}
			if (this.timer.consume())
			//if (this.seq[0].c())
				this.advance();
		}
		this.advance = function(){
			this.seq[0].e();
			if (this.seq.shift() == undefined)
				this.container.remove(this);
			if (this.seq[0] == undefined){
				this.container.remove(this);
				return;
			}
			this.timer = new that.Timer(this.seq[0].c).start();
		}
	}
	this.Sequence = function(seq){
		this.seq = seq;
		this.update = function(){
			if (this.seq[0] == undefined && exists(this.container.remove)){
				this.container.remove(this);
				return;
			}
			if (typeof this.seq[0].c != "function" || typeof this.seq[0].e != "function"){
				if (this.seq.shift() == undefined && exists(this.container.remove))
					this.container.remove(this);
				return;
			}
			if (this.seq[0].c())
				this.advance();
		}
		this.skip = function(){
			if (this.seq.shift() == undefined && exists(this.container.remove))
				this.container.remove(this);
		}
		this.advance = function(){
			if (exists(this.seq[0]))
				this.seq[0].e();
			if (this.seq.shift() == undefined && exists(this.container.remove))
				this.container.remove(this);
		}
	}
	this.Repeater = function(reps){
		this.maxreps = reps || -1;
		this.curreps = 0;
		this.timer = new that.Timer(1).setLoop(true).start();
		this.oncomp = function(){}
		this.onfinish = function(){}
		this.setOncomp = function(oncomp){
			this.oncomp = oncomp || function(){};
			return this;
		}
		this.setOnfinish = function(onfinish){
			this.onfinish = onfinish || function(){};
			return this;
		}
		this.progress = function(){
			if (this.maxreps == -1)
				return 0;
			return this.curreps / this.maxreps;
		}
		this.setDelay = function(delay){
			this.timer = new that.Timer(delay || 1).setLoop(true).start();
			return this;
		}
		this.update = function(delta){
			this.timer.update(delta);
			if (this.curreps >= this.maxreps && this.maxreps != -1){
				this.onfinish();
				this.container.remove(this);
				return;
			}
			if (this.timer.consume()){
				this.curreps++;
				this.oncomp();
			}
		}
	}
	this.Timer = function(dur){
		this.dur = dur || 0;
		this.count = 0;
		this.running = false;
		this.loop = false;
		this.autocons = false;
		this.setKilloncomp = function(kill){
			this.killoncomp = kill || false;
			return this;
		}
		this.setLoop = function(loop){
			this.loop = loop || false;
			return this;
		}
		this.setAuto = function(auto, oncomp){
			this.autocons = auto;
			if (typeof oncomp == "function")
				this.oncomp = oncomp;
			return this;
		}
		this.start = function(finished){
			this.count = 0;
			if (finished)
				this.count = this.dur;
			this.running = true;
			return this;
		}
		this.ready = function(){
			return this.count >= this.dur;
		}
		this.progress = function(){
			if (this.count >= this.dur)
				return 1;
			return this.count/this.dur;
		}
		this.consume = function(){
			if (this.dur < 0)
				return false;
			if (this.count >= this.dur){
				this.count = 0;
				if (!this.loop)
					this.running = false;
				return true;
			}
			return false;
		}
		this.renderp = function(g){
			if (this.progress()>=1||this.progress()<0)
				return; else{
				g.save();
				//var w = 16-this.progress()*16;
				//g.globalAlpha = .35;
				//g.fillStyle = "red";
				//var p = new Path2D();
				g.beginPath();
				//p.rect(-20,-20,42,42);
				//p.moveTo(0,0);
				//p.closePath();
				//g.clip();
				//g.fillRect(16-w/2,16-w/2,w,w);
				//g.strokeStyle = "blue";
				//g.strokeRect(0,0,32,32);
				//g.beginPath();
				//g.moveTo(16,8);
				//g.lineTo(16,0);
				g.lineTo(16,16);
				g.arc(16,16,8,-Math.PI/2,2*Math.PI*(-.2+this.progress()));
				//g.lineTo(16,16);
				g.fillStyle = "white";
				//g.strokeStyle = "red";
				g.globalAlpha = .35;
				//g.closePath();
				g.fill();//*/
				//g.addPath(p);
				g.restore();
			}
		}
		this.update = function(delta){
			//console.log(this.count);
			if (this.running && this.count <= this.dur)
				this.count+=delta;
			if (this.autocons)
				if (this.consume())
					if (typeof this.oncomp == "function"){
						this.oncomp();
						if (this.killoncomp) 
							this.container.remove(this);
					}
		}
	}
}