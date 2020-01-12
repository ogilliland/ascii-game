function Character(width, height, depth) {
    this.position = new Vector();
    var self = this;

    this.get = function(position, face = new Vector(0, 0, 1)) {
        if(position.x == 0 && position.y == 0 && position.z == 0){
            return 4 << 12 | 1;
        } else {
            return 0;
        }
    }

    // convert world coordinates to local coordinates
    this.toLocal = function(position) {
        return position.subtract(self.position);
    }

    // check if voxel exists at these coordinates
    this.isSolid = function(position) {
        return self.get(position) > 0;
    }

    this.move = function(distance) {
        self.position = self.position.add(distance);
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