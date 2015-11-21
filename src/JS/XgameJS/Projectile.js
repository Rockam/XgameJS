/**
 * Represents a projectile.
 * @constructor
 * @param {Sprite} sprite - The sprite of the punch.
 */
function Projectile(sprite) {
	"use strict";
	/*globals Vector2*/
	this.Sprite = sprite;
	this.Speed = 6;
	this.Power = 1;
	this.SpeedV = Vector2.Zero();
}

/**
 * Updates de projectile.
 * @name Update
 * @function
 * @param {Sprite} playerSprite - The player's sprite.
 * @param {Number} levelWidth - The width of the level.                    
 * @memberOf Projectile
 */
Projectile.prototype.Update = function () {
	"use strict";
	/*globals SpriteEffects*/
	var self = this,
		projectileSprite = self.Sprite,
		bounds = projectileSprite.Bounds();

    //TODO: Add your projectile's update logic here. Change this function arguments as you need
};