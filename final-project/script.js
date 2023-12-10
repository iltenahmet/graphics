// global variables
let gl = null;
let uColor = null; 
let uMatrix = null;
let uInvMatrix = null;

let vertexSize = 6;
let vertexShader = "";
let fragmentShader = "";
main();

async function main() {
	vertexShader =  await fetchShader("./vert.glsl");
	fragmentShader = await fetchShader("./frag.glsl");
	setTimeout(afterTimeOut, 100);
}

function afterTimeOut() {
	gl = start_gl(canvas1, vertexSize, vertexShader, fragmentShader);
	uColor = gl.getUniformLocation(gl.program, "uColor");
	uMatrix = gl.getUniformLocation(gl.program, "uMatrix");
	uInvMatrix = gl.getUniformLocation(gl.program, "uInvMatrix");

	let startTime = Date.now() / 1000;
	setInterval(tick(startTime), 30);
} 

function tick(startTime) {
	let time = Date.now() / 1000 - startTime;

	let color = [.6,.3,.2];

	mSet(mIdentity());	

	mDuplicate();
		mTurnX(time * 2);	
		mPerspective(3);
		mTurnY(time);

		mScale(.16,.16,.16);	
		//drawShape(cube, color);	
		drawShape(sphere(20, 10), color)
	mPop();

	mDuplicate();
		mMove(100, 0, 0);
		drawShape(sphere(20, 10), color)
	mPop();
	
}

function drawShape(mesh, color) {
	if (gl == null) {
		console.error("gl is null, can't drawShape");
		return;
	}

	gl.uniform3fv(uColor, color);
	gl.uniformMatrix4fv(uMatrix, false, mTop());
	gl.uniformMatrix4fv(uInvMatrix, false, mInverse(mTop()));
	gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
	gl.drawArrays(mesh.type == 'TRIANGLES' ? 
								gl.TRIANGLES : 
								gl.TRIANGLE_STRIP, 0, mesh.length / vertexSize);
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