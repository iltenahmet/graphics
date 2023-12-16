precision mediump float;
varying vec4 vertexColor;

uniform vec4 ourColor;

void main(void) {
	//gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0);
	gl_FragColor = ourColor;
}
