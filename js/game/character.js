function Character(width, height, depth) {
    this.position = new Vector();
    var self = this;

    this.get = function(vector) {
        if(vector.x == 0 && vector.y == 0 && vector.z == 0){
            return 4 << 12 | 1;
        } else {
            return 0;
        }
    }

    // convert world coordinates to local coordinates
    this.toLocal = function(vector) {
        return vector.subtract(self.position);
    }

    // check if voxel exists at these coordinates
    this.isSolid = function(vector) {
        return self.get(vector) > 0;
    }

    this.move = function(vector) {
        self.position = self.position.add(vector);
        // force voxel position to whole integer values
        // to prevent flickering of player sprite
        self.position.x = Math.round(self.position.x);
        self.position.y = Math.round(self.position.y);
        self.position.z = Math.round(self.position.z);
    }

    this.update = function() {
        self.position.z = scene.depth*3/4; // TO DO - remove
    }
}