precision mediump float;

uniform vec3 uColor;
varying vec3 vPos, vNor, vaPos;

uniform float uTime;

float noise(vec3 point) { 
	float r = 0.; 
	for (int i=0;i<16;i++) {
		vec3 p = point + mod(vec3(i,i/4,i/8) , vec3(4.0,2.0,2.0)) + 1.7 * sin(vec3(i,5*i,8*i)); 
		vec3 C = floor(p); 
		vec3 P = p - C - .5;
		vec3 A = abs(P);
		C += mod(C.x + C.y + C.z, 2.) * step(max(A.yzx,A.zxy), A) * sign(P);
		vec3 D = 34. * sin(987. * float(i) + 876. * C + 76. * C.yzx + 765. * C.zxy);
		P = p - C - .5;
		r += sin(6.3 * dot(P,fract(D)-.5)) * pow(max(0.,1.-2. * dot(P,P)), 4.);
	} 
	return .5 * sin(r); 
}


float turbulence(vec3 pos) {
	float frequency = 0.0;
	float scale = 1.0;
	for (int i = 0; i < 9; i++) {
		frequency += abs(noise(scale * pos)) / scale;
		scale *= 2.0;
		pos = vec3(0.866 * pos.x + 0.5 * pos.z, pos.y + 100.0, -0.5 * pos.x + 0.866 * pos.z);
	}
	return frequency * 10.;
}

vec3 blood(vec3 pos) {
	float turbulenceValue = turbulence(pos);
	return vec3(turbulenceValue / 2., pow(turbulenceValue, 2.) / 2., pow(turbulenceValue, 2.) / 2.);
}

void main(void) {
	float contrast = 0.05 + max(0.0, dot(normalize(vNor), vec3(0.57)));
	vec3 baseColor = contrast * uColor;

	float y = vaPos.y;
	y += turbulence(vPos + vec3(.1 * uTime, 0., .1 * uTime));

	vec3 finalColor = baseColor * blood(0.9 * vaPos);
	gl_FragColor = vec4(sqrt(finalColor), 1.0);
}
