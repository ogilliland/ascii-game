function Terrain(width, height, depth, scale) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.scale = scale;
    this.position = new Vector();
    this.map = new Uint8Array(width*height*depth);

    this.set = function(x, y, z, voxel) {
        if(x >= 0 && x < this.width && y >= 0 && y < this.height && z >= 0 && z < this.depth) {
            this.map[x + y*this.width + z*this.width*this.height] = voxel;
        } else {
            // ERROR - out of range
        }
    }

    this.get = function(x, y, z) {
        if(x >= 0 && x < this.width && y >= 0 && y < this.height && z >= 0 && z < this.depth) {
            return this.map[x + y*this.width + z*this.width*this.height];
        } else {
            // ERROR - out of range
            return null;
        }
    }

    // convert local coordinates to world coordinates
    this.world = function(x, y, z) {
        return this.get(x - this.position.x, y - this.position.y, z - this.position.z);
    }

    this.init = function() {
        this.noise = new SimplexNoise("seed");
        for(var y = 0; y < this.height; y++) {
            for(var x = 0; x < this.width; x++) {
                for(var z = 0; z < this.depth; z++) {
                    // noise tanges from -1 to 1; we need from 0 to 1
                    // delta is the amount of terrain above the current voxel
                    var delta = Math.max(0, 0.5*(this.noise.noise2D(x/this.scale, y/this.scale) + 1) - z/this.depth);
                    var above = Math.round(delta*this.depth);
                    if(above > randbetween(4, 6)) {
                        var voxel = 1;
                    } else if(above > randbetween(1, 2)) {
                        var voxel = 6;
                    } else if(above > 0) {
                        var voxel = 14;
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