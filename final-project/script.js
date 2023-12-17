// global variables
let gl = null;
let uColor = null; 
let matrix = null;
let invMatrix = null;
let vertices = null;
let startTime = 0;

//let vertexSize = 11;
let vertexSize = 5;
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
	//
	matrix = gl.getUniformLocation(gl.program, "matrix");
	invMatrix = gl.getUniformLocation(gl.program, "invMatrix");

	addTexture(0, 'container.jpg');
	addTexture(1, 'skeleton.png');

	let textures = gl.getUniformLocation(gl.program, "textures");
	gl.uniform1iv(textures, [0,1]);

	//vertices = sphere(20, 10);
	vertices = new Float32Array([
    -0.5, -0.5, -0.5,  0.0, 0.0,
     0.5, -0.5, -0.5,  1.0, 0.0,
     0.5,  0.5, -0.5,  1.0, 1.0,
     0.5,  0.5, -0.5,  1.0, 1.0,
    -0.5,  0.5, -0.5,  0.0, 1.0,
    -0.5, -0.5, -0.5,  0.0, 0.0,

    -0.5, -0.5,  0.5,  0.0, 0.0,
     0.5, -0.5,  0.5,  1.0, 0.0,
     0.5,  0.5,  0.5,  1.0, 1.0,
     0.5,  0.5,  0.5,  1.0, 1.0,
    -0.5,  0.5,  0.5,  0.0, 1.0,
    -0.5, -0.5,  0.5,  0.0, 0.0,

    -0.5,  0.5,  0.5,  1.0, 0.0,
    -0.5,  0.5, -0.5,  1.0, 1.0,
    -0.5, -0.5, -0.5,  0.0, 1.0,
    -0.5, -0.5, -0.5,  0.0, 1.0,
    -0.5, -0.5,  0.5,  0.0, 0.0,
    -0.5,  0.5,  0.5,  1.0, 0.0,

     0.5,  0.5,  0.5,  1.0, 0.0,
     0.5,  0.5, -0.5,  1.0, 1.0,
     0.5, -0.5, -0.5,  0.0, 1.0,
     0.5, -0.5, -0.5,  0.0, 1.0,
     0.5, -0.5,  0.5,  0.0, 0.0,
     0.5,  0.5,  0.5,  1.0, 0.0,

    -0.5, -0.5, -0.5,  0.0, 1.0,
     0.5, -0.5, -0.5,  1.0, 1.0,
     0.5, -0.5,  0.5,  1.0, 0.0,
     0.5, -0.5,  0.5,  1.0, 0.0,
    -0.5, -0.5,  0.5,  0.0, 0.0,
    -0.5, -0.5, -0.5,  0.0, 1.0,

    -0.5,  0.5, -0.5,  0.0, 1.0,
     0.5,  0.5, -0.5,  1.0, 1.0,
     0.5,  0.5,  0.5,  1.0, 0.0,
     0.5,  0.5,  0.5,  1.0, 0.0,
    -0.5,  0.5,  0.5,  0.0, 0.0,
    -0.5,  0.5, -0.5,  0.0, 1.0
	]);

	startTime = Date.now() / 1000;
	setInterval(tick, 30);
} 

function tick() {
	let time = Date.now() / 1000 - startTime;

	let m = mIdentity();
	m = mPerspective(3, m);
	m = mRotateX(-1, m);
	m = mTranslate(0, s(time) / 2, 0, m);

	gl.uniformMatrix4fv(matrix   , false, m);
	gl.uniformMatrix4fv(invMatrix, false, mInverse(m));
		
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.drawArrays(gl.TRIANGLES, 0, vertices.length / vertexSize);

}

function drawShape(mesh, color) {
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
