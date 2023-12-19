precision mediump float;

varying vec3 vPos;
varying vec3 vNor;
varying vec2 texCoord;

uniform float uTime;
uniform sampler2D textures[2];
uniform bool uIsSphere;
uniform bool uIsSkeleton;

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
	float alpha = 1.0;

	//ligthing
	vec3 color = vec3(.2) + max(0., -nor.z) * vec3(.3,.4,.6) + max(0.,nor.z) * vec3(.6,.4,.3);
	color +=  max(0., -nor.y) * vec3(.3,.3,.6)+ max(0.,nor.y) * vec3(.55,.4,.4);
	color +=  max(0., -nor.x) * vec3(.3,.3,.6)+ max(0.,nor.x) * vec3(.55,.4,.4);

	if (uIsSphere) {
		color *= vec3(1.0, 0.1, 0.1);
	} else if (uIsSkeleton) {
		vec4 texture = texture2D(textures[1], texCoord);
		color *= texture2D(textures[1], texCoord).rgb;
		color *= turbulence(vPos) *  0.5;
		if (color.r + color.g + color.b < 0.1) alpha = 0.0;
	} else {
		vec4 texture = texture2D(textures[0], texCoord);
		color *= texture2D(textures[0], texCoord).rgb;
	}

	gl_FragColor = vec4(color, alpha);
}
