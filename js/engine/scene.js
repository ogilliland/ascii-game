function Scene(width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.children = [];
    var self = this;

    this.addChild = function(object) {
        self.children.push(object);
    }

    this.voxelTest = function(position, face) {
        for(var i = 0; i < self.children.length; i++) {
            if(!self.children[i].hasOwnProperty("sprite")) {
                var between = camera.position.subtract(position);
                return {
                    "depth": -1*between.dot(camera.direction),
                    "isSolid": self.children[i].isSolid(self.children[i].toLocal(position)),
                    "voxel": self.children[i].get(self.children[i].toLocal(position), face)
                };
            }
        }
        return {
            "depth": Infinity,
            "isSolid": 0,
            "voxel": 0
        };
    }

    this.spriteTest = function(start, direction, right, up) {
        for(var i = 0; i < self.children.length; i++) {
            if(self.children[i].hasOwnProperty("sprite")) {
                var between = start.subtract(self.children[i].position);
                var depth = -1*between.dot(direction);
                var horizontal = Math.round(between.dot(right));
                var vertical = Math.round(between.dot(up));
                // calculate direction from camera angle
                // TO DO - offset by sprite angle
                var betweenUnit = between.unit();
                var a = betweenUnit.x*Math.cos(self.children[i].sprite.angle) + betweenUnit.y*Math.sin(self.children[i].sprite.angle);
                var b = betweenUnit.y*Math.cos(self.children[i].sprite.angle) - betweenUnit.x*Math.sin(self.children[i].sprite.angle);
                if(Math.abs(a) > Math.abs(b)) {
                    var face = "+x";
                    if(a < 0) {
                        face = "-x";
                    }
                } else {
                    var face = "+y";
                    if(b < 0) {
                        face = "-y";
                    }
                }
                var spriteVoxel = self.children[i].sprite.get(horizontal, vertical, face);
                if(spriteVoxel > 0) {
                    return {
                        "depth": depth,
                        "isSolid": self.children[i].sprite.isSolid(horizontal, vertical, face),
                        "voxel": spriteVoxel
                    };
                }
            }
        }
        return {
            "depth": Infinity,
            "isSolid": 0,
            "voxel": 0
        };
    }

    this.update = function() {
        for(var i = 0; i < self.children.length; i++) {
            if (typeof self.children[i].update === "function") { 
                self.children[i].update();
            }
        }
    }
}