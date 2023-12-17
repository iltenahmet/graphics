attribute vec3 aPos;
attribute vec3 aNor;
attribute vec2 aUV;
//attribute vec2 aTan;

uniform mat4 matrix;
uniform mat4 invMatrix;

varying vec4 vertexColor;
varying vec2 texCoord;

void main() {
	gl_Position = matrix * vec4(aPos, 1.0);
	texCoord = aUV;
}
