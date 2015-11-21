/**
 * Defines a vector with two components.
 * @constructor
 * @param {Number} x - Initial value for the x-component of the vector.
 * @param {Number} y - Initial value for the y-component of the vector.
 */
function Vector2(x, y) {
	"use strict";
	this.X = x;
	this.Y = y;
}

/**
 * Returns a Vector2 with both of its components set to zero.
 * @name Zero
 * @function
 * @memberOf Vector2
 * @static
 */
Vector2.Zero = function () {
	"use strict";
	return new Vector2(0, 0);
};

/**
 * Returns a Vector2 with both of its components set to one.
 * @name One
 * @function
 * @memberOf Vector2
 * @static
 */
Vector2.One = function () {
	"use strict";
	return new Vector2(1, 1);
};

/**
 * Adds two vectors.
 * @name Add
 * @function
 * @param {Vector2} value1 - Source vector 1
 * @param {Vector2} value2 - Source vector 2
 * @memberOf Vector2
 * @static
 */
Vector2.Add = function (value1, value2) {
	"use strict";
	return new Vector2(value1.X + value2.X, value1.Y + value2.Y);
};

/**
 * Substract two vectors.
 * @name Substract
 * @function
 * @param {Vector2} value1 - Source vector 1
 * @param {Vector2} value2 - Source vector 2
 * @memberOf Vector2
 * @static
 */
Vector2.Substract = function (value1, value2) {
	"use strict";
	return new Vector2(value1.X - value2.X, value1.Y - value2.Y);
};

/**
 * Divides the components of a vector by a scalar value or the components of another vector.
 * @name Divide
 * @function
 * @param {Vector2} value1 - Source vector 1
 * @param {Vector2} value2 - A scalar value or a source vector 2
 * @memberOf Vector2
 * @static
 */
Vector2.Divide = function (value1, value2) {
	"use strict";
	if (typeof (value2) === "number") {
		return new Vector2(value1.X / value2, value1.Y / value2);
	} else {
		return new Vector2(value1.X / value2.X, value1.Y / value2.Y);
	}
};

/**
 * Multiplies the components of a vector by a scalar value or the components of another vector.
 * @name Multiply
 * @function
 * @param {Vector2} value1 - Source vector 1
 * @param {Vector2} value2 - A scalar value or a source vector 2
 * @memberOf Vector2
 * @static
 */
Vector2.Multiply = function (value1, value2) {
	"use strict";
	if (typeof (value2) === "number") {
		return new Vector2(value1.X * value2, value1.Y * value2);
	} else {
		return new Vector2(value1.X * value2.X, value1.Y * value2.Y);
	}
};

/**
 * Calculates the distance between two vectors.
 * @name Distance
 * @function
 * @param {Vector2|Point} value1 - Source vector 1
 * @param {Vector2|Point} value2 - Source vector 2
 * @memberOf Vector2
 * @static
 */
Vector2.Distance = function (value1, value2) {
	"use strict";
	return (Math.sqrt(Math.pow(value2.X - value1.X, 2) + Math.pow(value2.Y - value1.Y, 2)));
};

/**
 * Calculates the length of the vector.
 * @name Length
 * @function
 * @memberOf Vector2
 */
Vector2.prototype.Length = function () {
	"use strict";
	return (Math.sqrt(Math.pow(this.X, 2) + Math.pow(this.Y, 2)));
};

/**
 * Turns the current vector into a unit vector. The result is a vector one unit
 * in length pointing in the same direction as the original vector.
 * @name Normalize
 * @function
 * @memberOf Vector2
 */
Vector2.prototype.Normalize = function () {
	"use strict";
	var self = this,
		length = self.Length();
	
	return (new Vector2(self.X / length, self.Y / length));
};

/**
 * Check if the vectors are equal.
 * @name Equals
 * @function
 * @param {Vector2} v1 - vector 1.
 * @param {Vector2} v2 - vector 2.
 * @memberOf Vector2
 * @static
 */
Vector2.Equals = function (v1, v2) {
	"use strict";
	return (v1.X === v2.X && v1.Y === v2.Y);
};