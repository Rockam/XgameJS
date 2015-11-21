/**
 * Represents a 2D grid of texels.
 * @constructor
 * @param {String} name - The path to the resource.
 */
function Texture2D(name) {
	"use strict";
	/*global Rectangle, Image*/
	this.Name = name;
	this.Image = new Image();
	this.Image.src = name;
}

/**
 * Gets the width of the texture.
 * @name Height
 * @function
 * @memberOf Texture2D
 */
Texture2D.prototype.Height = function () {
	"use strict";
	return this.Image.height;
};

/**
 * Gets the height of the texture.
 * @name Width
 * @function
 * @memberOf Texture2D
 */
Texture2D.prototype.Width = function () {
	"use strict";
	return this.Image.width;
};

/**
 * Gets the bounds of the texture.
 * @name Bounds
 * @function
 * @memberOf Texture2D
 */
Texture2D.prototype.Bounds = function () {
	"use strict";
	return new Rectangle(0, 0, this.Width(), this.Height());
};

/**
 * Gets half of the width of the texture.
 * @name HalfWidth
 * @function
 * @memberOf Texture2D
 */
Texture2D.prototype.HalfWidth = function () {
	"use strict";
	return this.Width() / 2;
};

/**
 * Gets half of the height of the texture.
 * @name HalfHeight
 * @function
 * @memberOf Texture2D
 */
Texture2D.prototype.HalfHeight = function () {
	"use strict";
	return this.Height() / 2;
};