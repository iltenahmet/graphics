   function vec3Dot(a, b){
      return (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
   }

   function vec3Length(v) {
      return Math.sqrt( v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
   }

   function vec3Normalize(v) {
      let len = vec3Length(v);
      if (len == 0) return;

      v[0] /= len;
      v[1] /= len;
      v[2] /= len;

      return v;
   }

