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