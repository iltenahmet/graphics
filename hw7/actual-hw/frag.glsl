precision mediump float;
uniform vec3 uColor;
varying vec3 vPos, vNor;
void main(void) {
  float c = .05 + max(0., dot(normalize(vNor), vec3(.57)));
  vec3 color = c * uColor;
  gl_FragColor = vec4(sqrt(color), 1.);
}