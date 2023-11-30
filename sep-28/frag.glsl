precision mediump float;
uniform float uTime;
uniform vec3  uCursor;
varying vec3  vPos;

float fl = 3.;
vec4 S  = vec4(0., 0., 0., .5);

float raySphere(vec3 V, vec3 W, vec4 S) {
	vec3 C = S.xyz;
	float r = S.w;

	vec3 Vp = V - C;
	float b = dot(Vp, W);
	float c = dot(Vp, Vp) - r*r; 
	float d = b*b - c;

	return d > 0. ? -b - sqrt(d) : -1.;
}

vec3 shadeSphere(vec4 S, vec3 P, vec3 L) {
	vec3 C = S.xyz;
	float r = S.w;

	vec3 N = (P - C) / r;
	return vec3(.02, .02, .1) + vec3(.9, max(0., dot(N, L)));
}

void main() {
	vec3 color = vec3(0., 0., .1);

	// Define a light direction
	vec L = normalize(vec3(1.,1.,1.));

	// Form the ray
	vec3 V = vec3(0., 0., fl);
	vec3 W = normalize(vec3(vPos.xy, -fl));

	float t = raySphere(V, W, S);
	if (t > 0.) {
		color = shadeSphere(S, V + t * W, L);
	}

	gl_FragColor = vec4(sqrt(color), 1.);
}