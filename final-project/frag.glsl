precision mediump float;

varying vec4 vertexColor;
varying vec2 texCoord;

uniform sampler2D textures[2];

void main(void) {
	gl_FragColor = mix(texture2D(textures[0], texCoord), texture2D(textures[1], texCoord), 0.5) * vertexColor;
	//gl_FragColor = texture2D(textures[1], texCoord);
}
