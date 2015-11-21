/**
 * Represents a sprite, which is composed of a Texture2D and other properties.
 * @constructor
 * @param {Texture2D} texture - The texture image.
 * @param {Vector2} scale - The scale vector of the image.
 * @param {Rectangle} sourceRect - The image source rectangle.
 * @param {Point} position - The sprite position in the canvas.
 * @param {Boolean} isVisible - Determines if the sprite is visible or not.
 */
function Sprite(texture, scale, sourceRect, position, isVisible) {
	"use strict";
	/*global SpriteEffects*/
	this.Texture = texture;
	this.Scale = scale;
	this.SourceRect = sourceRect;
	this.Position = position;
	this.IsVisible = isVisible;
	this.SpriteEffects = SpriteEffects.None;
	this.Rotation = 0;
}

/**
 * Gets the width of the sprite.
 * @name Width
 * @function
 * @memberOf Sprite
 */
Sprite.prototype.Width = function () {
	"use strict";
	var self = this,
		aspectRatio = self.Texture.Width() / self.Texture.Height(),
		sourceAspectRatio = self.SourceRect.Width / self.SourceRect.Height;

	if (aspectRatio !== sourceAspectRatio) {
		return (self.Texture.Width() * self.Scale.X) / aspectRatio;
	} else {
		return self.Texture.Width() * self.Scale.X;
	}
	//return this.Texture.Width() * this.Scale.X;
};

/**
 * Gets the height of the sprite.
 * @name Height
 * @function
 * @memberOf Sprite
 */
Sprite.prototype.Height = function () {
	"use strict";
	return this.Texture.Height() * this.Scale.Y;
};

/**
 * Gets half of the width of the texture.
 * @name HalfWidth
 * @function
 * @memberOf Sprite
 */
Sprite.prototype.HalfWidth = function () {
	"use strict";
	return this.Width() / 2;
};

/**
 * Gets half of the height of the texture.
 * @name HalfHeight
 * @function
 * @memberOf Sprite
 */
Sprite.prototype.HalfHeight = function () {
	"use strict";
	return this.Height() / 2;
};

/**
 * Gets the Point that specifies the center of the sprite.
 * @name Center
 * @function
 * @memberOf Sprite
 */
Sprite.prototype.Center = function () {
	"use strict";
	/*global Point*/
	var self = this;

	return new Point(self.Position.X + self.HalfWidth(), self.Position.Y + self.HalfHeight());
};

/**
 * Returns the y-coordinate of the top of the sprite.
 * @name Top
 * @function
 * @memberOf Sprite
 */
Sprite.prototype.Top = function () {
	"use strict";
	return this.Position.Y;
};

/**
 * Returns the y-coordinate of the bottom of the sprite.
 * @name Bottom
 * @function
 * @memberOf Sprite
 */
Sprite.prototype.Bottom = function () {
	"use strict";
	return this.Position.Y + this.Height();
};

/**
 * Returns the x-coordinate of the left side of the sprite.
 * @name Left
 * @function
 * @memberOf Sprite
 */
Sprite.prototype.Left = function () {
	"use strict";
	return this.Position.X;
};

/**
 * Returns the x-coordinate of the right side of the sprite.
 * @name Right
 * @function
 * @memberOf Sprite
 */
Sprite.prototype.Right = function () {
	"use strict";
	return this.Position.X + this.Width();
};

/**
 * Returns the rectangle bounds of the sprite.
 * @name Bounds
 * @function
 * @memberOf Sprite
 */
Sprite.prototype.Bounds = function () {
	"use strict";
	/*global Rectangle*/
	var self = this;
	
	return new Rectangle(self.Position.X, self.Position.Y, self.Width(), self.Height());
};