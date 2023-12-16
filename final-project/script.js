// global variables
let gl = null;
let uColor = null; 
let uMatrix = null;
let uInvMatrix = null;
let startTime = 0;

async function fetchShader(path) {
	try {
		const response = await fetch(path);
		const text = await response.text();
		return text;
	} catch (error) {
		console.error(`There was a problem fetching the shader from ${path}:`, error);
	}
}

let vertexSize = 3;
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
	//uColor = gl.getUniformLocation(gl.program, "uColor");
	//uMatrix = gl.getUniformLocation(gl.program, "uMatrix");
	//uInvMatrix = gl.getUniformLocation(gl.program, "uInvMatrix");
	

	startTime = Date.now() / 1000;
	setInterval(tick, 30);
} 

function tick() {
	let time = Date.now() / 1000 - startTime;
	let green = s(time) / 2.0 + 0.5;

	let vertexColorLocation = gl.getUniformLocation(gl.program, "ourColor");

	gl.uniform4f(vertexColorLocation, 0, green, 0, 1);

	let vertices = new Float32Array([
    // first triangle
     0.5,  0.5, 0.0,  // top right
     0.5, -0.5, 0.0,  // bottom right
    -0.5,  0.5, 0.0,  // top left 
    // second triangle
     0.5, -0.5, 0.0,  // bottom right
    -0.5, -0.5, 0.0,  // bottom left
    -0.5,  0.5, 0.0   // top left
	]); 
		
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.drawArrays(gl.TRIANGLES, 0, 6);

}
// ALL OF THE 3D MESH SHAPES THAT WE ARE RENDERING (FOR NOW IT'S JUST ONE SHAPE)
let meshData = [
	{ type: 1, mesh: new Float32Array([ -1,1,0, 1,1,0, -1,-1,0, 1,-1,0 ]) },
];

function drawShape(mesh, color) {
	gl.uniform3fv      (uColor    , color);
	gl.uniformMatrix4fv(uMatrix   , false, mTop());
	gl.uniformMatrix4fv(uInvMatrix, false, mInverse(mTop()));
	gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
	gl.drawArrays(mesh.type == 'TRIANGLES' ? gl.TRIANGLES : gl.TRIANGLE_STRIP, 0, mesh.length / vertexSize);
}
