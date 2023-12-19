attribute vec3 aPos;
attribute vec3 aNor;
attribute vec2 aUV;

uniform mat4 uModel;
uniform mat4 uProj;
uniform mat4 uView;

varying vec4 vertexColor;
varying vec3 vPos;
varying vec3 vNor;
varying vec2 texCoord;

void main() {
	gl_Position = uProj * uView * uModel * vec4(aPos, 1.0);
	vPos = aPos;
    vNor = aNor;
	texCoord = aUV;
}
