precision mediump float;

const int MAX_SPHERES = 511;

uniform float uTime, uFL;
uniform vec3  uCursor;
uniform vec3  uC[MAX_SPHERES];
uniform vec4  uS[MAX_SPHERES];

varying vec3  vPos;

float raySphere(vec3 V, vec3 W, vec4 S) {
	vec3 C = S.xyz;
	float r = S.w;

	vec3 Vp = V - C;
	float b = dot(Vp,W);
	float c = dot(Vp,Vp) - r*r;
	float d = b*b - c;
	return d > 0. ? -b - sqrt(d) : -1.;
}

vec3 shadeSphere(vec4 S, vec3 P, vec3 L, vec3 color) {
	vec3 C = S.xyz;
	float r = S.w;

	vec3 N = (P - C) / r;
	return color * (vec3(.02,.02,.1) + vec3( .9 * max(0., dot(N, L)) ));
}

void main(void) {

	// SET BACKGROUND COLOR
	vec3 color = vec3(1.,1.,1.);

	// DEFINE A LIGHT DIRECTION
	vec3 L = normalize(vec3(1.,1.,1.));

	// FORM THE RAY FOR THIS PIXEL
	vec3 V = vec3(0.,0.,uFL);
	vec3 W = normalize(vec3(vPos.xy,-uFL));

	// RAY TRACE TO EACH SPHERE, CHOOSING THE NEAREST ONE
	float tMin = 1000.;
	for (int n = 0 ; n < MAX_SPHERES; n++) {
	    // if (n >= 2)
	    //     break;
		float t = raySphere(V, W, uS[n]);
		if (t > 0. && t < tMin) {
			color = shadeSphere(uS[n], V + t * W, L, uC[n]);
			tMin = t;
		}
	}

	gl_FragColor = vec4(sqrt(color), 1.);
}
