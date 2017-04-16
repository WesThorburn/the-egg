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

		if(self.y > 800){
			self.y = 800;
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