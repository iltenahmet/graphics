let cos = (t) => { return Math.cos(t); } 
let sin = (t) => { return Math.sin(t); }

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

let mMult = (a, b) => {
   let dst = [];
   for (let n = 0 ; n < 16 ; n++)
      dst.push(a[n&3]*b[n&12] + a[n&3|4]*b[n&12|1] + a[n&3|8]*b[n&12|2] + a[n&3|12]*b[n&12|3]);
   return dst;
}

let mTranslate = (tx,ty,tz, m) => {
   return mMult(m, [1,0,0,0, 0,1,0,0, 0,0,1,0, tx,ty,tz,1]);
}

let mRotateX = (theta, m) => {
   let c = cos(theta), s = sin(theta);
   return mMult(m, [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);
}

let mRotateY = (theta, m) => {
   let c = cos(theta), s = sin(theta);
   return mMult(m, [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);
}

let mRotateZ = (theta, m) => {
   let c = cos(theta), s = sin(theta);
   return mMult(m, [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]);
}

let mScale = (sx,sy,sz, m) => {
   return mMult(m, [sx,0,0,0, 0,sy,0,0, 0,0,sz,0, 0,0,0,1]);
}


let mPerspective = (fl, m) => {
   return mMult(m, [1,0,0,0, 0,1,0,0, 0,0,1,-1/fl, 0,0,0,1]);
}

function mMultVec4(m, vec4) {
    let r1 = m.slice(0, 4);
    let r2 = m.slice(4, 8);
    let r3 = m.slice(8, 12);
    let r4 = m.slice(12, 16);

    return [r1[0] * vec4[0] + r1[1] * vec4[1] + r1[2] * vec4[2] + r1[3] * vec4[3], 
	    r2[0] * vec4[0] + r2[1] * vec4[1] + r2[2] * vec4[2] + r2[3] * vec4[3],
	    r3[0] * vec4[0] + r3[1] * vec4[1] + r3[2] * vec4[2] + r3[3] * vec4[3], 
	    r4[0] * vec4[0] + r4[1] * vec4[1] + r4[2] * vec4[2] + r4[3] * vec4[3] ];
}

// Learned how look at works from: https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
function lookAt(pos, target, up) {
	let z = pos.subtract(target); 
	z.normalize();
	let x = up.cross(z); 
	x.normalize();
	let y = z.cross(x);
	y.normalize();
	
	return [
	   x.x, x.y, x.z, 0,
	   y.x, y.y, y.z, 0,
	   z.x, z.y, z.z, 0,
	   pos.x, pos.y, pos.z, 1];
}

/**
 * This function is from: https://github.com/toji/gl-matrix/blob/master/src/mat4.js#L1623
 * which is published under the MIT license.
 */
function mPerspectiveNO(fovy, aspect, near, far) {
	let out = [];

    const f = 1.0 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;

    out[8] = 0;
    out[9] = 0;
    out[11] = -1;

    out[12] = 0;
    out[13] = 0;
    out[15] = 0;

    if (far != null && far !== Infinity) {
		const nf = 1 / (near - far);
		out[10] = (far + near) * nf;
		out[14] = 2 * far * near * nf;
    } else {
		out[10] = -1;
		out[14] = -2 * near;
    }

    return out;
}

