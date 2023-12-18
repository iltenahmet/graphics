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


// inputs are vec3
let mLookAt = (position, target, world_up) => {
   let direction = position.subtract(target);
   direction.normalize();

   let right = world_up.cross(direction);
   right.normalize();

   let up = right.cross(direction);
   up.normalize();

   let m1 = [ right.x,     right.y,     right.z,     0,
			  up.x,        up.y,        up.z   ,     0,
			  direction.x, direction.y, direction.z, 0,
			  0,           0,           0,           1  ];

   let m2 = [1, 0, 0, -position.x,
			 0, 1, 0, -position.y,
			 0, 0, 1, -position.z,
			 0, 0, 0,  1          ];

   return mMult(m1, m2);
}

function lookAt(out, eye, center, up) {
  let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  let eyex = eye[0];
  let eyey = eye[1];
  let eyez = eye[2];
  let upx = up[0];
  let upy = up[1];
  let upz = up[2];
  let centerx = center[0];
  let centery = center[1];
  let centerz = center[2];

  if (
    Math.abs(eyex - centerx) < 0.0001 &&
    Math.abs(eyey - centery) < 0.0001 &&
    Math.abs(eyez - centerz) < 0.0001
  ) {
    return mIdentity();
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

/**
 * This function is from https://github.com/toji/gl-matrix/blob/master/src/mat4.js#L1623
 * which is published under the MIT license.
 */
function mPerspectiveFromFieldOfView(out, fov, near, far) {
  let upTan = Math.tan((fov.upDegrees * Math.PI) / 180.0);
  let downTan = Math.tan((fov.downDegrees * Math.PI) / 180.0);
  let leftTan = Math.tan((fov.leftDegrees * Math.PI) / 180.0);
  let rightTan = Math.tan((fov.rightDegrees * Math.PI) / 180.0);
  let xScale = 2.0 / (leftTan + rightTan);
  let yScale = 2.0 / (upTan + downTan);

  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = (far * near) / (near - far);
  out[15] = 0.0;
  return out;
}

/**
 * This function is from https://github.com/toji/gl-matrix/blob/master/src/mat4.js#L1623
 * which is published under the MIT license.
 */
function mPerspectiveNO(out, fovy, aspect, near, far) {
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

/*
// sets the top element in the stack to the value
let mStackSet = (st, value) => {
	st[st.length - 1] = value;
}

let mStackTop = (st) => {
	return st[st.length - 1];
}

let mStackPop = (st) => {
	st.pop(st);
}

let mStackDuplicate = (st) => {
	st.push(mStackTop(st));
}


let mStackMove = (st, x, y, z) => {
	let matrix = mMult(mStackTop(st), [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]);
	mStackSet(matrix);	
}

let mStackRotateX= (st, t) => {
	let matrix = mMult(mStackTop(st), [1,0,0,0, 0,c(t),s(t),0, 0,-s(t),c(t),0, 0,0,0,1]);
	mStackSet(matrix);
}

let mStackRotateY= (st, t) => {
	let matrix = mMult(mStackTop(), [c(t),0,-s(t),0, 0,1,0,0, s(t),0,c(t),0, 0,0,0,1]);
	mStackSet(matrix);
}

let mStackRotateZ = (t) => {
	let matrix = mMult(mStackTop(), [c(t),s(t),0,0, -s(t),c(t),0,0, 0,0,1,0, 0,0,0,1]);
	mStackSet(matrix);
}

let mStackScale = (x, y, z) => {
	let matrix = mMult(mStackTop(), [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]);
	mStackSet(matrix);
}

let mStackProject = (x, y, z) => {
	let matrix = mMult(mStackTop(), [1,0,0,x, 0,1,0,y, 0,0,1,z, 0,0,0,1]);
	mStackSet(matrix);
}

let mStackPerspective = (fl) => {
	let matrix = mMult(mStackTop(), [1,0,0,0, 0,1,0,0, 0,0,1,-1/fl, 0,0,0,1]);
	mStackSet(matrix);
}
*/
