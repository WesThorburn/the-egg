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