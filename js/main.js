var canvas, ctx, terrain, camera;

var VOXEL_SIZE = 8; // px

var WIDTH = 128;
var HEIGHT = 128;
var DEPTH = 32;

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

	/* camera = new PerspectiveCamera();
	camera.setPos(WIDTH, HEIGHT, DEPTH + 64);
	camera.lookAt(0, 0, 0); */

	camera = new OrthographicCamera();
	camera.setPos(WIDTH, HEIGHT, DEPTH + 64);
	camera.lookAt(0, 0, 0);

	resize();
	render();
}

function resize() {
	canvas.width = window.innerWidth; // px
	canvas.height = window.innerHeight; // px

	camera.width = canvas.width / VOXEL_SIZE + 1; // voxels
	camera.height = canvas.height / VOXEL_SIZE + 1; // voxels
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	camera.render(ctx);

	// slow spin
	var angle = Math.PI/1000;
	camera.position.x = camera.position.x*Math.cos(angle) - camera.position.y*Math.sin(angle);
	camera.position.y = camera.position.x*Math.sin(angle) + camera.position.y*Math.cos(angle);
	camera.lookAt(0, 0, 0);

	requestAnimationFrame(render);
}