# WebGL-Tennis
An EXTREMELY basic virtual tennis clone for WebGL

## Controls
Player 1: W/S

Player 2: Up & Down arrow keys 

## Game logic
The main entities of the game are set up as Javascript objects in the initObjects() function. When the paddles are moved, they 
accelerate to a max speed. They also will collide with the top of the field and stop. The ball initially starts at the middle of 
the screen and goes horizontally to one of the sides, and will bounce off both the wall and paddles. When it collides with the  
topp walls, the y direction will be negated, while the angle the ball richochets off a paddle is dependent on the position away 
from the center of the paddle in which it hits. Finally, the velocity of the paddle does impact an increase in velocity of the 
ball.

If the ball hits either of the two side walls, a player gains a point and the game is over when one of the two player's score is 
up to 10.

## Aesthetic Implementation
To reduce strain on the CPU & GPU, the top bars as well as the dotted line are rendered as a background for the canvas. To view
this, the opacity for the canvas is 0.0. When a player wins, the background is changed out to a win screen and the page is to be 
reloaded to play again.
