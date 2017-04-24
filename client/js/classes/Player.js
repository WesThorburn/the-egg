var Player = function(initPack){
	var self = {};
	self.id = initPack.id;
	self.x = initPack.x;
	self.y = initPack.y;
	self.spdX = 0;
	self.spdY = 0;
	self.maxSpd = 5;
	self.friction = 0.96;
	self.playerAngle = initPack.playerAngle;
	self.score = 0;
	self.camera = initPack.camera;
	self.playerImage = "player-right";
	self.turningFrame = 1;

	self.update = function(){
		self.updateSpeed();
		self.updatePosition();
	}

	self.updateSpeed = function(){
		var accelerationFactor = self.maxSpd/20;
		var diagonalSpeedModifier = 1;
		if(self.pressingRight && self.pressingUp || 
			self.pressingRight && self.pressingDown || 
			self.pressingLeft && self.pressingUp || 
			self.pressingLeft && self.pressingDown){
			diagonalSpeedModifier = 0.9685;
		}
		if (self.pressingUp) {
	        if ((self.spdY - accelerationFactor) > -self.maxSpd) {
	            self.spdY = (self.spdY - accelerationFactor) * diagonalSpeedModifier;
	        }
	        else{
	        	self.spdY = -self.maxSpd * diagonalSpeedModifier;
	        }
	    }
	    if (self.pressingDown) {
	        if ((self.spdY + accelerationFactor) < self.maxSpd) {
	            self.spdY = (self.spdY + accelerationFactor) * diagonalSpeedModifier;
	        }
	        else{
	        	self.spdY = self.maxSpd * diagonalSpeedModifier;
	        }
	    }
	    if (self.pressingLeft) {
	        if ((self.spdX - accelerationFactor)> -self.maxSpd) {
	            self.spdX = (self.spdX - accelerationFactor) * diagonalSpeedModifier;
	        }
	        else{
	        	self.spdX = -self.maxSpd * diagonalSpeedModifier;
	        }
	    }
	    if (self.pressingRight) {
	        if((self.spdX + accelerationFactor) < self.maxSpd){
	            self.spdX = (self.spdX + accelerationFactor) * diagonalSpeedModifier;
	        }
	        else{
	        	self.spdX = self.maxSpd * diagonalSpeedModifier;
	        }
	    }

	    //Limit to max speed
	    if(self.spdX > self.maxSpd){
	    	self.spdX = self.maxSpd;
	    }
	    if(self.spdY > self.maxSpd){
	    	self.spdY = self.maxSpd;
	    }

	    self.spdX *= self.friction;
	    self.spdY *= self.friction;

	    //Reduce speed to 0 if already near zero
	    if(self.spdX < 0.1 && self.spdX > -0.1){
	    	self.spdX = 0;
	    }
	    if(self.spdY < 0.1 && self.spdY > -0.1){
	    	self.spdY = 0;
	    }
	}

	self.updatePosition = function(){
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