function start_gl(canvas, vertexSize, vertexShader, fragmentShader) {
	// GET THE 3D CONTEXT OF THE CANVAS
	let gl = canvas.getContext("webgl", {premultipliedAlpha: false});

	// CREATE A PROGRAM THAT WILL RUN ON THE GPU
	let program = gl.createProgram();
	gl.program = program;

	// THIS IS HOW WE COMPILE AND ATTACH A SHADER TO THE GPU PROGRAM
	let addshader = (type, src) => {
		let shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);
		if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			throw "Cannot compile shader:\n\n" + gl.getShaderInfoLog(shader);
		gl.attachShader(program, shader);
	};

	// ADD THE VERTEX AND FRAGMENT SHADERS
	addshader(gl.VERTEX_SHADER  , vertexShader  );
	addshader(gl.FRAGMENT_SHADER, fragmentShader);

	// LINK THE PROGRAM AND REPORT ANY ERRORS
	gl.linkProgram(program);
	if (! gl.getProgramParameter(program, gl.LINK_STATUS))
		throw "Could not link the shader program!";
	gl.useProgram(program);

	// DECLARE A PLACE FOR MY VERTICES TO GO DOWN ON THE GPU
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

	// PERMIT THE GPU TO RENDER NEARER THINGS IN FRONT OF FARTHER AWAY THINGS
	//gl.enable(gl.DEPTH_TEST);
	//gl.depthFunc(gl.LEQUAL);
	
	// make sure transparent png is ptransparent
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  // unpremultiplied alpha

	// SET ANY ONE ATTRIBUTE OF A VERTEX
	let vertexAttribute = (name, size, position) => {
		let attr = gl.getAttribLocation(program, name);
		gl.enableVertexAttribArray(attr);
		gl.vertexAttribPointer(attr, size, gl.FLOAT, false, vertexSize * 4, position * 4);
	}

	
	vertexAttribute('aPos', 3, 0);
	vertexAttribute('aNor', 3, 3);
	vertexAttribute('aUV', 2, 6);

	return gl;
}



