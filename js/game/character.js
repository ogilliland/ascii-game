function Character(width, height, depth) {
    this.position = new Vector();
    this.velocity = new Vector();
    this.acceleration = 1;
    this.maxSpeed = 2;
    this.friction = 0.5; // multiplier for speed
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

    this.move = function(direction) {
        // update velocity
        self.velocity.x += direction.x * self.acceleration;
        self.velocity.y += direction.y * self.acceleration;
        // limit max speed in the x-y plane
        var planeVelocity = new Vector(self.velocity.x, self.velocity.y, 0);
        if(planeVelocity.length() > self.maxSpeed) {
            planeVelocity = planeVelocity.unit().multiply(self.maxSpeed);
        }
        self.velocity.x = planeVelocity.x;
        self.velocity.y = planeVelocity.y;
        // update sprite angle
        self.sprite.angle = direction.toAngles().phi - Math.PI/2;
    }

    this.update = function() {
        if(self.sprite.ready) {
            var height = self.sprite.data.size[2];
            var target = raycast(self.position.add(new Vector(0, 0, height)), new Vector(0, 0, -1), self.maxSpeed*4, scene.voxelTest);
            if(target.length > 0) {
                var depth = Math.round(target[target.length-1].depth);
                if(depth <= height) {
                    self.position.z += height - depth
                    self.velocity.z = 0;
                } else if(depth > 1) {
                    self.velocity.z -= 1;
                }
            } else {
                self.velocity.z -= 1;
            }
        }
        // update position and velocity
        self.position = self.position.add(self.velocity);
        self.velocity = self.velocity.multiply(self.friction);
    }
}