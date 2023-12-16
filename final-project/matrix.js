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
   let c = Math.cos(theta), s = Math.sin(theta);
   return mMult(m, [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);
}

let mRotateY = (theta, m) => {
   let c = Math.cos(theta), s = Math.sin(theta);
   return mMult(m, [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);
}

let mRotateZ = (theta, m) => {
   let c = Math.cos(theta), s = Math.sin(theta);
   return mMult(m, [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]);
}

let mScale = (sx,sy,sz, m) => {
   return mMult(m, [sx,0,0,0, 0,sy,0,0, 0,0,sz,0, 0,0,0,1]);
}

let mPerspective = (fl, m) => {
   return mMult(m, [1,0,0,0, 0,1,0,0, 0,0,1,-1/fl, 0,0,0,1]);
}

let c = (time) => {
	return Math.cos(time);
} 

let s = (time) => {
	return Math.sin(time)	
}

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

/*
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
