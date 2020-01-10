var canvas, ctx, terrain;

var VOXEL_SIZE = 8; // px

var WIDTH = 64;
var HEIGHT = 64;
var DEPTH = 64;

var SCALE = 32;

var CANVAS_WIDTH;
var CANVAS_HEIGHT;

var ASPECT = 9/16; // aspect ratio as height/width
var AOV_X = 40 * Math.PI / 180; // horizontal angle of view in radians
var AOV_Y = AOV_X * ASPECT; // vertical angle of view in radians
var CAMERA_MIN = 64;
var CAMERA_MAX = 512;

var COLORS = ["#0d2b45", "#203c56", "#544e68", "#8d697a", "#d08159", "#ffaa5e", "#ffd4a3", "#ffecd6"];
/* var ON_COLORS = ["#ffecd6", "#ffecd6", "#ffecd6", "#ffecd6", "#0d2b45", "#0d2b45"]; */

window.onload = function() {
	init();
}

window.onresize = function() {
	resize();
}

function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	terrain = new Terrain(WIDTH, HEIGHT, DEPTH, SCALE);

	resize();
	render();
}

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	CANVAS_WIDTH = canvas.width / VOXEL_SIZE;
	CANVAS_HEIGHT = canvas.height / VOXEL_SIZE;
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var y = 0; y <= CANVAS_HEIGHT; y++) {
		for(var x = 0; x <= CANVAS_WIDTH; x++) {

			var x1 = WIDTH/2;
			var y1 = HEIGHT/2;
			var z1 = DEPTH + CAMERA_MIN;

			var x2 = CAMERA_MAX * Math.tan((x/CANVAS_WIDTH)*AOV_X - AOV_X/2);
			var y2 = CAMERA_MAX * Math.tan((y/CANVAS_HEIGHT)*AOV_Y - AOV_Y/2);
			var z2 = CAMERA_MAX * -1;

			var target = ray(x1, y1, z1, x2, y2, z2);

			ctx.fillStyle = COLORS[target];
			// ctx.fillStyle = COLORS[terrain.get(x, y, DEPTH/2)];
			ctx.fillRect(x*VOXEL_SIZE, y*VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
		}
	}

	requestAnimationFrame(render);
}

function ray(x1, y1, z1, x2, y2, z2) {
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
			
			// return first non-air block encountered
			if(terrain.get(x, y, z) > 0) {
				return terrain.get(x, y, z);
			}

			if (err_1 > 0) {
				y += y_inc;
				err_1 -= dx2;
			}
			if (err_2 > 0) {
				z += z_inc;
				err_2 -= dx2;
			}
			err_1 += dy2;
			err_2 += dz2;
			x += x_inc;
		}
	} else if ((m >= l) && (m >= n)) {
		err_1 = dx2 - m;
		err_2 = dz2 - m;
		for (i = 0; i < m; i++) {
		   	
		   	// return first non-air block encountered
			if(terrain.get(x, y, z) > 0) {
				return terrain.get(x, y, z);
			}

			if (err_1 > 0) {
				x += x_inc;
				err_1 -= dy2;
			}
			if (err_2 > 0) {
				z += z_inc;
				err_2 -= dy2;
			}
			err_1 += dx2;
			err_2 += dz2;
			y += y_inc;
		}
	} else {
		err_1 = dy2 - n;
		err_2 = dx2 - n;
		for (i = 0; i < n; i++) {
			
			// return first non-air block encountered
			if(terrain.get(x, y, z) > 0) {
				return terrain.get(x, y, z);
			}

			if (err_1 > 0) {
				y += y_inc;
				err_1 -= dz2;
			}
			if (err_2 > 0) {
				x += x_inc;
				err_2 -= dz2;
			}
			err_1 += dy2;
			err_2 += dx2;
			z += z_inc;
		}
	}
}