function UIFramework(){
	this.frameworkName = "UIFramework";
	var that = this;
	this.Follow = function(f, t, offx, offy, scale){
		this.follower = f;
		this.target = t;
		this.scale = scale || 1;
		this.x = 0;
		this.y = 0;
		if (exists(offx) && exists(offy)){//typeof offx == "number" && typeof offy == "number"){
			this.x = offx;
			this.y = offy;}
		this.following = true;
	}
	this.Follow.prototype.init = function(){
		if (!exists(this.target.x))
			this.target.x = 0;
		if (!exists(this.target.y))
			this.target.y = 0;
		this.update();
		//this.follower.x = this.target.x + this.x;
		//this.follower.y = this.target.y + this.y;
		}
	this.Follow.prototype.update = function(){
		if (!this.following)		return;
		var tx = this.target.x,
			ty = this.target.y;
        if ((this.follower.container==-1)||(this.target.container==-1))
            this.container.remove(this);
		if (typeof tx == "function") tx = this.target.x();
		if (typeof ty == "function") ty = this.target.y();
		if (typeof this.x == "function") this.follower.x = this.x(this.target);
		else this.follower.x = this.scale * (tx + this.x);
		if (typeof this.y == "function") this.follower.y = this.y(this.target);
		else this.follower.y = this.scale * (ty + this.y);
	}
	this.Clickable = (function(){
		function superinit(x,y,w,h,dblct){
			this.x = x || 0;
			this.y = y || 0;
			this.w = w || 0;
			this.h = h || 0;
			this.dblcdelay = dblct || (window.mobile?.7:.35);
		}
		function cdx(x){	return this.container.boxx(x)-this.x;	}
		function cdy(y){	return this.container.boxy(y)-this.y;	}
		function cd(xy){	return [this.cdx(xy.x),this.cdy(xy.y)];	}
		function onme(dx,dy){	return dx>=0&&dy>=0&&dx<this.w&&dy<this.h	}
		function update(d){
			if (this.dblctime >= 0)	this.dblctime-=d;
			if (this.firstclick && this.dblctime < 0 && this.dblclick){
				this.firstclick = false;
				this.leftclick();
			}
			if (this.container !== -1 && this.container)
			this.isover = this.checkover(Ms.getMouse());//this.onme.apply(this,this.cd(Ms.getMouse())) && this.container.mouseonbox(Ms.getMouse());
		}
		function checkover(m){
			return this.onme.apply(this,this.cd(m)) && (this.container.mouseonbox(m) || !this.container.cropped);
		}
		function mousedown(e,m){
			if (this.isdown = this.isover = this.checkover(m)){
				if (e.button == 0){
					this.dblctime = this.dblcdelay;
					return this.leftdown && this.leftdown.apply(this,this.cd(m));
				}
				if (e.button == 2)
					return this.rightdown && this.rightdown.apply(this,this.cd(m));
			} return false;
		}
		function mouseup(e,m){
			var dx = this.cdx(m.x);
			var dy = this.cdy(m.y);
			this.isover = this.onme(dx,dy);
			if (!this.isdown)	return;
			if (this.isover && this.isdown)
				if (e.button == 0){
					if (this.firstclick && this.dblclick){
						this.dblclick();
						this.firstclick = false;
					} else this.firstclick = true;
					if (this.dblctime < 0 || !this.dblclick) 
						return this.leftclick && this.leftclick(dx,dy);
				}
				else if (e.button == 2)
					return this.rightclick && this.rightclick(dx,dy);
			this.isdown = false;
		}
		function mousemove(e,m){
			this.isover = this.checkover(m);//this.onme.apply(this,this.cd(m)) && this.container.mouseonbox(m);
		}
		return function(options){
			this.Clickable = {
				superinit:superinit,
				cdx:cdx,
				cdy:cdy,
				cd:cd,
				checkover:checkover,
				update:update,
				onme:onme,
				mousedown:mousedown,
				mouseup:mouseup,
				mousemove:mousemove
			};
			/*this.cdx = cdx;
			this.cdy = cdy;
			this.onme = onme;
			this.mousedown = mousedown;
			this.mouseup = mouseup;
			this.mousemove = mousemove;*/
			return this;
		}
	})();
	this.Button = function(x,y,w,h){
		this.superinit.call(this,[{Clickable:[x,y,w,h]}]);
			this.xfers(["Clickable"]);
		//console.log(this);
		//this.Clickable.superinit.call(this,x,y,w,h);
		//xferfuncs(this,this.Clickable);
		/*this.leftdown = function(){
			return true;
		}*/
		this.leftclick = function(dx,dy){
			return this.onclick.call(this);
		}
		this.rightclick = function(dx,dy){
			
		}
		//var that = this
		//console.log(["down","up","move"].forEach.toString());//((t)=>{console.log(this)});
		/*["down","up","move"].forEach((t)=>{//console.log(this)});
			this["mouse"+t] = function(e,m){
				console.log("mouse"+t);
			return this.Clickable["mouse"+t].call(this,e,m);
		}.bind(this)});*/
		this.cropped = this.w>0&&this.h>0;
		this.ccolor = "grey";
		this.bcolor = "darkgrey";
		this.color = "clear";
		this.alphamod = 1;
		this.key = "";
		this.pcolor = "black";
		this.text = "";
		var adjusted = false;
		this.adjust = function(g){
			g.font = ""+(this.h*.5)+"px Arial";
			//if (!adjusted)	
			//	adjusted = 
			this.w = g.measureText(this.text).width+this.h*2;
		}
		this.inrender = function(g){}
		this.rbefore = function(g){
			g.save()
			g.translate(this.x,this.y);
			if (this.alphamod > 0 && this.alphamod != 1)
				g.globalAlpha*=this.alphamod;
			if (!this.transparent&&this.ccolor!=="clear"){
				g.fillStyle = this.ccolor;
				g.fillRect(0,0,this.w,this.h);}
			if (!this.cropped) return;
			g.beginPath();
			g.rect(0,0,this.w,this.h);
			g.clip();
			g.closePath();
		}
		this.rafter = function(g){
			g.restore();
			g.strokeStyle = this.bcolor == "clear" ? "rgba(0,0,0,0)" : this.bcolor;
			g.lineWidth = 4;
			g.strokeRect(this.x,this.y,this.w,this.h);
			if (this.color!=="clear"){
				g.globalAlpha = .5;
				g.strokeStyle = g.fillStyle = this.color;
				g.fillRect(this.x,this.y,this.w,this.h);
				g.strokeRect(this.x,this.y,this.w,this.h);
			}
			if (!(this.isdown && this.isover))
				return;
			g.globalAlpha = .5;
			g.fillStyle = this.pcolor;
			g.fillRect(this.x+2,this.y+2,this.w-4,this.h-4);
		}
		this.render = function(g){
			this.rbefore(g);
			this.inrender.call(this,g);
			var size = this.h*.5;
					g.font = ""+size+"px Arial";
			if (this.text !== ""){
				g.fillStyle = "black";
				while (g.measureText(this.text).width > this.w*.9){
					size--;
					g.font = ""+size+"px Arial";
				}
				Drw.drawCText(g,this.text,this.w/2,this.h/2);
			}
			this.rafter(g);
		}
	}
	M.Functionable.call(this.Button.prototype,this.Clickable);
	//this.Clickable.call(this.Button.prototype);
	this.DBox = function(x,y,w,h){
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 0;
		this.alphamod = 1;
		this.cropped = this.w>0&&this.h>0;
		this.transparent = false;//!this.cropped;
		this.color = "clear";
		this.bcolor = "clear";
		this.pcolor = "black";
		this.font = "";
		var systems = {};
		var q = [];
		var rrng = {min:0,max:0};
		var urng = {min:0,max:0};
		this.getq = function(){return q.slice();};
		this.camera = new Camera(this.w/2,this.h/2,this.w,this.h);
		this.camera.container = this;
		this.invisible = false;
		this.frozen = false;
		this.hidden = false;
		this.empty = function(){
			systems = {};
			q = [];
			rrng = {min:0,max:0};
			this.camera.reset();
			this.onempty && this.onempty();
		}
		function Camera(cx, cy, width, height){
			var scale = 1;
			this.x = cx;
			this.y = cy;
			this.grid = -1;
			if (typeof width == "number" && typeof height == "number"){
				this.w = width;
				this.h = height;}
			this.reset = function(){
				this.x = this.container.w/2;
				this.y = this.container.h/2;
				this.w = this.container.w;
				this.h = this.container.h;
				scale = 1;
				this.grid = -1;
			}
			this.centerZero = function(){
				this.x = 0;
				this.y = 0;
			}
			this.setGrid = function(on, dx, dy, color, width){
				if (!on){this.grid = -1;return;}
				this.grid = new Grid(this,dx,dy,color,width);
			}
			function Grid(cam, dx, dy, color, width){
				this.cam = cam;
				this.dx = dx || 100;
				this.dy = dy || 100;
				this.color = color || "white";
				this.width = width || 1;
				this.render = function(g){
					g.strokeStyle = this.color;
					g.lineWidth = this.width;
					var u, d, l, r;
					u = this.cam.y-this.cam.h/2/this.cam.getzoom();
					d = this.cam.y+this.cam.h/2/this.cam.getzoom();
					l = this.cam.x-this.cam.w/2/this.cam.getzoom();
					r = this.cam.x+this.cam.w/2/this.cam.getzoom();
					for (var i = l-l%this.dx-this.dx; i <= r+this.dx; i+=this.dx)
						for (var j = u-u%this.dy-this.dy; j <= d+this.dy; j+=this.dy)
						g.strokeRect(i,j,this.dx,this.dy);
				}
			}
			//this.relx = function(){
			//	return (this.x-this.w/2)*scale;}
			//this.rely = function(){
			//	return this.y-this.h/2;}
			this.relx = function(x){
				return (x*scale - this.x*scale + this.w/2);//*scale;
			}
			this.rely = function(y){
				return (y*scale - this.y*scale + this.h/2)//*scale;
			}
			this.getzoom = function(){
				return scale;}
			this.zoom = function(scl){
				scale*=scl;}
			this.zoomto = function(scl){
				scale = scl;}
			this.step = function(g){
				g.translate(-this.x*scale,-this.y*scale);
				g.translate(this.w/2,this.h/2);
				g.scale(scale,scale);
				if (this.grid!=-1)
					this.grid.render(g);
				//g.translate(-(this.x*scale-this.w/2), -(this.y*scale-this.h/2));
				//console.log(scale);
				//g.scale(scale, scale);
				}
			this.unstep = function(g){
				g.scale(1/scale,1/scale);
				g.translate(-this.w/2,-this.h/2);
				g.translate(this.x*scale,this.y*scale);
				//g.scale(1/scale, 1/scale);
				//g.translate((this.x*scale-this.w/2), (this.y*scale-this.h/2));
			}
		}
		this.filterq = function(func){
			q.filter(func);
		}
		this.makescrollable = function(scroll,onscroll,dy){
			this.scroll = scroll || function(amt,to){
				//this.camera.zoom(amt+1);
				this.camera.y = amt+to?0:this.camera.y;
				onscroll && onscroll();
			}//.bind(this);
			that.Clickable.call(clicker.prototype);
			function clicker(dy){
				this.ddy = dy;
				this.rl = 3;
				this.init = function(){
					var b = this.container.getbounds();
					var s = (b.d-b.u)*.1;
					this.Clickable.superinit.call(this,b.r-s,dy>0?b.u:b.d-s,s,s);
				}
				this.update = function(d){
					if (this.isover && this.isdown)
						this.container.scroll(d*this.ddy);
					var b = this.container.getbounds();
					var s = (b.d-b.u)*.1;
					this.Clickable.superinit.call(this,b.r-s,dy>0?b.u:b.d-s,s,s);
				}
				this.leftdown = function(){
					return true;
				}
				this.render = function(g){
					g.translate(this.x,this.y);
					g.fillStyle = "grey";
					g.fillRect(0,0,this.w,this.h);
					g.fillStyle = "black";
					var dy = -Math.sign(this.ddy);
					var m = this.h/2+dy*this.h/10;
					g.beginPath();
					g.moveTo(this.w/2,m+dy*this.h/5);
					g.lineTo(this.w/5,m-dy*this.h/3);
					g.lineTo(this.w/5*4,m-dy*this.h/3);
					g.fill();
					g.strokeStyle = "darkgrey";
					g.lineWidth = 5;
					g.strokeRect(2,2,this.w-4,this.h-4);
					if (!(this.isdown && this.isover))
						return;
					g.globalAlpha = .5;
					g.fillRect(2,2,this.w-4,this.h-4);
				}
			}
			this.add(new clicker(-10));
			this.add(new clicker(10));
		}
		this.tabq = [];
		this.tabl = [];
		this.newtab = function(name, box){
			box = box || new that.DBox();
			box.hidden = true;
			this.add(box,name);
			this.tabl.push(name);
		}
		this.settab = function(name){
			if (!this.has(name))
				return;
			//if (this.tabq.length > 0)
				for (var i = 0; i < this.tabl.length; i++)
					this.get(this.tabl[i]).hidden = true;
			//if (this.curtab!=="")
			//	this.get(this.curtab).hidden = true;
			this.get(name).hidden = false;
			//if (this.tabq[this.tabq.length-1]!==name)
			this.tabq.push(name);
			this.get(name).onsettab && this.get(name).onsettab();
		}
		this.prevtab = function(){
			if (this.tabq.length <= 1)	return;
			this.get(this.tabq.pop()).hidden = true;
			
				for (var i = 0; i < this.tabl.length; i++)
					this.get(this.tabl[i]).hidden = true;
			this.get(this.tabq[this.tabq.length-1]).hidden = false;
		}
		this.mouseevent = function(type,e,m){
			//console.log(type);
			//console.log(this.invisible);
			//if (this.invisible)
			//	console.log(this.invisible);
			if (this.hidden || this.frozen || this.invisible)	return;
			for (var j = rrng.max; j >= rrng.min; j--)
				for (var i = q.length-1; i >= 0; i--)
					if (exists(q[i]))
						if (q[i].rl==j)
							if (typeof q[i]["mouse"+type] !== "undefined"  && !q[i].invisible && !q[i].hidden)
								if (q[i]["mouse"+type](e,m))
									return true;
			return this.mousecatcher;//this.mouseonbox(m)&&!this.transparent;
		}
		this.keyevent = function(type, c){
			if (this.hidden || this.frozen)	return;
			for (var j = rrng.max; j >= rrng.min; j--)
				for (var i = 0; i < q.length; i++)
					if (exists(q[i]))
						if (q[i].rl==j)
							if (typeof q[i]["key"+type] !== "undefined")
								if (q[i]["key"+type](c))
									return;}
		function setupSys(system){
			system.container = this;
			system.pget = this.get;
			system.removeme = function(){
				//alert("wfeefd");
				//alert(this.systemname);
				if (this.container && this.container !== -1)
					this.container.remove(this);
				else console.log("no container");
			}.bind(system);
		}
		this.add = function(system, name){
			if (typeof name !== "string" || name == ""){
				//console.log("Adding anonymous system: ");
				//console.log(system);
				q.push(system);
				setupSys.call(this,system);
				//system.systemname = name;
				if (typeof system.init == "function")	system.init();	return system}var sub = "";
			if (name.indexOf("^")==0){if (exists(this.container))this.container.add(system,name.substring(1));
				else this.add(system,name.substring(1)); }
			if (name.indexOf(".")!==-1){
				sub = name.substring(name.indexOf("."));
				name = name.substring(0,name.indexOf("."));
				if (typeof systems[name] !== "object"){	console.log("Parent system not found: "+name);	return;}}
			if (sub == ""){
				if (this.has(name) && q.indexOf(systems[name])!=-1)
					q.splice(q.indexOf(systems[name]),1,system)
				else q.push(system);
				systems[name] = system;
				setupSys.call(this,system);
				system.systemname = name;
				if (typeof system.init == "function")	system.init(); return system}
			else return systems[name].add(system, sub.substring(1));}
		this.remove = function(sorn){//system or name
			switch(typeof sorn){
				case "undefined":	console.log("Invalid removal.");	return;
				case "string": //name 
					//if (this.has(sorn)){ return;}// return;}
					//if (sorn.charAt(0)!=="("){
					//alert(sorn);
					//sorn = this.get(sorn);//systems[sorn];//this.get(sorn.systemname);//	sorn.container = -1;
				//	alert(sorn);
				//	}else 
					sorn = this.get(sorn);
					//if (typeof sorn.ondelete == "function")	//	sorn.ondelete();
					//console.log(q.splice(q.indexOf(sorn),1));
					//delete sorn;	
					//alert(sorn.systemname);
					//return;
				default: sorn.container = -1;//system
					//console.log(sorn.systemname);
					//console.log("index"+q.indexOf(sorn)+" sname"+sorn.systemname);
					//if (typeof sorn.ondelete == "function")		sorn.ondelete();
					//if (!sorn || sorn == -1)return alert("blah");
					//if (sorn.systemname.charAt(0)!=="(")
					//;//alert(sorn.systemname);
					q.splice(q.indexOf(sorn),1);
					if (!sorn.ondelete || (sorn.ondelete && sorn.ondelete()))
						delete systems[sorn.systemname];
					return;
			}
		}
		this.get = function(name){
			if (typeof name !== "string"){	console.log("Not a valid name: "+name);	return -1;}
			var sub = "";
			if (name.indexOf("^")==0){
				if (exists(this.container))	
					return this.container.get(name.substring(1));
				else this.get(name.substring(1));
			}
			if (name.indexOf(".")!==-1){
				sub = name.substring(name.indexOf(".")+1);
				name = name.substring(0,name.indexOf("."));
			}
			if (typeof systems[name] !== "object"){	//throw("System not found: "+name);
			return -1;}
			if (sub == "") return systems[name];
			else return systems[name].get(sub);}
		this.has = function(name){
			//return this.get(name)!=-1;}
			return exists(systems[name]);}
		this.update = function(delta){
			if (this.frozen || this.hidden)	return;
			q.filter((s)=>s.container == this);				//filter is removed
			for (var i = 0; i < q.length; i++){
				if (!exists(q[i])) continue;
				q[i].ul = q[i].ul || 0;
				if (q[i].ul<urng.min)urng.min=q[i].ul;
				if (q[i].ul>urng.max)urng.max=q[i].ul;}
			for (var j = urng.min; j <= urng.max; j++)
				for (var i = 0; i < q.length; i++)
					if (exists(q[i]))
						if (!q[i].frozen && exists(q[i].update) && q[i].ul==j)
							q[i].update(delta);}
		this.render = function(g){
			if (this.invisible || this.hidden)	return;
			renderBefore.call(this,g);
			this.camera.step(g);
			for (var i = 0; i < q.length; i++){
				if (!exists(q[i])) continue;
				q[i].rl = q[i].rl || 0;
				if (q[i].rl<rrng.min)rrng.min=q[i].rl;
				if (q[i].rl>rrng.max)rrng.max=q[i].rl;}
			for (var j = rrng.max; j >=rrng.min; j--)
				for (var i = 0; i < q.length; i++)
					if (exists(q[i]))
						if (q[i].rl==j && q[i].fullscreen){
							temprender(g,q[i]);
							for (var j2 = j; j2 <= rrng.max; j2++)
								for (var i = 0; i < q.length; i++)
									if (q[i].rl==j)
										temprender(g,q[i]);
							this.camera.unstep(g);
							renderAfter.call(this,g);
							return;}
			for (var j = rrng.min; j <= rrng.max; j++)
				for (var i = 0; i < q.length; i++)
					if (exists(q[i]))
						if (q[i].rl==j)
							temprender(g,q[i]);
			this.camera.unstep(g);
			renderAfter.call(this,g);
		}
		function renderBefore(g){
			g.save()
			if (this.font !== "")
				g.font = this.font;
			g.translate(this.x,this.y);
			if (this.alphamod > 0 && this.alphamod != 1)
				g.globalAlpha*=this.alphamod;
			if (!this.transparent&&this.color!=="clear"&&this.alphamod > 0){
				g.fillStyle = this.color;
				g.fillRect(0,0,this.w,this.h);}
			if (!this.cropped) return;
			g.beginPath();
			g.rect(0,0,this.w,this.h);
			g.clip();
			g.closePath();
		}
		function renderAfter(g){
			g.restore();
			if (this.bcolor=="clear")
				return;
			g.strokeStyle = this.bcolor;
			g.lineWidth = 4;
			g.strokeRect(this.x,this.y,this.w,this.h);
			if (this.pcolor=="clear"||!this.frozen)
				return;
			g.globalAlpha = .5;
			g.fillStyle = this.pcolor;
			g.fillRect(this.x,this.y,this.w,this.h);
		}
		/*function renderprep(g){
			g.save()
			g.translate(this.x,this.y);
			if (!this.transparent&&this.color!=="clear"){
				g.fillStyle = this.color;
				g.fillRect(0,0,this.w,this.h);}
			g.save();
			if (!this.cropped) return;
			g.beginPath();
			g.rect(0,0,this.w,this.h);
			g.clip();
			g.closePath();}
		function renderborders(g){
			g.restore();
			if (!this.borders){g.restore(); return;}
			border.rotateto(0);
			border.setwidth(this.w);
			idraw(g,border,this.w/2,0);
			idraw(g,border,this.w/2,this.h);
			border.rotateto(Math.PI/2);
			border.setwidth(this.h);
			idraw(g,border,0,this.h/2);
			idraw(g,border,this.w,this.h/2);
			idraw(g, corner, 0, 0);
			idraw(g, corner, 0, this.h);
			idraw(g, corner, this.w, 0);
			idraw(g, corner, this.w, this.h);
			if (!this.edges){g.restore(); return;}
			idraw(g, corner, 0, this.h/2);
			idraw(g, corner, this.w/2, 0);
			idraw(g, corner, this.w, this.h/2);
			idraw(g, corner, this.w/2, this.h);
			g.restore();}*/
		function temprender(g, renderobj){
			if (existsAndIs(renderobj.invisible, true) || existsAndIs(renderobj.hidden, true))	return;
			g.save();
			if (exists(renderobj.render))
				renderobj.render(g);
			g.restore();}
	}
	this.DBox.prototype.stretchfit = function(inner){
		var m1 = inner.h/inner.w,
			m2 = this.h/this.w;
		if (m1 > m2){
			this.camera.reset();
			//this.camera.centerZero();
			this.camera.zoomto(this.h/inner.h);
			inner.x = (this.w-inner.w)/2;
			inner.y = (this.h-inner.h)/2;
			//inner.x = inner.w/-2;
			//inner.y = inner.h/-2
		} 
		else if (m1 < m2){
			
			this.camera.reset();
			//this.camera.centerZero();
			this.camera.zoomto(this.w/inner.w);
			inner.x = (this.w-inner.w)/2;
			inner.y = (this.h-inner.h)/2;//*this.w/inner.w)/2;
			//inner.x = inner.w/-2;
			//inner.y = inner.h/-2
		} 
		else {
		//if (m1 == m2){
			//this.camera.centerZero();
			this.camera.zoomto(this.w/inner.w);
			inner.x = inner.w/-2;
			inner.y = inner.h/-2
		}
		
	}
	this.DBox.prototype.getbounds = function(){
		var u, d, l, r;
		u = this.camera.y-this.camera.h/2/this.camera.getzoom();
		d = this.camera.y+this.camera.h/2/this.camera.getzoom();
		l = this.camera.x-this.camera.w/2/this.camera.getzoom();
		r = this.camera.x+this.camera.w/2/this.camera.getzoom();
		return {	u:u,	d:d,	l:l,	r:r};}
	this.DBox.prototype.inbounds = function(x,y){
		var b = this.getbounds();
		return x <= b.r && x >= b.l && y <= b.d && y >= b.u;
	}
	this.DBox.prototype.getarea = function(){
		var b = this.getbounds();
		return Math.abs((b.u-b.d)*(b.l-b.r));}
	this.DBox.prototype.cumZoom = function(){
		if (typeof this.container !== "undefined")
			return this.container.cumZoom()*this.camera.getzoom();
		else return this.camera.getzoom();
		//	if (typeof this.container.screenx !== "undefined")
		//		return this.container.screenx(x);
		//	else return x;
		//else return x;
	}
	this.DBox.prototype.mouseonbox = function(m){
		if (!exists(this.container) || this.container == -1 || this.hidden || this.invisible)	return false;
		return m.relx(this)>0&&m.relx(this)<this.w*this.container.cumZoom()&&m.rely(this)>0&&m.rely(this)<this.h*this.container.cumZoom();}
	this.DBox.prototype.screenx = function(xx){
		var x = this.x + this.camera.relx(xx);
		if (typeof this.container !== "undefined" && this.container !== -1)
			if (typeof this.container.screenx !== "undefined")
				return this.container.screenx(x);
			else return x;
		else return x;}
	this.DBox.prototype.screeny = function(yy){
		var y = this.y + this.camera.rely(yy);
		if (typeof this.container !== "undefined" && this.container !== -1)
			if (typeof this.container.screeny !== "undefined")
				return this.container.screeny(y);
			else return y;
		else return y;}
	this.DBox.prototype.boxx = function(x,container){
		x = (this.container && this.container.boxx(x)) || x;
		return (x-this.x+this.camera.x*this.camera.getzoom()-this.camera.w/2)/this.camera.getzoom(); 
	}
	this.DBox.prototype.boxy = function(y,container){
		y = (this.container && this.container.boxy(y)) || y;
		return (y-this.y+this.camera.y*this.camera.getzoom()-this.camera.h/2)/this.camera.getzoom(); 
	}
	this.DBox.prototype.Boxx = function(x,container){ // coord in container to coord in this
		if (!container && x.container && x.container !== -1 && x.container.screenx)	return this.boxx(x.container.screenx(x.x));
		//console.log(container);
		//console.log(x);
		return this.boxx(container.screenx(x));
	}
	this.DBox.prototype.Boxy = function(y,container){
		if (!container && y.container && y.container !== -1 && y.container.screeny)	return this.boxy(y.container.screeny(y.y));
		
		return this.boxy(container.screeny(y));
	}
	this.DBox.prototype.Claim = function(thing){
		thing.x = this.Boxx(thing);
		thing.y = this.Boxy(thing);
		this.add(thing);
	}
	this.DBox.prototype.mousedown = (function(e,m){	return this.mouseevent.apply(this,["down",e,m]);});
	this.DBox.prototype.mouseup = function(e,m){	return this.mouseevent.apply(this,["up",e,m]);}
	this.DBox.prototype.mousemove = function(e,m){	return this.mouseevent.apply(this,["move",e,m]);}
	this.DBox.prototype.keydown = function(c){		this.keyevent("down",c);}
	this.DBox.prototype.keyup = function(c){		this.keyevent("up",c);}
	this.DBox.prototype.keypress = function(c){		this.keyevent("press",c);}
}