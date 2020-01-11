function OrthographicCamera() {
	this.width = 0;
	this.height = 0;
	this.thresholdMin = 2;
	this.thresholdMax = 512;
	this.position = new Vector();
	this.direction = new Vector();
	this.right = new Vector();
	this.up = new Vector();
	var self = this;

	this.setContext = function(ctx) {
		self.ctx = ctx;
	}

	this.resize = function() {
		self.ctx.canvas.width = window.innerWidth; // px
		self.ctx.canvas.height = window.innerHeight; // px

		self.ctx.webkitImageSmoothingEnabled = false;
		self.ctx.mozImageSmoothingEnabled = false;
		self.ctx.msImageSmoothingEnabled = false;
		self.ctx.imageSmoothingEnabled = false;

		self.width = self.ctx.canvas.width / VOXEL_SIZE + 1; // voxels
		self.height = self.ctx.canvas.height / VOXEL_SIZE + 1; // voxels
	}

	this.refresh = function() {
		self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
	}

	this.setPos = function(x, y, z) {
		self.position.x = x;
		self.position.y = y;
		self.position.z = z;
	}

	this.lookAt = function(x, y, z) {
		self.direction = new Vector(x, y, z).subtract(self.position).unit();
		self.right = new Vector(0, 0, 1).cross(self.direction).unit();
		self.up = self.right.cross(self.direction);
	}

	this.render = function() {
		for(var y = 0; y < self.height; y++) {
			for(var x = 0; x < self.width; x++) {

				var offset = new Vector();
				offset = offset.add(self.right.multiply(x - self.width/2));
				offset = offset.add(self.up.multiply(y - self.height/2));

				var start = self.position.add(offset);
				start = start.add(self.direction.multiply(self.thresholdMin));
				var end = self.position.add(offset);
				end = end.add(self.direction.multiply(self.thresholdMax));

				var target = raycast(start, self.direction, self.thresholdMax, scene.voxelTest);

				var color = (target & (15 << 12)) >>> 12;
				var bgColor = (target & (15 << 8)) >>> 8;
				var glyph = target & 255;
				font.drawGlyph(self.ctx, x*VOXEL_SIZE, y*VOXEL_SIZE, color, bgColor, glyph);
			}
		}
	}
}