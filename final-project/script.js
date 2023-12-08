let vertexSize = 6;
let vertexShader = `
	attribute vec3 aPos, aNor;
	uniform mat4 uMatrix, uInvMatrix;
	varying vec3 vPos, vNor;
	void main() {
		vec4 pos = uMatrix * vec4(aPos, 1.0);
		vec4 nor = vec4(aNor, 0.0) * uInvMatrix;
		vPos = pos.xyz;
		vNor = nor.xyz;
		gl_Position = pos * vec4(1.,1.,-.1,1.);
	}
`;
let fragmentShader = `
	precision mediump float;
	uniform vec3 uColor;
	varying vec3 vPos, vNor;
	void main(void) {
		float c = .05 + max(0., dot(normalize(vNor), vec3(.57)));
		vec3 color = vec3(.03,.04,.08) + c * uColor;
		gl_FragColor = vec4(sqrt(color), 1.);
	}
`;

setTimeout(() => {
	let gl = start_gl(canvas1, vertexSize, vertexShader, fragmentShader);

	let uColor     = gl.getUniformLocation(gl.program, "uColor");
	let uMatrix    = gl.getUniformLocation(gl.program, "uMatrix");
	let uInvMatrix = gl.getUniformLocation(gl.program, "uInvMatrix");

	let drawShape = (mesh, color) => {
		gl.uniform3fv      (uColor    , color);
		gl.uniformMatrix4fv(uMatrix   , false, m());
		gl.uniformMatrix4fv(uInvMatrix, false, mInverse(m()));
		gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
		gl.drawArrays(mesh.type == 'TRIANGLES' ? gl.TRIANGLES : gl.TRIANGLE_STRIP, 0, mesh.length / vertexSize);
	}

	let startTime = Date.now() / 1000;
	setInterval(() => {
		let time = Date.now() / 1000 - startTime;

		mIdentity();

		let color = [.6,.3,.2];
		drawShape(sphere(20, 10), color);	
		
		drawShape(tube(20, 10), color);	

	}, 30);
}, 100);
