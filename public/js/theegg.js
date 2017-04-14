var Camera = function(ctx, camera){
	var self = {};
	self.x = 0;
	self.y = 0;
	self.spdX = 0;
	self.spdY = 0;
	self.width = camera.width;
	self.height = camera.height;
	self.ctx = ctx;
	self.trackingId; //Id of object (player) camera is tracking

	self.update = function(){
		var windowSizeOffset = {x: window.innerWidth / widthScaleFactor / 2, y: window.innerHeight / heightScaleFactor / 2};
		var player = Player.list[self.trackingId];

		if(self.trackingId){
			//Smooth camera tracking
			if(self.spdX > -10 && self.spdX < 10){
				self.x = player.x - windowSizeOffset.x;
			}
			if(self.spdY > -10 && self.spdY < 10){
				self.y = player.y - windowSizeOffset.y;
			}
		}
	}
	
	self.getRelPos = function(entAttr){
		var relX = entAttr.x - self.x;
		var relY = entAttr.y - self.y;
		
		return{
			x: relX,
			y: relY
		}
	}
	
	self.getPos = function(){
		return{
			x: self.x,
			y: self.y
		}
	}
	
	self.getSize = function(){
		return{
			width: self.width,
			height: self.height
		}
	}

	return self;
}
var KineticObject = function(initPack){
	var self = {}; 
	self.id = initPack.id;
	self.x = initPack.x;
	self.y = initPack.y;
	self.radius = initPack.radius;
	self.length = initPack.length;
	self.width = initPack.width;
	self.angle = initPack.angle;
	self.spdX = initPack.spdX;
	self.spdY = initPack.spdY;
	self.totalLifeTime = initPack.travelTime;
	self.parent = initPack.parent;
	self.timeAlive = 0;
	self.animationFrame = 0;

	self.getAttr = function(){
		return{
			x: self.x + self.radius * Math.cos(self.angle * Math.PI / 180),
			y: self.y + self.radius * Math.sin(self.angle * Math.PI / 180),
		}
	}

	self.update = function(){
		if(self.timeAlive < self.totalLifeTime){
			self.timeAlive++;
			self.x += self.spdX;
			self.y += self.spdY;
		}
	}

	self.draw = function(ctx, cam){
		var rPos = cam.getRelPos(self.getAttr());
		var lineEndX = rPos.x + self.length * Math.cos(self.angle * Math.PI / 180)
		var lineEndY = rPos.y + self.length * Math.sin(self.angle * Math.PI / 180)
		drawLine(ctx, rPos.x, rPos.y, lineEndX, lineEndY, self.width);
	}

	KineticObject.list[self.id] = self;
	return self;
}
var Player = function(initPack){
	var self = {};
	self.id = initPack.id;
	self.x = initPack.x;
	self.y = initPack.y;
	self.spdX = 0;
	self.spdY = 0;
	self.playerAngle = initPack.playerAngle;
	self.score = 0;
	self.camera = initPack.camera;
	self.playerImage = "player-right";

	self.update = function(){
		self.x += Math.round(self.spdX);
		self.y += Math.round(self.spdY);

		if(self.y > 728){
			self.y = 728;
		}
	}

	self.getAttr = function(){
		return {x:self.x, y:self.y}
	}
	
	self.draw = function(ctx, cam){
		var rPos = cam.getRelPos(self.getAttr());
		if(self.spdX > 0){
			self.playerImage = "player-right";
		}
		else if(self.spdX < 0){
			self.playerImage = "player-left";
		}
		var playerImage = document.getElementById(self.playerImage);
		
		if(playerImage){
			ctx.drawImage(playerImage, rPos.x, rPos.y);
		}
		else{
			ctx.lineWidth = 1;
			ctx.strokeStyle = "#afafaf";
			drawCircle(ctx, rPos.x, rPos.y, 25);
		}
	}
	Player.list[self.id] = self;
	return self;
}
var StaticObject = function(initPack){
	var self = {};
	self.id = initPack.id;
	self.parent = initPack.parent;
	self.type = initPack.type;
	self.x = initPack.x;
	self.y = initPack.y;
	self.width = 0;
	self.height = 0;
	self.angle = initPack.angle;
	self.hp = initPack.hp;
	self.collisions = false;
	self.image = "";
	self.animationFrame = 0;

	self.getAttr = function(){
		return {x:self.x, y:self.y}
	}

	self.draw = function(ctx, cam){
		var rPos = self.getAttr();
		var objectImage = document.getElementById(self.objectImage);
		ctx.drawImage(objectImage, rPos.x, rPos.y);
	}

	StaticObject.list[self.id] = self;
	return self;
}
var DEBUG = true;
var selfId = "player";
var inGame = true;

Player.list = {};
KineticObject.list = {};
StaticObject.list = {};

var screenWidth;
var screenHeight;
var optimalAspectRatio = screenWidth/screenHeight;
var currentAspectRatio = window.innerWidth/window.innerHeight;
var widthScaleFactor = window.innerWidth/screenWidth;
var heightScaleFactor = window.innerHeight/screenHeight;

var xPosition = window.innerWidth/2;
var yPosition = window.innerHeight/2;
var hudXPosition = screenWidth/2;
var hudYPosition = screenHeight/2;

if(currentAspectRatio > optimalAspectRatio){
	yPosition = yPosition/widthScaleFactor*heightScaleFactor; //takes into account the "perspective" shift already done by the old resizing work
}
else if(currentAspectRatio < optimalAspectRatio){
	xPosition = xPosition/heightScaleFactor*widthScaleFactor; //takes into account the "perspective" shift already done by the old resizing work
}

var GAME_WIDTH = 10000;
var GAME_HEIGHT = 10000;
var ctx = document.getElementById('canvas').getContext('2d');

var mouseData = [0,0,0];
var newMouseData = [0,0,0];
var hudMouseData = [0,0];
var hoveringOnHud = false;
var click = {x:0, y:0};
var mouseDistance = 0;

var initPack = {id: selfId, x: 400, y: 148, playerAngle: 0, camera: {width:1366, height:768}};
player = new Player(initPack);
camera = new Camera(ctx, initPack.camera);
camera.trackingId = player.id;
screenWidth = camera.width;
screenHeight = camera.height;

$(window).resize(function(){ 
	resizeCanvas();
});

window.onbeforeunload = function(){
	if(inGame){
		return "You will be disconnected from the server and data may be lost. Are you sure?";
	}
};
function drawBackground(ctx, cam){
	var origin = cam.getRelPos({x:0, y:0});
	var limit = cam.getRelPos({x:GAME_WIDTH, y:GAME_HEIGHT});

	var backgroundImage = document.getElementById("homeImage");
	if(backgroundImage){
		ctx.drawImage(backgroundImage, origin.x, origin.y);
	}

	var grass1 = document.getElementById("grass");
	var grass2 = document.getElementById("grass2");
	var berries = document.getElementById("berries");

	ctx.drawImage(grass1, origin.x+85, origin.y+740);
	ctx.drawImage(grass2, origin.x+200, origin.y+740);
	ctx.drawImage(grass1, origin.x+540, origin.y+740);
	ctx.drawImage(berries, origin.x+400, origin.y+700);
	ctx.drawImage(grass1, origin.x+615, origin.y+740);
	ctx.drawImage(grass2, origin.x+800, origin.y+740);
}

function drawGrid(ctx, cam){
	var origin = cam.getRelPos({x:0, y:0});
	var limit = cam.getRelPos({x:GAME_WIDTH, y:GAME_HEIGHT});

	//Background layer
	ctx.fillStyle = '#efefef';
	ctx.fillRect(origin.x-9999,origin.y-9999, GAME_WIDTH+9999, GAME_HEIGHT+9999);

	//Game area
	ctx.fillStyle = '#f7f7f7';
	ctx.fillRect(origin.x,origin.y, GAME_WIDTH, GAME_HEIGHT);
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#e8e8e8';

	//Horizontal Loop
	for(i = 0; i <= GAME_WIDTH; i+= 20){
		if(i % 500 == 0){
			var lineWidth = 4;
		}
		else if(i % 100 == 0){
			var lineWidth = 2;
		}
		else{
			var lineWidth = 1;
		}
		drawLine(ctx, origin.x, origin.y + i, limit.x, origin.y + i, lineWidth);
	}
	//Vertical Loop
	for(i = 0; i <= GAME_HEIGHT; i+= 20){
		if(i % 500 == 0){
			var lineWidth = 4;
		}
		else if(i % 100 == 0){
			var lineWidth = 2;
		}
		else{
			var lineWidth = 1;
		}
		drawLine(ctx, origin.x + i, origin.y, origin.x + i, limit.y, lineWidth);
	}
}
var drawLine = function(ctx, originX, originY, destinationX, destinationY, lineWidth){
	if(lineWidth === undefined){ //Handle default values
		lineWidth = 1
	}

	ctx.lineWidth=lineWidth;
	ctx.beginPath();
	ctx.moveTo(originX, originY);
	ctx.lineTo(destinationX, destinationY);
	ctx.stroke();
}
var drawLineSeries = function(ctx, coOrds){
	for(var i = 0; i < coOrds.length; i++){
		if(i+1 >= coOrds.length){ //Reset to first co-ord if end has been reached
			var destCoOrdPosition = 0;
		}
		else{
			var destCoOrdPosition = i + 1;
		}
		var originCoOrdPosition = i;
		drawLine(ctx, coOrds[originCoOrdPosition][0], coOrds[originCoOrdPosition][1], coOrds[destCoOrdPosition][0], coOrds[destCoOrdPosition][1]);
	}
}
var drawRectangle = function(ctx, x, y, width, height){
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.stroke();
}
var drawHoverRectangle = function(ctx, xMin, xMax, yMin, yMax, outlineColor, hoverColor, selected){
	//Handle default values
	if(outlineColor === undefined){
		outlineColor = '#000000';
	}
	if(hoverColor === undefined){
		hoverColor = '#adacac';
	}
	if(selected === undefined){
		selected = false;
	}

	var squareDimensions = [
		[xMin, yMin],
		[xMax, yMin],
		[xMax, yMax],
		[xMin, yMax],
	];
	if(selected || hudMouseData[0] >= xMin && hudMouseData[0] <= xMax && hudMouseData[1] >= yMin && hudMouseData[1] <= yMax){
		ctx.fillStyle = hoverColor;
		ctx.fillRect(xMin,yMin, xMax-xMin, yMax-yMin);
	}
	ctx.strokeStyle = outlineColor;
	drawLineSeries(ctx, squareDimensions);
}
var drawCircle = function(ctx, x, y, radius){
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI); 
	ctx.stroke();
}
var drawEllipse = function(ctx, x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise){
	if(anticlockwise === undefined){ //Handle default values
		anticlockwise = false;
	}

	ctx.beginPath();
	ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
	ctx.stroke();
}
function drawHud(ctx){
	if(currentAspectRatio > 1 && currentAspectRatio < 2.6){
		var playerData = Player.list[selfId];

		ctx.fillStyle = '#e5e5e5';
		ctx.fillRect(0.005*hudXPosition, 1.925*hudYPosition, 0.04*hudXPosition, 0.067*hudYPosition);
	}
}

function drawDebugVariables(ctx){
	ctx.font = '14px Arial';
	ctx.fillStyle = 'red';
	
	var playerData = Player.list[selfId];
	ctx.fillText("Id: " + playerData.id, 0, 15);
	ctx.fillText("X: " + playerData.x, 0, 30);
	ctx.fillText("Y: " + playerData.y, 0, 45);
	ctx.fillText("SpdX: " + playerData.spdX, 0, 60);
	ctx.fillText("SpdY: " + playerData.spdY, 0, 75);
	ctx.fillText("Player Angle: " + playerData.playerAngle, 0, 90);
	ctx.fillText("Score: " + playerData.score, 0, 105);
	ctx.fillText("Camera Width: " + camera.width, 0, 120);
	ctx.fillText("Camera Height: " + camera.height, 0, 135);
	ctx.fillText("Camera X: " + camera.x, 0, 150);
	ctx.fillText("Camera Y: " + camera.y, 0, 165);
	ctx.fillText("Camera Tracking: " + camera.trackingId, 0, 180);

	ctx.fillStyle = '#F0FBFF';
	ctx.strokeStyle = '#BFBFBF';
	ctx.lineWidth = 1;
}
function resizeCanvas(camera){
	if(camera){
		if(screenWidth != camera.width && screenHeight != camera.height){
			screenWidth = camera.width;
			screenHeight = camera.height;
		}
		else{
			return;
		}
	}

	optimalAspectRatio = screenWidth/screenHeight;
	currentAspectRatio = window.innerWidth/window.innerHeight;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	xPosition = window.innerWidth/2;
	yPosition = window.innerHeight/2;

	widthScaleFactor = window.innerWidth/screenWidth;
	heightScaleFactor = window.innerHeight/screenHeight;

	if(currentAspectRatio > optimalAspectRatio){
		yPosition = yPosition/widthScaleFactor*heightScaleFactor; //takes into account the "perspective" shift already done by the old resizing work
		heightScaleFactor = widthScaleFactor;
	}
	else if(currentAspectRatio < optimalAspectRatio){
		xPosition = xPosition/heightScaleFactor*widthScaleFactor; //takes into account the "perspective" shift already done by the old resizing work
		widthScaleFactor = heightScaleFactor;
	}
	
	hudXPosition = (window.innerWidth/2)/widthScaleFactor;
	hudYPosition = (window.innerHeight/2)/heightScaleFactor;
	
	ctx.scale(widthScaleFactor, heightScaleFactor);
}
var userTestMode = false;
var testModeInterval;

document.onkeydown = function(event){
	if(inGame){
		if([68, 83, 65, 87, 82, 32, 19, 45, 37, 38, 39, 40].indexOf(event.keyCode) != -1){
			event.preventDefault();
			if(event.keyCode == 65){ //a
				Player.list[selfId].spdX = -5;
			}
			else if(event.keyCode == 68){ //d
				Player.list[selfId].spdX = 5;
			}
			else if(event.keyCode == 87){ //w
				Player.list[selfId].spdY = -5;
			}
			else if(event.keyCode == 83){ //s
				Player.list[selfId].spdY = 5;
			}
			else if(event.keyCode == 37){ //left arrow
				Player.list[selfId].spdX = -5;
			}
			else if(event.keyCode == 39){ //right arrow
				Player.list[selfId].spdX = 5;
			}
			else if(event.keyCode == 38){ //up arrow
				Player.list[selfId].spdY = -5;
			}
			else if(event.keyCode == 40){ //down arrow
				Player.list[selfId].spdY = 5;
			}
			else if(event.keyCode == 82){ //r
				console.log("R pressed");
			}
			else if(event.keyCode == 32){ //spacebar
				console.log("Space pressed");
			}
			else if(event.keyCode == 45){//insert key
				console.log("Insert Key pressed");
				DEBUG = !DEBUG;
				console.log("Going into debug mode");
			}
		}
	}
}
document.onkeyup = function(event){
	if(inGame){
		if([68, 83, 65, 87, 82, 32, 19, 45, 37, 38, 39, 40].indexOf(event.keyCode) != -1){
			event.preventDefault();
			if(event.keyCode == 65){ //a
				Player.list[selfId].spdX = 0;
			}
			else if(event.keyCode == 68){ //d
				Player.list[selfId].spdX = 0;
			}
			else if(event.keyCode == 87){ //w
				Player.list[selfId].spdY = 0;
			}
			else if(event.keyCode == 83){ //s
				Player.list[selfId].spdY = 0;
			}
			else if(event.keyCode == 37){ //left arrow
				Player.list[selfId].spdX = 0;
			}
			else if(event.keyCode == 39){ //right arrow
				Player.list[selfId].spdX = 0;
			}
			else if(event.keyCode == 38){ //up arrow
				Player.list[selfId].spdY = 0;
			}
			else if(event.keyCode == 40){ //down arrow
				Player.list[selfId].spdY = 0;
			}
			else if(event.keyCode == 82){
				//r
			}
			else if(event.keyCode == 32){
				//spacebar
			}
		}
	}
}
window.onblur = function(){
	if(inGame){
		console.log("blur detected");
	}
}
document.onmousedown = function(event){
	if(!$('#loginModal').is(':visible') && !$('#registerModal').is(':visible') && !$('#aboutModal').is(':visible') && !$('#privacyModal').is(':visible')){
		if(!hoveringOnHud && selfId){
			if(event.which == 1){
				console.log("Left clicked");
			}
			else if(event.which == 3){
				console.log("Right clicked");
			}
		}
		click = {x: event.clientX, y: event.clientY};
	}
}
document.onmouseup = function(event){
	if(!hoveringOnHud && selfId){
		if(event.which == 1){
			
		}
		else if(event.which == 3){
			
		}
	}
	click = {x: 0, y: 0};
}
document.onmousemove = function(event){
	if(selfId){
		var playerRelPosition = camera.getRelPos(Player.list[selfId].getAttr());
		var relativePlayerXPosition = playerRelPosition.x * widthScaleFactor;
		var relativePlayerYPosition = playerRelPosition.y * heightScaleFactor;

		var mouseAngle = Math.atan2(relativePlayerYPosition - event.clientY, relativePlayerXPosition - event.clientX) * 180 / Math.PI + 180;

		Player.list[selfId].playerAngle = Math.round(mouseAngle);
	}
	hudMouseData = [event.clientX, event.clientY];
}
!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/Windows Phone/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");if("undefined"!=typeof s[1]&&(r=s[0]),s=r.split("Twitter"),"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window)return this},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);
if(!isMobile.any){
	setInterval(function(){
	    gameloop();
	}, 16);

	resizeCanvas();

	function gameloop(){
		if(selfId != null){
			hoveringOnHud = false;
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
			camera.update();

			if(DEBUG){
				drawGrid(ctx, camera);
			}
			drawBackground(ctx, camera);
			
			ctx.clearRect(0, 0, ctx.width, ctx.height);

			for(var i in KineticObject.list){
				var kineticObject = KineticObject.list[i];
				kineticObject.update();
				kineticObject.draw(ctx, camera);
			}

			for(var i in StaticObject.list){
				StaticObject.list[i].draw(ctx, camera);
			}

			for(var i in Player.list){
				Player.list[i].update();
				Player.list[i].draw(ctx, camera);
			}

			if(DEBUG){
				drawDebugVariables(ctx);
			}
			else{
				drawHud(ctx);
			}
		}
	}
}
else{
	$('#mobileViewModal').modal();
}