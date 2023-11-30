attribute vec3 aPos, aNor, aTan;
attribute vec2 aUV;
uniform mat4 uMatrix, uInvMatrix;
varying vec3 vNor, vTan, vPos, vaPos;
varying vec2 vUV;
void main() {
	vaPos = aPos;

	vec4 pos = uMatrix * vec4(aPos, 1.);
	vec4 nor = vec4(aNor, 0.0) * uInvMatrix;
	vec4 tan = vec4(aTan, 0.0) * uInvMatrix;

	vPos = pos.xyz;
	vNor = nor.xyz;
	vTan = tan.xyz;

	vUV = aUV;
	gl_Position = pos * vec4(1.,1.,-.1,1.);
}