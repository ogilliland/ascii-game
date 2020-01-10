function Terrain(width, height, depth, scale) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.scale = scale;
    this.map = new Uint8Array(width*height*depth);

    this.set = function(x, y, z, voxel) {
        if(x > 0 && x < this.width && y > 0 && y < this.height && z > 0 && z < this.depth) {
            this.map[x + y*this.width + z*this.width*this.height] = voxel;
        } else {
            // ERROR - out of range
        }
    }

    this.get = function(x, y, z) {
        if(x > 0 && x < this.width && y > 0 && y < this.height && z > 0 && z < this.depth) {
            return this.map[x + y*this.width + z*this.width*this.height];
        } else {
            // ERROR - out of range
            return null;
        }
    }

    this.init = function() {
        this.noise = new SimplexNoise("seed");
        for(var y = 0; y < this.height; y++) {
            for(var x = 0; x < this.width; x++) {
                for(var z = 0; z < this.depth; z++) {
                    var delta = Math.max(0, this.noise.noise2D(x/this.scale, y/this.scale) - z/this.depth);
                    var above = Math.round(delta*this.depth);
                    if(above > 3) {
                        var voxel = 3;
                    } else if (above > 1) {
                        var voxel = 5;
                    } else if (above == 1) {
                        var voxel = 7;
                    } else {
                        var voxel = 0;
                    }
                    this.set(x, y, z, voxel);
                }
            }
        }
    }

    this.init();
}