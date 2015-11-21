/**
 * Defines a point in 2D space.
 * @constructor
 * @param {Number} x - The x-coordinate of the point.
 * @param {Number} y - The y-coordinate of the point.
 */
function Point(x, y) {
	"use strict";
	this.X = x;
	this.Y = y;
}

/**
 * Returns the point (0,0).
 * @name Zero
 * @function
 * @memberOf Point
 * @static
 */
Point.Zero = function () {
	"use strict";
	return new Point(0, 0);
};

/**
 * Returns the point (1,1).
 * @name One
 * @function
 * @memberOf Point
 * @static
 */
Point.One = function () {
	"use strict";
	return new Point(1, 1);
};

/**
 * Check if the points are equal.
 * @name Equals
 * @function
 * @param {Point} p1 - point 1.
 * @param {Point} p2 - point 2.
 * @memberOf Point
 * @static
 */
Point.Equals = function (p1, p2) {
	"use strict";
	return (p1.X === p2.X && p1.Y === p2.Y);
};