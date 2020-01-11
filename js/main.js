var canvas, ctx, terrain, camera, font;

var times = [];

// TO DO - remove this and get from font map instead
var VOXEL_SIZE = 12; // px

var WIDTH = 64;
var HEIGHT = 64;
var DEPTH = 32;

var SCALE = 128;

window.onload = function() {
	init();
}

window.onresize = function() {
	resize();
}

function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	font = new Font();

	terrain = new Terrain(WIDTH, HEIGHT, DEPTH, SCALE);
	terrain.position.x = -1 * WIDTH/2;
	terrain.position.y = -1 * HEIGHT/2;

	/* camera = new PerspectiveCamera();
	camera.setPos(WIDTH, HEIGHT, DEPTH + 64);
	camera.lookAt(0, 0, 0); */

	camera = new OrthographicCamera();
	camera.setPos(WIDTH/2, HEIGHT/2, DEPTH + 32);
	camera.lookAt(0, 0, 0);

	resize();
	render();
}

function resize() {
	canvas.width = window.innerWidth; // px
	canvas.height = window.innerHeight; // px

	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;

	camera.width = canvas.width / VOXEL_SIZE + 1; // voxels
	camera.height = canvas.height / VOXEL_SIZE + 1; // voxels
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	camera.render(ctx);

	// slow spin
	var angle = Math.PI/100;
	camera.position.x = camera.position.x*Math.cos(angle) - camera.position.y*Math.sin(angle);
	camera.position.y = camera.position.x*Math.sin(angle) + camera.position.y*Math.cos(angle);
	camera.lookAt(0, 0, 0);

	calculateFps();
	requestAnimationFrame(render);
}

function randbetween(min, max) {
	return Math.random()*(max - min) + min;
}

function calculateFps() {
	var now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    var fps = times.length;
 	// console.log("fps: "+fps);
}