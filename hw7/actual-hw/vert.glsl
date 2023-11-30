attribute vec3 aPos, aNor;
uniform mat4 uMatrix, uInvMatrix;
varying vec3 vPos, vNor;
void main() {
  vec4 pos = uMatrix * vec4(aPos, 1.0);
  vec4 nor = vec4(aNor, 0.0) * uInvMatrix;
  vPos = pos.xyz;
  vNor = nor.xyz;
  gl_Position = pos * vec4(1.,1.,-.1,1.);
}