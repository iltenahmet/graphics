// global variables
let gl = null;
let uProj = null; 
let uModel = null;
let uView = null;

let view = null;
let cameraMoveSpeed = 1;
let cameraRotateSpeed = 0.1;

cameraPos   = new vec3(0.0, 0.0,  0);
cameraFront = new vec3(0.0, 0.0, -1);
cameraUp    = new vec3(0.0, 1.0,  0.0);

let startTime = 0;

let vertexSize = 5;
let vertexShader = "";
let fragmentShader = "";

let w, a, s, d = false;
main();

async function main() {
	vertexShader =  await fetchShader("./vert.glsl");
	fragmentShader = await fetchShader("./frag.glsl");
	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keyup', handleKeyUp);
	setTimeout(afterTimeOut, 100);
}

function afterTimeOut() {
	gl = start_gl(canvas1, vertexSize, vertexShader, fragmentShader);

	uModel = gl.getUniformLocation(gl.program, "uModel");
	uProj = gl.getUniformLocation(gl.program, "uProj");
	uView = gl.getUniformLocation(gl.program, "uView");

	addTexture(0, 'container.jpg');
	addTexture(1, 'skeleton.png');

	let textures = gl.getUniformLocation(gl.program, "textures");
	gl.uniform1iv(textures, [0,1]);

	view = mTranslate(0, 0, -10, mIdentity()); 


	startTime = Date.now() / 1000;
	setInterval(tick, 30);
} 

function tick() {
	let time = Date.now() / 1000 - startTime;

	let  cubePositions = [
	   new vec3( 0.0,  0.0,  0.0), 
	   new vec3( 4,  5, 5), 
	   new vec3(-4, 2, -20),  
	   new vec3(0, 10, -12.3),  
	   new vec3( 0, 3, 5),  
	   new vec3(-1.7,  3.0, -7.5),  
	   new vec3( 1.3, -2.0, -2.5),  
	   new vec3( 1.5,  2.0, -2.5), 
	   new vec3( 1.5,  0.2, -1.5), 
	   new vec3(-1.3,  1.0, -1.5)  
	];

	//let proj = mPerspectiveFromFieldOfView(mIdentity(), 0.78, 0.1, 100); 
	//let proj = mPerspective(0.7, mIdentity());
	
	let proj = mPerspectiveNO(mIdentity(), 0.78, 1.0, 0.1, 100); 

	let camY = cos(time / 10);
	let camZ = sin(time / 10);


	
	if (w) {
		view = mTranslate(0, 0, cameraMoveSpeed, view); 
	} 

	if (s) {
		view = mTranslate(0, 0, -cameraMoveSpeed, view); 

	}

	if (a) {
		//view = mRotateY(cameraRotateSpeed, view);
		//cameraFront = new vec3(cameraFront.x, cameraFront.y, cameraFront.z - 1);
		cameraPos = new vec3(cameraPos.x, cameraPos.y, cameraPos.z - 1);
		view = mLookAt(cameraPos, cameraPos.add(cameraFront), cameraUp); 
	}

	if (d) {
		view = mRotateY(-cameraRotateSpeed, view);
	}
	
	
	for(let i = 0; i < 10; i++)
	{
		let m = mIdentity();
		m = mTranslate(cubePositions[i].x, cubePositions[i].y, cubePositions[i].z, m);
		let angle = 20.0 * i; 
		m = mRotateX(angle, m);
		m = mRotateY(angle * 0.3 , m);
		m = mRotateY(angle * 0.5, m);
		m = mScale(0.5, 0.5, 0.5, m);

		drawShape(cube, m, view, proj); 	
	}



}

function drawShape(vertices, model, view, proj) {
	gl.uniformMatrix4fv(uProj, false, proj);
	gl.uniformMatrix4fv(uView, false, view);
	gl.uniformMatrix4fv(uModel , false, model);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.drawArrays(gl.TRIANGLES, 0, vertices.length / vertexSize);
}

function drawShapeFromStack(mesh, color) {
	gl.uniform3fv      (uColor    , color);
	gl.uniformMatrix4fv(matrix   , false, mTop());
	gl.uniformMatrix4fv(invMatrix, false, mInverse(mTop()));
	gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
	gl.drawArrays(mesh.type == 'TRIANGLES' ? gl.TRIANGLES : gl.TRIANGLE_STRIP, 0, mesh.length / vertexSize);
}

let addTexture = (index, file) => {
	let image = new Image();
	image.onload = () => {
		gl.activeTexture (gl.TEXTURE0 + index);
		gl.bindTexture   (gl.TEXTURE_2D, gl.createTexture());
		gl.pixelStorei   (gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D    (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
	}
	image.src = file;
}
	
async function fetchShader(path) {
	try {
		const response = await fetch(path);
		const text = await response.text();
		return text;
	} catch (error) {
		console.error(`There was a problem fetching the shader from ${path}:`, error);
	}
}

function handleKeyDown(event) {
	switch (event.key) {
		case 'w':
			w = true;
			break;
		case 'a':
			a = true;
			break;
		case 's':
			s = true;
			break;
		case 'd':
			d = true;
			break;
	}
}

function handleKeyUp(event) {
	switch (event.key) {
		case 'w':
			w = false;
			break;
		case 'a':
			a = false;
			break;
		case 's':
			s = false;
			break;
		case 'd':
			d = false;
			break;
	}
}
