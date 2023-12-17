function createTriangleStrip (nu, nv, p) {
	let vertices = [];
	for (let j = nv ; j > 0 ; j--) {
		for (let i = 0 ; i <= nu ; i++) {
			vertices.push(p(i/nu,j/nv), p(i/nu,j/nv-1/nv));
		}
		vertices.push(p(1,j/nv-1/nv), p(0,j/nv-1/nv));
	}
	let triangleStrip = new Float32Array(vertices.flat());
	triangleStrip.type = 'TRIANGLE_STRIP';
	return triangleStrip;
}

function stringToTriangles(str) {
	let vertices = [];
	for (let n = 0 ; n < str.length ; n++)
		switch (str.charAt(n)) {
		case 'N': vertices.push(-1    ); break;
		case 'n': vertices.push(-0.577); break;
		case '0': vertices.push( 0    ); break;
		case 'p': vertices.push( 0.577); break;
		case 'P': vertices.push( 1    ); break;
		}
	let triangles = new Float32Array(vertices);
	triangles.type = 'TRIANGLES';
	return triangles;
}

function sphere(nu, nv) {
	return createTriangleStrip(nu, nv, sphere_p);
}

function sphere_p(u, v) {
	let theta = 2 * Math.PI * u;
	let phi = Math.PI * (v - .5);

	let x = Math.cos(phi) * Math.cos(theta);
	let y = Math.cos(phi) * Math.sin(theta);
	let z = Math.sin(phi);

	//return [ x,y,z, x,y,z, u, v];
	return [ x,y,z, u, v];
}

function tube(nu, nv) {
	return createTriangleStrip(nu, nv, tube_p);
}

function tube_p(u, v){
	let theta = 2 * Math.PI * u;

	let x = Math.cos(theta);
	let y = Math.sin(theta);
	let z = 2 * v - 1;

	return [ x,y,z, x,y,0 ];
}

let disk = (nu, nv) => createTriangleStrip(nu, nv, (u,v) => {
	let theta = 2 * Math.PI * u;
	let x = v * Math.cos(theta),
		 y = v * Math.sin(theta);
	return [ x,y,0, 0,0,1 ];
});

let cylinder = (nu, nv) => createTriangleStrip(nu, nv, (u,v) => {
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

let torus = (nu, nv) => createTriangleStrip(nu, nv, (u,v) => {
	let theta = 2 * Math.PI * u;
	let phi   = 2 * Math.PI * v;
	let ct = Math.cos(theta), cp = Math.cos(phi);
	let st = Math.sin(theta), sp = Math.sin(phi);
	let x = (1 + .5 * cp) * ct,
		 y = (1 + .5 * cp) * st,
		 z =      .5 * sp;
	return [ x,y,z, cp*ct,cp*st,sp ];
});

/*
let cube = stringToTriangles(`PNP00P PPP00P NPP00P  NPP00P NNP00P PNP00P
							  NPN00N PPN00N PNN00N  PNN00N NNN00N NPN00N
						      PPNP00 PPPP00 PNPP00  PNPP00 PNNP00 PPNP00
						      NNPN00 NPPN00 NPNN00  NPNN00 NNNN00 NNPN00
							  NPP0P0 PPP0P0 PPN0P0  PPN0P0 NPN0P0 NPP0P0
						      PNN0N0 PNP0N0 NNP0N0  NNP0N0 NNN0N0 PNN0N0`);
*/

let octahedron = stringToTriangles(`00Nnnn 0N0nnn N00nnn  P00pnn 0N0pnn 00Npnn
								 N00npn 0P0npn 00Nnpn  00Nppn 0P0ppn P00ppn
								 00Pnnp 0N0nnp N00nnp  P00pnp 0N0pnp 00Ppnp
								 N00npp 0P0npp 00Pnpp  00Pppp 0P0ppp P00ppp`);

let plane = (nu, nv) => createTriangleStrip(nu, nv, (u,v) => {
   return [ 2*u-1,2*v-1,0,  0,0,1, u,v, 1,0,0 ]
});

let cube = new Float32Array([
	// vertices        // texture coord
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
	

