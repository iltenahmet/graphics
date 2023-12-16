attribute vec3 aPos;
attribute vec3 aCol;
attribute vec2 aUV;

varying vec4 vertexColor;
varying vec2 texCoord;

void main() {
	gl_Position = vec4(aPos, 1.0);
	vertexColor = vec4(aCol, 1.0);
	texCoord = aUV;
}
