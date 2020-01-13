/**
 * Call the callback with (x,y,z,value,face) of all blocks along the line
 * segment from point 'origin' in vector direction 'direction' of length
 * 'radius'. 'radius' may be infinite.
 * 
 * 'face' is the normal vector of the face of that block that was entered.
 * It should not be used after the callback returns.
 * 
 * If the callback returns a true value, the traversal will be stopped.
 */
function raycast(origin, direction, radius, callback) {
  // From "A Fast Voxel Traversal Algorithm for Ray Tracing"
  // by John Amanatides and Andrew Woo, 1987
  // <http://www.cse.yorku.ca/~amana/research/grid.pdf>
  // <http://citeseer.ist.psu.edu/viewdoc/summary?doi=10.1.1.42.3443>
  // Extensions to the described algorithm:
  //   • Imposed a distance limit.
  //   • The face passed through to reach the current cube is provided to
  //     the callback.

  // The foundation of this algorithm is a parameterized representation of
  // the provided ray,
  //                    origin + t * direction,
  // except that t is not actually stored; rather, at any given point in the
  // traversal, we keep track of the *greater* t values which we would have
  // if we took a step sufficient to cross a cube boundary along that axis
  // (i.e. change the integer part of the coordinate) in the variables
  // tMaxX, tMaxY, and tMaxZ.

  // Cube containing origin point.
  var x = Math.floor(origin.x);
  var y = Math.floor(origin.y);
  var z = Math.floor(origin.z);
  // Break out direction vector.
  var dx = direction.x;
  var dy = direction.y;
  var dz = direction.z;
  // Direction to increment x,y,z when stepping.
  var stepX = signum(dx);
  var stepY = signum(dy);
  var stepZ = signum(dz);
  // See description above. The initial values depend on the fractional
  // part of the origin.
  var tMaxX = intbound(origin.x, dx);
  var tMaxY = intbound(origin.y, dy);
  var tMaxZ = intbound(origin.z, dz);
  // The change in t when taking a step (always positive).
  var tDeltaX = stepX/dx;
  var tDeltaY = stepY/dy;
  var tDeltaZ = stepZ/dz;
  // Buffer for reporting faces to the callback.
  var face = new Vector();
  // Array for storing the voxels that have been traversed
  var result = [];

  // Avoids an infinite loop.
  if (dx === 0 && dy === 0 && dz === 0) {
    throw new RangeError("Raycast in zero direction!");
  }

  // Rescale from units of 1 cube-edge to units of 'direction' so we can
  // compare with 't'.
  radius /= Math.sqrt(dx*dx+dy*dy+dz*dz);

  while (/* ray has not gone past bounds of world */
         (stepX > 0 ? x < scene.width : x >= 0) &&
         (stepY > 0 ? y < scene.height : y >= 0) &&
         (stepZ > 0 ? z < scene.depth : z >= 0)) {

    // Invoke the callback, unless we are not *yet* within the bounds of the
    // world.
    if (!(x < 0 || y < 0 || z < 0 || x >= scene.width || y >= scene.height || z >= scene.depth)) {
      var temp = callback(new Vector(x, y, z), face);
      result.push(temp);
      if (temp.isSolid) {
        return result;
      }
    }

    // tMaxX stores the t-value at which we cross a cube boundary along the
    // X axis, and similarly for Y and Z. Therefore, choosing the least tMax
    // chooses the closest cube boundary. Only the first case of the four
    // has been commented in detail.
    if (tMaxX < tMaxY) {
      if (tMaxX < tMaxZ) {
        if (tMaxX > radius) break;
        // Update which cube we are now in.
        x += stepX;
        // Adjust tMaxX to the next X-oriented boundary crossing.
        tMaxX += tDeltaX;
        // Record the normal vector of the cube face we entered.
        face.x = -stepX;
        face.y = 0;
        face.z = 0;
      } else {
        if (tMaxZ > radius) break;
        z += stepZ;
        tMaxZ += tDeltaZ;
        face.x = 0;
        face.y = 0;
        face.z = -stepZ;
      }
    } else {
      if (tMaxY < tMaxZ) {
        if (tMaxY > radius) break;
        y += stepY;
        tMaxY += tDeltaY;
        face.x = 0;
        face.y = -stepY;
        face.z = 0;
      } else {
        // Identical to the second case, repeated for simplicity in
        // the conditionals.
        if (tMaxZ > radius) break;
        z += stepZ;
        tMaxZ += tDeltaZ;
        face.x = 0;
        face.y = 0;
        face.z = -stepZ;
      }
    }
  }
  return result;
}

function intbound(s, ds) {
  // find the smallest positive t such that s+t*ds is an integer.
  return (ds > 0 ? Math.ceil(s)-s : s-Math.floor(s)) / Math.abs(ds);
}

function signum(x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}

function mod(value, modulus) {
  return (value % modulus + modulus) % modulus;
}