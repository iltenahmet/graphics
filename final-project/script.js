// global variables
let gl = null;
let uProj = null; 
let uModel = null;
let uView = null;
let uIsSphere = null;
let uTime = null;

let view = null;
let viewMoveSpeed = 0.5;
let viewRotateSpeed = 0.03;

let viewPos = new vec3(0, 0, -10);
let target = viewPos.subtract(new vec3(0, 0, -1));
let viewDirection = target.subtract(viewPos); 

let startTime = 0;

let vertexSize = 8;
let vertexShader = "";
let fragmentShader = "";

let w, a, s, d, e, q, up, down, left, right, space = false;

let platform = createPlatform(32, 32);

let projectiles = [ ];
let projectilesDir = [ ];
let projectileSpeed = 1;
let lastProjectileTime = Date.now() / 1000;
let projectileWaitDuration = 0.2;

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
	uIsSphere = gl.getUniformLocation(gl.program, "uIsSphere");
	uTime = gl.getUniformLocation(gl.program, "uTime");

    // source: https://opengameart.org/content/tileable-metal-textures-treadplate1png
	addTexture(0, 'metal.png');

	let textures = gl.getUniformLocation(gl.program, "textures");
	gl.uniform1iv(textures, [0,1]);

	view = mTranslate(0, 0, -10, mIdentity()); 

	startTime = Date.now() / 1000;
	setInterval(tick, 30);
} 

function tick() {
	let time = Date.now() / 1000 - startTime;

	gl.uniform1f(uTime, time);

	let proj = mPerspectiveNO(0.78, canvas1.width / canvas1.height, 0.1, 10000); 
	
	handleInput();	

	view = lookAt(viewPos, target, new vec3(0,1,0));
	view = mInverse(view);
  
	// draw platform
	for(let i = 0; i < platform.length; i++)
	{
		let m = mIdentity();
		m = mTranslate(platform[i].x, platform[i].y, platform[i].z, m);
		drawShape(cube, 'TRIANGLES', m, view, proj, false); 
	}

	// draw projectiles 
	for (let i = 0; i < projectiles.length; i++) {
		let m = mIdentity();
		m = mTranslate(projectiles[i].x, projectiles[i].y, projectiles[i].z, m);
		let scaleFactor = 0.2;
		m = mScale(scaleFactor, scaleFactor, scaleFactor, m);
		let sphere20 = sphere(20, 10);
		drawShape(sphere20, 'TRIANGLE_STRIP', m, view, proj, true); 

		projectiles[i] = projectiles[i].add(projectilesDir[i].multiplyByNum(projectileSpeed));
	}

	// draw skeletons
}

function drawShape(vertices, type, model, view, proj, isSphere) {
	gl.uniformMatrix4fv(uProj, false, proj);
	gl.uniformMatrix4fv(uView, false, view);
	gl.uniformMatrix4fv(uModel , false, model);
	gl.uniform1i(uIsSphere, isSphere);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.drawArrays(type == 'TRIANGLES' ? gl.TRIANGLES : gl.TRIANGLE_STRIP, 0, vertices.length / vertexSize);
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
        case 'e':
            e = true;
            break;
        case 'q':
            q = true;
            break;
        case 'ArrowUp':
            up = true;
            break;
        case 'ArrowDown':
            down = true;
            break;
        case 'ArrowLeft':
            left = true;
            break;
        case 'ArrowRight':
            right = true;
            break;
		case ' ':
			space = true;
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
		case 'e':
            e = false;
            break;
        case 'q':
            q = false;
            break;
        case 'ArrowUp':
            up = false;
            break;
        case 'ArrowDown':
            down = false;
            break;
        case 'ArrowLeft':
            left = false;
            break;
        case 'ArrowRight':
            right = false;
            break;
		case ' ':
			space = false;
			break;
    }
}

function handleInput() {
	if (w || a || d || s) {
		let dir = viewDirection;
		if (a || d) dir = viewDirection.cross(new vec3(0, 1, 0));

		dir.normalize();
		dir.multiplyByNum(viewMoveSpeed);
		
		let bAdd = true;
		if (s || a) bAdd = false;	  
		

		viewPos = bAdd ? viewPos.add(dir) : viewPos.subtract(dir);	
		target = bAdd ? target.add(dir) : target.subtract(dir);
	} 

	if (left || right) {
		// send target around origin
		target = target.subtract(viewPos);

		// rotate around origin
		let m = mIdentity();
		if (left) m = mRotateY(-viewRotateSpeed, m);
		if (right) m = mRotateY(viewRotateSpeed, m);
		let v4 = mMultVec4(m, [target.x, target.y, target.z, 1]);
		target.x = v4[0];
		target.y = v4[1];
		target.z = v4[2];

		// bring it back the same distance
		target = target.add(viewPos);

		viewDirection = target.subtract(viewPos);
	}

	if (space) {
		if ((Date.now() / 1000) - lastProjectileTime < projectileWaitDuration) return;
		lastProjectileTime = Date.now() / 1000;

		projectiles.push(new vec3(viewPos.x, viewPos.y - 0.5, viewPos.z));
		viewDirection.normalize();
		projectilesDir.push(new vec3(viewDirection.x, viewDirection.y, viewDirection.z));
	}
}

function createPlatform(n, m){
	let out = [];
	//ground
	for (let i = -n; i < n; i++){
		for (let j = -m; j < m; j++) {
			out.push(new vec3(i, -3, j));
		}
	}

	//walls
	for (let i = -n; i < n; i++) {
		for (let j = -2; j < 4; j++) {
			out.push(new vec3(i, j, -n));
		}
	}

	for (let i = -n; i < n; i++) {
		for (let j = -2; j < 4; j++) {
			out.push(new vec3(i, j, n));
		}
	}

	for (let i = -m; i < m; i++) {
		for (let j = -2; j < 4; j++) {
			out.push(new vec3(m, j, i));
		}
	}

	for (let i = -m; i < m; i++) {
		for (let j = -2; j < 4; j++) {
			out.push(new vec3(-m, j, i));
		}
	}
	return out;
}
