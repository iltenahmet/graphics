let matrixStack = []; 
matrixStack.push(mIdentity());

function mIdentity() {
	return [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
}

function mInverse(m) {
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

function mMult(a, b) {
	let dst = [];
	for (let n = 0 ; n < 16 ; n++)
		dst.push(a[n&3]*b[n&12] + a[n&3|4]*b[n&12|1] + a[n&3|8]*b[n&12|2] + a[n&3|12]*b[n&12|3]);
	return dst;
}

function c(time) {
	return Math.cos(time);
} 

function s(time) {
	return Math.sin(time)	
}

// sets the top element in the stack to the value
function mSet(value) {
	matrixStack[matrixStack.length - 1] = value;
}

function mTop() {
	return matrixStack[matrixStack.length - 1];
}

function mPop() {
	matrixStack.pop();
}

function mDuplicate() {
	matrixStack.push(mTop());
}

function mMove(x, y, z) {
	let matrix = mMult(mTop(), [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]);
	mSet(matrix);	
}

function mTurnX(t) {
	let matrix = mMult(mTop(), [1,0,0,0, 0,c(t),s(t),0, 0,-s(t),c(t),0, 0,0,0,1]);
	mSet(matrix);
}

function mTurnY(t) {
	let matrix = mMult(mTop(), [c(t),0,-s(t),0, 0,1,0,0, s(t),0,c(t),0, 0,0,0,1]);
	mSet(matrix);
}

function mTurnZ(t) {
	let matrix = mMult(mTop(), [c(t),s(t),0,0, -s(t),c(t),0,0, 0,0,1,0, 0,0,0,1]);
	mSet(matrix);
}

function mScale(x, y, z) {
	let matrix = mMult(mTop(), [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]);
	mSet(matrix);
}

function mProject(x, y, z) {
	let matrix = mMult(mTop(), [1,0,0,x, 0,1,0,y, 0,0,1,z, 0,0,0,1]);
	mSet(matrix);
}

function mPerspective(fl) {
	let matrix = mMult(mTop(), [1,0,0,0, 0,1,0,0, 0,0,1,-1/fl, 0,0,0,1]);
	mSet(matrix);
}
