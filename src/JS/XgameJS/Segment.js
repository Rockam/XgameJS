/**
 * Represents a 2D segment, which is composed of two points.
 * @constructor
 * @param {Point} pointA - The A point of the segment.
 * @param {Point} pointB - The B point of the segment.
 */
function Segment(pointA, pointB) {
	"use strict";
	/*global Vector2*/
	this.pointA = pointA;
	this.pointB = pointB;
}

/**
 * Gets the distance of the segment.
 * @name Distance
 * @function
 * @memberOf Segment
 */
Segment.prototype.Distance = function () {
	"use strict";
	var self = this;

	return Math.sqrt(Math.pow((self.pointB.X - self.pointA.X), 2) + Math.pow((self.pointB.Y - self.pointA.Y), 2));
};

/**
 * Gets the direction vector of the segment.
 * @name DirectionVector
 * @function
 * @memberOf Segment
 */
Segment.prototype.DirectionVector = function () {
	"use strict";
	var self = this,
		distance = self.Distance();

	return new Vector2((self.pointB.X - self.pointA.X) / distance, (self.pointB.Y - self.pointA.Y) / distance);
};