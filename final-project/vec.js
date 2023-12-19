class vec3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	dot(other){
		return (this.x * other.x + this.y * other.y +this.z * other.z);
	}

	//a×b=⟨a2b3−a3b2,a3b1−a1b3,a1b2−a2b1⟩
	cross(other) {
		return new vec3(this.y * other.z - this.z * other.y,
						this.z * other.x - this.x * other.z,
						this.x * other.y - this.y * other.x );   
	}

	length() {
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z);
	}

	normalize() {
		let len = this.length();
		if (len == 0) return;

		this.x /= len;
		this.y /= len;
		this.z /= len;
	}

	set(other) {
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;
	}

	subtract(other) {
		return new vec3(this.x - other.x, this.y - other.y, this.z - other.z);
	}

	add(other) {
		return new vec3(this.x + other.x, this.y + other.y, this.z + other.z);
	}

	multiplyByNum(num) {
		return new vec3(this.x * num, this.y * num, this.z * num);
	}

	toString() {
		let s = "<" + this.x + ", " + this.y + ", " + this.z + ">";
		return s;  
	}

	toArr() {
		return [this.x, this.y, this.z];
	}

}
