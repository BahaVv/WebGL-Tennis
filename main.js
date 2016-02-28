var gl;
var program;
var transY = 0.0;

function initGL(){
  var canvas = document.getElementById( "canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, 600, 600);
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

  var paddle1 = [
    vec4(-0.9, 0.25, 0.0, 1.0),
    vec4(-0.85, 0.25, 0.0, 1.0),
    vec4(-0.85, -0.25, 0.0, 1.0),
    vec4(-0.9, -0.25, 0.0, 1.0),

    vec4(-0.02, 0.02, 0.0, 1.0),
    vec4(0.02, 0.02, 0.0, 1.0),
    vec4(0.02, -0.02, 0.0, 1.0),
    vec4(-0.02, -0.02, 0.0, 1.0),

    vec4(0.85, 0.25, 0.0, 1.0),
    vec4(0.9, 0.25, 0.0, 1.0),
    vec4(0.9, -0.25, 0.0, 1.0),
    vec4(0.85, -0.25, 0.0, 1.0)
  ];

  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(paddle1), gl.STATIC_DRAW);

  var vertexPositionLoc = gl.getAttribLocation(program, "vertexPosition");
  gl.vertexAttribPointer(vertexPositionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPositionLoc);

  render();
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
  gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);

  var fragColorLoc = gl.getUniformLocation(program, "fragColor");
  gl.uniform4f(fragColorLoc, 1.0, 1.0, 1.0, 1.0);

  requestAnimFrame(render);
}

function keyInput() {

}
