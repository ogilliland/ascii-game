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

				var target = ray(
					Math.round(start.x),
					Math.round(start.y), 
					Math.round(start.z), 
					Math.round(end.x), 
					Math.round(end.y), 
					Math.round(end.z)
				);

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

				var offset = new Vector();
				offset = offset.add(this.right.multiply(x - this.width/2));
				offset = offset.add(this.up.multiply(y - this.height/2));

				var start = this.position.add(offset);
				start = start.add(this.direction.multiply(this.thresholdMin));
				var end = this.position.add(offset);
				end = end.add(this.direction.multiply(this.thresholdMax));

				var target = ray(
					Math.round(start.x),
					Math.round(start.y), 
					Math.round(start.z), 
					Math.round(end.x), 
					Math.round(end.y), 
					Math.round(end.z)
				);

				ctx.fillStyle = COLORS[target];
				ctx.fillRect(x*VOXEL_SIZE, y*VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
			}
		}
	}
}

function ray(x1, y1, z1, x2, y2, z2) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	var dz = z2 - z1;
	var x_inc = (dx < 0) ? -1 : 1;
	var l = Math.abs(dx);
	var y_inc = (dy < 0) ? -1 : 1;
	var m = Math.abs(dy);
	var z_inc = (dz < 0) ? -1 : 1;
	var n = Math.abs(dz);
	var dx2 = l * 2;
	var dy2 = m * 2;
	var dz2 = n * 2;

	var x = x1, y = y1, z = z1;

	if ((l >= m) && (l >= n)) {
		var err_1 = dy2 - l;
		var err_2 = dz2 - l;
		for (var i = 0; i < l; i++) {
			
			// return first non-air block encountered
			if(terrain.world(x, y, z) > 0) {
				return terrain.world(x, y, z);
			}

			if (err_1 > 0) {
				y += y_inc;
				err_1 -= dx2;
			}
			if (err_2 > 0) {
				z += z_inc;
				err_2 -= dx2;
			}
			err_1 += dy2;
			err_2 += dz2;
			x += x_inc;
		}
	} else if ((m >= l) && (m >= n)) {
		err_1 = dx2 - m;
		err_2 = dz2 - m;
		for (i = 0; i < m; i++) {
		   	
		   	// return first non-air block encountered
			if(terrain.world(x, y, z) > 0) {
				return terrain.world(x, y, z);
			}

			if (err_1 > 0) {
				x += x_inc;
				err_1 -= dy2;
			}
			if (err_2 > 0) {
				z += z_inc;
				err_2 -= dy2;
			}
			err_1 += dx2;
			err_2 += dz2;
			y += y_inc;
		}
	} else {
		err_1 = dy2 - n;
		err_2 = dx2 - n;
		for (i = 0; i < n; i++) {
			
			// return first non-air block encountered
			if(terrain.world(x, y, z) > 0) {
				return terrain.world(x, y, z);
			}

			if (err_1 > 0) {
				y += y_inc;
				err_1 -= dz2;
			}
			if (err_2 > 0) {
				x += x_inc;
				err_2 -= dz2;
			}
			err_1 += dy2;
			err_2 += dx2;
			z += z_inc;
		}
	}

	return 0;
}