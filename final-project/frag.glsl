precision mediump float;

varying vec2 texCoord;

uniform sampler2D textures[2];

void main(void) {
	vec4 texture1 = texture2D(textures[0], texCoord);
	vec4 texture2 = texture2D(textures[1], texCoord);
	//vec3  color =  mix(texture1, texture2, 0.5).rgb;
	//gl_FragColor = vec4(color, 1.0);
	gl_FragColor = texture2D(textures[0], texCoord);
}
