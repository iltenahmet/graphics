async function fetchShader(path) {
	try {
		const response = await fetch(path);
		const text = await response.text();
		return text;
	} catch (error) {
		console.error(`There was a problem fetching the shader from ${path}:`, error);
	}
}

let mIdentity = () => [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
let mInverse = m => {
	let dst = [], det = 0, cofactor = (c, r) => {
		let s = (i, j) => m[c+i & 3 | (r+j & 3) << 2];
		return (c+r & 1 ? -1 : 1) * ( (s(1,1) * (s(2,2) * s(3,3) - s(3,2) * s(2,3)))
									- (s(2,1) * (s(1,2) * s(3,3) - s(3,2) * s(1,3)))
									+ (s(3,1) * (s(1,2) * s(2,3) - s(2,2) * s(1,3))) );
	}
	for (let n = 0 ; n < 16 ; n++) dst.push(cofactor(n >> 2, n & 3));
	for (let n = 0 ; n <  4 ; n++) det += m[n] * dst[n << 2]; 
	for (let n = 0 ; n < 16 ; n++) dst[n] /= det;
	return dst;
}
let matrixMultiply = (a, b) => {
	let dst = [];
	for (let n = 0 ; n < 16 ; n++)
		dst.push(a[n&3]*b[n&12] + a[n&3|4]*b[n&12|1] + a[n&3|8]*b[n&12|2] + a[n&3|12]*b[n&12|3]);
	return dst;
}
let mTranslate = (tx,ty,tz, m) => {
	return matrixMultiply(m, [1,0,0,0, 0,1,0,0, 0,0,1,0, tx,ty,tz,1]);
}
let mRotateX = (theta, m) => {
	let c = Math.cos(theta), s = Math.sin(theta);
	return matrixMultiply(m, [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);
}
let mRotateY = (theta, m) => {
	let c = Math.cos(theta), s = Math.sin(theta);
	return matrixMultiply(m, [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);
}
let mRotateZ = (theta, m) => {
	let c = Math.cos(theta), s = Math.sin(theta);
	return matrixMultiply(m, [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]);
}
let mScale = (sx,sy,sz, m) => {
	return matrixMultiply(m, [sx,0,0,0, 0,sy,0,0, 0,0,sz,0, 0,0,0,1]);
}
let mPerspective = (fl, m) => {
	return matrixMultiply(m, [1,0,0,0, 0,1,0,0, 0,0,1,-1/fl, 0,0,0,1]);
}

let start_gl = (canvas, meshData, vertexSize, vertexShader, fragmentShader) => {
	let gl = canvas.getContext("webgl");
	let program = gl.createProgram();
	gl.program = program;
	let addshader = (type, src) => {
		let shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);
		if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			throw "Cannot compile shader:\n\n" + gl.getShaderInfoLog(shader);
		gl.attachShader(program, shader);
	};
	addshader(gl.VERTEX_SHADER  , vertexShader  );
	addshader(gl.FRAGMENT_SHADER, fragmentShader);
	gl.linkProgram(program);
	if (! gl.getProgramParameter(program, gl.LINK_STATUS))
		throw "Could not link the shader program!";
	gl.useProgram(program);
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	let vertexAttribute = (name, size, position) => {
		let attr = gl.getAttribLocation(program, name);
		gl.enableVertexAttribArray(attr);
		gl.vertexAttribPointer(attr, size, gl.FLOAT, false, vertexSize * 4, position * 4);
	}
	vertexAttribute('aPos', 3, 0);
	vertexAttribute('aNor', 3, 3);
	return gl;
}

let createMesh1 = (nu, nv, p) => {
	let mesh = [];
	for (let j = 0 ; j < nv ; j++) {
		for (let i = 0 ; i < nu ; i++) {
			let u = i/nu, v = j/nv;
			let p00 = p(u     , v     );
			let p10 = p(u+1/nu, v     );
			let p01 = p(u     , v+1/nv);
			let p11 = p(u+1/nu, v+1/nv);
			mesh.push(p00, p10, p11);
			mesh.push(p11, p01, p00);
		}
	}
	return mesh.flat();
}

let createMesh = (nu, nv, p) => {
	let mesh = [];
	for (let j = nv ; j > 0 ; j--) {
		for (let i = 0 ; i <= nu ; i++)
			mesh.push(p(i/nu,j/nv), p(i/nu,j/nv-1/nv));
		mesh.push(p(1,j/nv-1/nv), p(0,j/nv-1/nv));
	}
	return mesh.flat();
}

let sphere = (nu, nv) => createMesh(nu, nv, (u,v) => {
	let theta = 2 * Math.PI * u;
	let phi = Math.PI * (v - .5);
	let x = Math.cos(phi) * Math.cos(theta),
	y = Math.cos(phi) * Math.sin(theta),
	z = Math.sin(phi);
	return [ x,y,z, x,y,z ];
});

let tube = (nu, nv) => createMesh(nu, nv, (u,v) => {
	let theta = 2 * Math.PI * u;
	let x = Math.cos(theta),
	y = Math.sin(theta),
	z = 2 * v - 1;
	return [ x,y,z, x,y,0 ];
});

let disk = (nu, nv) => createMesh(nu, nv, (u,v) => {
	let theta = 2 * Math.PI * u;
	let x = v * Math.cos(theta),
	y = v * Math.sin(theta);
	return [ x,y,0, 0,0,1 ];
});

let cylinder = (nu, nv) => createMesh(nu, nv, (u,v) => {
	let theta = 2 * Math.PI * u;
	let x = Math.cos(theta),
	y = Math.sin(theta);
	switch (5 * v >> 0) {
	case 0: return [ 0,0,-1, 0,0,-1 ];
	case 1: return [ x,y,-1, 0,0,-1 ];
	case 2: return [ x,y,-1, x,y, 0 ];
	case 3: return [ x,y, 1, x,y, 0 ];
	case 4: return [ x,y, 1, 0,0, 1 ];
	case 5: return [ 0,0, 1, 0,0, 1 ];
	}
});

let torus = (nu, nv) => createMesh(nu, nv, (u,v) => {
	let theta = 2 * Math.PI * u;
	let phi   = 2 * Math.PI * v;
	let ct = Math.cos(theta), cp = Math.cos(phi);
	let st = Math.sin(theta), sp = Math.sin(phi);
	let x = (1 + .5 * cp) * ct,
	y = (1 + .5 * cp) * st,
	z =      .5 * sp;
	return [ x,y,z, cp*ct,cp*st,sp ];
});

let strToTris = str => {
	let tris = [];
	for (let n = 0 ; n < str.length ; n++) {
		switch (str.charAt(n)) {
		case 'N': tris.push(-1    ); break;
		case 'n': tris.push(-0.577); break;
		case '0': tris.push( 0    ); break;
		case 'p': tris.push( 0.577); break;
		case 'P': tris.push( 1    ); break;
		}
	}
	return tris;
}

let cube = strToTris(`PNP00P PPP00P NPP00P  NPP00P NNP00P PNP00P
					  NPN00N PPN00N PNN00N  PNN00N NNN00N NPN00N
					  PPNP00 PPPP00 PNPP00  PNPP00 PNNP00 PPNP00
					  NNPN00 NPPN00 NPNN00  NPNN00 NNNN00 NNPN00
					  NPP0P0 PPP0P0 PPN0P0  PPN0P0 NPN0P0 NPP0P0
					  PNN0N0 PNP0N0 NNP0N0  NNP0N0 NNN0N0 PNN0N0`);

let octahedron = strToTris(`00Nnnn 0N0nnn N00nnn  P00pnn 0N0pnn 00Npnn
						    N00npn 0P0npn 00Nnpn  00Nppn 0P0ppn P00ppn
						    00Pnnp 0N0nnp N00nnp  P00pnp 0N0pnp 00Ppnp
						    N00npp 0P0npp 00Pnpp  00Pppp 0P0ppp P00ppp`);

let meshData = [
	{ type: 1, color: [1.,.05,.05], mesh: new Float32Array(sphere(20, 10)) },
	{ type: 1, color: [1.,.1,.1], mesh: new Float32Array(sphere(20, 10)) },
	{ type: 1, color: [1.,.15,.15], mesh: new Float32Array(sphere(20, 10)) },
	{ type: 1, color: [1.,.20,.20], mesh: new Float32Array(sphere(20, 10)) },
	{ type: 1, color: [1.,.25,.25], mesh: new Float32Array(sphere(20, 10)) },
	{ type: 1, color: [1.,.3,.3], mesh: new Float32Array(sphere(20, 10)) },
	// { type: 1, color: [.1,1.,.1], mesh: new Float32Array(tube(20, 1)) },
	// { type: 1, color: [.1,.1,1.], mesh: new Float32Array(disk(20, 1)) },
	// { type: 1, color: [1.,1.,.1], mesh: new Float32Array(cylinder(20, 6)) },
	// { type: 1, color: [1.,.1,.1], mesh: new Float32Array(torus(30, 20)) },
	// { type: 0, color: [.1,1.,1.], mesh: new Float32Array(cube) },
	// { type: 0, color: [1.,1.,1.], mesh: new Float32Array(octahedron) },
];

(async() => {
	let vertexSize = 6;
	let vertexShader =  await fetchShader("./vert.glsl");
	let fragmentShader = await fetchShader("./frag.glsl");

	setTimeout(() => {
		let gl = start_gl(canvas1, meshData, vertexSize, vertexShader, fragmentShader);

		let uColor     = gl.getUniformLocation(gl.program, "uColor");
		let uMatrix    = gl.getUniformLocation(gl.program, "uMatrix");
		let uInvMatrix = gl.getUniformLocation(gl.program, "uInvMatrix");

		let uTime =  gl.getUniformLocation(gl.program, "uTime");

		let startTime = Date.now() / 1000;
		setInterval(() => {
			let time = Date.now() / 1000 - startTime;

			for (let n = 0 ; n < meshData.length ; n++) {

				let m = mIdentity();
				m = mPerspective(3, m);
				//m = mRotateY(time, m);

				let c = .5 * Math.cos(2 * Math.PI * n / meshData.length);
				let s = .5 * Math.sin(2 * Math.PI * n / meshData.length);
				m = mTranslate(c,s,0, m);
				 m = mScale(.16,.16,.16, m);

				gl.uniform3fv      (uColor    , meshData[n].color);
				gl.uniformMatrix4fv(uMatrix   , false, m);
				gl.uniformMatrix4fv(uInvMatrix, false, mInverse(m));

				gl.uniform1f(uTime, time);

				let mesh = meshData[n].mesh;
				gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
				gl.drawArrays(meshData[n].type ? gl.TRIANGLE_STRIP : gl.TRIANGLES, 0, mesh.length / vertexSize);
			}
		}, 30);
	}, 100);
})();
