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