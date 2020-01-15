function Character(width, height, depth) {
    this.position = new Vector();
    this.sprite = new Sprite();
    this.sprite.load("data/sprite/player.json");
    var self = this;

    // convert world coordinates to local coordinates
    this.toLocal = function(position) {
        return position.subtract(self.position);
    }

    // check if voxel exists at these coordinates
    this.isSolid = function(position) {
        return self.get(position) > 0;
    }

    this.move = function(distance) {
        // update position
        self.position = self.position.add(distance);
        // update sprite angle
        self.sprite.angle = distance.toAngles().phi - Math.PI/2;
    }

    this.update = function() {
        self.position.z = scene.depth*3/4; // TO DO - remove
    }
}