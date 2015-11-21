/**
 * Creates an instance of the canvas. Also handles the configuration of the canvas.
 * @constructor
 * @param {HTML} document - The descriptor of the HTML.
 */
function GraphicsDevice(document) {
    "use strict";
    /*global Element*/
    this.canvas = document.querySelector("canvas");
}

/**
 * Gets the preferred back-buffer height.
 * @name PreferredBackBufferHeight
 * @function
 * @memberOf GraphicsDevice
 */
GraphicsDevice.prototype.PreferredBackBufferHeight = function () {
    "use strict";
    return this.canvas.height;
};

/**
 * Gets the preferred back-buffer width.
 * @name PreferredBackBufferWidth
 * @function
 * @memberOf GraphicsDevice
 */
GraphicsDevice.prototype.PreferredBackBufferWidth = function () {
    "use strict";
    return this.canvas.width;
};

/**
 * Specifies the default minimum back-buffer height (600).
 * @name DefaultBackBufferHeight
 * @function
 * @memberOf GraphicsDevice
 * @static
 */
GraphicsDevice.prototype.DefaultBackBufferHeight = function () {
    "use strict";
    return 600;
};

/**
 * Specifies the default minimum back-buffer width (800).
 * @name DefaultBackBufferWidth
 * @function
 * @memberOf GraphicsDevice
 * @static
 */
GraphicsDevice.prototype.DefaultBackBufferWidth = function () {
    "use strict";
    return 800;
};

/**
 * Toggles between full page and windowed mode.
 * @name ToggleFullPage
 * @function
 * @memberOf GraphicsDevice
 */
GraphicsDevice.prototype.ToggleFullPage = function () {
    "use strict";
    var self = this,
        canvas = self.canvas,
        scaleX = 0,
        scaleY = 0;

    //Don't go to full page if full screen is activated
    if (!self.IsFullScreen()) {
        if (self.IsFullPage()) {
            canvas.width = self.DefaultBackBufferWidth();
            canvas.height = self.DefaultBackBufferHeight();
        } else {
            scaleX = window.innerWidth / canvas.width;
            scaleY = window.innerHeight / canvas.height;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.getContext("2d").scale(scaleX, scaleY);
        }
    }
};

/**
 * Toggles between full screen and windowed mode.
 * @name ToggleFullScreen
 * @function
 * @memberOf GraphicsDevice
 */
GraphicsDevice.prototype.ToggleFullScreen = function () {
    "use strict";
    /*global setTimeout*/
    var self = this,
        canvas = self.canvas,
        scaleX = 0,
        scaleY = 0;

    if (!self.IsFullScreen()) {

        //If canvas is full page turn it normal
        if (self.IsFullPage()) {
            self.ToggleFullPage();
        }

        if (canvas.requestFullScreen) {
            canvas.requestFullScreen();
        } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullScreen) {
            canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }

        scaleX = window.innerWidth / canvas.width;
        canvas.width = window.innerWidth;
        //For some reason (that I dunno), setTimeout is compulsory for the correct resizing
        setTimeout(function () {
            scaleY = window.innerHeight / canvas.height;
            canvas.height = window.innerHeight;
            canvas.getContext("2d").scale(scaleX, scaleY);
        }, 150);

    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        canvas.width = self.DefaultBackBufferWidth();
        canvas.height = self.DefaultBackBufferHeight();
    }
};

/**
 * Gets a value that indicates whether the device should start in full-page mode.
 * @name IsFullPage
 * @function
 * @memberOf GraphicsDevice
 */
GraphicsDevice.prototype.IsFullPage = function () {
    "use strict";
    /*global window */
    return (this.canvas.width === window.innerWidth && this.canvas.height === window.innerHeight);
};

/**
 * Gets a value that indicates whether the device should start in full-screen mode.
 * @name IsFullScreen
 * @function
 * @memberOf GraphicsDevice
 */
GraphicsDevice.prototype.IsFullScreen = function () {
    "use strict";
    /*global document */
    return !((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen));
};

/**
 * Clear the canvas rectangle.
 * @name Clear
 * @function
 * @memberOf GraphicsDevice
 */
GraphicsDevice.prototype.Clear = function () {
    "use strict";
    var canvas = this.canvas;

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
};