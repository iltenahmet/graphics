attribute vec3 aPos;
varying   vec3 vPos;

varying vec4 vertexColor;

void main() {
	gl_Position = vec4(aPos, 1.0);
	vPos = aPos;
	vertexColor = vec4(1.0, 0.0, 0.0, 1.0);
}
