/**
 * Defines a rectangle.
 * @constructor
 * @param {Number} x - The x-coordinate of the rectangle.
 * @param {Number} y - The y-coordinate of the rectangle.
 * @param {Number} width - Width of the rectangle.
 * @param {Number} height - Height of the rectangle.
 */
function Rectangle(x, y, width, height) {
	"use strict";
	this.Height = height;
	this.Width = width;
	this.X = x;
	this.Y = y;
}

/**
 * Gets the upper-left value of the Rectangle.
 * @name Location
 * @function
 * @memberOf Rectangle
 */
Rectangle.prototype.Location = function () {
	"use strict";
	/*global Point */
	return new Point(this.X, this.Y);
};

/**
 * Returns the y-coordinate of the top of the rectangle.
 * @name Top
 * @function
 * @memberOf Rectangle
 */
Rectangle.prototype.Top = function () {
	"use strict";
	return this.Y;
};

/**
 * Returns the y-coordinate of the bottom of the rectangle.
 * @name Bottom
 * @function
 * @memberOf Rectangle
 */
Rectangle.prototype.Bottom = function () {
	"use strict";
	return this.Y + this.Height;
};

/**
 * Returns the x-coordinate of the left side of the rectangle.
 * @name Left
 * @function
 * @memberOf Rectangle
 */
Rectangle.prototype.Left = function () {
	"use strict";
	return this.X;
};

/**
 * Returns the x-coordinate of the right of the rectangle.
 * @name Right
 * @function
 * @memberOf Rectangle
 */
Rectangle.prototype.Right = function () {
	"use strict";
	return this.X + this.Width;
};

/**
 * Gets the Point that specifies the center of the rectangle.
 * @name Center
 * @function
 * @memberOf Rectangle
 */
Rectangle.prototype.Center = function () {
	"use strict";
	/*global Point */
	var self = this;
	return new Point(self.X + (self.Width / 2), self.Y + (self.Height / 2));
};

/**
 * Gets half of the width of the rectangle.
 * @name HalfWidth
 * @function
 * @memberOf Rectangle
 */
Rectangle.prototype.HalfWidth = function () {
	"use strict";
	return this.Width / 2;
};

/**
 * Gets half of the height of the rectangle.
 * @name HalfHeight
 * @function
 * @memberOf Rectangle
 */
Rectangle.prototype.HalfHeight = function () {
	"use strict";
	return this.Height / 2;
};

/**
 * Returns a Rectangle with all of its values set to zero.
 * @name Empty
 * @function
 * @memberOf Rectangle
 * @static
 */
Rectangle.Empty = function () {
	"use strict";
	return new Rectangle(0, 0, 0, 0);
};

/**
 * Gets a value that indicates whether the Rectangle is empty.
 * @name IsEmpty
 * @function
 * @memberOf Rectangle
 */
Rectangle.prototype.IsEmpty = function () {
	"use strict";
	return (this.Width <= 0 && this.Height <= 0);
};

/**
 * Determines whether this Rectangle contains a specified Point.
 * @name Contains
 * @function
 * @param {Point} point - The Point to evaluate.
 * @memberOf Rectangle
 */
Rectangle.prototype.Contains = function (value) {
	"use strict";
	var self = this;
	return (value.X >= self.X && value.X <= self.Right()) && (value.Y >= self.Y && value.Y <= self.Bottom());
};

/**
 * Pushes the edges of the Rectangle out by the horizontal and vertical values specified.
 * @name Inflate
 * @function
 * @param {Number} horizontalAmount - Value to push the sides out by.
 * @param {Number} verticalAmount - Value to push the top and bottom out by.
 * @memberOf Rectangle
 */
Rectangle.prototype.Inflate = function (horizontalAmount, verticalAmount) {
	"use strict";
    var self = this;
    
	self.Width += horizontalAmount;
    if (self.Width < 0) {
        self.Width = 0;
    }
	self.Height += verticalAmount;
    if (self.Height < 0) {
        self.Height = 0;
    }
};

/**
 * Determines whether a specified Rectangle intersects with this Rectangle, and by how much.
 * @name Intersects
 * @function
 * @param {Rectangle} value - The Rectangle to evaluate.
 * @memberOf Rectangle
 */
Rectangle.prototype.Intersects = function (value) {
	"use strict";
	/*global Vector2*/
	var self = this,
		//Calculate the distance vector and the combined half widths and heights
		distance = new Vector2(
			self.Center().X - value.Center().X,
			self.Center().Y - value.Center().Y
        ),
		combinedHalfWidths = self.HalfWidth() + value.HalfWidth(),
		combinedHalfHeights = self.HalfHeight() + value.HalfHeight();

	//Check whether distance.X is less than the combined half widths 
	if (Math.abs(distance.X) < combinedHalfWidths) {
		//An intersection might be occurring!
		//Check whether distance.y is less than the combined half heights 
		if (Math.abs(distance.Y) < combinedHalfHeights) {
			//An intersection has occurred! return the overlap vector
			return new Vector2(combinedHalfWidths - Math.abs(distance.X),
							   combinedHalfHeights - Math.abs(distance.Y));
		}
	}

	return false;
};