function Character(width, height, depth) {
    this.position = new Vector();
    this.speed = 2;
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
        if(self.sprite.ready) {
            var height = self.sprite.data.size[2];
            var target = raycast(self.position.add(new Vector(0, 0, height)), new Vector(0, 0, -1), self.speed*4, scene.voxelTest);
            if(target.length > 0) {
                var depth = Math.round(target[target.length-1].depth);
                console.log(depth);
                if(depth <= height) {
                    self.position.z += height - depth;
                } else if(depth > 1) {
                    self.position.z--;
                }
            } else {
                self.position.z--;
            }
        }
    }
}