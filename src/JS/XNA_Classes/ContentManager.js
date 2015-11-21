/**
 * The ContentManager loads sound and images of the game into memory.
 * @constructor
 */
function ContentManager() {
	"use strict";
	this.assetsToLoad = [];
	this.assetsLoaded = 0;
	this.allLoaded = false;
}


/**
 * Function called when a content was loaded in memory.
 * @name loadHandler
 * @function
 * @private
 * @memberOf ContentManager
 */
ContentManager.prototype.loadHandler = function () {
	"use strict";
	var self = this,
		len = self.assetsToLoad.length,
		i;

	self.assetsLoaded += 1;
    
	//If all contents were loaded then remove listeners and reset variables
	if (self.assetsLoaded === len) {

		//Remove the load handlers
		for (i = 0; i < len; i += 1) {
			self.assetsToLoad[i].removeEventListener("load", self.loadHandler.bind(self), false);
		}
		
		self.allLoaded = true;
		//self.assetsToLoad.splice(0, len);
		//self.assetsLoaded = 0;
	}
};

/**
 * Loads an image and return a Texture2D instance.
 * @name LoadTexture2D
 * @function
 * @param {String} src - The path to the image.
 * @memberOf ContentManager
 */
ContentManager.prototype.LoadTexture2D = function (src) {
	"use strict";
	/*global Texture2D*/
	var self = this,
		texture = new Texture2D(src);

	//Add load handler
	texture.Image.addEventListener("load", self.loadHandler.bind(self), false);
	self.assetsToLoad.push(texture.Image);
	return texture;
};

/**
 * Loads a song and return a Song instance.
 * @name LoadSong
 * @function
 * @param {String} src - The path to the song.
 * @memberOf ContentManager
 */
ContentManager.prototype.LoadSong = function (src) {
	"use strict";
	/*global Song*/
	var self = this,
		song = new Song(src);

	//Add load handler
	song.Audio.addEventListener("loadedmetadata", self.loadHandler.bind(self), false);
	self.assetsToLoad.push(song.Audio);
	return song;
};

/**
 * Loads a sound effect and return a SoundEffect instance.
 * @name LoadSoundEffect
 * @function
 * @param {String} src - The path to the sound effect.
 * @memberOf ContentManager
 */
ContentManager.prototype.LoadSoundEffect = function (src) {
	"use strict";
	/*global SoundEffect*/
	var self = this,
		soundEffect = new SoundEffect(src);

	//Add load handler
	soundEffect.Audio.addEventListener("loadedmetadata", self.loadHandler.bind(self), false);
	self.assetsToLoad.push(soundEffect.Audio);
	return soundEffect;
};

/**
 * Check if all contents were loaded or not.
 * @name AllContentLoaded
 * @function
 * @memberOf ContentManager
 */
ContentManager.prototype.AllContentLoaded = function () {
	"use strict";
	return this.allLoaded;
};