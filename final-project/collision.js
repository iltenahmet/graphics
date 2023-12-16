class collisionSphere {
	constructor(point, r) {
		this.point = point;
		this.r = r;	
	}
}

class collisionPlane {
	constructor(points, normal) {
		this.p1 = points[0];
		this.p2 = points[1];
		this.p3 = points[2];
		this.p4 = points[3];
		this.normal = normal;
	}
}
