function Sprite() {
	this.data = {};
	this.ready = false;
	var self = this;

	this.get = function(position, face = new Vector(0, 0, 1)) {
		if(self.ready) {
			var x = position.x + self.data.origin[0];
            var y = position.y + self.data.origin[1];
            var z = position.z + self.data.origin[2];
            if(face.x != 0) {
            	// draw sprite on the y-z plane
            	var direction = "+x";
            	if(face.x < 0) {
            		direction = "-x";
            	}
            	if(y >= 0 && y < self.data.size[1] && z >= 0 && z < self.data.size[2]) {
            		// voxel exists in sprite
            		return self.data.voxels[direction][y + z*self.data.size[1]];
            	}
            } else if (face.y != 0) {
            	// draw sprite on the x-z plane
            	var direction = "+y";
            	if(face.y < 0) {
            		direction = "-y";
            	}
            	if(x >= 0 && x < self.data.size[0] && z >= 0 && z < self.data.size[2]) {
            		// voxel exists in sprite
            		return self.data.voxels[direction][x + z*self.data.size[0]];
            	}
            } else {
            	// draw sprite on the x-y plane
            	var direction = "+z";
            	if(face.z < 0) {
            		direction = "-z";
            	}
            	if(x >= 0 && x < self.data.size[0] && y >= 0 && y < self.data.size[1]) {
            		// voxel exists in sprite
            		return self.data.voxels[direction][x + y*self.data.size[0]];
            	}
            }
        } else {
            return 0;
        }
	}

	this.load = function(url) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				self.onReady(xhttp.responseText);
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}

	this.onReady = function(data) {
		self.data = JSON.parse(data);
		self.ready = true;
	}
}