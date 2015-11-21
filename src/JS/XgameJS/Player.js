/**
 * Represents the player.
 * @constructor
 * @param {AnimatedSprite|Sprite} sprite - The player's sprite.
 */
function Player(sprite) {
	"use strict";
	/*globals Vector2, AnimatedSprite*/
	this.Sprite = sprite; //The player sprite

	//Physics properties
	this.SpeedV = Vector2.Zero();
	this.AccelerationV = Vector2.Zero();
	this.SpeedLimit = 4;
	this.GroundFriction = 1;

	//Platform game properties
	this.IsOnGround = undefined;
	this.JumpForce = -8;

	//Player States
	this.IDLE = 0;
	this.MOVING = 3;
	this.JUMPING = 4;
	//this.CROUCHED = 4;
	//[...]
	this.CurrentState = 0;
    
    this.Life = 10;
	
	//If the sprite is animated starts the sprite animation
	if (this.Sprite instanceof AnimatedSprite) {
		this.Sprite.StartAnimation();
	}
}

/**
 * Updates de player.
 * @name Update
 * @function
 * @param {Boolean} moveLeft - Tells if the player moved left or not.
 * @param {Boolean} moveRight - Tells if the player moved right or not.
 * @param {Boolean} jump - Tells if the player jumped or not.
 * @param {Number} levelWidth - The width of the level.
 * @param {Number} gravityForce - The gravity force.
 * @memberOf Player
 */
Player.prototype.Update = function (moveLeft, moveRight, jump, levelWidth, gravityForce) {
	"use strict";
	/*globals SpriteEffects*/
	var self = this,
		playerSprite = self.Sprite,
		bounds = self.Bounds();
    
    //TODO: Add your player's update logic here. Change this function arguments as you need
	
	//Screen boundaries
	//Left
	if (bounds.X < 0) {
		self.SpeedV.X = 0;
		playerSprite.Position.X = playerSprite.Position.X - bounds.X;
	}
	//Up
	if (bounds.Y < 0) {
		self.SpeedV.Y = 0;
		playerSprite.Position.Y = playerSprite.Position.Y - bounds.Y;
	}
	//Right
	if (bounds.X + bounds.Width > levelWidth) {
		self.SpeedV.X = 0;
		playerSprite.Position.X = levelWidth - (playerSprite.Right() - bounds.Right()) - bounds.Width;
	}
};

/**
 * The player's collision rectangle.
 * @name Bounds
 * @function
 * @memberOf Player
 */
Player.prototype.Bounds = function () {
	"use strict";
	/*globals Rectangle*/
	var self = this,
		spriteBounds = self.Sprite.Bounds();

	return new Rectangle(
		spriteBounds.X + spriteBounds.HalfWidth() / 2,
		spriteBounds.Y,
		spriteBounds.HalfWidth(),
		spriteBounds.Height
	);
};