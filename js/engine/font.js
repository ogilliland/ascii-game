function Font() {
	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = 0;
	this.canvas.height = 0;
	this.colors = 16;
	this.glyphs = 16; // per row or column
	this.glyphSize = 0;
	this.ready = false;
	var self = this;

	var resources = new Resources();
	resources.load([
	    "img/colors.png",
	    "img/font.png"
	]);
	resources.onReady(function() {
		self.glyphSize = resources.get("img/font.png").width / self.glyphs;
		self.canvas.width = self.colors * resources.get("img/font.png").width;
		self.canvas.height = self.colors * resources.get("img/font.png").height;
		// force nearest neighbour interpolation
		self.ctx.webkitImageSmoothingEnabled = false;
		self.ctx.mozImageSmoothingEnabled = false;
		self.ctx.msImageSmoothingEnabled = false;
		self.ctx.imageSmoothingEnabled = false;
		// create texture map
		// draw colors
		self.ctx.drawImage(resources.get("img/colors.png"), 0, 0, self.canvas.width, self.canvas.height);
		// create temporary canvas to store colorized font
		var temp = document.createElement("canvas");
		var tempCtx = temp.getContext("2d");
		temp.width = self.glyphs * self.glyphSize;
		temp.height = self.glyphs * self.glyphSize;
		for(var color = 0; color < self.colors; color++) {
			// draw color
			tempCtx.globalCompositeOperation = "source-over";
			tempCtx.webkitImageSmoothingEnabled = false;
			tempCtx.mozImageSmoothingEnabled = false;
			tempCtx.msImageSmoothingEnabled = false;
			tempCtx.imageSmoothingEnabled = false;
			tempCtx.drawImage(resources.get("img/colors.png"), color, 0, 1, 1, 0, 0, temp.width, temp.height);
			// draw font
			tempCtx.globalCompositeOperation = "destination-in";
			tempCtx.drawImage(resources.get("img/font.png"), 0, 0, temp.width, temp.height);
			var pattern = self.ctx.createPattern(temp, "repeat");
			self.ctx.fillStyle = pattern;
  			self.ctx.fillRect(0, color*self.glyphs*self.glyphSize, self.canvas.width, self.glyphs*self.glyphSize);
		}
		self.ready = true;
	});

	this.drawGlyph = function(ctx, x, y, color, bgColor, char) {
		if(self.ready) {
			var glyphX = bgColor*self.glyphs*self.glyphSize + (char%self.glyphs)*self.glyphSize;
			var glyphY = color*self.glyphs*self.glyphSize + Math.floor(char/self.glyphs)*self.glyphSize;
			ctx.drawImage(self.canvas, glyphX, glyphY, self.glyphSize, self.glyphSize, x, y, VOXEL_SIZE, VOXEL_SIZE);
		}
	}
}

function Resources() {
	this.resourceCache = {};
    this.loading = [];
    this.readyCallbacks = [];
    var self = this;

    _load = function(url) {
        if(self.resourceCache[url]) {
            return self.resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                self.resourceCache[url] = img;

                if(self.isReady()) {
                    self.readyCallbacks.forEach(function(func) { func(); });
                }
            };
            self.resourceCache[url] = false;
            img.src = url;
        }
    }

    // load an image url or an array of image urls
    this.load = function(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    this.get = function(url) {	
        return self.resourceCache[url];
    }

    this.isReady = function() {
        var ready = true;
        for(var k in self.resourceCache) {
            if(self.resourceCache.hasOwnProperty(k) && !self.resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    this.onReady = function(func) {
    	self.readyCallbacks.push(func);
    }
}