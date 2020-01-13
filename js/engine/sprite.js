function Sprite() {
	this.data = {};
	this.ready = false;
	var self = this;

	this.get = function(horizontal, vertical, face = new Vector(0, 0, 1)) {
		if(self.ready) {
			// TO DO - read voxels from self.data
			if(horizontal == 0 && vertical == 0) {
            	return 4 << 12 | 2;
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