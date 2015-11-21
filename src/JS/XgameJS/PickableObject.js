/**
 * Defines a pickable object.
 * @constructor
 * @param {Sprite|AnimatedSprite} sprite - The sprite of the object.
 * @param {PickableObjectTypes} type - The object type.
 */
function PickableObject(sprite, type) {
	"use strict";
	/*globals AnimatedSprite*/
	this.Sprite = sprite;
	this.Type = type;
	
	//If th sprite is animated starts the sprite animation
	if (this.Sprite instanceof AnimatedSprite) {
		this.Sprite.StartAnimation();
	}
}

/**
 * The collision rectangle of the pickable object.
 * @name Update
 * @function
 * @memberOf PickableObject
 */
PickableObject.prototype.Bounds = function () {
	"use strict";
	/*globals Rectangle*/
	var self = this,
		spriteBounds = self.Sprite.Bounds();

	return new Rectangle(
		spriteBounds.X + spriteBounds.HalfWidth() / 2,
		spriteBounds.Y + spriteBounds.HalfHeight() / 2,
		spriteBounds.HalfWidth(),
		spriteBounds.HalfHeight()
	);
};