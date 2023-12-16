// global variables
let gl = null;
let uColor = null; 
let uMatrix = null;
let uInvMatrix = null;
let startTime = 0;

let vertexSize = 8;
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
	//
	addTexture(0, 'container.jpg');
	addTexture(1, 'awesomeface.png');

	let textures = gl.getUniformLocation(gl.program, "textures");
	gl.uniform1iv(textures, [0,1]);
	

	startTime = Date.now() / 1000;
	setInterval(tick, 30);
} 

function tick() {
	let time = Date.now() / 1000 - startTime;
	let green = s(time) / 2.0 + 0.5;

	let vertexColorLocation = gl.getUniformLocation(gl.program, "ourColor");

	gl.uniform4f(vertexColorLocation, 0, green, 0, 1);

	//								  vertex             color           texture coords
	let vertices = new Float32Array([-1.0,   1.0,  0.0,  1.0, 0.0, 0.0,  0.0, 1.0,
									 -1.0,  -1.0,  0.0,  0.0, 1.0, 0.0,  0.0, 0.0,
									  1.0,   1.0,  0.0,  0.0, 1.0, 0.0,  1.0, 1.0,
									  1.0,  -1.0,  0.0,  0.0, 0.0, 1.0,  1.0, 0.0 ]); 
		
		
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / vertexSize);

}

function drawShape(mesh, color) {
	gl.uniform3fv      (uColor    , color);
	gl.uniformMatrix4fv(uMatrix   , false, mTop());
	gl.uniformMatrix4fv(uInvMatrix, false, mInverse(mTop()));
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
