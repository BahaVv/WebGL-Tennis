# WebGL-Tennis
An EXTREMELY basic virtual tennis clone for WebGL

## Controls
Player 1: W/S

Player 2: Up & Down arrow keys 

## Game logic
The main entities of the game are set up as Javascript objects in the initObjects() function. When the paddles are moved, they accelerate to a max speed. They will stop upon colliding with the top or bottom of the field. The ball initially starts at the center of the screen and moves horizontally to one of the sides, and will bounce off both the wall and paddles. When it collides with the top walls, the y direction will be negated, while the angle the ball richochets off a paddle is dependent on the position away 
from the center of the paddle in which it hits. Finally, the velocity of the paddle does impact an increase in velocity of the 
ball.

If the ball hits either of the two side edges, a player gains a point. The game is over when one of the two players' scores reaches 10.

## Rendering Implementation
the vertices of all the objects are in seperate objects rather than a single array. The two paddles and ball have a vertices member which store the vertices to be rendered. In each individual render function, the vertices are sent to the ARRAY_BUFFER, and after sending a uniform2f to translate the object, it will be rendered on the screen.

The paddles are always white, but the paddle has a different color after collison with the paddle, so a uniform4f is passed to the fragment shader with the current color of the ball as found in ball.color.

## Collison Implementation
The implemented collision system uses an algorithm to reduce redundant checks. The paddles do not move on the x-axis, so ball-paddle collision is only checked when the ball.x is greater than 0.9 or ball.x is less than -0.9. Then we check the actual collision with using the x, y, halfwidth, and halfheight values of the paddle and ball to see if they collide. If they do, the x direction is reversed and the y direction will depend on the position the ball hits the paddle as described earlier.  

## Aesthetic Implementation
The top/bottom bars as well as the dotted line are rendered as a background for the canvas. To view
this, the opacity for the canvas is 0.0. When a player wins, the background is changed out to a win screen. The page should be reloaded to play again.
