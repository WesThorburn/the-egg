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