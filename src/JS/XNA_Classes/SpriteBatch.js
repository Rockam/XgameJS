/**
 * Enables a group of sprites to be drawn using the same settings.
 * @constructor
 * @param {GraphicsDevice} graphicsDevice - The graphics device where sprites will be drawn.
 */
function SpriteBatch(graphicsDevice) {
	"use strict";
	this.ctx = graphicsDevice.canvas.getContext("2d");
}

/**
 * Adds a sprite to a batch of sprites for rendering using the specified texture, position, and source rectangle.
 * @name Draw
 * @function
 * @param {Texture2D} texture - A texture.
 * @param {Vector2} position - The location (in screen coordinates) to draw the sprite.
 * @param {Rectangle} sourceRectangle - A rectangle that specifies (in texels) the source texels from a texture.
 * @param {Number} rotation - Specifies the angle (in radians) to rotate the sprite about its center.
 * @param {Vector2} scale - Scale factor.
 * @param {SpriteEffects} effects - Effects to apply.
 * @memberOf SpriteBatch
 */
SpriteBatch.prototype.Draw = function (texture, position, sourceRectangle, rotation, scale, effects) {
	"use strict";
	/*global SpriteEffects*/
	var self = this,
		flipHorizontally = 1,
		flipVertically = 1,
		aspectRatio = texture.Width() / texture.Height(),
		sourceAspectRatio = sourceRectangle.Width / sourceRectangle.Height,
		textureWidth = texture.Width(),
        posX = 0,
        posY = 0;
	
	//Save the context to restore later
	self.ctx.save();

	//Rotate the image if required
	if (rotation !== 0) {
		self.ctx.translate(Math.floor(position.X + texture.HalfWidth() * scale.X), Math.floor(position.Y + texture.HalfHeight() * scale.Y));
		self.ctx.rotate(rotation * Math.PI / 180);
		posX = -texture.HalfWidth() * scale.X;
		posY = -texture.HalfHeight() * scale.Y;
	} else {
        posX = position.X;
		posY = position.Y;
    }

	//Apply sprite effects if needed
	if (effects === SpriteEffects.FlipHorizontally) {
		flipHorizontally = -1;
	} else if (effects === SpriteEffects.FlipVertically) {
		flipVertically = -1;
	}

	//Scale the image
	self.ctx.scale(scale.X * flipHorizontally, scale.Y * flipVertically);

	if (aspectRatio !== sourceAspectRatio) {
		textureWidth /= aspectRatio;
	}
	
	//Draw the image
	self.ctx.drawImage(texture.Image,
			sourceRectangle.X, sourceRectangle.Y,
			sourceRectangle.Width, sourceRectangle.Height,
			Math.floor(posX) * flipHorizontally / scale.X, Math.floor(posY) * flipVertically / scale.Y,
			textureWidth * flipHorizontally, texture.Height() * flipVertically
		);

	//Restore the canvas context
	self.ctx.restore();
};

/**
 * Adds a string to a batch of sprites for rendering using the specified font, text, position, color and scale.
 * @name DrawString
 * @function
 * @param {String} font - A string representing the font for displaying text (example: "normal bold 20px Helvetica").
 * @param {String} text - A text string.
 * @param {Vector2} position - The location (in screen coordinates) to draw the sprite.
 * @param {String} color - A string representing the color (example: "#FF00F0").
 * @param {Vector2} scale - Scale factor.
 * @memberOf SpriteBatch
 */
SpriteBatch.prototype.DrawString = function (font, text, position, color, scale) {
	"use strict";
	var self = this;
	
	//Save the context to restore later
	self.ctx.save();
	
	//Scale the image
	self.ctx.scale(scale.X, scale.Y);
	
	//Determine the font, color and baseline, and then draw the given text
	self.ctx.font = font;
	self.ctx.fillStyle = color;
	self.ctx.textBaseline = "top";
	self.ctx.fillText(text, position.X, position.Y);
	
	//Restore the canvas context
	self.ctx.restore();
};

/**
 * Draw a given rectangle.
 * @name DrawRectangle
 * @function
 * @param {Rectangle} rectangle - The rectangle to draw.
 * @param {String} lineWidth - the width of the line to be drawn.
 * @param {String} color - A string representing the color (example: "#FF00F0").
 * @memberOf SpriteBatch
 */
SpriteBatch.prototype.DrawRectangle = function (rectangle, lineWidth, color) {
	"use strict";
	var self = this;

	//If the line width is null or undefined set a default value
	if (lineWidth === null || typeof lineWidth === "undefined") {
		lineWidth = "1";
	}
	
	//If the color is null or undefined set a default color (black)
	if (color === null || typeof color === "undefined") {
		color = "#000000";
	}
	
	//Save the context to restore later
	self.ctx.save();

	//Set the line width and the line color
	self.ctx.lineWidth = lineWidth;
	self.ctx.strokeStyle = color;

	//Draw the rectangle
	self.ctx.strokeRect(
		rectangle.X,
		rectangle.Y,
		rectangle.Width,
		rectangle.Height
	);

	//Restore the canvas context
	self.ctx.restore();
};

/**
 * Draw a given segment.
 * @name DrawSegment
 * @function
 * @param {Segment} segment - The segment to draw.
 * @param {String} lineWidth - the width of the line to be drawn.
 * @param {String} color - A string representing the color (example: "#FF00F0").
 * @memberOf SpriteBatch
 */
SpriteBatch.prototype.DrawSegment = function (segment, lineWidth, color) {
	"use strict";
	var self = this;

	//If the line width is null or undefined set a default value
	if (lineWidth === null || typeof lineWidth === "undefined") {
		lineWidth = "1";
	}
	
	//If the color is null or undefined set a default color (black)
	if (color === null || typeof color === "undefined") {
		color = "#000000";
	}
	
	//Save the context to restore later
	self.ctx.save();

	//Set the line width and the line color
	self.ctx.lineWidth = lineWidth;
	self.ctx.strokeStyle = color;

	//Draw the segment
	self.ctx.beginPath();
    self.ctx.moveTo(segment.pointA.X, segment.pointA.Y);
    self.ctx.lineTo(segment.pointB.X, segment.pointB.Y);
    self.ctx.stroke();

	//Restore the canvas context
	self.ctx.restore();
};