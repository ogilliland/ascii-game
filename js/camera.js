function Camera() {
	this.aspect = 9/16;
	this.aov = 40 * Math.PI / 180; // horizontal angle of view in radians
	this.thresholdMin = 2;
	this.thresholdMax = 512;

	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.setPos = function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	this.render = function(ctx) {
		for(var y = 0; y <= this.height; y++) {
			for(var x = 0; x <= this.width; x++) {

				var x1 = this.x;
				var y1 = this.y;
				var z1 = this.z;

				var x2 = this.thresholdMax * Math.tan((x/this.width)*this.aov - this.aov/2);
				var y2 = this.thresholdMax * Math.tan((y/this.height)*this.aov*this.aspect - this.aov*this.aspect/2);
				var z2 = this.thresholdMax * -1;

				var target = ray(x1, y1, z1, x2, y2, z2);

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
			if(terrain.get(x, y, z) > 0) {
				return terrain.get(x, y, z);
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
			if(terrain.get(x, y, z) > 0) {
				return terrain.get(x, y, z);
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
			if(terrain.get(x, y, z) > 0) {
				return terrain.get(x, y, z);
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
}