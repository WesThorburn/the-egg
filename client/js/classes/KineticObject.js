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