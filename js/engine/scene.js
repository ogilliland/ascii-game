function Scene(width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.children = [];
    var self = this;

    this.addChild = function(object) {
        self.children.push(object);
    }

    this.voxelTest = function(x, y, z) {
        for(var i = 0; i < self.children.length; i++) {
            if(self.children[i].isSolid(self.children[i].toLocal(new Vector(x, y, z)))) {
                return self.children[i].get(self.children[i].toLocal(new Vector(x, y, z)));
            }
        }
    }
}