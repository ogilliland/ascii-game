function Terrain(width, height, depth, scale) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.scale = scale;
    this.position = new Vector();
    // bits 0 - 3  : color
    // bits 4 - 7  : bgColor
    // bits 8 - 15 : glyph
    this.map = new Uint16Array(width*height*depth);

    this.set = function(vector, voxel) {
        if(vector.x >= 0 && vector.x < this.width && vector.y >= 0 && vector.y < this.height && vector.z >= 0 && vector.z < this.depth) {
            this.map[vector.x + vector.y*this.width + vector.z*this.width*this.height] = voxel;
        } else {
            // ERROR - out of range
        }
    }

    this.get = function(vector) {
        if(vector.x >= 0 && vector.x < this.width && vector.y >= 0 && vector.y < this.height && vector.z >= 0 && vector.z < this.depth) {
            return this.map[vector.x + vector.y*this.width + vector.z*this.width*this.height];
        } else {
            // ERROR - out of range
            return null;
        }
    }

    // convert world coordinates to local coordinates
    this.toLocal = function(vector) {
        return vector.subtract(this.position);
    }

    // check if voxel exists at these coordinates
    this.isSolid = function(vector) {
        return this.get(vector) > 0;
    }

    this.noise = new SimplexNoise("seed");
    for(var y = 0; y < this.height; y++) {
        for(var x = 0; x < this.width; x++) {
            for(var z = 0; z < this.depth; z++) {
                // noise tanges from -1 to 1; we need from 0 to 1
                // delta is the amount of terrain above the current voxel
                var delta = Math.max(0, 0.5*(this.noise.noise2D(x/this.scale, y/this.scale) + 1) - z/this.depth);
                var above = Math.round(delta*this.depth);
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
                    bgColor = 14;
                    var rand = Math.random();
                    if(rand < 0.5) {
                        glyph = 142;
                    }
                }
                var voxel = color << 12 | bgColor << 8 | glyph;
                this.set(new Vector(x, y, z), voxel);
            }
        }
    }
}