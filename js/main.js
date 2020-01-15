var scene, camera, font, player;

var playerControls = {
	"up": false,
	"down": false,
	"left": false,
	"right": false,
	"rotateLeft": false,
	"rotateRight": false,
	"mouse": {
		"x": 0,
		"y": 0,
		"dragging": false
	}
};

var times = [];

window.onload = function() {
	init();
}

window.onresize = function() {
	camera.resize();
}

function init() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	font = new Font();

	scene = new Scene(256, 256, 32);

	var terrain = new Terrain(scene.width, scene.height, scene.depth, 128);
	scene.addChild(terrain);

	player = new Character();
	player.position.x = scene.width/2;
	player.position.y = scene.height/2;
	scene.addChild(player);

	camera = new OrthographicCamera();
	camera.setContext(ctx);
	// camera.setPos(new Vector(scene.width/2, scene.height/2, scene.depth + 32));
	// camera.lookAt(new Vector(0, 0, 0));

	camera.follow(player);

	camera.resize();
	animate();
}

function animate() {
	// move player
	var up = 0;
	var right = 0;
	var rotate = 0;

	if(playerControls.up) {
		up++;
	}
	if(playerControls.down) {
		up--;
	}
	if(playerControls.left) {
		right++;
	}
	if(playerControls.right) {
		right--;
	}
	if(playerControls.rotateLeft) {
		rotate++;
	}
	if(playerControls.rotateRight) {
		rotate--;
	}

	var speed = player.speed;
	if(up*right != 0) {
		speed = Math.sqrt(speed);
	}
	if(up != 0) {
		player.move(camera.direction.multiply(up*speed));
	}
	if(right != 0) {
		player.move(camera.right.multiply(-right*speed));
	}
	if(rotate != 0) {
		camera.phi -= rotate*Math.PI/32;
	}

	scene.update();

	camera.refresh();
	camera.render();

	calculateFps();
	requestAnimationFrame(animate);
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

document.onkeydown = function(e) {
    e = e || window.event;
    
    if (e.keyCode == "38" || e.keyCode == "87") {
        playerControls.up = true;
    } else if (e.keyCode == "40" || e.keyCode == "83") {
        playerControls.down = true;
    } else if (e.keyCode == "37" || e.keyCode == "65") {
       playerControls.left = true;
    } else if (e.keyCode == "39" || e.keyCode == "68") {
       playerControls.right = true;
    } else if (e.keyCode == "81") {
       playerControls.rotateLeft = true;
    } else if (e.keyCode == "69") {
       playerControls.rotateRight = true;
    }
}

document.onkeyup = function(e) {
    e = e || window.event;
    
    if (e.keyCode == "38" || e.keyCode == "87") {
        playerControls.up = false;
    } else if (e.keyCode == "40" || e.keyCode == "83") {
        playerControls.down = false;
    } else if (e.keyCode == "37" || e.keyCode == "65") {
       playerControls.left = false;
    } else if (e.keyCode == "39" || e.keyCode == "68") {
       playerControls.right = false;
	} else if (e.keyCode == "81") {
       playerControls.rotateLeft = false;
    } else if (e.keyCode == "69") {
       playerControls.rotateRight = false;
    }
}

document.onmousedown = function(e) {
	playerControls.mouse.dragging = true;
	playerControls.mouse.x = e.screenX;
	playerControls.mouse.y = e.screenY;
}

document.onmouseup = function(e) {
	playerControls.mouse.dragging = false;
}

document.onmousemove = function(e) {
	if(playerControls.mouse.dragging) {
		var dx = e.screenX - playerControls.mouse.x;
		var dy = e.screenY - playerControls.mouse.y;
		camera.phi += dx*Math.PI/400;
		camera.theta += dy*Math.PI/400;
		playerControls.mouse.x = e.screenX;
		playerControls.mouse.y = e.screenY;
	}
}