precision mediump float;
uniform int uIsTexture[2];
uniform sampler2D uSampler[2];
varying vec3 vNor, vTan, vaPos;
varying vec2 vUV;

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

void main(void) {
	vec3 nor = normalize(vNor);

	// OPTIONALLY ADD BUMP TEXTURE
	if (uIsTexture[1] == 1) {
		vec4 T = texture2D(uSampler[1], vUV);
		vec3 tan = normalize(vTan);
		vec3 bin = cross(nor, tan);
		nor = normalize(nor + (2.*T.r-1.) * tan + (2.*T.g-1.) * bin);
	}

	// FOR THIS EXAMPLE, JUST USING FAKE LIGHTING
	vec3 color = vec3(.2) + max(0., nor.x) * vec3(.3,.4,.6)
						+ max(0.,-nor.x) * vec3(.6,.4,.3);

	// DO GAMMA CORRECTION
	color = sqrt(color);

	// OPTIONALLY ADD COLOR TEXTURE
	if (uIsTexture[0] == 1)
		color *= texture2D(uSampler[0], vUV).rgb;

	gl_FragColor = vec4(color, 1.);
}
