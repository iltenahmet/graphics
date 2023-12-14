// global variables
let gl = null;
let uColor = null; 
let uMatrix = null;
let uInvMatrix = null;
let startTime = 0;

let sphere20  = sphere(20,10);
let skinColor = [.6,.3,.2];

async function fetchShader(path) {
	try {
		const response = await fetch(path);
		const text = await response.text();
		return text;
	} catch (error) {
		console.error(`There was a problem fetching the shader from ${path}:`, error);
	}
}

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

	startTime = Date.now() / 1000;
	setInterval(tick, 30);
} 

function drawShape(mesh, color) {
	gl.uniform3fv      (uColor    , color);
	gl.uniformMatrix4fv(uMatrix   , false, mTop());
	gl.uniformMatrix4fv(uInvMatrix, false, mInverse(mTop()));
	gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
	gl.drawArrays(mesh.type == 'TRIANGLES' ? gl.TRIANGLES : gl.TRIANGLE_STRIP, 0, mesh.length / vertexSize);
}

function tick() {
	let time = Date.now() / 1000 - startTime;

	let cos = Math.cos(2 * time);
	let sin = Math.sin(2 * time);
  
	let view = -.50 + 1.00 * 0.5 / 100;
	let sw   =  .06 +  .12 * 0.5 / 100;
	let al   =  .06 +  .12 * 0.5 / 100;
	let hw   =  .03 +  .06 * 0.5 / 100;
	let ll   =  .08 +  .16 * 0.5 / 100;

	mSet(mIdentity());
	mProject(0,0,-1/3);

	mTurnY(view);

	// GENERIC LIMB

	let limb = (length, thickness, shoulder, elbow) => {
		mDuplicate();
			mTurnX(shoulder);
			mMove(0,-length,0);

			mDuplicate();
				mScale(thickness,length,thickness);
				drawShape(sphere20, skinColor); // UPPER LIMB
			mPop();

			mMove(0,-length,0);
			mTurnX(elbow); 
			mMove(0,-length,0);

			mDuplicate();
				mScale(thickness*.8,length,thickness*.8);
				drawShape(sphere20, skinColor); // LOWER LIMB
			mPop();
		mPop();
	}

	// ARMS

	mMove(0,.5,0);
	mDuplicate();
		mTurnZ(sin /8);
		mDuplicate();
			mMove(sw,0,0);
			limb(al, .025, cos + .3, sin - 1);     // LEFT ARM
		mPop();
		mDuplicate();
			mMove(-sw,0,0);
			limb(al, .025, -cos + .3, -sin - 1);   // RIGHT ARM
		mPop();
	mPop();

	// LEGS

	mMove(0,-.3,0);
	mDuplicate();
		mTurnZ(-sin/8);
		mDuplicate();
			mScale(hw,hw/2,hw/2);
			drawShape(sphere20, [1,1,1]);
		mPop();
		mDuplicate();
			mMove(hw,0,0);
			limb(ll, .035, -cos - .3, -sin + 1);     // LEFT LEG
		mPop();
		mDuplicate();
			mMove(-hw,0,0);
			limb(ll, .035, cos - .3, sin + 1);   // RIGHT LEG
		mPop();
	mPop();
}

