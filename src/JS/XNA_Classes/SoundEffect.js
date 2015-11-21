/**
 * A sound effect.
 * @constructor
 * @param {String} name - the path to the resource.
 */
function SoundEffect(name) {
	"use strict";
	/*global Audio*/
	this.Name = name;
	this.Audio = new Audio();
	this.Audio.src = name;
	this.Audio.loop = false;
	this.Audio.muted = false;
	this.Audio.volume = 0.85;
}

/**
 * Plays the Sound Effect.
 * @name Play
 * @function
 * @memberOf SoundEffect
 */
SoundEffect.prototype.Play = function () {
	"use strict";
    var self = this;
 
    self.Audio.currentTime = 0.0;
	self.Audio.play();
};

/**
 * Gets the duration of the sound effect.
 * @name Duration
 * @function
 * @memberOf SoundEffect
 */
SoundEffect.prototype.Duration = function () {
	"use strict";
	return this.Audio.duration;
};