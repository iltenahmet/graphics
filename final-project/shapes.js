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

function sphere(nu, nv) {
	return createTriangleStrip(nu, nv, sphere_p);
}

function sphere_p(u, v) {
	let theta = 2 * Math.PI * u;
	let phi = Math.PI * (v - .5);

	let x = Math.cos(phi) * Math.cos(theta);
	let y = Math.cos(phi) * Math.sin(theta);
	let z = Math.sin(phi);

	return [ x,y,z, x,y,z, u, v];
	//return [ x,y,z, u, v];
}

let plane = (nu, nv) => createTriangleStrip(nu, nv, (u,v) => {
   return [ 2*u-1,2*v-1,0,  0,0,1, u,v, 1,0,0 ]
});

let strToTris = str => {
   let tris = [];
   for (let n = 0 ; n < str.length ; n++)
      switch (str.charAt(n)) {
      case 'N': tris.push(-1    ); break;
      case 'n': tris.push(-0.577); break;
      case '0': tris.push( 0    ); break;
      case 'p': tris.push( 0.577); break;
      case 'P': tris.push( 1    ); break;
      }
   return new Float32Array(tris);
}

let cube = strToTris(` PNP00P00 PPP00PP0 NPP00PPP  NPP00PPP NNP00P0P PNP00P00
                       NPN00N00 PPN00NP0 PNN00NPP  PNN00NPP NNN00N0P NPN00N00
                       PPNP0000 PPPP00P0 PNPP00PP  PNPP00PP PNNP000P PPNP0000
                       NNPN0000 NPPN00P0 NPNN00PP  NPNN00PP NNNN000P NNPN0000
                       NPP0P000 PPP0P0P0 PPN0P0PP  PPN0P0PP NPN0P00P NPP0P000
                       PNN0N000 PNP0N0P0 NNP0N0PP  NNP0N0PP NNN0N00P PNN0N000 `);

/*
let cube = new Float32Array([
	// vertices        texture coord
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
*/
