var canvas, ctx;

var VOXEL_SIZE = 8; // px

var WIDTH = 8;
var HEIGHT = 8;
var DEPTH = 8;

var CANVAS_WIDTH;
var CANVAS_HEIGHT;

var map = new Uint8Array(WIDTH*DEPTH*HEIGHT);

window.onload = function() {
	init();
}

window.onresize = function() {
	resize();
}

function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

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
	var colors = ["#FFFFFF", "#000000"];
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var y = 0; y <= CANVAS_HEIGHT; y++) {
		for(var x = 0; x <= CANVAS_WIDTH; x++) {
			ctx.fillStyle = colors[Math.floor(Math.random()*2)];
			ctx.fillRect(x*VOXEL_SIZE, y*VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
		}
	}

	requestAnimationFrame(render);
}