/**
 * Defines a polygon.
 * @constructor
 * @param {Array} segments - An array with the segments that conform the polygon.
 */
function Polygon(segments) {
	"use strict";
	this.Segments = segments;
}

/**
 * Gets the number of vertex of the polygon.
 * @name NumberOfVertex
 * @function
 * @memberOf Polygon
 */
Polygon.prototype.NumberOfVertex = function () {
	"use strict";
	return this.Segments.length;
};

