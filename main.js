var gl;
var program;
var transY1 = 0.0;
var transY2 = 0.0;

var transYLoc;

var keys = {};

var leftpaddle, rightpaddle, ball;

function initObjects() {
  leftpaddle = {
    x: -0.875,
    y: 0,
    w: 0.05,
    h: 0.5,
    speed: 0,
    vertices: [
      vec2(-0.9, 0.25),
      vec2(-0.85, 0.25),
      vec2(-0.85, -0.25),
      vec2(-0.9, -0.25)
    ]
  };

  rightpaddle = {
    x: 0,
    y: 0,
    w: 0.05,
    h: 0.5,
    speed: 0,
    vertices: [
      vec2(0.85, 0.25),
      vec2(0.9, 0.25),
      vec2(0.9, -0.25),
      vec2(0.85, -0.25)
    ]
  };

  ball = {
    x: 0,
    y: 0,
    w: 0.04,
    h: 0.04,
    speed: 0,
    vertices: [
      vec2(-0.02, 0.02),
      vec2(0.02, 0.02),
      vec2(0.02, -0.02),
      vec2(-0.02, -0.02)
    ]
  };
}

function initGL(){
  var canvas = document.getElementById( "canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, 600, 600);
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

  initObjects();

  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  var vertexPositionLoc = gl.getAttribLocation(program, "vertexPosition");
  gl.vertexAttribPointer(vertexPositionLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPositionLoc);

  transYLoc = gl.getUniformLocation(program, "transY");

  render();
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  renderLeftPaddle();
  renderBall();
  renderRightPaddle();

  var fragColorLoc = gl.getUniformLocation(program, "fragColor");
  gl.uniform4f(fragColorLoc, 1.0, 1.0, 1.0, 1.0);

  keyUpdate();

  requestAnimFrame(render);
}

function renderLeftPaddle() {
  gl.bufferData(gl.ARRAY_BUFFER, flatten(leftpaddle.vertices), gl.STATIC_DRAW);
  gl.uniform1f(transYLoc, transY1);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, leftpaddle.vertices.length);
}

function renderRightPaddle() {
  gl.bufferData(gl.ARRAY_BUFFER, flatten(rightpaddle.vertices), gl.STATIC_DRAW);
  gl.uniform1f(transYLoc, transY2);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, rightpaddle.vertices.length);
}

function renderBall() {
  gl.bufferData(gl.ARRAY_BUFFER, flatten(ball.vertices), gl.STATIC_DRAW);
  gl.uniform1f(transYLoc, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, ball.vertices.length);
}

function keyUpdate() {
  if(keys[87]) transY1 += 0.05;
  if(keys[83]) transY1 -= 0.05;

  if(keys[38]) transY2 += 0.05;
  if(keys[40]) transY2 -= 0.05;
}

function keyDown(event) {
  keys[event.keyCode] = true;
}

function keyUp(event) {
  keys[event.keyCode] = false;
}
