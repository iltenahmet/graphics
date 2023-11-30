precision mediump float;
uniform int uSlide;
uniform float uTime;
uniform vec3  uCursor;
varying vec3  vPos;

vec3 makeItBrighter(vec3 color) {
	return 2. * color;
}

vec3 applyCursor(vec3 color, float cursorSize) {
	vec3 xy = 1./cursorSize * (uCursor - vPos) * vec3(1., 1., 1.);
	return color + vec3(max(0., 1. - dot(xy, xy)));
}

void main() {
	vec2 uv = vec2(vPos.x, vPos.y);

	vec3 color = vec3(.2,.5,.9);

	for (int i = 0; i < 7; i++) {
		if (i >= uSlide) break;

		uv = fract(uv * 2.0) - 0.5;

		float c = (sin(uTime) + 1.)/2.;
		color.r += c/4.;
		color.b -= c/2.;
		
		float d = (length(uv)) * exp(-length(vPos) * (sin(uTime) + 1.)/2.);
		d = sin(d*8. + uTime)/8.;
		d = abs(d);
		d = smoothstep(0.0, 0.1, d);
		d = 0.02 / d;

		color -= vec3(d);

	}
	
	color = applyCursor(color, .05);

	gl_FragColor = vec4(sqrt(color), 1.);
}
