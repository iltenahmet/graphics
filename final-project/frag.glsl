precision mediump float;

varying vec4 vertexColor;
varying vec2 texCoord;

uniform sampler2D testTexture;

void main(void) {
	gl_FragColor = texture2D(testTexture, texCoord) * vertexColor;
}
