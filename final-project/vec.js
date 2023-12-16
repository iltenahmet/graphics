class vec3 {
   constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
   }

   dot(other){
      return (this.x * other.x + this.y * other.y +this.z * other.z);
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
}
