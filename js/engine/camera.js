// TO DO - remove perspective camera
function PerspectiveCamera() {
	this.width = 0;
	this.height = 0;
	this.aspect = 9/16;
	this.aov = 40 * Math.PI / 180; // horizontal angle of view in radians
	this.thresholdMin = 2;
	this.thresholdMax = 512;
	this.position = new Vector();
	this.direction = new Vector();
	this.right = new Vector();
	this.up = new Vector();

	this.setPos = function(x, y, z) {
		this.position.x = x;
		this.position.y = y;
		this.position.z = z;
	}

	this.lookAt = function(x, y, z) {
		this.direction = new Vector(x, y, z).subtract(this.position).unit();
		this.right = new Vector(0, 0, 1).cross(this.direction).unit();
		this.up = this.right.cross(this.direction);
	}

	this.render = function(ctx) {
		for(var y = 0; y < this.height; y++) {
			for(var x = 0; x < this.width; x++) {

				var offset = this.direction;
				offset = offset.add(this.right.multiply(Math.tan((x/this.width)*this.aov - this.aov/2)));
				offset = offset.add(this.up.multiply(Math.tan((y/this.height)*this.aov*this.aspect - this.aov*this.aspect/2)));
				offset = offset.unit();

				var start = this.position.add(offset.multiply(this.thresholdMin));
				var end = this.position.add(offset.multiply(this.thresholdMax));

				var target = raycast(
					Math.round(start.x),
					Math.round(start.y), 
					Math.round(start.z), 
					Math.round(end.x), 
					Math.round(end.y), 
					Math.round(end.z)
				);

				// TO DO - update with texture glyphs from orthographic camera
				ctx.fillStyle = COLORS[target];
				ctx.fillRect(x*VOXEL_SIZE, y*VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
			}
		}
	}
}

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

	this.render = function(ctx) {
		for(var y = 0; y < self.height; y++) {
			for(var x = 0; x < self.width; x++) {

				var offset = new Vector();
				offset = offset.add(self.right.multiply(x - self.width/2));
				offset = offset.add(self.up.multiply(y - self.height/2));

				var start = self.position.add(offset);
				start = start.add(self.direction.multiply(self.thresholdMin));
				var end = self.position.add(offset);
				end = end.add(self.direction.multiply(self.thresholdMax));

				var target = raycast(
					Math.round(start.x),
					Math.round(start.y), 
					Math.round(start.z), 
					Math.round(end.x), 
					Math.round(end.y), 
					Math.round(end.z)
				);

				var color = (target & (15 << 12)) >>> 12;
				var bgColor = (target & (15 << 8)) >>> 8;
				var glyph = target & 255;
				font.drawGlyph(ctx, x*VOXEL_SIZE, y*VOXEL_SIZE, color, bgColor, glyph);
			}
		}
	}
}