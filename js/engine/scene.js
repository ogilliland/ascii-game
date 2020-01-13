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
                return {
                    "depth": position.dot(camera.direction),
                    "isSolid": self.children[i].isSolid(self.children[i].toLocal(position)),
                    "voxel": self.children[i].get(self.children[i].toLocal(position), face)
                };
            }
        }
    }

    this.update = function() {
        for(var i = 0; i < self.children.length; i++) {
            if (typeof self.children[i].update === "function") { 
                self.children[i].update();
            }
        }
    }
}