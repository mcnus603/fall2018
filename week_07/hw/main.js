
var counter = 0; 
var globalX;
var globalY;
var posiNumber = 1;
var newCookie = true;

Cookies.remove('posi1');
Cookies.remove('posi2');
Cookies.remove('posi3');
Cookies.remove('posi4');
Cookies.remove('posi5');
Cookies.remove('posi6');

var positions = [];

var shapes = ['cube', 'sphere', 'cone'];


//THREE JS 

var renderer, camera, scene,light, light1, mesh;
var alltheShapes= [];

//renderer

renderer = new THREE.WebGLRenderer({canvas: document.getElementById('canvas')});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


//camera



camera = new THREE.PerspectiveCamera(90, window.innerHeight/window.innerHeight, 0.1, 3000);
window.addEventListener('mousemove', function(e){

	var x = e.clientY/2; 

	camera.position.z = -x;
});
//scene
scene = new THREE.Scene();

//lights
light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

light1 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light1);

//object

// var geometry = (5, 5, 32);

// var sphere = new THREE.Mesh( geometry, material );
// scene.add( sphere );


window.addEventListener('resize', function () {
   
   var width = window.innerWidth;
   var height = window.innerHeight;
   renderer.setSize(width, height);

});

function makeCone () {
	var xMin = -800
	var xMax = 800
	var yMin = -600
	var yMax = 600;

	var x = Math.floor(Math.random() * (xMax - xMin ) + xMin);
	var y = Math.floor(Math.random() * (yMax - yMin) + yMin);

	var geometry = new THREE.ConeGeometry(40, 200, 800);
	var material = new THREE.MeshNormalMaterial();
	var cone = new THREE.Mesh( geometry, material );
	cone.position.set(x, y, -1000);
	alltheShapes.push(cone);
	scene.add(cone);
}

// makeCone();

function makeCube() {

	//randomness
	var xMin = -800
	var xMax = 800
	var yMin = -600
	var yMax = 600;

	var x = Math.floor(Math.random() * (xMax - xMin ) + xMin);
	var y = Math.floor(Math.random() * (yMax - yMin) + yMin);

	var geometry = new THREE.BoxGeometry(100, 100, 100);
	var material = new THREE.MeshNormalMaterial();

//how to make things, geometry + material = mesh
	var cube = new THREE.Mesh(geometry, material);
//set position of object
	cube.position.set(x, y, -1000);
	alltheShapes.push(cube);
	scene.add(cube);

}

function makeSphere () {
	var xMin = -800
	var xMax = 800
	var yMin = -600
	var yMax = 600;

	var x = Math.floor(Math.random() * (xMax - xMin ) + xMin);
	var y = Math.floor(Math.random() * (yMax - yMin) + yMin);

	var geometry = new THREE.TorusGeometry(60, 35, 160, 160);
	var material = new THREE.MeshNormalMaterial();
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(x, y, -1000);
	alltheShapes.push(sphere);
	scene.add(sphere);


}

		

function posiCheck (num) {
	if(Cookies.getJSON('posi' + num)) {

		// console.log(posiNumber);

		var theCookie = Cookies.getJSON('posi' + num);
		//parse positions array
		for (var i = 0; i < theCookie.length; i++) {
			var anEntry = theCookie[i];
			positions.push(anEntry);
		}

		for(var i = 0; i < theCookie.length; i++) {

			var shape = makeTHREEJS();

			if(shape == 0) {
				makeCone();
			} else if(shape == 1) {
				makeSphere();
			} else {
				makeCube();
			}

		displayCircles(theCookie[i][0], theCookie[i][1]);
	}
		//recursive 
		posiCheck(num + 1);
	}
}

posiCheck(posiNumber);


function displayCircles(x , y) {
	var aCircle = document.createElement('div');
	aCircle.className = 'circle';
	aCircle.style.left = x + "px";
	aCircle.style.top = y + "px";
	document.body.append(aCircle);
}

window.addEventListener("mousemove", function(e){
	globalX = e.clientX;
	globalY = e.clientY;
});

function adjustPosiNum () {
	//change posinumber
	var theCookie = Cookies.getJSON('posi' + posiNumber); 
	// console.log(posiNumber);

	if(theCookie.length > 250) {
		newCookie = true;
		posiNumber = 2;

	}

}

function addPostoCookies () {

	if(newCookie == false) {
		adjustPosiNum();
	}


	var thePos = [globalX, globalY];

	//x and y are a number
	if(typeof globalX == "number" && typeof globalY == "number") {

		//if this is the first position added 
		if(newCookie) {

			positions.push(thePos);
			Cookies.set('posi' + posiNumber, positions, {expires:10});

			newCookie = false;

		} else {

			//x and y arent the same as the last 
			var theLastPos = positions.length - 1; 
			var theLastX = positions[theLastPos][0];
			var theLastY = positions[theLastPos][1];

			if(theLastX!== globalX && theLastY !== globalY) {

				// makeCube();
				var shape = makeTHREEJS();

				if(shape == 0) {
					makeCone();
				} else if(shape == 1) {
					makeSphere();
				} else {
					makeCube();
				}

				displayCircles(globalX, globalY);

				positions.push(thePos);
				Cookies.set('posi' + posiNumber, positions, {expires:10});	

			}

		} 
	}
	
}

setInterval(addPostoCookies, 1500);

function makeTHREEJS() {
	var r = Math.floor(Math.random() * 3); 
	console.log(r);
	var theShape = shapes[r];
	return r;
}

//render loop 
requestAnimationFrame(render);

function render() {

	for(var i = 0; i < alltheShapes.length; i++) {
		if(newCookie == false) {

		var xR = positions[i][0]/8000;
		var yR = positions[i][1]/8000;

		alltheShapes[i].rotation.x += xR;
		alltheShapes[i].rotation.y += yR;

		}

	}

	renderer.render(scene, camera);
	requestAnimationFrame(render);
}
