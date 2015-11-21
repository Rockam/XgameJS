/**
 * Defines the game camera.
 * @constructor
 * @param {Number} width       - The width of the camera.
 * @param {Number} height      - The height of the camera.
 * @param {Number} levelWidth  - The width of the level.
 * @param {Number} levelHeight - The height of the level.
 * @param {Number} zoom        - The zoom of the camera.
 */
function Camera(width, height, levelWidth, levelHeight, zoom) {
	"use strict";
	/*global Point, Vector2*/
	this.Width = width;
	this.Height = height;
	this.LevelWidth = levelWidth;
	this.LevelHeight = levelHeight;
	this.Zoom = zoom;
	this.Position = Point.Zero();
	this.SpeedV = Vector2.Zero();	//For parallax scrolling
	this.PreviousSpeedX = 0;	//For parallax scrolling
	
	//Camera constants
	this.upLeftMarginPercentage = 0.3;
	this.downRightMarginPercentage = 0.7;
	this.MaxZoom = 2.5;
	this.MinZoom = 1.0;
}

/**
 * The camera's inner right scroll boundaries.
 * @name RightInnerBoundary
 * @function
 * @memberOf Camera
 */
Camera.prototype.RightInnerBoundary = function () {
	"use strict";
	var self = this;
	return self.Position.X + (self.Width * self.downRightMarginPercentage / self.Zoom);
};

/**
 * The camera's inner left scroll boundaries.
 * @name LeftInnerBoundary
 * @function
 * @memberOf Camera
 */
Camera.prototype.LeftInnerBoundary = function () {
	"use strict";
	var self = this;
	return self.Position.X + (self.Width * self.upLeftMarginPercentage / self.Zoom);
};

/**
 * The camera's inner top scroll boundaries.
 * @name TopInnerBoundary
 * @function
 * @memberOf Camera
 */
Camera.prototype.TopInnerBoundary = function () {
	"use strict";
	var self = this;
	return self.Position.Y + (self.Height * self.upLeftMarginPercentage / self.Zoom);
};

/**
 * The camera's inner bottom scroll boundaries.
 * @name BottomInnerBoundary
 * @function
 * @memberOf Camera
 */
Camera.prototype.BottomInnerBoundary = function () {
	"use strict";
	var self = this;
	return self.Position.Y + (self.Height * self.downRightMarginPercentage / self.Zoom);
};

/**
 * Increases the zoom by 0.1.
 * @name IncreaseZoom
 * @function
 * @memberOf Camera
 */
Camera.prototype.IncreaseZoom = function () {
	"use strict";
	var self = this;
	
	if (self.Zoom < self.MaxZoom) {
		self.Zoom += 0.1;
	}
};

/**
 * Decreases the zoom by 0.1.
 * @name DecreaseZoom
 * @function
 * @memberOf Camera
 */
Camera.prototype.DecreaseZoom = function () {
	"use strict";
	var self = this;
	
	if (self.Zoom > self.MinZoom) {
		self.Zoom -= 0.1;
	}
};

/**
 * Updates de camera depending on the player's position.
 * @name Update
 * @function
 * @param {Player} player - the player of the game.
 * @memberOf Camera
 */
Camera.prototype.Update = function (player) {
	"use strict";
	var self = this,
		playerSprite = player.Sprite;
	
	//Scroll the camera
	if (playerSprite.Position.X < self.LeftInnerBoundary()) {
		self.Position.X = Math.floor(playerSprite.Position.X - (self.Width * self.upLeftMarginPercentage / self.Zoom));
	}
	if (playerSprite.Position.X + playerSprite.Width() > self.RightInnerBoundary()) {
		self.Position.X = Math.floor(playerSprite.Position.X + playerSprite.Width() - (self.Width * self.downRightMarginPercentage / self.Zoom));
	}
	if (playerSprite.Position.Y < self.TopInnerBoundary()) {
		self.Position.Y = Math.floor(playerSprite.Position.Y - (self.Height * self.upLeftMarginPercentage / self.Zoom));
	}
	if (playerSprite.Position.Y + playerSprite.Height() > self.BottomInnerBoundary()) {
		self.Position.Y = Math.floor(playerSprite.Position.Y + playerSprite.Height() - (self.Height * self.downRightMarginPercentage / self.Zoom));
	}

	//The camera's world boundaries
	if (self.Position.X < 0) {
		self.Position.X = 0;
	}
	if (self.Position.X * self.Zoom + self.Width > self.LevelWidth * self.Zoom) {
		self.Position.X = (self.LevelWidth * self.Zoom - self.Width) / self.Zoom;
	}
	if (self.Position.Y < 0) {
		self.Position.Y = 0;
	}
	if (self.Position.Y * self.Zoom + self.Height > (self.LevelHeight * self.Zoom)) {
		self.Position.Y = (self.LevelHeight * self.Zoom - self.Height) / self.Zoom;
	}

	//Figure out the camera's velocity by subtracting its position in the
	//previous frame from its position in this frame
	self.SpeedV.X = self.Position.X - self.PreviousSpeedX;
};