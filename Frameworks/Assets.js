function AssetsFramework(){
	this.frameworkName = "AssetsFramework";
	this.ready = true;
	var imgs = {},
		audio = {};
	var iloadq = [],
		aloadq = [];
	var failed = 0;
	this.path = "";
	this.setPath = function(path){this.path = path;}
	this.loadImage = function(name, src){
		this.ready = false;
		src = this.path+src;
		if (imgs[name]){
			console.log("Duplicate image name "+name+". Skipping load.");
			return;}
		imgs[name] = new Image();
		imgs[name].onload = function(){iloadq.splice(iloadq.indexOf(imgs[name]),1);
				console.log("Assets loading, "+getprogress()+"% complete.");};
		imgs[name].onerror = function(){
			console.log("File load failed: "+src);
			iloadq.splice(iloadq.indexOf(imgs[name]),1);
			delete imgs[name];
			failed++;
			return;}
		iloadq.push({img:imgs[name],source:src});}
	this.loadAudio = function(name, src){
		this.ready = false;
		if (audio[name]){
			console.log("Duplicate audio name "+name+". Skipping load.");
			return;}
		audio[name] = new Howl({urls: [src], buffer :true, 
			onload: function(){
				aloadq.splice(aloadq.indexOf(audio[name]),1);
				console.log("Assets loading, "+getprogress()+"% complete.");
				}});
		aloadq.push(audio[name]);
		}
	this.load = function(){
		startload.call(this);}
	this.i = function(name){
		if (!imgs[name]){
			console.log("Invalid image reference: "+name);
			return;}
		return imgs[name];}
	this.a = function(name){
		if (!audio[name]){
			console.log("Invalid audio reference.");
			return;}
		return audio[name];}
	function loading(){
		return !isloaded();}
	function isloaded(){
		return iloadq.length==0&&aloadq.length==0;}
	function getprogress(){
		var total = size(imgs)+size(audio);
		var loaded = total-iloadq.length-aloadq.length;
		return Math.floor(100*loaded/total);}
	function startload(){
		if (size(imgs)+size(audio) == 0){
			console.log("No assets loaded.");this.ready = true;return;}
		for (var i = 0; i < iloadq.length; i++)
			iloadq[i].img.src = iloadq[i].source;
		var next = doneLoading.bind(this);
		var checkloop = function(){
			//console.log(isloaded());
			if (isloaded()){ next.call();return;}
			else setTimeout(checkloop,15);
		}
		checkloop();
		//if (isloaded()) next.call();
		//else 
		//var interval = setTimeout(function(){
		//	if (isloaded())next.call();},10);
	}
	function doneLoading(){
		if (failed == 0) console.log("Asset loading complete. All files loaded successfully.");
		else if (failed == 1) console.log("Asset loading complete. 1 file failed to load.")
		else console.log("Asset loading complete. "+failed+" files failed to load.");
		this.ready = true;
	}
}
