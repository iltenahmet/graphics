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

let matrix = [[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]], c = t => Math.cos(t), s = t => Math.sin(t),
	 m = value => value ? matrix[matrix.length-1] = value : matrix[matrix.length-1];

mSave     =   ()   => matrix.push(m());
mRestore  =   ()   => matrix.pop();
mIdentity =   ()   => m([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
mMove    = (x,y,z) => m(mMult(m(), [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]));
mTurnX   =    t    => m(mMult(m(), [1,0,0,0, 0,c(t),s(t),0, 0,-s(t),c(t),0, 0,0,0,1]));
mTurnY   =    t    => m(mMult(m(), [c(t),0,-s(t),0, 0,1,0,0, s(t),0,c(t),0, 0,0,0,1]));
mTurnZ   =    t    => m(mMult(m(), [c(t),s(t),0,0, -s(t),c(t),0,0, 0,0,1,0, 0,0,0,1]));
mScale   = (x,y,z) => m(mMult(m(), [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]));
mProject = (x,y,z) => m(mMult(m(), [1,0,0,x, 0,1,0,y, 0,0,1,z, 0,0,0,1]));
