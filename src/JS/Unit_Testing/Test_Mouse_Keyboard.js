/**
 * Provides basic graphics device initialization, game logic, and rendering code.
 */
function Game() {
	"use strict";
	/*globals ContentManager, GraphicsDevice, document, SpriteBatch, GameStates*/
	this.Content = new ContentManager();
	this.GraphicsDevice = new GraphicsDevice(document);
	this.spriteBatch = null;
	this.gameState = GameStates.Initializing;
	this.preloading = true;
}

/**
 * Allows the game to perform any initialization it needs to before starting to run.
 * This is where it can query for any required services and load any non-graphic
 * related content.
 * @name Initialize
 * @function
 * @memberOf Game
 */
Game.prototype.Initialize = function () {
	"use strict";
	var self = this;

	// TODO: Add your initialization logic here

	self.gameState = GameStates.Loading;
};

/**
 * LoadContent will be called once per game and is the place to load
 * all of your content.
 * @name LoadContent
 * @function
 * @memberOf Game
 */
Game.prototype.LoadContent = function () {
	"use strict";
	var self = this;

	if (self.preloading) {
		// Create a new SpriteBatch, which can be used to draw textures.
		self.spriteBatch = new SpriteBatch(self.GraphicsDevice);
		
		// TODO: use this.Content.Load... to load your game content here
		
		self.preloading = false;
	}
	
	if (self.Content.AllContentLoaded) {
		// TODO: create the objects that will use the content previously loaded
		
		self.gameState = GameStates.Playing;
	}
};

/**
 * Allows the game to run logic such as updating the world,
 * checking for collisions, gathering input, and playing audio.
 * @name Update
 * @function
 * @memberOf Game
 */
Game.prototype.Update = function () {
	"use strict";
	var self = this;

	// TODO: Add your update logic here
};

/**
 * This is called when the game should draw itself.
 * @name Draw
 * @function
 * @memberOf Game
 */
Game.prototype.Draw = function () {
	"use strict";
	var self = this;

	self.GraphicsDevice.Clear();

	// TODO: Add your drawing code here
    self.GraphicsDevice.Clear();
	
	self.spriteBatch.DrawString(
		"normal bold 18px Helvetica",
		"------ MOUSE ------",
		new Point(30, 20),
		"#000000",
		Vector2.One()
	);
	self.spriteBatch.DrawString(
		"normal bold 16px Helvetica",
		"X: "+Mouse.X+"      Y: "+Mouse.Y,
		new Point(30, 50),
		"#000000",
		Vector2.One()
	);
	self.spriteBatch.DrawString(
		"normal bold 16px Helvetica",
		"Wheel: "+Mouse.ScrollWheelValue,
		new Point(30, 80),
		"#000000",
		Vector2.One()
	);
	self.spriteBatch.DrawString(
		"normal bold 16px Helvetica",
		"LeftButtonPressed: "+Mouse.LeftButtonPressed,
		new Point(30, 110),
		"#000000",
		Vector2.One()
	);
	self.spriteBatch.DrawString(
		"normal bold 16px Helvetica",
		"RightButtonPressed: "+Mouse.RightButtonPressed,
		new Point(30, 140),
		"#000000",
		Vector2.One()
	);
	self.spriteBatch.DrawString(
		"normal bold 16px Helvetica",
		"MiddleButtonPressed: "+Mouse.MiddleButtonPressed,
		new Point(30, 170),
		"#000000",
		Vector2.One()
	);
	
	self.spriteBatch.DrawString(
		"normal bold 18px Helvetica",
		"------ KEYBOARD ------",
		new Point(30, 230),
		"#000000",
		Vector2.One()
	);
    
	self.spriteBatch.DrawString(
		"normal bold 16px Helvetica",
		"Teclas que están siendo pulsadas: "+Keyboard.keyDownList,
		new Point(30, 260),
		"#000000",
		Vector2.One()
	);
	
	self.spriteBatch.DrawString(
		"normal bold 16px Helvetica",
		"Teclas pulsadas: "+Keyboard.keyUpList,
		new Point(30, 290),
		"#000000",
		Vector2.One()
	);
};

/**
 * Call this method to initialize the game, begin running the game loop, and
 * start processing events for the game.
 * @name Run
 * @function
 * @memberOf Game
 */
Game.prototype.Run = function () {
	"use strict";
	/*globals requestAnimationFrame*/
	var self = this;

	//Call the game loop
	requestAnimationFrame(self.Run.bind(self), self.GraphicsDevice.canvas);

	//Choose the method to run according to the game state
	switch (self.gameState) {
	case GameStates.Initializing:
		self.Initialize();
		break;
	case GameStates.Loading:
		self.LoadContent();
		break;
	case GameStates.Playing:
		self.Update();
		self.Draw();
		break;
	}
};