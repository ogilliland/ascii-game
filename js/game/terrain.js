function Terrain(width, height, depth, scale) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.scale = scale;
    this.lightDir = new Vector(1, 1, 0).unit();
    this.position = new Vector();
    // bits 0 - 3  : color
    // bits 4 - 7  : bgColor
    // bits 8 - 15 : glyph
    this.map = new Uint16Array(width*height*depth);
    var self = this;

    this.set = function(vector, voxel) {
        if(vector.x >= 0 && vector.x < self.width && vector.y >= 0 && vector.y < self.height && vector.z >= 0 && vector.z < self.depth) {
            self.map[vector.x + vector.y*self.width + vector.z*self.width*self.height] = voxel;
        } else {
            // ERROR - out of range
        }
    }

    self.get = function(vector) {
        if(vector.x >= 0 && vector.x < self.width && vector.y >= 0 && vector.y < self.height && vector.z >= 0 && vector.z < self.depth) {
            return self.map[vector.x + vector.y*self.width + vector.z*self.width*self.height];
        } else {
            // ERROR - out of range
            return null;
        }
    }

    // convert world coordinates to local coordinates
    self.toLocal = function(vector) {
        return vector.subtract(self.position);
    }

    // check if voxel exists at these coordinates
    self.isSolid = function(vector) {
        return self.get(vector) > 0;
    }

    this.noise = new SimplexNoise("seed");
    for(var y = 0; y < this.height; y++) {
        for(var x = 0; x < this.width; x++) {
            for(var z = 0; z < this.depth; z++) {
                // noise tanges from -1 to 1; we need from 0 to 1
                // delta is the amount of terrain above the current voxel
                var delta = Math.max(0, 0.5*(this.noise.noise2D(x/this.scale, y/this.scale) + 1) - z/this.depth);
                var above = Math.round(delta*this.depth);
                var gradientX = new Vector(1, 0, this.depth*(this.noise.noise2D((x+0.5)/this.scale, (y-0.5)/this.scale) - this.noise.noise2D((x-0.5)/this.scale, (y-0.5)/this.scale)));
                var gradientY = new Vector(0, 1, this.depth*(this.noise.noise2D((x-0.5)/this.scale, (y-0.5)/this.scale) - this.noise.noise2D((x-0.5)/this.scale, (y+0.5)/this.scale)));
                var faceNormal = gradientX.cross(gradientY).unit();
                // defaults
                var color = 0;
                var bgColor = 0;
                var glyph = 0;
                if(above > randbetween(5, 7)) {
                    // stone
                    color = 2;
                    bgColor = 1;
                    var rand = Math.random();
                    if(rand < 0.5) {
                        glyph = 176;
                    } else if(rand < 0.8) {
                        glyph = 177;
                    } else {
                        glyph = 178;
                    }
                } else if(above > 1) {
                    // mud
                    color = 5;
                    bgColor = 6;
                    var rand = Math.random();
                    if(rand < 0.5) {
                        glyph = 141;
                    } else {
                        glyph = 176;
                    }
                } else if(above > 0) {
                    // grass
                    color = 15;
                    var lightIntensity = faceNormal.dot(this.lightDir);
                    if(lightIntensity < 0) {
                        color = 5;
                    }
                    bgColor = 14;
                    glyph = 0;
                    if (Math.abs(lightIntensity) > 0.5) {
                        glyph = 30;
                        if(lightIntensity < 0) glyph = 31;
                    } else if (Math.abs(lightIntensity) > 0.25) {
                        glyph = 43;
                    } else if (Math.abs(lightIntensity) > 0.1) {
                        glyph = 37;
                    } else if(Math.abs(lightIntensity) > 0.05) {
                        glyph = 44;
                    } else if(Math.abs(lightIntensity) > 0.025) {
                        glyph = 46;
                    }
                }
                var voxel = color << 12 | bgColor << 8 | glyph;
                this.set(new Vector(x, y, z), voxel);
            }
        }
    }
}