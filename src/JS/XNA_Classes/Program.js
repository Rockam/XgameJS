/**
 * The main entry point for the application.
 */
(function () {
    "use strict";
    /*global Game, Keyboard, Mouse, window*/

    //Create the game object and start running it
    var game = new Game(),
        canvas = game.GraphicsDevice.canvas;
    game.Run();

    /***************************************************/
    /*** Keyboard and Mouse listeners initialization ***/
    /***************************************************/
    //Add keyboard event listeners
    window.addEventListener("keydown", Keyboard.addKeyDown, false);
    window.addEventListener("keyup", Keyboard.addKeyUp, false);

    //Add mouse event listeners
    canvas.addEventListener("mousedown", Mouse.mouseDownHandler.bind(Mouse), false);
    window.addEventListener("mouseup", Mouse.mouseUpHandler.bind(Mouse), false);
    canvas.addEventListener("mousemove", function (event) {

        //Find the new mouse's x and y position on the canvas
        Mouse.X = event.pageX - canvas.offsetLeft;
        Mouse.Y = event.pageY - canvas.offsetTop;

        //If the mouse position changed then set the previous mouse's x and 
        //y position on the canvas
        if (Mouse.PreviousX !== Mouse.X || Mouse.PreviousY !== Mouse.Y) {
            Mouse.IsMoving = true;
            Mouse.PreviousX = Mouse.X;
            Mouse.PreviousY = Mouse.Y;
        } else if (Mouse.IsMoving) {
            Mouse.IsMoving = false;
        }

    }, false);

    //The mouse wheel listener
    canvas.addEventListener("wheel", Mouse.mouseWheelHandler.bind(Mouse), false);

    //Disable the context menu when pressing right button of the mouse
    canvas.addEventListener("contextmenu", function (e) {
        if (e.button === 2) {
            e.preventDefault();
            return false;
        }
    }, false);
}());