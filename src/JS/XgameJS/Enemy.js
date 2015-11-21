/**
 * Represents one enemy.
 * @constructor
 * @param {AnimatedSprite|Sprite} sprite - The enemys's sprite.
 */
function Enemy(sprite) {
	"use strict";
	/*globals Vector2, setInterval, AnimatedSprite, SpriteEffects*/

	this.Sprite = sprite;

	//Physics properties
	this.SpeedV = Vector2.Zero();
	this.Speed = 0;

	//Platform game properties   
	this.IsOnGround = undefined;

	//Enemy States
	this.IDLE = 0;
	this.MOVING = 1;
	this.HITTED = 2;
	//this.TURNING = 3;
	//[...]
	this.CurrentState = 0;

	//Enemy attributtes
	this.Life = 5;
	
	//If the sprite is animated starts the sprite animation
	if (this.Sprite instanceof AnimatedSprite) {
		this.Sprite.StartAnimation();
	}
	
	//Change the enemy state every 2 seconds
	setInterval(this.ChangeEnemyState.bind(this), 2000);
}

/**
 * Updates de enemy.
 * @name Update
 * @function
 * @param {Number} levelWidth - The width of the level.
 * @param {Array} platforms - The platforms array.
 * @param {Number} gravityForce - The gravity force.
 * @memberOf Enemy
 */
Enemy.prototype.Update = function (levelWidth, platforms, gravityForce) {
	"use strict";
	var self = this,
		enemySprite = self.Sprite,
		bounds = self.Bounds();

    //TODO: Add your enemy's update logic here. Change this function arguments as you need

	//Screen boundaries
	//Left
	if (bounds.X < 0) {
		self.SpeedV.X = 0;
		enemySprite.Position.X = enemySprite.Position.X - bounds.Position.X;
	}
	//Up
	if (bounds.Y < 0) {
		self.SpeedV.Y = 0;
		enemySprite.Position.Y = enemySprite.Position.Y - bounds.Position.Y;
	}
	//Right
	if (bounds.X + bounds.Width > levelWidth) {
		self.SpeedV.X = 0;
		enemySprite.Position.X = levelWidth - (enemySprite.Right() - bounds.Right()) - bounds.Width;
	}

};

/**
 * Changes the enemy state randomly
 * @name ChangeEnemysState
 * @function
 * @memberOf Enemy
 */
Enemy.prototype.ChangeEnemyState = function () {
	"use strict";
	/*globals SpriteEffects*/
	var self = this,
		enemySprite = self.Sprite;
    
    //TODO: Change your enemy state logic here
};

/**
 * The enemys's collision rectangle.
 * @name Bounds
 * @function
 * @memberOf Enemy
 */
Enemy.prototype.Bounds = function () {
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