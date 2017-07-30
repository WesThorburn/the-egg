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
	self.playerImage = "img/bird-front.png";
	self.turningLeft = 0;
	self.turningRight = 0;
	self.turnFrame = 0;
	self.turnAnimationFinished = 0;
	self.spawning = 1;
	self.spawnFrame = 0;
	self.walkFrame = 0;

	self.update = function(){
		self.updateSpeed();
		self.updatePosition();
	}

	self.updateSpeed = function(){
		if(!self.spawning){
			var accelerationFactor = self.maxSpd/5;
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
		    	if(!self.turnAnimationFinished){
		    		self.turningLeft = 1;
		    	}

		        if ((self.spdX - accelerationFactor)> -self.maxSpd) {
		            self.spdX = (self.spdX - accelerationFactor) * diagonalSpeedModifier;
		        }
		        else{
		        	self.spdX = -self.maxSpd * diagonalSpeedModifier;
		        }
		    }
		    if (self.pressingRight) {
		    	if(!self.turnAnimationFinished){
		    		self.turningRight = 1;
		    	}
		        if((self.spdX + accelerationFactor) < self.maxSpd){
		            self.spdX = (self.spdX + accelerationFactor) * diagonalSpeedModifier;
		        }
		        else{
		        	self.spdX = self.maxSpd * diagonalSpeedModifier;
		        }
		    }

		    if(!self.pressingLeft){
		    	self.turningLeft = 0;
		    }
		    if(!self.pressingRight){
		    	self.turningRight = 0;
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

		    if(self.spdX < 2 && self.spdX > -2){
		    	self.turnAnimationFinished = 0;
		    }
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

		if(!self.spawning){
			if(self.turningLeft && !self.turnAnimationFinished){
				self.turnFrame++;
				self.playerImage = "img/animations/character/turnLeft/turnLeft-" + self.turnFrame + ".png";
			}
			else if(self.turningRight && !self.turnAnimationFinished){
				self.turnFrame++;
				self.playerImage = "img/animations/character/turnRight/turnRight-" + self.turnFrame + ".png";
			}
			else if(!self.turningLeft && !self.turningRight && self.turnAnimationFinished){
				self.walkFrame++;
				if(self.spdX <= 0){
					self.playerImage = "img/animations/character/walkLeft/walkLeft-" + self.walkFrame + ".png";
				}
				else if(self.spdX > 0){
					self.playerImage = "img/animations/character/walkRight/walkRight-" + self.walkFrame + ".png";
				}
			}

			if(self.turnFrame == 5){
		    	self.turnFrame = 0;
		    	self.turnAnimationFinished = 1;
		    	if(self.turningLeft){
		    		self.turningLeft = 0;
		    	}
		    	else if(self.turningRight){
		    		self.turningRight = 0;
		    	}
			}
			if(self.walkFrame == 5){
				self.walkFrame = 0;
			}
		}
		else if(self.spawning){
			self.spawnFrame++;
			self.playerImage = "img/animations/character/spawn/spawn-" + self.spawnFrame + ".png";

			if(self.spawnFrame == 27){
				self.spawning = 0;
			}
		}
		
		if(self.playerImage){
			var image = new Image();
			image.src = self.playerImage;
			ctx.drawImage(image, rPos.x, rPos.y);
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