/**
 * Represents an animated sprite, which is composed of various frames.
 * @constructor
 * @param {Texture2D} texture - The texture image.
 * @param {Vector2} scale - The scale of the image.
 * @param {Rectangle} sourceRect - The image source rectangle.
 * @param {Point} position - The sprite position in the canvas.
 * @param {Boolean} isVisible - Determines if the sprite is visible or not.
 * @param {Boolean} loop - Determines if the animation has to animate in loop or not (one time).
 * @param {Boolean} pingPongLoop - Determines if the animation should run in reverse when reachs the last
 *                                 frame or not (reset to initial frame).
 * @param {Number} millisecondsPerFrame - A number representing the milliseconds between each frame.
 * @param {Number} numberOfFrames - The number of frames in the sprite sheet.
 */
function AnimatedSprite(texture, scale, sourceRect, position, isVisible, animationType, numberOfFrames, millisecondsPerFrame) {
	"use strict";
	/*global Sprite, AnimationTypes, setInterval, clearInterval*/

	//Call the father constructor (super)
	Sprite.call(this, texture, scale, sourceRect, position, isVisible);

	this.AnimationType = animationType;
	this.NumberOfFrames = numberOfFrames;
	this.MillisecondsPerFrame = millisecondsPerFrame;
	this.CurrentFrame = 0;
	this.Forward = true; //to control the direction of the loop
	this.Columns = Math.floor(texture.Width() / sourceRect.Width);
	this.RunAnimation = true;
	this.VerticalOffset = 0;	//(optional) used when the animation sheet has different
								//animations representing different states of the object
								//which owns the sprite
	this.interval = null;
}

//Create the AnimatedSprite.prototype object, which inherits from Sprite.prototype.
//Then stablish the "constructor" property to reference to AnimatedSprite
AnimatedSprite.prototype = Object.create(Sprite.prototype);
AnimatedSprite.prototype.constructor = AnimatedSprite;

/**
 * Starts the update animation timer.
 * @name StartAnimation
 * @function
 * @memberof AnimatedSprite
 */
AnimatedSprite.prototype.StartAnimation = function () {
	"use strict";
	var self = this;

	self.interval = setInterval(self.UpdateAnimation.bind(self), self.MillisecondsPerFrame);
};

/**
 * Stops the update animation timer.
 * @name StopAnimation
 * @function
 * @memberof AnimatedSprite
 */
AnimatedSprite.prototype.StopAnimation = function () {
	"use strict";
	clearInterval(this.interval);
};

/**
 * Update the animation depending on the number of frames
 * @name UpdateAnimation
 * @function
 * @memberof AnimatedSprite
 */
AnimatedSprite.prototype.UpdateAnimation = function () {
	"use strict";
	var self = this,
		sourceRect = self.SourceRect;
	
	sourceRect.X = Math.floor(self.CurrentFrame % self.Columns) * sourceRect.Width;
	sourceRect.Y = Math.floor(self.CurrentFrame / self.Columns) * sourceRect.Height;

	if (self.RunAnimation) {

		//Do different actions depending on the animation type
		switch (self.AnimationType) {

		case AnimationTypes.PlayOneTime:
			//It the last frame has been reached, stop the run
			if (self.CurrentFrame === self.NumberOfFrames - 1) {
				self.RunAnimation = false;
			}
			break;

		case AnimationTypes.Loop:
			//If the last frame has been reached, reset to the initial frame
			if (self.CurrentFrame === self.NumberOfFrames - 1) {
				self.CurrentFrame = 0;
			}
			break;

		case AnimationTypes.PingPongLoop:
			//If the last frame has been reached, reverse the animation
			if (self.CurrentFrame === self.NumberOfFrames - 1) {
				self.Forward = false;
			}
			//If the first frame has been reached, set forward to true
			if (self.CurrentFrame === 0) {
				self.Forward = true;
			}
			break;
		}

		//Add 1 to currentFrame if forward is true, subtract 1 if it's false
		if (self.Forward) {
			self.CurrentFrame += 1;
		} else {
			self.CurrentFrame -= 1;
		}
		
		//Apply vertical offset
		sourceRect.Y += sourceRect.Height * self.VerticalOffset;
	}
};