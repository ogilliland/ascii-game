var canvas, ctx, terrain, camera;

var VOXEL_SIZE = 8; // px

var WIDTH = 64;
var HEIGHT = 64;
var DEPTH = 64;

var SCALE = 32;

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

	camera = new Camera();
	camera.setPos(WIDTH/2, HEIGHT, DEPTH + 64);
	camera.lookAt(WIDTH/2, HEIGHT/2, 0);

	resize();
	render();
}

function resize() {
	canvas.width = window.innerWidth; // px
	canvas.height = window.innerHeight; // px

	camera.width = canvas.width / VOXEL_SIZE; // voxels
	camera.height = canvas.height / VOXEL_SIZE; // voxels
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	camera.render(ctx);

	requestAnimationFrame(render);
}