var gl;
var program;

function initGL(){
  var canvas = document.getElementById( "canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, 512, 512);
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

  // program = initShaders( gl, "vertex-shader", "fragment-shader" );
  // gl.useProgram( program );

  render();
}

function render() {

}
