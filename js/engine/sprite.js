function Sprite() {
	this.data = {};
	this.angle = 0;
	this.ready = false;
	var self = this;

	this.get = function(horizontal, vertical, face = "+y") {
		if(self.ready) {
			if(face == "+x" || face == "-x") {
				var h = horizontal + self.data.origin[1]; // y
				var v = vertical + self.data.origin[2]; // z
				var hMax = self.data.size[1];
				var vMax = self.data.size[2];
			} else if (face == "+y" || face == "-y") {
				var h = horizontal + self.data.origin[0]; // x
				var v = vertical + self.data.origin[2]; // z
				var hMax = self.data.size[0];
				var vMax = self.data.size[2];
			}
			if(h >= 0 && h < hMax && v >= 0 && v < vMax) {
            	return self.data.voxels[face][h + v*hMax];
            }
        } else {
            return 0;
        }
	}

	this.isSolid = function(horizontal, vertical, face) {
		if(self.ready) {
			if(face == "+x" || face == "-x") {
				var h = horizontal + self.data.origin[1]; // y
				var v = vertical + self.data.origin[2]; // z
				var hMax = self.data.size[1];
				var vMax = self.data.size[2];
			} else if (face == "+y" || face == "-y") {
				var h = horizontal + self.data.origin[0]; // x
				var v = vertical + self.data.origin[2]; // z
				var hMax = self.data.size[0];
				var vMax = self.data.size[2];
			}
			if(h >= 0 && h < hMax && v >= 0 && v < vMax) {
            	return self.data.solidMap[face][h + v*hMax];
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