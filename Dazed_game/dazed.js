var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
canvas.width = windowWidth * 0.99;
canvas.height = windowHeight * 0.99;
var windowCX = canvas.width/2;
var windowCY = canvas.height/2;
var windowA = 0;
//////////////////
var entity;
var entityBar = 0;
var level = 0;
var entityRad = ((canvas.width<canvas.height)?canvas.width/3:canvas.height/3);
//////////////////
var polygons = [];
var polySide = 6;
var polygonWait = 100;
var polygonWaitCount = 0;
var lineWidthJumpWait = 50;
var lineWidthJumpCount = 0;
var lineFlag = 0;
var polygonLineWidth = 1;
//////////////////
var backRad = (windowWidth > windowHeight)?windowWidth/2+canvas.width/30:windowHeight/2+canvas.height/30;
var colors = ["red","blue","yellow","green","grey","purple"];
var colors2 = ["rgba(40,0,0,1)","rgba(80,0,0,1)","rgba(120,0,0,1)","rgba(160,0,0,1)","rgba(200,0,0,1)","rgba(240,0,0,1)"];
var colors3 = ["#FFFFFF","#FFCCFF","#FF99FF","#FF66FF","#FF33FF","#FF00FF"];
var colorCode = ["FF","CC","99","66","33","00"];
var colorCode2 = ["FF","EE","DD","CC","BB","AA","99","88","77","66","55","44","33","22","11","00"];
var colorShift2 = 0;
var colorShift1 = 0;
var colorShift3 = false;
var colorShift4 = false;
var colorChangeControlFlag = 0;
var colorChangeMax = 4;
//////////////////
var pressedKey = -1;
var gameInterval;
//////////////////

canvas.style.position = "absolute";
canvas.style.left = (windowWidth - canvas.width)/2;
canvas.style.top = (windowHeight - canvas.height)/2;

window.addEventListener("keydown",keyPress);
window.addEventListener("keyup",keyRelease);
window.addEventListener("click",firefoxOScontrol);

function keyPress(e) {
	pressedKey = e.keyCode;
	console.log(pressedKey);
}

function keyRelease(e) {
	pressedKey = -1;
}

function firefoxOScontrol(e) {
	if(e.clientX<(windowWidth/2))
		pressedKey = 37;
	else
		pressedKey = 39;
}

function entityPar() {
	this.a = windowA + (360/polySide)/2; 
	this.x = windowCX + ((canvas.width<canvas.height)?canvas.width/3:canvas.height/3)*Math.cos(this.a*Math.PI/180);
	this.y = windowCY + ((canvas.width<canvas.height)?canvas.width/3:canvas.height/3)*Math.sin(this.a*Math.PI/180);
	this.r = (windowWidth < windowHeight)?windowWidth*0.01:windowHeight*0.01;
	this.c = "rgba(0,0,0,1)";
}

function polygonPar() {
	this.x = windowCX;
	this.y = windowCY;
	this.r = 1;//5 * entity.r;
	this.c = "rgba(0,0,0,1)";
	this.s = 6;  //sides
	this.w = entity.r * 5;  //width
	this.mbar = Math.floor(Math.random() * polySide);  //missing bar < s
}

function entitySpawn() {
	entity = new entityPar();
}

function polygonSpawn() {
	polygons.push(new polygonPar());
}

function polygonDestruct() {
	polygons.shift();
	level--;
}

function entityRender() {
	ctx.beginPath();
	ctx.fillStyle = entity.c;
	ctx.arc(entity.x,entity.y,entity.r,0,2*Math.PI);
	ctx.fill();
	ctx.closePath();
}

function polygonRender() {
	for(var i=0;i<polygons.length;i++) {
		for(var j=0;j<polySide;j++) {
			if(polygons[i].mbar == j)
				continue;
			ctx.beginPath();
			ctx.moveTo(windowCX+polygons[i].r*Math.cos((windowA+j*360/polySide)*Math.PI/180),windowCY+polygons[i].r*Math.sin((windowA+j*360/polySide)*Math.PI/180));
			j++;
			ctx.lineTo(windowCX+polygons[i].r*Math.cos((windowA+j*360/polySide)*Math.PI/180),windowCY+polygons[i].r*Math.sin((windowA+j*360/polySide)*Math.PI/180));
			j--;
			ctx.strokeStyle = polygons[i].c;
			ctx.lineWidth = polygonLineWidth;
			ctx.stroke();
			ctx.closePath();
		}
		//polygons[i].lw -= 1;
		if(polygons[i].r >= (backRad-15)) {
			polygonDestruct();
			break;
		}
		polygons[i].r+=2;
	}
	/*if(lineFlag == 1) {
		lineFlag = 0;
		lineWidthJumpCount = 0;
	}*/
}

function entityUpdate() {
	if(pressedKey == 37) {
		entity.a -= 360/polySide;
		pressedKey = -1;
		entityBar--;
		if(entityBar<0)
			entityBar = polySide-1;
	} else if(pressedKey == 39) {
		entity.a += 360/polySide;
		pressedKey = -1;
		entityBar++;
		if(entityBar>=polySide)
			entityBar = 0;
	}

	entity.x = windowCX + ((canvas.width<canvas.height)?canvas.width/3:canvas.height/3)*Math.cos(entity.a*Math.PI/180);
	entity.y = windowCY + ((canvas.width<canvas.height)?canvas.width/3:canvas.height/3)*Math.sin(entity.a*Math.PI/180);
}

function entityCollisionCheck() {
	if(entityBar != polygons[level].mbar && (polygons[level].r*Math.cos(360/polySide/2 * Math.PI / 180)) >= (entityRad-5) && (polygons[level].r*Math.cos(360/polySide/2 * Math.PI / 180)) <= (entityRad+5)) {
		clearInterval(gameInterval);
	}
	if((polygons[level].r*Math.cos(360/polySide/2 * Math.PI / 180)) > (entityRad+5)) {
		level++;
	}
}

function backgroundGen() {
	for(var i=0;i<polySide;i++) {
		ctx.beginPath();
		ctx.moveTo(windowCX,windowCY);
		ctx.lineTo(windowCX+backRad*Math.cos((windowA+i*360/polySide)*Math.PI/180),windowCY+backRad*Math.sin((windowA+i*360/polySide)*Math.PI/180));
		i++;
		ctx.lineTo(windowCX+backRad*Math.cos((windowA+i*360/polySide)*Math.PI/180),windowCY+backRad*Math.sin((windowA+i*360/polySide)*Math.PI/180));
		ctx.lineTo(windowCX,windowCY);
		i--;
		if(colorShift4 == false) {
			if(colorShift3 == false)
				ctx.fillStyle = "#"+colorCode2[colorShift1]+colorCode[i%6]+colorCode2[colorShift2];
			else if(colorShift3 == true)
				ctx.fillStyle = "#"+colorCode2[colorShift1]+colorCode[i%6]+colorCode2[colorCode2.length-1-colorShift2];
		} else if(colorShift4 == true) {
			if(colorShift3 == false)
				ctx.fillStyle = "#"+colorCode2[colorCode2.length-1-colorShift1]+colorCode[i%6]+colorCode2[colorShift2];
			else if(colorShift3 == true)
				ctx.fillStyle = "#"+colorCode2[colorCode2.length-1-colorShift1]+colorCode[i%6]+colorCode2[colorCode2.length-1-colorShift2];
		} 
		ctx.fill();
		ctx.closePath();
	}
	colorChangeControlFlag++;
	if(colorChangeControlFlag == colorChangeMax) {
	/////////////////////
	colorChangeControlFlag = 0;
	colorShift2++;
		if(colorShift2 == colorCode2.length) {
			colorShift2 = 0;
			colorShift1++;
			if(colorShift1 == colorCode2.length) {
				colorShift1 = 0;
				colorShift4 = !colorShift4;
			}
			colorShift3 = !colorShift3;
		}
	/////////////////////
	}
}

function gameframe() {
	//ctx.clearRect(0,0,canvas.width,canvas.height);
	polygonWaitCount++;
	//lineWidthJumpCount++;
	polygonLineWidth+=0.1;
	if(polygonLineWidth >= 5) {
		polygonLineWidth = 1;
	}
	if(polygonWait == polygonWaitCount) {
		polygonWaitCount = 0;
		polygonSpawn();
	}
	windowA += 0.5;
	entity.a += 0.5;
	entityUpdate();
	//if(level<polygons.length)
		//entityCollisionCheck();
	backgroundGen();
	polygonRender();
	entityRender();
}

gameInterval = setInterval(gameframe,17);

entitySpawn();
polygonSpawn();
gameframe();