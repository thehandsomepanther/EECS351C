var topColr = new Float32Array([0.7, 0.7, 0.7]);	// North Pole: light gray
var equColr = new Float32Array([0.3, 0.7, 0.3]);	// Equator:    bright green
var botColr = new Float32Array([0.9, 0.9, 0.9]);	// South Pole: brightest gray.

function makeGroundGrid() {
  var xcount = 100;			// # of lines to draw in x,y to make the grid.
	var ycount = 100;
	var xymax	= 50.0;			// grid size; extends to cover +/-xymax in x and y.

  var xColr = new Float32Array([1.0, 1.0, 0.3]);	// bright yellow
 	var yColr = new Float32Array([0.5, 1.0, 0.5]);	// bright green.

	gndVerts = [];

	var xgap = xymax/(xcount-1);		// HALF-spacing between lines in x,y;
	var ygap = xymax/(ycount-1);		// (why half? because v==(0line number/2))

	// First, step thru x values as we make vertical lines of constant-x:
	for(v=0, j=0; v<2*xcount; v++, j+= floatsPerVertex) {
		if(v%2==0) {	// put even-numbered vertices at (xnow, -xymax, 0)
			gndVerts[j  ] = -xymax + (v  )*xgap;	// x
			gndVerts[j+1] = -xymax;					// y
			gndVerts[j+2] = 0.0;					// z
		}
		else {				// put odd-numbered vertices at (xnow, +xymax, 0).
			gndVerts[j  ] = -xymax + (v-1)*xgap;	// x
			gndVerts[j+1] = xymax;					// y
			gndVerts[j+2] = 0.0;					// z
		}
	}
	// Second, step thru y values as wqe make horizontal lines of constant-y:
	// (don't re-initialize j--we're adding more vertices to the array)
	for(v=0; v<2*ycount; v++, j+= floatsPerVertex) {
		if(v%2==0) {		// put even-numbered vertices at (-xymax, ynow, 0)
			gndVerts[j  ] = -xymax;					// x
			gndVerts[j+1] = -xymax + (v  )*ygap;	// y
			gndVerts[j+2] = 0.0;					// z
		}
		else {					// put odd-numbered vertices at (+xymax, ynow, 0).
			gndVerts[j  ] = xymax;					// x
			gndVerts[j+1] = -xymax + (v-1)*ygap;	// y
			gndVerts[j+2] = 0.0;					// z
		}
	}

  gndInds = [];

}

function makeSphere() {
  sphVerts = [];
  sphInds = [];

  var slices = 13;		// # of slices of the sphere along the z axis. >=3 req'd
  var sliceVerts	= 27;	// # of vertices around the top edge of the slice
  var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.

	var cos0 = 0.0;					// sines,cosines of slice's top, bottom edge.
	var sin0 = 0.0;
	var cos1 = 0.0;
	var sin1 = 0.0;
	var j = 0;							// initialize our array index
	var isLast = 0;
	var isFirst = 1;
	for(s=0; s<slices; s++) {	// for each slice of the sphere,
		if(s==0) {
			isFirst = 1;	// skip 1st vertex of 1st slice.
			cos0 = 1.0; 	// initialize: start at north pole.
			sin0 = 0.0;
		}
		else {					// otherwise, new top edge == old bottom edge
			isFirst = 0;
			cos0 = cos1;
			sin0 = sin1;
		}								// & compute sine,cosine for new bottom edge.
		cos1 = Math.cos((s+1)*sliceAngle);
		sin1 = Math.sin((s+1)*sliceAngle);
		if(s==slices-1) isLast=1;	// skip last vertex of last slice.
		for(v=isFirst; v< 2*sliceVerts-isLast; v++, j+=floatsPerVertex) {
			if(v%2==0)
			{
				sphVerts[j  ] = sin0 * Math.cos(Math.PI*(v)/sliceVerts);
				sphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts);
				sphVerts[j+2] = cos0;
			}
			else {
				sphVerts[j  ] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);		// x
				sphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts);		// y
				sphVerts[j+2] = cos1;											// w.
			}
		}
	}

  // Generate indices
  for (j = 0; j < slices; j++) {
    for (i = 0; i < slices; i++) {
      p1 = j * (slices+1) + i;
      p2 = p1 + (slices+1);

      sphInds.push(p1);
      sphInds.push(p2);
      sphInds.push(p1 + 1);

      sphInds.push(p1 + 1);
      sphInds.push(p2);
      sphInds.push(p2 + 1);
    }
  }
}

function makeCylinder() {
 var capVerts = 36;	// # of vertices around the topmost 'cap' of the shape
 var botRadius = 1;		// radius of bottom of cylinder (top always 1.0)

 cylVerts = [];
 cylInds = [];

	for(v=1,j=0; v<2*capVerts; v++,j+=floatsPerVertex) {
		if(v%2==0)
		{				// put even# vertices at center of cylinder's top cap:
			cylVerts[j  ] = 0.0; 			// x,y,z,w == 0,0,1,1
			cylVerts[j+1] = 0.0;
			cylVerts[j+2] = 1.0;
		}
		else {
			cylVerts[j  ] = Math.cos(Math.PI*(v-1)/capVerts);			// x
			cylVerts[j+1] = Math.sin(Math.PI*(v-1)/capVerts);			// y
			cylVerts[j+2] = 1.0;	// z
		}
	}
	for(v=0; v< 2*capVerts; v++, j+=floatsPerVertex) {
		if(v%2==0)	// position all even# vertices along top cap:
		{
				cylVerts[j  ] = Math.cos(Math.PI*(v)/capVerts);		// x
				cylVerts[j+1] = Math.sin(Math.PI*(v)/capVerts);		// y
				cylVerts[j+2] = 1.0;	// z
		}
		else		// position all odd# vertices along the bottom cap:
		{
				cylVerts[j  ] = botRadius * Math.cos(Math.PI*(v-1)/capVerts);		// x
				cylVerts[j+1] = botRadius * Math.sin(Math.PI*(v-1)/capVerts);		// y
				cylVerts[j+2] =-1.0;	// z
		}
	}
	for(v=0; v < (2*capVerts -1); v++, j+= floatsPerVertex) {
		if(v%2==0) {	// position even #'d vertices around bot cap's outer edge
			cylVerts[j  ] = botRadius * Math.cos(Math.PI*(v)/capVerts);		// x
			cylVerts[j+1] = botRadius * Math.sin(Math.PI*(v)/capVerts);		// y
			cylVerts[j+2] =-1.0;	// z
		}
		else {				// position odd#'d vertices at center of the bottom cap:
			cylVerts[j  ] = 0.0; 			// x,y,z,w == 0,0,-1,1
			cylVerts[j+1] = 0.0;
			cylVerts[j+2] =-1.0;
		}
	}
}

function makePyramid() {
  var botVerts = 4;	// # of vertices around the base of the pyramid
  var botRadius = 1;		// radius of bottom of cylinder (top always 1.0)

  // Create a (global) array to hold this cylinder's vertices;
  pyrVerts = [];
  pyrInds = [];
  // Create the sides of the pyramid
  for (v = 1, j = 0; v < 4 * botVerts; v++, j += floatsPerVertex) {
    if(v % 2 == 0) {	// position even #'d vertices around bot cap's outer edge
			pyrVerts[j  ] = botRadius * Math.cos(Math.PI*(v)/botVerts);		// x
			pyrVerts[j+1] = 0.0;		// y
			pyrVerts[j+2] = botRadius * Math.sin(Math.PI*(v)/botVerts);	// z
		}
		else {				// position odd #'d vertices at center of the bottom cap:
			pyrVerts[j  ] = 0.0; 			// x,y,z,w == 0,0,-1,1
			pyrVerts[j+1] = 1.0;
			pyrVerts[j+2] = 0.0;
		}
  }

  // Create the bottom of the pyramid
  for(v=0; v < (2 * botVerts + 1); v++, j+= floatsPerVertex) {
    if(v%2==0) {	// position even #'d vertices around bot cap's outer edge
      pyrVerts[j  ] = botRadius * Math.cos(Math.PI*(v)/botVerts);		// x
      pyrVerts[j+1] = 0.0		// y
      pyrVerts[j+2] = botRadius * Math.sin(Math.PI*(v)/botVerts);;	// z
    }
    else {				// position odd#'d vertices at center of the bottom cap:
      pyrVerts[j  ] = 0.0; 			// x,y,z,w == 0,0,-1,1
      pyrVerts[j+1] = 0.0;
      pyrVerts[j+2] = -1.0;
    }
  }
}
