function Character(width, height, depth) {
    this.position = new Vector();
    this.position.z = scene.depth*3/4;
    var self = this;

    this.get = function(vector) {
        if(vector.x == 1 && vector.y == 1 && vector.z == 0){
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

    this.setPos = function(vector) {
        self.position = vector;
    }
}