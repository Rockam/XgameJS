/**
 * Defines a circle.
 * @constructor
 * @param {Number} radius - The radius of the circle.
 * @param {Number} x - The x-coordinate of the circle.
 * @param {Number} y - The y-coordinate of the circle.
 */
function Circle(radius, x, y) {
	"use strict";
	this.Radius = radius;
	this.X = x;
	this.Y = y;
}

/**
 * Gets the diameter of the circle.
 * @name Diameter
 * @function
 * @memberOf Circle
 */
Circle.prototype.Diameter = function () {
	"use strict";
	return this.Radius * 2;
};

/**
 * Gets the upper-left value of the circle.
 * @name Location
 * @function
 * @memberOf Circle
 */
Circle.prototype.Location = function () {
	"use strict";
	/*global Point */
	return new Point(this.X, this.Y);
};

/**
 * Returns the y-coordinate of the top of the circle.
 * @name Top
 * @function
 * @memberOf Circle
 */
Circle.prototype.Top = function () {
	"use strict";
	return this.Y;
};

/**
 * Returns the y-coordinate of the bottom of the circle.
 * @name Bottom
 * @function
 * @memberOf Circle
 */
Circle.prototype.Bottom = function () {
	"use strict";
	return this.Y + this.Diameter();
};

/**
 * Returns the x-coordinate of the left side of the circle.
 * @name Left
 * @function
 * @memberOf Circle
 */
Circle.prototype.Left = function () {
	"use strict";
	return this.X;
};

/**
 * Returns the x-coordinate of the right of the circle.
 * @name Right
 * @function
 * @memberOf Circle
 */
Circle.prototype.Right = function () {
	"use strict";
	return this.X + this.Diameter();
};


/**
 * Gets the Point that specifies the center of the circle.
 * @name Center
 * @function
 * @memberOf Circle
 */
Circle.prototype.Center = function () {
	"use strict";
	var self = this;
	//console.log(self.X);
	return new Point(self.X + self.Radius, self.Y + self.Radius);
};

/**
 * Determines whether this circle contains a specified Point.
 * @name Contains
 * @function
 * @param {Point} point - The Point to evaluate.
 * @memberOf Circle
 */
Circle.prototype.Contains = function (value) {
	"use strict";
	/*global Vector2*/
	return (Vector2.Distance(this.Center(), value) <= this.Radius);
};

/**
 * Pushes the edges of the circle out by the amount specified.
 * @name Inflate
 * @function
 * @param {Number} amount - Value to push the radius out by.
 * @memberOf Circle
 */
Circle.prototype.Inflate = function (amount) {
	"use strict";
    var self = this;
    
	self.Radius += amount;
    if (self.Radius < 0) {
        self.Radius = 0;
    }
};

/**
 * Determines whether a specified Circle is inside this Circle, and by how much.
 * @name IsInsideCircle
 * @function
 * @param {Circle} circle - The Circle to evaluate.
 * @memberOf Circle
 */
Circle.prototype.IsInsideCircle = function (circle) {
	"use strict";
	var self = this,
		centerA = self.Center(),
		centerB = circle.Center(),
		vector = null,
		d = null,
		surfacePoint = null,
		distanceToSurface = 0;

	//Check if circles have the same center
	if (Point.Equals(centerA, centerB)) {
		distanceToSurface = (self.Radius + circle.Radius);
		return new Vector2(0, distanceToSurface);

		//Check if self circle is inside the other circle
	} else if (self.Radius < circle.Radius) {
		if (Vector2.Distance(centerA, centerB) <= Math.abs(circle.Radius - self.Radius)) {
			vector = new Vector2(centerA.X - centerB.X, centerA.Y - centerB.Y);
			d = vector.Normalize();
			surfacePoint = new Point((centerB.X + self.Radius) * d.X, (centerB.Y + self.Radius) * d.Y);
			distanceToSurface = Vector2.Distance(centerA, surfacePoint) + self.Radius;
			return new Vector2(distanceToSurface * d.X, distanceToSurface * d.Y);
		}
	}

	return false;
};

/**
 * Determines whether a specified Circle intersects with this Circle, and by how much.
 * @name Intersects
 * @function
 * @param {Circle} value - The Circle to evaluate.
 * @memberOf Circle
 */
Circle.prototype.Intersects = function (value) {
	"use strict";
	/*global Vector2 */
	var self = this,
		//Calculate the vector between the circles center points
		vector = new Vector2(
			self.Center().X - value.Center().X,
			self.Center().Y - value.Center().Y
		),
		//Find the distance between the circles
		magnitude = vector.Length(),
		//Add together the circles combined radius
		combinedRadius = self.Radius + value.Radius,
		overlap = 0,
		d = null;

	//Figure out if there's a collision
	if (magnitude < combinedRadius) {
		//Yes, a collision is happening.
		//Find the amount of overlap between the circles 
		overlap = combinedRadius - magnitude;

		//Normalize the vector, these numbers tell us the direction of the collision.
		//d = vector.Normalize();

		//Return the overlap and the vector between the circles center points
		return new Vector2(overlap, vector);
	}

	return false;
};

/**
 * Determines whether a specified Segment intersects with this Circle, and by how much.
 * @name IntersectsSegment
 * @function
 * @param {Segment} segment - The Segment to evaluate.
 * @memberOf Circle
 */
Circle.prototype.IntersectsSegment = function (segment) {
	"use strict";
	/*global Vector2*/
	var self = this,
		pointA = new Point(segment.pointA.X - self.Radius, segment.pointA.Y - self.Radius),
		pointB = new Point(segment.pointB.X - self.Radius, segment.pointB.Y - self.Radius),
		// Calculate the euclidean distance between a & b
		distance = Vector2.Distance(pointA, pointB),
		// Compute the direction vector d from a to b
		dir = new Vector2((pointB.X - pointA.X) / distance, (pointB.Y - pointA.Y) / distance),
		// Now the line equation is x = dx*t + ax, y = dy*t + ay with 0 <= t <= 1.
		// compute the value t of the closest point to the circle center (cx, cy)
		t = (dir.X * (self.X - pointA.X)) + (dir.Y * (self.Y - pointA.Y)),
		// compute the coordinates of the point e on line and closest to c
		e = new Point((t * dir.X) + pointA.X, (t * dir.Y) + pointA.Y),
		// Calculate the euclidean distance between c & e
		eDistCtoE = Vector2.Distance(self, e);

	Vector2.Add(e, self.Radius);

	// test if the line intersects the circle
	if (eDistCtoE < self.Radius) {

		// compute distance from t to circle intersection point
		var dt = Math.sqrt(Math.pow(self.Radius, 2) - Math.pow(eDistCtoE, 2));

		// compute first intersection point
		var f = new Point(((t - dt) * dir.X) + pointA.X, ((t - dt) * dir.Y) + pointA.Y);
		// check if f lies on the line
		f.onLine = (Vector2.Distance(pointA, f) + Vector2.Distance(f, pointB) === Vector2.Distance(pointA, pointB));

		// compute second intersection point
		var g = new Point(((t + dt) * dir.X) + pointA.X, ((t + dt) * dir.Y) + pointA.Y);
		// check if g lies on the line
		g.onLine = (Vector2.Distance(pointA, g) + Vector2.Distance(g, pointB) === Vector2.Distance(pointA, pointB));

		Vector2.Add(f, self.Radius);
		Vector2.Add(g, self.Radius);

		//return {points: {intersection1:f, intersection2:g}, pointOnLine: e};
		//console.log("Two intersections");
		var circleCenter = self.Center(),
			vectorAux1 = new Vector2(circleCenter.X - e.X, circleCenter.Y - e.Y),
			magnitude1 = vectorAux1.Length(),
			d = vectorAux1.Normalize(),
			vectorAux3 = new Vector2(circleCenter.X - pointA.X - self.Radius, circleCenter.Y - pointA.Y - self.Radius),
			magnitude3 = vectorAux3.Length(),
			vectorAux4 = new Vector2(circleCenter.X - pointB.X - self.Radius, circleCenter.Y - pointB.Y - self.Radius),
			magnitude4 = vectorAux4.Length(),
			overlap = 1;

		if (magnitude1 < self.Radius && (f.onLine || g.onLine)) {

			var pOnLine = null;

			if ((f.onLine && !g.onLine) || (!f.onLine && g.onLine)) {

				if (f.onLine) {
					pOnLine = f;
				} else {
					pOnLine = g;
				}

				var vectorAux2 = new Vector2(circleCenter.X - pOnLine.X, circleCenter.Y - pOnLine.Y),
					magnitude2 = vectorAux2.Length();

				d = vectorAux2.Normalize();

				if (magnitude3 < self.Radius) {
					overlap = (new Vector2(pOnLine.X - pointA.X - self.Radius, pOnLine.Y - pointA.Y - self.Radius)).Length();
				} else if (magnitude4 < self.Radius) {
					overlap = (new Vector2(pOnLine.X - pointB.X - self.Radius, pOnLine.Y - pointB.Y - self.Radius)).Length();
				} else {
					overlap = (self.Radius - magnitude1);
				}

			} else if (g.onLine && f.onLine) {

				overlap = (self.Radius - magnitude1);

			}

			return new Vector2(overlap * d.X, overlap * d.Y);
		}
	}
	/*else if (parseInt(eDistCtoE) === parseInt(self.Radius)) {
		console.log("Only one intersection");
		//return {points: false, pointOnLine: e};
		return true;
	}*/

	return false;
};