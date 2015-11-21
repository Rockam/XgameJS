/**
 * A song.
 * @constructor
 * @param {String} name - the path to the resource.
 */
function Song(name) {
	"use strict";
	/*global Audio*/
	this.Name = name;
	this.Audio = new Audio();
	this.Audio.src = name;
    this.Audio.loop = true;
	this.Audio.muted = false;
	this.Audio.volume = 0.8;
}

/**
 * Gets the duration of the song.
 * @name Duration
 * @function
 * @memberOf Song
 */
Song.prototype.Duration = function () {
	"use strict";
	return this.Audio.duration;
};

/**
 * Gets or set the muted setting for the song.
 * @name IsMuted
 * @function
 * @param {Boolean|Undefined} mute - The mute property (true, false or undefined)
 * @memberOf Song
 */
Song.prototype.IsMuted = function (mute) {
	"use strict";
	if (typeof mute === "undefined") {
		return this.Audio.muted;
	}

	this.Audio.muted = mute;
};

/**
 * Gets or set the loop setting for the song.
 * @name IsRepeating
 * @function
 * @param {Boolean|Undefined} loop - The loop property (true, false or undefined)
 * @memberOf Song
 */
Song.prototype.IsRepeating = function (loop) {
	"use strict";
	if (typeof loop === "undefined") {
		return this.Audio.loop;
	}

	this.Audio.loop = loop;
};

/**
 * Gets the play position within the currently playing song.
 * @name PlayPosition
 * @function
 * @memberOf Song
 */
Song.prototype.PlayPosition = function () {
	"use strict";
	return this.Audio.currentTime;
};

/**
 * Gets or sets the media player volume.
 * @name Volume
 * @function
 * @param {Number} volume - The loop volume.
 * @memberOf Song
 */
Song.prototype.Volume = function (volume) {
	"use strict";
    var self = this;
    
	if (typeof volume === "undefined") {
		return self.Audio.volume;
	}

    if (volume < 0) {
        self.Audio.volume = 0;
    } else if (volume > 1) {
        self.Audio.volume = 1;
    } else {
        self.Audio.volume = volume;
    }
};

/**
 * Plays the Song.
 * @name Play
 * @function
 * @memberOf Song
 */
Song.prototype.Play = function () {
	"use strict";
	this.Audio.play();
};

/**
 * Pauses the Song.
 * @name Pause
 * @function
 * @memberOf Song
 */
Song.prototype.Pause = function () {
	"use strict";
	this.Audio.pause();
};

/**
 * Resumes the Song.
 * @name Resume
 * @function
 * @memberOf Song
 */
Song.prototype.Resume = function () {
	"use strict";
	this.Audio.play();
};

/**
 * Stops the Song.
 * @name Stop
 * @function
 * @memberOf Song
 */
Song.prototype.Stop = function () {
	"use strict";
	this.Audio.pause();
	this.Audio.currentTime = 0.0;
};