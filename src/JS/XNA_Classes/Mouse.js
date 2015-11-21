/**
 * Allows retrieval of position and button clicks from a mouse input device.
 * @global
 */
var Mouse = {

    X: 0,
    Y: 0,
    PreviousX: 0,
    PreviousY: 0,
    LeftButtonPressed: false,
    MiddleButtonPressed: false,
    RightButtonPressed: false,
    LeftButtonClicked: false,
    MiddleButtonClicked: false,
    RightButtonClicked: false,
    LeftButton: 0,
    MiddleButton: 1,
    RightButton: 2,
    ScrollWheelValue: 0,
    IsMoving: false,
    IsDraggingSomething: false,

    /**
     * Determine which mouse button was pressed.
     * @name mouseDownHandler
     * @function
     * @param {Event} event - This parameter represents a mouse event.
     * @memberOf Mouse
     * @static
     */
    mouseDownHandler: function (event) {
        "use strict";
        switch (event.button) {
        case 0:
            this.LeftButtonPressed = true;
            break;
        case 1:
            this.MiddleButtonPressed = true;
            break;
        case 2:
            this.RightButtonPressed = true;
            break;
        }
    },

    /**
     * Determine which mouse button was released.
     * @name mouseUpHandler
     * @function
     * @param {Event} event - This parameter represents a mouse event.
     * @memberOf Mouse
     * @static
     */
    mouseUpHandler: function (event) {
        "use strict";
        switch (event.button) {
        case 0:
            this.LeftButtonPressed = false;
            this.LeftButtonClicked = true;
            break;
        case 1:
            this.MiddleButtonPressed = false;
            this.MiddleButtonClicked = true;
            break;
        case 2:
            this.RightButtonPressed = false;
            this.RightButtonClicked = true;
            break;
        }
    },

    /**
     * Returns whether a specified mouse button was clicked (down and up).
     * @name IsButtonClicked
     * @function
     * @param {Number} buttonCode - Enumerated value that specifies the button to query.
     * @memberOf Mouse
     * @static
     */
    IsButtonClicked: function (buttonCode) {
        "use strict";
        switch (buttonCode) {
        case 0:
            if (this.LeftButtonClicked) {
                this.LeftButtonClicked = false;
                return true;
            }
            break;
        case 1:
            if (this.MiddleButtonClicked) {
                this.MiddleButtonClicked = false;
                return true;
            }
            break;
        case 2:
            if (this.RightButtonClicked) {
                this.RightButtonClicked = false;
                return true;
            }
            break;
        default:
            return false;
        }
    },

    /**
     * Increments or decrements the ScrollWheelValue property according to the mouse wheel event.
     * @name mouseWheelHandler
     * @function
     * @param {Event} event - This parameter represents a mouse event.
     * @memberOf Mouse
     * @static
     */
    mouseWheelHandler: function (event) {
        "use strict";
        /*global window*/

        // cross-browser wheel delta
        var e = window.event || event; // old IE support

        this.ScrollWheelValue += Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    }
};