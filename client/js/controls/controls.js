var userTestMode = false;
var testModeInterval;

document.onkeydown = function(event){
	if(inGame){
		if([68, 83, 65, 87, 82, 32, 19, 220, 37, 38, 39, 40].indexOf(event.keyCode) != -1){
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
			else if(event.keyCode == 220){//insert key
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