var StaticObject = function(initPack){
	var self = {};
	self.id = initPack.id;
	self.parent = initPack.parent;
	self.type = initPack.type;
	self.x = initPack.x;
	self.y = initPack.y;
	self.width = 0;
	self.height = 0;
	self.angle = initPack.angle;
	self.hp = initPack.hp;
	self.collisions = false;
	self.image = "";
	self.animationFrame = 0;

	self.getAttr = function(){
		return {x:self.x, y:self.y}
	}

	self.draw = function(ctx, cam){
		var rPos = self.getAttr();
		var objectImage = document.getElementById(self.objectImage);
		ctx.drawImage(objectImage, rPos.x, rPos.y);
	}

	StaticObject.list[self.id] = self;
	return self;
}