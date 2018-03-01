function MainFramework(){
	this.frameworkName = "MainFramework";
	var haltFlag = false;
	//var pauseFlag;
	var loop;
	this.startLoop = function(){
			//console.log(this.allLoaded+" "+this.frameworkName);
		//if (exists(i) && exists(i.clearInterval)) i.clearInterval();
		if (this.allLoaded()){
			if (exists(start))start();
			executionLoop();
		}
		else {//console.log("Waiting for frameworks to load...");
		      setTimeout(this.startLoop.bind(this),50);}
	}
	this.createCanvas = function(w,h){
		if (typeof w == "number" && typeof h == "number")
				console.log("Creating new canvas of size "+w+" by "+h+".");
		else {	console.log("Creating new canvas of size 800 by 600.");		w = 800;h = 600;}
		this.canvas = document.createElement('canvas');
		this.canvas.width  = w;	this.canvas.height = h;
		document.body.appendChild(this.canvas);}
	this.setLoop = function(loop0){
		if (typeof loop0 == "function")
			loop = loop0;
	}
	function executionLoop(){
		if (typeof loop == "function")
			loop();
		else {
			console.log("loop is not a function.");
			return;
		}
		if (!haltFlag)
			requestAnimationFrame(executionLoop);
		else console.log("haltFlag called. Stopping execution.");
	}
	this.Functionable = new (function(){
		function superinit(superinitargs,ordersxfers){
			//console.log(this.prototype.supers);
			//console.log(this.supers);
			/*
			this.supers = {
				Entity:Entitiyfuncs,
				etc.
			}
			superinitargs = [
				{Clickable:[x,y,w,h]},
				{Entity:[id]}
				etc.
			]
			orderedinits = [
				"Clickable",
				"Entity",
				etc.
			]
			superinitargs = {
				Clickable:[x,y,w,h],
				etc.
			}
			*/
			var orderedinits = [];
			superinitargs.forEach((s)=>{for (var p in s) if (p !== "sets") orderedinits.push(p)});
		//	alert(orderedinits);
		//	alert(Object.keys(superinitargs.find((s)=>Object.keys(s)[0] == "Clickable")));
			for (var p in this.supers)
				if (p !== "sets" && orderedinits.indexOf(p) == -1)
					this.supers[p].superinit.apply(this,superinitargs.find((s)=>Object.keys(s)[0] == p));
				else if (orderedinits.indexOf(p)!==-1)
					;//console.log(p);
		//	console.log(orderedinits)
			orderedinits//.map((p)=>this.supers[p])
				.forEach((s)=>{//console.log(this.supers[s]);//superinitargs.find((q)=>Object.keys(q)[0] == s)[s]);//superinitargs.find((q)=>Object.keys(q)[0] == s));console.log(this.supers[s]);
					this.supers[s].superinit.apply(this,superinitargs.find((q)=>Object.keys(q)[0] == s)[s])});
			//console.log(orderedinits);
			//console.log(orderedinits);
			//alert ("AWFEWe");
			//console.log(orderedinits);
				return;
			for (var p in this.supers)
				if (p !== "sets" && orderedinits.indexOf(p) == -1)
					this.supers[p].superinit.apply(this,superinitargs.find((s)=>Object.keys(s)[0] == p));
			//console.log(this);
		}
		function xfers(orderedinits){
			//console.log("xfer");
			//console.log(this);
			orderedinits.forEach((s)=>{xferfuncs(this,this.supers[s],["superinit"])});
		}
		return function(){ //Functionable.call(prototype,super1,super2,...)
			this.supers = {}
			arguments = Object.keys(arguments).map((k)=>arguments[k]);
			//alert(JSON.stringify(arguments));
			if (arguments.length > 0)
				arguments.forEach((s)=>s.call(this.supers)); // this = obj prototype
			this.superinit = superinit;
			this.xfers = xfers;
			return this;
		}
	})();
	this.fN2N = function(fN){return FindFrameworkAndDo(fN,function(n){return n;});}
	this.n2FN = function(n){return FindFrameworkAndDo(n,function(f){return f.frameworkName;},true);}
	this.allLoaded = function(){
		var ready = true;
		var notready = "Waiting for Frameworks to load:\n";
		for (var p in Frameworks){
			var fready = true;
			if (typeof Frameworks[p].ready == "boolean")
				fready = Frameworks[p].ready && fready;
			if (typeof Frameworks[p].ready == "function")
				fready = Frameworks[p].ready() && fready;
			if (!fready)	notready += Frameworks[p].frameworkName+"\n";
			ready = ready && fready;
		}
		if (!ready)
			console.log(notready);
		
		/*for (var p in Frameworks){
			//console.log(p+" "+Frameworks[p].ready);
			if (typeof Frameworks[p].ready == "boolean")
				ready = ready && Frameworks[p].ready;
			else if (typeof Frameworks[p].ready == "function")
				ready = ready && Frameworks[p].ready();}*/
		return ready;
	}
}
function GFW(fn){
	for (var p in Frameworks)
		if (Frameworks[p].frameworkName == fn)
			return Frameworks[p];
//	return FindFrameworkAndDo(fn,function(f){return f;},true);
}
function FindFrameworkAndDo(frameworkName, action, giveframework){
	if (typeof action == "undefined")
		action = function(){}
	for (var p in Frameworks)
		if (Frameworks[p].frameworkName == frameworkName){
			if (typeof giveframework == "boolean" && giveframework)
				action.call(Frameworks[p]);
			else action.call(p);
			return true;}
	return false;
}
var Frameworks = {};
function registerFramework(framework, name){
	if (typeof framework == "function")
		framework = new framework();
	if (framework === false){
		console.log("Framework already loaded");
		return;}
	if (typeof window[name] == "undefined" && typeof framework == "object"){
		window[name] = framework;
		Frameworks[name] = framework;
	}
	else console.log("Framework name already taken in global namespace.");
}
function registerFrameworks(couples){
	for (var i = 0; i < couples.length; i++)
		registerFramework(couples[i].f,couples[i].n);
}
function makeShortcut(target, name, override){
	if (typeof window[name] == "undefined"||override){		window[name] = target; return target;}
	else console.log("Shortcut name already taken in global namespace: "+name);
}
function extend(sub, sup){sub.prototype = Object.create(sup.prototype);}
function size(obj){var s = 0;for (var p in obj)if (obj.hasOwnProperty(p))s++;return s;}
function exists(thing){return (typeof thing !== "undefined");}
function existsAndIs(thing, is){return exists(thing) && thing == is;}
Object.prototype.sets = function(sets){
		for (var p in sets)
			this[p] = sets[p];
		return this;
	}
Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};
window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
window.mobile = window.mobilecheck();
Function.prototype.curry = function() {
  var fn = this;
  var args = [].slice.call(arguments, 0);
  return function() {
    return fn.apply(this, args.concat([].slice.call(arguments, 0)));
  };
}
function capitalize(str){
	return str.charAt(0).toUpperCase()+str.substring(1);
}
function xferfuncs(me, obj, omits){
	for (var p in obj)
		if (obj.hasOwnProperty(p) && (typeof obj[p] == "function") && (!omits || omits.indexOf(p)==-1))
			me[p] = obj[p];
}
function flatten(arr){
	arr = arr.concat.apply(arr,arr);
}
//Array.prototype.flatten = function(){
//	return [].concat.apply([],this);
//}