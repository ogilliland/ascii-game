var canvas, ctx, map, noise;

var VOXEL_SIZE = 8; // px

var WIDTH = 256;
var HEIGHT = 256;
var DEPTH = 256;

var SCALE = 64;

var CANVAS_WIDTH;
var CANVAS_HEIGHT;

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

	map = new Uint8Array(WIDTH*DEPTH*HEIGHT);
	noise = new SimplexNoise("seed");

	for(var y = 0; y < HEIGHT; y++) {
		for(var x = 0; x < WIDTH; x++) {
			for(var z = 0; z < DEPTH; z++) {
				var delta = Math.max(0, noise.noise2D(x/SCALE, y/SCALE) - z/DEPTH);
				var blocks = Math.round(delta*DEPTH);
				if(blocks > 3) {
					var fill = 7;
				} else if (blocks > 1) {
					var fill = 5;
				} else if (blocks == 1) {
					var fill = 3;
				} else {
					var fill = 0;
				}
				map[x + y*WIDTH + z*WIDTH*HEIGHT] = fill;
			}
		}
	}

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
			ctx.fillStyle = COLORS[map[x + y*WIDTH + (DEPTH/2)*WIDTH*HEIGHT]];
			ctx.fillRect(x*VOXEL_SIZE, y*VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
		}
	}

	requestAnimationFrame(render);
}