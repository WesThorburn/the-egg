var Camera = function(ctx, camera){
	var self = {};
	self.x = 0;
	self.y = 0;
	self.spdX = 0;
	self.spdY = 0;
	self.width = camera.width;
	self.height = camera.height;
	self.ctx = ctx;
	self.trackingId; //Id of object (player) camera is tracking

	self.update = function(){
		var windowSizeOffset = {x: window.innerWidth / widthScaleFactor / 2, y: window.innerHeight / heightScaleFactor / 2};
		var player = Player.list[self.trackingId];

		if(self.trackingId){
			//Smooth camera tracking
			if(self.spdX > -10 && self.spdX < 10){
				self.x = player.x - windowSizeOffset.x;
			}
			if(self.spdY > -10 && self.spdY < 10){
				self.y = player.y - windowSizeOffset.y;
			}
		}
	}
	
	self.getRelPos = function(entAttr){
		var relX = entAttr.x - self.x;
		var relY = entAttr.y - self.y;
		
		return{
			x: relX,
			y: relY
		}
	}
	
	self.getPos = function(){
		return{
			x: self.x,
			y: self.y
		}
	}
	
	self.getSize = function(){
		return{
			width: self.width,
			height: self.height
		}
	}

	return self;
}