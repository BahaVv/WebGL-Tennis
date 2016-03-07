var gl; // Application WebGL instance
var program; // Shader program (should contain vertex & fragment shaders)

var transY1 = 0.0; // Variable containing vertical translation for first paddle
var transY2 = 0.0; // Variable containing vertical translation for second paddle
var transYBall = 0.0; // Variable containing vertical translation for ball

var yDir = 1; // The direction of the ball in the y-axis

var transLoc; // trans Uniform location from shader
var fragColorLoc; // frag_color Uniform location from shader

var keys = {}; // Variable used to store currently pressed keys

var leftpaddle, rightpaddle, ball, field; // Game objects

/* initObjects(): Initialize game state for all basic game objects */
function initObjects() {
  // P1
  leftpaddle = {
    x: -0.925,
    y: 0,
    width: 0.05,
	  halfwidth: 0.025,
    height: 0.34,
	  halfheight: 0.17,
    speed: 0,
    vertices: [
      vec2(-0.95, 0.17),
      vec2(-0.9, 0.17),
      vec2(-0.9, -0.17),
      vec2(-0.95, -0.17)
    ]
  };

  // P2
  rightpaddle = {
    x: 0.925,
    y: 0,
    width: 0.05,
	  halfwidth: 0.025,
    height: 0.34,
	  halfheight: 0.17,
    speed: 0,
    vertices: [
      vec2(0.9, 0.17),
      vec2(0.95, 0.17),
      vec2(0.95, -0.17),
      vec2(0.9, -0.17)
    ]
  };

  // Tennis ball
  ball = {
    x: 0,
    y: 0,
    width: 0.04,
	  halfwidth: 0.02,
    height: 0.06,
	  halfheight: 0.03,
    speed: 0,
    color: vec4(1.0,1.0,1.0,1.0),
    vertices: [
      vec2(-0.02, 0.03),
      vec2(0.02, 0.03),
      vec2(0.02, -0.03),
      vec2(-0.02, -0.03)
    ]
  };

  // Play field
  field = {
    score1: 0, // P1 score
	   score2: 0, // P2 score
  };
}

/* initGL(): Spin up initial WebGL program state */
function initGL(){
  var canvas = document.getElementById( "canvas" ); // Grab canvas from HTML

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, 1024, 768); // Viewport size 1024x768
  gl.clearColor( 0.0, 0.0, 0.0, 0.0 ); // Background color is utterly transparent

  initObjects(); // Spin up game state

  // Set up score in webpage
  document.getElementById('score1').innerHTML = field.score1;
  document.getElementById('score2').innerHTML = field.score2;

  program = initShaders( gl, "vertex-shader", "fragment-shader" ); // Spin up our shader programs
  gl.useProgram( program ); // Bind shader program 'program' to currently used set of shaders

  var vertexBuffer = gl.createBuffer(); // Initialize buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // Bind vertexBuffer to currently used buffer

  var vertexPositionLoc = gl.getAttribLocation(program, "vertexPosition"); // Get 'vertexPosition' uniform
                                                                           // location from shader program
  gl.vertexAttribPointer(vertexPositionLoc, 2, gl.FLOAT, false, 0, 0); // Initialize it as an Attrib Array
  gl.enableVertexAttribArray(vertexPositionLoc); // Bind it as currently used attrib array

  transLoc = gl.getUniformLocation(program, "trans"); // Populate global variable w/ trans location
  fragColorLoc = gl.getUniformLocation(program, "fragColor"); // Populate global variable w/ frag_color location

  render();
}

/* render(): Main event loop, controls vertex/fragment rendering and fires
   collision detection/score update functions when necessary. */
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT); // Clear the buffer

  renderLeftPaddle();
  renderRightPaddle();
  renderBall();

  gl.uniform4f(fragColorLoc, 1.0, 1.0, 1.0, 1.0); // Set pixel color uniform to white

  keyUpdate(); // Check player key presses once per frame (60hz)
  ballCollisionUpdate(); // Check ball collision
  paddleCollisionUpdate(); // Check paddle collision

  requestAnimFrame(render); // Inform the browser we're ready to render another frame
}

/* renderLeftPaddle(): Render P1 vertices */
function renderLeftPaddle() {
  gl.bufferData(gl.ARRAY_BUFFER, flatten(leftpaddle.vertices), gl.STATIC_DRAW);
  gl.uniform2f(transLoc, 0, transY1);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, leftpaddle.vertices.length);
}

/* renderRightPaddle(): Render P2 vertices */
function renderRightPaddle() {
  gl.bufferData(gl.ARRAY_BUFFER, flatten(rightpaddle.vertices), gl.STATIC_DRAW);
  gl.uniform2f(transLoc, 0, transY2);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, rightpaddle.vertices.length);
}

transXBall = 0.01;

/* renderBall(): I mean...yeah. Renders the ball. */
function renderBall() {
  gl.bufferData(gl.ARRAY_BUFFER, flatten(ball.vertices), gl.STATIC_DRAW);
  gl.uniform4f(fragColorLoc, ball.color[0], ball.color[1], ball.color[2], ball.color[3]);
  gl.uniform2f(transLoc, ball.x, ball.y);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, ball.vertices.length);
  ball.x += transXBall;
  ball.y += transYBall;
}

/* ballCollisionUpdate(): Initial function for ball collision checks */
function ballCollisionUpdate() {

  // Check to see if ball is close enough to sides to care about paddles/score zone
  if (ball.x > 0.93) {
	  // Figure out if we're too far to collide, or if we're scoring

	  // NOTE: Paddle should not collide if ball midpoint is past paddle midpoint
	  // Also note, we're going to need some way to prevent multiple collisions on
	  // sequential frames, while the ball is moving away

    // Scoring always takes precedence
    if(ball.x > 1) {
      updateScore(1);
      resetBall(1);
	    return;
    }

    if(ball.x < -1) {
      updateScore(2);
      resetBall(2);
	    return;
    }
  }

  if (ball.x < -0.93) {
	 // Figure out if we're too far to collide, or if we're scoring

	 // Scoring always takes precedence
	if(ball.x > 1) {
      updateScore(1);
      resetBall(1);
	    return;
    }

    if(ball.x < -1) {
      updateScore(2);
      resetBall(2);
	    return;
    }
  }

  // Check to see if ball is touching wall
  // TODO: Ricochet physics
  if(ball.y > 1) {
    yDir = -1;
  }
  if(ball.y < -1) {
    yDir = 1;
  }
}

/* paddleCollisionUpdate(): Initial function for paddle collision checks */
function paddleCollisionUpdate() {
	// Check to see if paddle is touching either wall

	// Checking @ 0.967 because wall graphic extends to .977, and we want to
	// stop just a hair before the wall
	if (leftpaddle.y + leftpaddle.halfheight > 0.967) {
		// Update left paddle position by bumping it down
		// NOTE: could make some kind of acceleration function
		// that overrides player input to make this smooth
		// Could use a 'frame counter' to do this that would assist
		// with other timing events, too.
    transY1 = 0.967 - leftpaddle.halfheight;
    leftpaddle.y = transY1;
	}

	if (leftpaddle.y - leftpaddle.halfheight < -0.967) {
		// Update left paddle position by bumping it up
    transY1 = -0.967 + leftpaddle.halfheight;
    leftpaddle.y = transY1;
	}

	if (rightpaddle.y + rightpaddle.halfheight > 0.967) {
    // Update right paddle position by bumping it down
    transY2 = 0.967 - rightpaddle.halfheight;
    rightpaddle.y = transY2;
	}

	if (rightpaddle.y - rightpaddle.halfheight < -0.967) {
		// Update right paddle position by bumping it up
    transY2 = -0.967 + rightpaddle.halfheight;
    rightpaddle.y = transY2;
	}
}

/* resetBall(playerNum): resets the ball to be in the center of the screen and facing the
   player indicated by playerNum */
function resetBall(playerNum) {
  ball.x = 0;
  ball.y = 0;
  transXBall = 0.01 * ((playerNum % 2) ? -1 : 1);
}

/* changeColor(): update the ball with a random color after a paddle collision */
function changeColor() {
  ball.color = vec4(Math.random().toFixed(2),Math.random().toFixed(2),Math.random().toFixed(2),1.0);
}

/* updateScore(playerNum): updates the score of player #playerNum */
function updateScore(playerNum) {
  if(playerNum == 1) {
    field.score1 += 1;
    document.getElementById('score1').innerHTML = field.score1;
  } else {
    field.score2 += 1;
    document.getElementById('score2').innerHTML = field.score2;
  }
}

/* keyUpdate(): Checks for current key presses, and updates the player position accordingly */
function keyUpdate() {

  if(keys[87]) { // W -- Move P1 paddle up
    if(leftpaddle.speed < 0.5) leftpaddle.speed += 0.02;
     transY1 += 0.05 * leftpaddle.speed;
     leftpaddle.y = transY1;
  }
  if(keys[83]) {  // S -- Move P1 paddle down
    if(leftpaddle.speed < 0.5) leftpaddle.speed += 0.02;
    transY1 -= 0.05 * leftpaddle.speed;
    leftpaddle.y = transY1;
  }

  if(keys[38]) { // Up cursor key -- move P2 paddle up
    if(rightpaddle.speed < 0.5) rightpaddle.speed += 0.02;
    transY2 += 0.05 * rightpaddle.speed;
    rightpaddle.y = transY2
  }
  if(keys[40]) { // Down cursor key -- move P2 paddle down
    if(rightpaddle.speed < 0.5) rightpaddle.speed += 0.02;
    transY2 -= 0.05 * rightpaddle.speed;
    rightpaddle.y = transY2;
  }
}

/* keyDown(): Fires when key is pressed down, sets that key to pressed in the global keys variable */
// TODO: Less memory intensive way of doing this?
function keyDown(event) {
  event.preventDefault();
  keys[event.keyCode] = true;
}

/* keyUp(): Fires when key is released, sets that key to un-pressed in the global keys variable */
function keyUp(event) {
  leftpaddle.speed = 0;
  rightpaddle.speed = 0;
  keys[event.keyCode] = false;
}
