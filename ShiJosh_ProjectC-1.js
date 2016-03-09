var VSHADER_SOURCE =
	'struct LampT {\n' +		// Describes one point-like Phong light source
	'		vec3 pos;\n' +			// (x,y,z,w); w==1.0 for local light at x,y,z position
	' 	vec3 ambi;\n' +			// Ia ==  ambient light source strength (r,g,b)
	' 	vec3 diff;\n' +			// Id ==  diffuse light source strength (r,g,b)
	'		vec3 spec;\n' +			// Is == specular light source strength (r,g,b)
	'}; \n' +
	'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
	'		vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
	'		vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
	'		vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
	'		vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
	'		int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
  '		};\n' +
	'uniform LampT u_LampSet[2];\n' +		// Array of all light sources.
	'uniform MatlT u_MatlSet[1];\n' +		// Array of all materials.
  'attribute vec4 a_Position; \n' +		// vertex position (model coord sys)
  'attribute vec4 a_Normal; \n' +			// vertex normal vector (model coord sys)
  'uniform mat4 u_MvpMatrix; \n' +
  'uniform mat4 u_ModelMatrix; \n' + 		// Model matrix
  'uniform mat4 u_NormalMatrix; \n' +  	// Inverse Transpose of ModelMatrix;
	'uniform bool gourand; \n' +  	// Inverse Transpose of ModelMatrix;
	'uniform bool blinn; \n' +  	// Inverse Transpose of ModelMatrix;
	'uniform vec3 u_eyePosWorld; \n' + 	// Camera/eye location in world coords.
	'varying vec3 v_Kd; \n' +							// Phong Lighting: diffuse reflectance
  'varying vec4 v_Position; \n' +
  'varying vec3 v_Normal; \n' +					// Why Vec3? its not a point, hence w==0
	'varying vec4 v_Color; \n' +					// Why Vec3? its not a point, hence w==0
  'void main() { \n' +
	'	 if (gourand) {\n' +
	'  vec4 position = u_ModelMatrix * a_Position;\n' +
	'  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal)); \n' +
	'  vec3 lightDirection = normalize(u_LampSet[0].pos - position.xyz);\n' +
	'  vec3 eyeDirection = normalize(u_eyePosWorld - position.xyz); \n' +
	'  float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
			// The Blinn-Phong lighting model computes the specular term faster
			// because it replaces the (V*R)^shiny weighting with (H*N)^shiny,
			// where 'halfway' vector H has a direction half-way between L and V
			// H = norm(norm(V) + norm(L)).  Note L & V already normalized above.
			// (see http://en.wikipedia.org/wiki/Blinn-Phong_shading_model)
	'  vec3 H = normalize(lightDirection + eyeDirection); \n' +
	'  float nDotH = max(dot(H, normal), 0.0); \n' +
	'  float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +

	'	 vec3 lamp0_emissive = 										u_MatlSet[0].emit;' +
	'  vec3 lamp0_ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi;\n' +
	'  vec3 lamp0_diffuse = u_LampSet[0].diff * v_Kd * nDotL;\n' +
	'	 vec3 lamp0_speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64;\n' +

	'  lightDirection = normalize(u_LampSet[1].pos - position.xyz);\n' +
	'  eyeDirection = normalize(u_eyePosWorld - position.xyz); \n' +
	'  nDotL = max(dot(lightDirection, normal), 0.0); \n' +
	'  H = normalize(lightDirection + eyeDirection); \n' +
	'  nDotH = max(dot(H, normal), 0.0); \n' +
	'  e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +

	'	 vec3 headlamp_emissive = 										u_MatlSet[0].emit;' +
	'  vec3 headlamp_ambient = u_LampSet[1].ambi * u_MatlSet[0].ambi;\n' +
	'  vec3 headlamp_diffuse = u_LampSet[1].diff * v_Kd * nDotL;\n' +
	'	 vec3 headlamp_speculr = u_LampSet[1].spec * u_MatlSet[0].spec * e64;\n' +
	'  v_Color = vec4(lamp0_emissive + lamp0_ambient + headlamp_emissive + headlamp_ambient, 1.0);\n' +
	'  } else {\n'+
	'  \n' +
	'  }\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Position = u_ModelMatrix * a_Position; \n' +
  '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	'	 v_Kd = u_MatlSet[0].diff; \n' +
  '}\n';

var FSHADER_SOURCE =
  'precision highp float;\n' +
  'precision highp int;\n' +
	'struct LampT {\n' +		// Describes one point-like Phong light source
	'		vec3 pos;\n' +			// (x,y,z,w); w==1.0 for local light at x,y,z position
	' 	vec3 ambi;\n' +			// Ia ==  ambient light source strength (r,g,b)
	' 	vec3 diff;\n' +			// Id ==  diffuse light source strength (r,g,b)
	'		vec3 spec;\n' +			// Is == specular light source strength (r,g,b)
	'}; \n' +
	'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
	'		vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
	'		vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
	'		vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
	'		vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
	'		int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
  '		};\n' +
	'uniform LampT u_LampSet[2];\n' +		// Array of all light sources.
	'uniform MatlT u_MatlSet[1];\n' +		// Array of all materials.
	'uniform bool gourand; \n' +  	// Inverse Transpose of ModelMatrix;
	'uniform bool blinn; \n' +  	// Inverse Transpose of ModelMatrix;
  'uniform vec3 u_eyePosWorld; \n' + 	// Camera/eye location in world coords.
	'varying vec4 v_Color; \n' + 	// Camera/eye location in world coords.
  'varying vec3 v_Normal;\n' +				// Find 3D surface normal at each pix
  'varying vec4 v_Position;\n' +			// pixel's 3D pos too -- in 'world' coords
  'varying vec3 v_Kd;	\n' +						// Find diffuse reflectance K_d per pix
  'void main() { \n' +
	'	 if (gourand) {\n' +
	'  gl_FragColor = v_Color;\n' +
	'  } else {\n'+
	'  vec3 normal = normalize(v_Normal); \n' +
	'  vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position.xyz);\n' +
	'  vec3 eyeDirection = normalize(u_eyePosWorld - v_Position.xyz); \n' +
	'  float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
			// The Blinn-Phong lighting model computes the specular term faster
			// because it replaces the (V*R)^shiny weighting with (H*N)^shiny,
			// where 'halfway' vector H has a direction half-way between L and V
			// H = norm(norm(V) + norm(L)).  Note L & V already normalized above.
			// (see http://en.wikipedia.org/wiki/Blinn-Phong_shading_model)
	'  vec3 H = normalize(lightDirection + eyeDirection); \n' +
	'  float nDotH = max(dot(H, normal), 0.0); \n' +
	'  vec3 C = normal * dot(lightDirection, normal); \n' +
	'	 vec3 R = 2.0 * C;\n' +
	'  R = R - lightDirection; \n' +
	'  float vDotR = max(dot(eyeDirection, R), 0.0); \n' +
	'  float e64; \n' +
	'  if (blinn) {\n' +
	'  e64 = pow(vDotR, float(u_MatlSet[0].shiny));\n' +
	'  } else {\n' +
	'  e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
	'  }\n' +
	'	 vec3 lamp0_emissive = 										u_MatlSet[0].emit;' +
	'  vec3 lamp0_ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi;\n' +
	'  vec3 lamp0_diffuse = u_LampSet[0].diff * v_Kd * nDotL;\n' +
	'	 vec3 lamp0_speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64;\n' +

	'  lightDirection = normalize(u_LampSet[1].pos - v_Position.xyz);\n' +
	'  eyeDirection = normalize(u_eyePosWorld - v_Position.xyz); \n' +
	'  nDotL = max(dot(lightDirection, normal), 0.0); \n' +
	'  H = normalize(lightDirection + eyeDirection); \n' +
	'  nDotH = max(dot(H, normal), 0.0); \n' +
	'  e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +

	'	 vec3 headlamp_emissive = 										u_MatlSet[0].emit;' +
	'  vec3 headlamp_ambient = u_LampSet[1].ambi * u_MatlSet[0].ambi;\n' +
	'  vec3 headlamp_diffuse = u_LampSet[1].diff * v_Kd * nDotL;\n' +
	'	 vec3 headlamp_speculr = u_LampSet[1].spec * u_MatlSet[0].spec * e64;\n' +

	'  gl_FragColor = vec4(lamp0_emissive + lamp0_ambient + lamp0_diffuse + lamp0_speculr + headlamp_emissive + headlamp_ambient + headlamp_diffuse + headlamp_speculr, 1.0);\n' +
	'  }\n' +

  '}\n';

var isDrag=false;		// mouse-drag: true when user holds down mouse button
var xMclik=0.0;			// last mouse button-down position (in CVV coords)
var yMclik=0.0;
var xMdragTot=0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
var yMdragTot=0.0;

var uLoc_eyePosWorld 	= false;
var uLoc_ModelMatrix 	= false;
var uLoc_MvpMatrix 		= false;
var uLoc_NormalMatrix = false;

// ... for Phong material/reflectance:
var uLoc_Ke = false;
var uLoc_Ka = false;
var uLoc_Kd = false;
var uLoc_Kd2 = false;			// for K_d within the MatlSet[0] element.l
var uLoc_Ks = false;
var uLoc_Kshiny = false;

var u_gourand = false;
var u_blinn = false;

var g_last = Date.now();
var armAngle = 45;
var armDelta = 45;

//  ... for 3D scene variables (previously used as arguments to draw() function)
var canvas 	= false;
var gl 			= false;
var n_vcount= false;	// formerly 'n', but that name is far too vague and terse
											// to use safely as a global variable.

var	eyePosWorld = new Float32Array(3);	// x,y,z in world coords
var modelMatrix = new Matrix4();  // Model matrix
var	mvpMatrix 	= new Matrix4();	// Model-view-projection matrix
var	normalMatrix= new Matrix4();	// Transformation matrix for normals
var viewMatrix  = new Matrix4();

var lamp0 = new LightsT();
var lamp0_ambi = [0.4, 0.4, 0.4];
var lamp0_diff = [1.0, 1.0, 1.0];
var lamp0_spec = [1.0, 1.0, 1.0];

var headlamp = new LightsT();
var lamp0_on = true;
var headlamp_on = true;

var materials = [];
materials[0] = new Material(MATL_RED_PLASTIC);
materials[1] = new Material(MATL_OBSIDIAN);
materials[2] = new Material(MATL_JADE);
materials[3] = new Material(MATL_CHROME);

var floatsPerVertex = 3;

function main() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context \'gl\' for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  n_vcount = initVertexBuffers(gl);		// vertex count.
  if (n_vcount < 0) {
    console.log('Failed to set the vertex information: n_vcount false');
    return;
  }

  gl.clearColor(0.4, 0.4, 0.4, 1.0);
  gl.enable(gl.DEPTH_TEST);

  canvas.onmousedown	=	function(ev){myMouseDown( ev, gl, canvas) };
  canvas.onmousemove = 	function(ev){myMouseMove( ev, gl, canvas) };
  canvas.onmouseup = 		function(ev){myMouseUp(   ev, gl, canvas)};

	window.addEventListener("keydown", myKeyDown, false);
	window.addEventListener("change", myInputChange, false);

  // Create, save the storage locations of uniform variables: ... for the scene
  // (Version 03: changed these to global vars (DANGER!) for use inside any func)
  uLoc_eyePosWorld  = gl.getUniformLocation(gl.program, 'u_eyePosWorld');
  uLoc_ModelMatrix  = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  uLoc_MvpMatrix    = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  uLoc_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!uLoc_eyePosWorld ||
      !uLoc_ModelMatrix	|| !uLoc_MvpMatrix || !uLoc_NormalMatrix) {
  	console.log('Failed to get GPUs matrix storage locations');
  	return;
	}
	//  ... for Phong light source:
	// NEW!  Note we're getting the location of a GLSL struct array member:

  lamp0.u_pos  = gl.getUniformLocation(gl.program, 'u_LampSet[0].pos');
  lamp0.u_ambi = gl.getUniformLocation(gl.program, 'u_LampSet[0].ambi');
  lamp0.u_diff = gl.getUniformLocation(gl.program, 'u_LampSet[0].diff');
  lamp0.u_spec = gl.getUniformLocation(gl.program, 'u_LampSet[0].spec');
  if( !lamp0.u_pos || !lamp0.u_ambi	|| !lamp0.u_diff || !lamp0.u_spec	) {
    console.log('Failed to get GPUs Lamp0 storage locations');
    return;
  }

	headlamp.u_pos  = gl.getUniformLocation(gl.program, 'u_LampSet[1].pos');
  headlamp.u_ambi = gl.getUniformLocation(gl.program, 'u_LampSet[1].ambi');
  headlamp.u_diff = gl.getUniformLocation(gl.program, 'u_LampSet[1].diff');
  headlamp.u_spec = gl.getUniformLocation(gl.program, 'u_LampSet[1].spec');
  if( !headlamp.u_pos || !headlamp.u_ambi	|| !headlamp.u_diff || !headlamp.u_spec	) {
    console.log('Failed to get GPUs Headlamp storage locations');
    return;
  }

	uLoc_Ke = gl.getUniformLocation(gl.program, 'u_MatlSet[0].emit');
	uLoc_Ka = gl.getUniformLocation(gl.program, 'u_MatlSet[0].ambi');
	uLoc_Kd = gl.getUniformLocation(gl.program, 'u_MatlSet[0].diff');
	uLoc_Ks = gl.getUniformLocation(gl.program, 'u_MatlSet[0].spec');
	uLoc_Kshiny = gl.getUniformLocation(gl.program, 'u_MatlSet[0].shiny');

	if(!uLoc_Ke || !uLoc_Ka || !uLoc_Kd // || !uLoc_Kd2
		  		    || !uLoc_Ks || !uLoc_Kshiny
		 ) {
		console.log('Failed to get GPUs Reflectance storage locations');
		return;
	}

	u_gourand = gl.getUniformLocation(gl.program, 'gourand');
	if(!u_gourand) {
		console.log('Failed to get gourand storage location');
		return;
	}

	u_blinn = gl.getUniformLocation(gl.program, 'blinn');
	if(!u_blinn) {
		console.log('Failed to get blinn storage location');
		return;
	}
	// Position the camera in world coordinates:
	// (Note: uniform4fv() expects 4-element float32Array as its 2nd argument)

  // Init World-coord. position & colors of first light source in global vars;

	lamp0.I_pos.elements.set( [6.0, 5.0, 5.0]);

	var tick = function() {
		eyePosWorld.set([g_EyeX, g_EyeY, g_EyeZ]); // eye pos
		headlamp.I_pos.elements.set([g_EyeX, g_EyeY, g_EyeZ]); // eye pos

		if (headlamp_on) {
			headlamp.I_ambi.elements.set([0.4, 0.4, 0.4]);
		  headlamp.I_diff.elements.set([1.0, 1.0, 1.0]);
		  headlamp.I_spec.elements.set([1.0, 1.0, 1.0]);
		} else {
			headlamp.I_ambi.elements.set([0.0, 0.0, 0.0]);
			headlamp.I_diff.elements.set([0.0, 0.0, 0.0]);
			headlamp.I_spec.elements.set([0.0, 0.0, 0.0]);
		}

		if (lamp0_on) {
		  lamp0.I_ambi.elements.set(lamp0_ambi);
		  lamp0.I_diff.elements.set(lamp0_diff);
		  lamp0.I_spec.elements.set(lamp0_spec);
		} else {
		  lamp0.I_ambi.elements.set([0.0, 0.0, 0.0]);
		  lamp0.I_diff.elements.set([0.0, 0.0, 0.0]);
		  lamp0.I_spec.elements.set([0.0, 0.0, 0.0]);
		}

    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;

		armAngle = (armAngle + (armDelta * elapsed) / 1000.0) % 360;
    winResize();   // Draw the triangle
    requestAnimationFrame(tick, canvas);
  };
  tick();
}

function initVertexBuffers(gl) {
  makeGroundGrid();
	makeSphere();
	makeCylinder();
	makePyramid();

	var mySiz = gndVerts.length +
							sphVerts.length +
							cylVerts.length +
							pyrVerts.length;
	var nn = mySiz / floatsPerVertex;

	positions = [];
	indices = [];

	gndPosStart = 0;
	for(i=0, j=0; j < gndVerts.length; i++, j++) {
		positions[i] = gndVerts[j];
	}
	sphPosStart = i;
	for(j=0; j < sphVerts.length; i++, j++) {
		positions[i] = sphVerts[j];
	}
	cylPosStart = i;
	for(j=0; j < cylVerts.length; i++, j++) {
		positions[i] = cylVerts[j];
	}
	pyrPosStart = i;
	for(j=0; j < pyrVerts.length; i++, j++) {
		positions[i] = pyrVerts[j];
	}

	gndIndStart = 0;
	for(i=0, j=0; j < gndInds.length; i++, j++) {
		indices[i] = gndInds[j];
	}
	sphIndStart = i;
	for(j=0; j < sphInds.length; i++, j++) {
		indices[i] = sphInds[j];
	}
	cylIndStart = i;
	for(j=0; j < cylInds.length; i++, j++) {
		indices[i] = cylInds[j];
	}
	pyrIndStart = i;
	for(j=0; j < pyrInds.length; i++, j++) {
		indices[i] = pyrInds[j];
	}

  // Write the vertex property to buffers (coordinates and normals)
  // Use the same data for each vertex and its normal because the sphere is
  // centered at the origin, and has radius of 1.0.
  // We create two separate buffers so that you can modify normals if you wish.
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(positions), gl.FLOAT, 3))  return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

var shading_style = false;
var lighting_style = false;

function draw() {
	modelMatrix.setTranslate(0.0, 0.0, 0.0);
	mvpMatrix.translate(14.0, -3.0, -2.0);

	gl.uniform1i(u_gourand, shading_style, 1);     // Kshiny
	gl.uniform1i(u_blinn, lighting_style, 1);     // Kshiny

	gl.uniform3fv(uLoc_eyePosWorld, eyePosWorld);// use it to set our uniform

  gl.uniform3fv(lamp0.u_pos,  lamp0.I_pos.elements.slice(0,3));
  gl.uniform3fv(lamp0.u_ambi, lamp0.I_ambi.elements);		// ambient
  gl.uniform3fv(lamp0.u_diff, lamp0.I_diff.elements);		// diffuse
  gl.uniform3fv(lamp0.u_spec, lamp0.I_spec.elements);		// Specular

	gl.uniform3fv(headlamp.u_pos,  headlamp.I_pos.elements.slice(0,3));
  gl.uniform3fv(headlamp.u_ambi, headlamp.I_ambi.elements);		// ambient
  gl.uniform3fv(headlamp.u_diff, headlamp.I_diff.elements);		// diffuse
  gl.uniform3fv(headlamp.u_spec, headlamp.I_spec.elements);		// Specular

	gl.uniform3fv(uLoc_Ke, materials[0].K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(uLoc_Ka, materials[0].K_ambi.slice(0,3));				// Ka ambient
  gl.uniform3fv(uLoc_Kd, materials[0].K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(uLoc_Ks, materials[0].K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(uLoc_Kshiny, parseInt(materials[0].K_shiny, 10));     // Kshiny

	gl.viewport(0, 0, canvas.width, canvas.height);

	mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  mvpMatrix.lookAt(	eyePosWorld[0], eyePosWorld[1], eyePosWorld[2], // eye pos
  									g_LookX, g_LookY, g_LookZ, 				// aim-point (in world coords)
									  0,  0, 1);				// up (in world coords)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	drawMyScene(gl);
}

function drawMyScene(gl) {

	// mvpMatrix.rotate(180, 0.0, 0.0, 1.0);

	gl.uniform3fv(uLoc_Ke, materials[2].K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(uLoc_Ka, materials[2].K_ambi.slice(0,3));				// Ka ambient
	gl.uniform3fv(uLoc_Kd, materials[2].K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(uLoc_Ks, materials[2].K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(uLoc_Kshiny, parseInt(materials[2].K_shiny, 10));     // Kshiny

	pushMatrix(mvpMatrix);
	pushMatrix(mvpMatrix);

	mvpMatrix.multiply(modelMatrix);
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(uLoc_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_STRIP,
								gndPosStart/floatsPerVertex,
								gndVerts.length/floatsPerVertex);

	gl.uniform3fv(uLoc_Ke, materials[0].K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(uLoc_Ka, materials[0].K_ambi.slice(0,3));				// Ka ambient
	gl.uniform3fv(uLoc_Kd, materials[0].K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(uLoc_Ks, materials[0].K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(uLoc_Kshiny, parseInt(materials[0].K_shiny, 10));     // Kshiny

	mvpMatrix.translate(0.0, 0.0, 2.0);
	mvpMatrix.multiply(modelMatrix);
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(uLoc_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP,							// use this drawing primitive, and
								cylPosStart/floatsPerVertex,             // start at this vertex number, and
								cylVerts.length/floatsPerVertex);		// draw this many vertices

	pushMatrix(mvpMatrix);
	pushMatrix(mvpMatrix);
	mvpMatrix = popMatrix();
	pushMatrix(modelMatrix);

  modelMatrix.translate(1.0, 0.0, 2.0);
	modelMatrix.rotate(armAngle, 0, 1, 0);
	mvpMatrix.multiply(modelMatrix);
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(uLoc_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_STRIP,
								cylPosStart/floatsPerVertex,
								cylVerts.length/floatsPerVertex);

	modelMatrix = popMatrix();
	mvpMatrix = popMatrix();

	modelMatrix.translate(-1.0, 0.0, 2.0);
	modelMatrix.rotate(-armAngle, 0, 1, 0);
	mvpMatrix.multiply(modelMatrix);
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(uLoc_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_STRIP,
								cylPosStart/floatsPerVertex,
								cylVerts.length/floatsPerVertex);

	gl.uniform3fv(uLoc_Ke, materials[3].K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(uLoc_Ka, materials[3].K_ambi.slice(0,3));				// Ka ambient
	gl.uniform3fv(uLoc_Kd, materials[3].K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(uLoc_Ks, materials[3].K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(uLoc_Kshiny, parseInt(materials[3].K_shiny, 10));     // Kshiny

	mvpMatrix = popMatrix();

	mvpMatrix.translate(4.0, 4.0, 1.0);
	mvpMatrix.multiply(modelMatrix);
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(uLoc_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP,							// use this drawing primitive, and
								sphPosStart/floatsPerVertex,             // start at this vertex number, and
								sphVerts.length/floatsPerVertex);		// draw this many vertices

	pushMatrix(mvpMatrix);
	pushMatrix(mvpMatrix);
	mvpMatrix = popMatrix();
	pushMatrix(modelMatrix);

  modelMatrix.translate(1.0, 0.0, 2.0);
	modelMatrix.rotate(armAngle, 0, 1, 0);
	mvpMatrix.multiply(modelMatrix);
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(uLoc_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_STRIP,
								sphPosStart/floatsPerVertex,
								sphVerts.length/floatsPerVertex);

	modelMatrix = popMatrix();
	mvpMatrix = popMatrix();

	modelMatrix.translate(-1.0, 0.0, -2.0);
	modelMatrix.rotate(armAngle, 0, 1, 0);
	mvpMatrix.multiply(modelMatrix);
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(uLoc_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_STRIP,
								sphPosStart/floatsPerVertex,
								sphVerts.length/floatsPerVertex);

	gl.uniform3fv(uLoc_Ke, materials[1].K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(uLoc_Ka, materials[1].K_ambi.slice(0,3));				// Ka ambient
	gl.uniform3fv(uLoc_Kd, materials[1].K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(uLoc_Ks, materials[1].K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(uLoc_Kshiny, parseInt(materials[1].K_shiny, 10));     // Kshiny

	mvpMatrix = popMatrix();

	mvpMatrix.translate(-4.0, -4.0, 1.0);
	mvpMatrix.multiply(modelMatrix);
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(uLoc_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP,							// use this drawing primitive, and
								pyrPosStart/floatsPerVertex,             // start at this vertex number, and
								pyrVerts.length/floatsPerVertex);		// draw this many vertices

	pushMatrix(mvpMatrix);
	pushMatrix(mvpMatrix);
	mvpMatrix = popMatrix();
	pushMatrix(modelMatrix);

  modelMatrix.translate(1.0, 0.0, 2.0);
	modelMatrix.rotate(armAngle, 0, 1, 0);
	mvpMatrix.multiply(modelMatrix);
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(uLoc_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_STRIP,
								pyrPosStart/floatsPerVertex,
								pyrVerts.length/floatsPerVertex);

	modelMatrix = popMatrix();
	mvpMatrix = popMatrix();

	modelMatrix.translate(-1.0, 0.0, -2.0);
	modelMatrix.rotate(armAngle, 0, 1, 0);
	mvpMatrix.multiply(modelMatrix);
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(uLoc_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(uLoc_MvpMatrix, false, mvpMatrix.elements);
	gl.uniformMatrix4fv(uLoc_NormalMatrix, false, normalMatrix.elements);
	gl.drawArrays(gl.TRIANGLE_STRIP,
								pyrPosStart/floatsPerVertex,
								pyrVerts.length/floatsPerVertex);
}

function clearDrag() {
	xMdragTot = 0.0;
	yMdragTot = 0.0;

  lamp0.I_pos.elements.set([6.0, 5.0, 5.0]);
  draw();		// update GPU uniforms &  draw the newly-updated image.
}

function myMouseDown(ev, gl, canvas) {
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
  var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge

  var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
  						 (canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
							 (canvas.height/2);

	isDrag = true;											// set our mouse-dragging flag
	xMclik = x;													// record where mouse-dragging began
	yMclik = y;
};

function myMouseMove(ev, gl, canvas) {
	if(isDrag==false) return;				// IGNORE all mouse-moves except 'dragging'

  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
	var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge

  var x = (xp - canvas.width/2)  /
  						 (canvas.width/2);
	var y = (yp - canvas.height/2) /
							 (canvas.height/2);

	lamp0.I_pos.elements.set([
					lamp0.I_pos.elements[0],
					lamp0.I_pos.elements[1] + 4.0*(x-xMclik),
					lamp0.I_pos.elements[2] + 4.0*(y-yMclik)  ]);

	draw();

	xMdragTot += (x - xMclik);
	yMdragTot += (y - yMclik);
	xMclik = x;
	yMclik = y;
};

function myMouseUp(ev, gl, canvas) {
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
	var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge

  var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
  						 (canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
							 (canvas.height/2);
	console.log('myMouseUp  (CVV coords  ):  x, y=\t',x,',\t',y);

	isDrag = false;											// CLEAR our mouse-dragging flag, and
	xMdragTot += (x - xMclik);
	yMdragTot += (y - yMclik);
	console.log('myMouseUp: xMdragTot,yMdragTot =',xMdragTot,',\t',yMdragTot);
};

var theta = 2.875;
var g_EyeX = 21.25,
    g_EyeY = -3.75,
    g_EyeZ = 5.33;
var g_LookX = g_EyeX + Math.cos(theta);
    g_LookY = g_EyeY + Math.sin(theta);
		g_LookZ = 5.3;
var vel = 0.05;

function myKeyDown(ev) {

  switch(ev.keyCode)
	{
		case 87: 	// W
			d_z = (g_LookZ - g_EyeZ) * vel;
			d_x = (g_LookX - g_EyeX) * vel;
			d_y = (g_LookY - g_EyeY) * vel;
			g_EyeZ += d_z;
			g_LookZ += d_z;
			g_EyeX += d_x;
			g_LookX += d_x;
			g_EyeY += d_y;
			g_LookY += d_y;
      break;

		case 83:	// S
			d_z = (g_LookZ - g_EyeZ) * vel;
			d_x = (g_LookX - g_EyeX) * vel;
			d_y = (g_LookY - g_EyeY) * vel;
			g_EyeZ -= d_z;
			g_LookZ -= d_z;
			g_EyeX -= d_x;
			g_LookX -= d_x;
			g_EyeY -= d_y;
			g_LookY -= d_y;
      break;

    case 65:  // A
			g_EyeY += 0.1 * Math.cos(theta);
			g_LookY += 0.1 * Math.cos(theta);
			g_EyeX -= 0.1 * Math.sin(theta);
			g_LookX -= 0.1 * Math.sin(theta);
      break;

    case 68: // D
			g_EyeY -= 0.1 * Math.cos(theta);
			g_LookY -= 0.1 * Math.cos(theta);
			g_EyeX += 0.1 * Math.sin(theta);
			g_LookX += 0.1 * Math.sin(theta);
      break;

    case 38: // up arrow
      g_LookZ += 0.05;
      break;

    case 40: // down arrow
      g_LookZ -= 0.05;
      break;

    case 37: // left arrow
      theta += 0.025;
      g_LookY = g_EyeY + Math.sin(theta);
      g_LookX = g_EyeX + Math.cos(theta);
      break;

    case 39: // right arrow
      theta -= 0.025;
      g_LookY = g_EyeY + Math.sin(theta);
      g_LookX = g_EyeX + Math.cos(theta);
      break;

    case 81: // Q
      g_LookZ += 0.1;
      g_EyeZ += 0.1;
      break;

    case 69: // E
      g_LookZ -= 0.1;
      g_EyeZ -= 0.1;
      break;

		case 72: 	// H
			headlamp_on = !headlamp_on;
			break;

		case 74: 	// J
			lamp0_on = !lamp0_on;
			break;

		case 71: 	// G
			shading_style = !shading_style;
			break;

		case 70: 	// F
			lighting_style = !lighting_style;
			break;

    default:
      return;
	}
}

function myInputChange(ev) {
	console.log(ev)
	switch(ev.target.id) {
		case "ambient-r":
			lamp0_ambi[0] = ev.target.value;
			break;

		case "ambient-g":
			lamp0_ambi[1] = ev.target.value;
			break;

		case "ambient-b":
			lamp0_ambi[2] = ev.target.value;
			break;

		case "diffuse-r":
			lamp0_diff[0] = ev.target.value;
			break;

		case "diffuse-g":
			lamp0_diff[1] = ev.target.value;
			break;

		case "diffuse-b":
			lamp0_diff[2] = ev.target.value;
			break;

		case "specular-r":
			lamp0_spec[0] = ev.target.value;
			break;

		case "specular-g":
			lamp0_spec[1] = ev.target.value;
			break;

		case "specular-b":
			lamp0_spec[2] = ev.target.value;
			break;
	}
}

function winResize() {
  canvas = document.getElementById('webgl');	// get current canvas
  gl = getWebGLContext(canvas);
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	draw();
}
