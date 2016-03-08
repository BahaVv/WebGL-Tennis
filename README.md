# WebGL-Tennis
An EXTREMELY basic virtual tennis clone for WebGL

## Controls
Player 1: W/S

Player 2: Up & Down arrow keys 

## Game logic
The main entities of the game are set up as Javascript objects in the initObjects() function. When the paddles are moved, they 
accelerate to a max speed. They will stop upon colliding with the top or bottom of the field. The ball initially starts at the center of 
the screen and moves horizontally to one of the sides, and will bounce off both the wall and paddles. When it collides with the  
top walls, the y direction will be negated, while the angle the ball richochets off a paddle is dependent on the position away 
from the center of the paddle in which it hits. Finally, the velocity of the paddle does impact an increase in velocity of the 
ball.

If the ball hits either of the two side edges, a player gains a point. The game is over when one of the two player's score is 
up to 10.

## Aesthetic Implementation
The top/bottom bars as well as the dotted line are rendered as a background for the canvas. To view
this, the opacity for the canvas is 0.0. When a player wins, the background is changed out to a win screen. The page should be reloaded to play again.
