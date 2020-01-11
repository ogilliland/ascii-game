function raycast(x1, y1, z1, x2, y2, z2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  var dz = z2 - z1;
  var x_inc = (dx < 0) ? -1 : 1;
  var l = Math.abs(dx);
  var y_inc = (dy < 0) ? -1 : 1;
  var m = Math.abs(dy);
  var z_inc = (dz < 0) ? -1 : 1;
  var n = Math.abs(dz);
  var dx2 = l * 2;
  var dy2 = m * 2;
  var dz2 = n * 2;

  var x = x1, y = y1, z = z1;

  if ((l >= m) && (l >= n)) {
    var err_1 = dy2 - l;
    var err_2 = dz2 - l;
    for (var i = 0; i < l; i++) {
      if (err_1 > 0) {
        y += y_inc;
        err_1 -= dx2;
        // if voxel is solid, return its content
        if(terrain.isSolid(terrain.toLocal(new Vector(x, y, z))) > 0) {
          return terrain.get(terrain.toLocal(new Vector(x, y, z)));
        }
      }
      if (err_2 > 0) {
        z += z_inc;
        err_2 -= dx2;
        // if voxel is solid, return its content
        if(terrain.isSolid(terrain.toLocal(new Vector(x, y, z))) > 0) {
          return terrain.get(terrain.toLocal(new Vector(x, y, z)));
        }
      }
      err_1 += dy2;
      err_2 += dz2;
      x += x_inc;
      // if voxel is solid, return its content
      if(terrain.isSolid(terrain.toLocal(new Vector(x, y, z))) > 0) {
        return terrain.get(terrain.toLocal(new Vector(x, y, z)));
      }
    }
  } else if ((m >= l) && (m >= n)) {
    err_1 = dx2 - m;
    err_2 = dz2 - m;
    for (i = 0; i < m; i++) {
      if (err_1 > 0) {
        x += x_inc;
        err_1 -= dy2;
        // if voxel is solid, return its content
        if(terrain.isSolid(terrain.toLocal(new Vector(x, y, z))) > 0) {
          return terrain.get(terrain.toLocal(new Vector(x, y, z)));
        }
      }
      if (err_2 > 0) {
        z += z_inc;
        err_2 -= dy2;
        // if voxel is solid, return its content
        if(terrain.isSolid(terrain.toLocal(new Vector(x, y, z))) > 0) {
          return terrain.get(terrain.toLocal(new Vector(x, y, z)));
        }
      }
      err_1 += dx2;
      err_2 += dz2;
      y += y_inc;
      // if voxel is solid, return its content
      if(terrain.isSolid(terrain.toLocal(new Vector(x, y, z))) > 0) {
        return terrain.get(terrain.toLocal(new Vector(x, y, z)));
      }
    }
  } else {
    err_1 = dy2 - n;
    err_2 = dx2 - n;
    for (i = 0; i < n; i++) {
      if (err_1 > 0) {
        y += y_inc;
        err_1 -= dz2;
        // if voxel is solid, return its content
        if(terrain.isSolid(terrain.toLocal(new Vector(x, y, z))) > 0) {
          return terrain.get(terrain.toLocal(new Vector(x, y, z)));
        }
      }
      if (err_2 > 0) {
        x += x_inc;
        err_2 -= dz2;
        // if voxel is solid, return its content
        if(terrain.isSolid(terrain.toLocal(new Vector(x, y, z))) > 0) {
          return terrain.get(terrain.toLocal(new Vector(x, y, z)));
        }
      }
      err_1 += dy2;
      err_2 += dx2;
      z += z_inc;
      // if voxel is solid, return its content
      if(terrain.isSolid(terrain.toLocal(new Vector(x, y, z))) > 0) {
        return terrain.get(terrain.toLocal(new Vector(x, y, z)));
      }
    }
  }
  return 0;
}