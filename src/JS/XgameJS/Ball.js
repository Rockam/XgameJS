/**
 * Defines a Ball.
 * @constructor
 * @param {Sprite} sprite - The sprite that represents the ball.
 * @param {Number} radius - The radius of the circle of the ball.
 * @param {Point} position - The position of the ball.
 * @param {Number} position - The position of the ball.
 * @param {Boolean} bounce - Determines if the ball can bounce or not.
 */
function Ball(sprite, radius, position, index, bounce, rotate) {
	"use strict";
	/*global Vector2, Circle*/
	this.Sprite = sprite;
	this.Circle = new Circle(radius, position.X, position.Y);

	//Physics properties
	this.SpeedV = Vector2.Zero();
	this.GroundFriction = 0.975;
	this.BallBounceFriction = 0.85;
	this.WallBounceFriction = 0.7;
	this.MaxRotationSpeedTransmision = 25;
	this.CurrentRotationSpeed = 0;

	//Platform game properties
	this.IsOnGround = false;

	//Drag & Drop properties
	this.IsDraggable = true;
	this.IsBeenDragged = false;

	//Other properties
	this.RandomDir = [-0.1, 0.1];
	this.Index = index;
	this.IsBounceOn = bounce;
	this.IsRotationOn = rotate;
}

/**
 * Updates the ball.
 * @name Update
 * @function
 * @param {Number} worldWidth - The width of the game world.
 * @param {Number} worldHeight - The height of the game world.
 * @param {Array} balls - Array of existing balls.
 * @param {Boolean} isGravityOn - Determines if the gravity is activated or not.
 * @param {GravityDirections} gravityDir - The gravity direction of the game world.
 * @param {Number} gravityForce - The gravity force value.
 * @memberOf Ball
 */
Ball.prototype.Update = function (worldWidth, worldHeight, balls, isGravityOn, gravityDir, gravityForce) {
	"use strict";
	/*global GravityDirections, Mouse, Point, hitTestPoint*/
	var self = this,
		randomDirImpulse = 0,
		len = 0,
		i = 0,
		j = 0;

	//Check if the mouse clicked a ball to drag it
	if (self.Circle.Contains(new Point(Mouse.X, Mouse.Y)) && self.IsDraggable && Mouse.LeftButtonPressed && !Mouse.IsDraggingSomething) {	//Si quitamos IsDraggingSom... ocurren cosas divertidas
		//Assign the sprite to the dragSprite variable
		self.IsBeenDragged = true;
		Mouse.IsDraggingSomething = true;
		self.CurrentRotationSpeed = 0;
		self.SpeedV.X = 0;
		self.SpeedV.Y = 0;
		i = self.Index;
		len = balls.length;

		//push the dragSprite to the end of the sprites
		//array so that it's displayed last
		self.Index = balls.length - 1;
		balls.push(self);

		//Splice the dragSprite from its previous
		//position in the sprites array
		balls.splice(i, 1);

		for (j = i; j < len - 1; j += 1) {
			balls[j].Index -= 1;
		}
	}
	
	//Update the Circle position with the mouse position
	if (Mouse.IsMoving && self.IsBeenDragged) {
		self.Circle.X = Mouse.X - self.Circle.Radius;
		self.Circle.Y = Mouse.Y - self.Circle.Radius;
	}
	
	//If the mouse left button was released drop the ball
	if (self.IsBeenDragged && !Mouse.LeftButtonPressed) {
		self.IsBeenDragged = false;
		Mouse.IsDraggingSomething = false;
	}
	
	//Apply gravity depending on the gravity direction
	if (isGravityOn && !self.IsBeenDragged) {

		//Random impulse when the balls are generated
		if (!self.IsOnGround && self.SpeedV.X === 0 && self.SpeedV.Y === 0) {
			randomDirImpulse = self.RandomDir[Math.floor(Math.random() * 2)];
		}

		switch (gravityDir) {

			//Gravity down
		case GravityDirections.G_DOWN:
			self.SpeedV.Y += gravityForce;
			self.SpeedV.X += randomDirImpulse;
			if (self.Circle.Bottom() >= worldHeight) {
				self.SpeedV.X *= self.GroundFriction;
				self.IsOnGround = true;
			}
			break;

			//Gravity up
		case GravityDirections.G_UP:
			self.SpeedV.Y -= gravityForce;
			self.SpeedV.X += randomDirImpulse;
			if (self.Circle.Top() <= 0) {
				self.SpeedV.X *= self.GroundFriction;
				self.IsOnGround = true;
			}
			break;

			//Gravity left
		case GravityDirections.G_LEFT:
			self.SpeedV.X -= gravityForce;
			self.SpeedV.Y += randomDirImpulse;
			if (self.Circle.Left() <= 0) {
				self.SpeedV.Y *= self.GroundFriction;
				self.IsOnGround = true;
			}
			break;

			//Gravity right
		case GravityDirections.G_RIGHT:
			self.SpeedV.X += gravityForce;
			self.SpeedV.Y += randomDirImpulse;
			if (self.Circle.Right() >= worldWidth) {
				self.SpeedV.Y *= self.GroundFriction;
				self.IsOnGround = true;
			}
			break;
		}

	}

	//Move the ball if it isn't dragged
	if (!self.IsBeenDragged) {
		self.Circle.X += self.SpeedV.X;
		self.Circle.Y += self.SpeedV.Y;
	}

	//Collision with balls
	len = balls.length;
	if (len > 1 && !self.IsBeenDragged) {
		for (i = 0; i < len; i += 1) {
			if (self.Index !== i) {
				self.CollisionWithBall(balls[i], self.IsBounceOn, self.IsRotationOn);
			}
		}
	}
	
	//Screen boundaries
	//Left
	if (self.Circle.Left() < 0) {
		if (self.IsBounceOn) {
			self.SpeedV.X *= -self.WallBounceFriction;
		}
		self.Circle.X = 0;
	}
	//Up
	if (self.Circle.Top() < 0) {
		if (self.IsBounceOn) {
			self.SpeedV.Y *= -self.WallBounceFriction;
		}
		self.Circle.Y = 0;
	}
	//Right
	if (self.Circle.Right() > worldWidth) {
		if (self.IsBounceOn) {
			self.SpeedV.X *= -self.WallBounceFriction;
		}
		self.Circle.X = worldWidth - self.Circle.Diameter();
	}
	//Down
	if (self.Circle.Bottom() > worldHeight) {
		if (self.IsBounceOn) {
			self.SpeedV.Y *= -self.WallBounceFriction;
		}
		self.Circle.Y = worldHeight - self.Circle.Diameter();
	}

	//Update the sprite
	self.Sprite.Position.X = self.Circle.X;
	self.Sprite.Position.Y = self.Circle.Y;

	//Update the sprite rotation
	self.Sprite.Rotation += self.CurrentRotationSpeed;
	self.CurrentRotationSpeed *= self.GroundFriction;
};

/**
 * Check if a ball collide with other ball. Besides, bounce and rotate the balls if needed.
 * @name CollisionWithBall
 * @function
 * @param {Ball} ball - The ball which will be checked to find a collision.
 * @memberOf Ball
 */
Ball.prototype.CollisionWithBall = function (ball) {
	"use strict";
	var self = this,
		overlapV = self.Circle.IsInsideCircle(ball.Circle),
		vector = null,
		d = null,
		angle = 0,
		b1Magnitude = 0,
		b2Magnitude = 0,
		s = null;

	//If the other ball is inside the other 
	if (overlapV !== false) {
		self.Circle.X += overlapV.X;
		self.Circle.Y += overlapV.Y;
		return true;
	}
	
	//Check if this ball is inside the other
	overlapV = self.Circle.Intersects(ball.Circle);
	
	//If there is a collision with the other ball move it away of the other
	if (overlapV !== false) {

		vector = overlapV.Y; //the vector between the balls centers
		d = vector.Normalize();
		angle = Math.atan2(d.X, d.X) * 180 / Math.PI;
		b1Magnitude = self.SpeedV.Length();
		b2Magnitude = ball.SpeedV.Length();

		//If rotation is activated then rotate the ball
		if (self.IsRotationOn) {
			if (
				(angle >= 0 && angle <= 90 && self.SpeedV.X > 0) ||
					(angle > 90 && angle <= 180 && self.SpeedV.X >= 0) ||
					(angle < 0 && angle >= -90 && self.SpeedV.X <= 0) ||
					(angle < -90 && angle >= -180 && self.SpeedV.X < 0)
			) {
				self.CurrentRotationSpeed = Math.min(Math.abs(b1Magnitude), self.MaxRotationSpeedTransmision);
				ball.CurrentRotationSpeed = -Math.min(Math.abs(b2Magnitude), ball.MaxRotationSpeedTransmision);
			} else {
				self.CurrentRotationSpeed = -Math.min(Math.abs(b1Magnitude), self.MaxRotationSpeedTransmision);
				ball.CurrentRotationSpeed = Math.min(Math.abs(b2Magnitude), ball.MaxRotationSpeedTransmision);
			}

			//Limit the rotation speeds
			if (Math.abs(self.CurrentRotationSpeed) < 1) {
				self.CurrentRotationSpeed = 0;
			}
			if (Math.abs(ball.CurrentRotationSpeed) < 1) {
				ball.CurrentRotationSpeed = 0;
			}
		}
		
		//Move circle 1 out of the collision by multiplying
		//the overlap with the normalized vector and add it to 
		//ball 1's position
		self.Circle.X += overlapV.X * d.X;
		self.Circle.Y += overlapV.X * d.Y;
		//Ocurren cosas diver al poner esto
		//ball.Circle.X += overlapV.X * overlapV.Y[0];
		//ball.Circle.Y += overlapV.X * overlapV.Y[1];

		if (self.IsBounceOn) {
			//Create a collision vector object to represent the bounce surface
			//Find the bounce surface's X and Y properties
			//(This represents the normal of the distance vector between the circles)
			s = new Vector2(vector.Y, -vector.X);

			//Bounce b1 off the surface
			self.BounceOffSurface(ball, s);
		}
		
		return true;
	}
	
	return false;
};

/**
 * Bounces the current ball with other ball given the virtual surface between them.
 * @name BounceOffSurface
 * @function
 * @param {Ball} ball - The ball which will bounced.
 * @param {Vector2} s - The surface to bounce off.
 * @memberOf Ball
 */
Ball.prototype.BounceOffSurface = function (ball, s) {
	"use strict";
	//1. Calculate the collision surface's properties

	
	var self = this,
		//Find the surface vector's left normal
		leftNormalV = new Vector2(s.Y, -s.X),
		//s.lx = s.Y;
		//s.ly = -s.X;

		//Find its magnitude
		sLength = s.Length(),

		//Find its normalized/unit vector values
		dV = s.Normalize(),

		//2. Bounce the ball off the surface (s)

		//Find the dot product between the object and the surface
		dp1 = self.SpeedV.X * dV.X + self.SpeedV.Y * dV.Y,

		//Project the object's velocity onto the collision surface
		p1V = new Vector2(dp1 * dV.X, dp1 * dV.Y),

		//Find the dot product of the object and the surface's left normal (s.lx and s.ly)
		dp2 = self.SpeedV.X * (leftNormalV.X / sLength) + self.SpeedV.Y * (leftNormalV.Y / sLength),

		//Project the object's velocity onto the surface's left normal
		p2V = new Vector2(dp2 * (leftNormalV.X / sLength), dp2 * (leftNormalV.Y / sLength)),
		bounceV = null;

	//Reverse the projection on the surface's left normal
	p2V.X *= -1;
	p2V.Y *= -1;

	//Add up the projections to create a new bounce vector
	bounceV = new Vector2(p1V.X + p2V.X, p1V.Y + p2V.Y);

	//Assign the bounce vector to the object's velocity
	self.SpeedV.X = bounceV.X * self.BallBounceFriction;
	self.SpeedV.Y = bounceV.Y * self.BallBounceFriction;
	if (!ball.IsBeenDragged) {
		ball.SpeedV.X = -bounceV.X * ball.BallBounceFriction;
		ball.SpeedV.Y = -bounceV.Y * ball.BallBounceFriction;
	}
};