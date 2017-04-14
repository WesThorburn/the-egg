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