/**
 * Allows retrieval of keystrokes from a keyboard input device.
 * @global
 */
var Keyboard = {

	keyDownList: [],
	keyUpList: [],
	keyPressList: [],

	/**
	 * Add a key to the list of pressed down keys.
	 * @name addKeyDown
	 * @function
	 * @param {Event} event - This parameter represents a keyboard event.
	 * @memberOf Keyboard
	 * @static
	 */
	addKeyDown: function (event) {
		"use strict";
		var keyCode = event.keyCode,
			indexOfKey = Keyboard.keyDownList.indexOf(keyCode);

		if (indexOfKey === -1) {
			Keyboard.removeKeyUp(keyCode);
			Keyboard.keyDownList.push(keyCode);
		}

		event.preventDefault();
	},

	/**
	 * Add a key to the list of released keys.
	 * @name addKeyUp
	 * @function
	 * @param {Event} event - This parameter represents a keyboard event.
	 * @memberOf Keyboard
	 * @static
	 */
	addKeyUp: function (event) {
		"use strict";
		var keyCode = event.keyCode,
			indexOfKey = Keyboard.keyUpList.indexOf(keyCode);

		if (indexOfKey === -1) {
			Keyboard.removeKeyDown(keyCode);
			Keyboard.keyUpList.push(keyCode);
		}

		indexOfKey = Keyboard.keyPressList.indexOf(keyCode);

		if (indexOfKey !== -1) {
			Keyboard.keyPressList.splice(indexOfKey, 1);
		} else {
			Keyboard.keyPressList.push(keyCode);
		}

		event.preventDefault();
	},

	/**
	 * Remove a key of the list of pressed down keys.
	 * @name removeKeyDown
	 * @function
	 * @param {Number} key - The key code.
	 * @memberOf Keyboard
	 * @static
	 */
	removeKeyDown: function (key) {
		"use strict";
		var indexOfKey = Keyboard.keyDownList.indexOf(key);

		if (indexOfKey !== -1) {
			Keyboard.keyDownList.splice(indexOfKey, 1);
		}
	},

	/**
	 * Remove a key of the list of released keys.
	 * @name removeKeyUp
	 * @function
	 * @param {Number} key - The key code.
	 * @memberOf Keyboard
	 * @static
	 */
	removeKeyUp: function (key) {
		"use strict";
		var indexOfKey = Keyboard.keyUpList.indexOf(key);

		if (indexOfKey !== -1) {
			Keyboard.keyUpList.splice(indexOfKey, 1);
		}
	},

	/**
	 * Returns whether a specified key is currently being pressed.
	 * @name IsKeyDown
	 * @function
	 * @param {Keys} key - Enumerated value that specifies the key to query.
	 * @memberOf Keyboard
	 * @static
	 */
	IsKeyDown: function (key) {
		"use strict";
		var indexOfKey = Keyboard.keyDownList.indexOf(key);

		if (indexOfKey !== -1) {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * Returns whether a specified key is currently not pressed.
	 * @name IsKeyUp
	 * @function
	 * @param {Keys} key - Enumerated value that specifies the key to query.
	 * @memberOf Keyboard
	 * @static
	 */
	IsKeyUp: function (key) {
		"use strict";
		var indexOfKey = Keyboard.keyUpList.indexOf(key);

		if (indexOfKey !== -1) {
			Keyboard.removeKeyUp(key);
			return true;
		} else {
			return false;
		}
	},

	/**
	 * Returns whether a specified key was pressed and released.
	 * @name IsKeyPressed
	 * @function
	 * @param {Keys} key - Enumerated value that specifies the key to query.
	 * @memberOf Keyboard
	 * @static
	 */
	IsKeyPressed: function (key) {
		"use strict";
		var indexOfKey = Keyboard.keyPressList.indexOf(key);

		if (indexOfKey !== -1) {
			Keyboard.keyPressList.splice(indexOfKey, 1);
			return true;
		} else {
			return false;
		}
	}
};