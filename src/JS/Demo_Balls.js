/**
 * Provides basic graphics device initialization, game logic, and rendering code.
 */
function Game() {
	"use strict";
	/*globals ContentManager, GraphicsDevice, document, SpriteBatch, GameStates, GravityDirections*/
	this.Content = new ContentManager();
	this.GraphicsDevice = new GraphicsDevice(document);
	this.spriteBatch = null;
	this.gameState = GameStates.Initializing;

	//The HTML elements
	this.generateButton = document.querySelector("#generate");
	this.gravityCheckBox = document.querySelector("#gravity");
	this.gravityDirRadioButtons = document.querySelectorAll("#gravityDir");
	this.removeAllBallsButton = document.querySelector("#reset");

	//The ball image
	this.ballTexture = null;
	
	//The room image
	this.roomImage = null;

	//The balls array
	this.balls = [];

	//The room Sprite
	this.roomSprite = null;

	//Gravity properties
	this.gravityActivated = false;
	this.gravityDir = GravityDirections.G_DOWN;
	this.gravityForce = 0.4;

	//Other
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
	/*globals GenerateBall*/
	var self = this,
		len,
		i;

	//Add the event listener to the generate ball button
	self.generateButton.addEventListener("mousedown", self.GenerateBall.bind(self), false);

	//Remove all the balls in the room if this button is pressed
	self.removeAllBallsButton.addEventListener("mousedown", function (event) {
		self.balls.splice(0, self.balls.length);
	}, false);

	//Enable or disable the radiobuttons depending on the gravity checkbox
	self.gravityCheckBox.addEventListener("mousedown", function (event) {

		if (self.gravityCheckBox.checked) {
			self.gravityActivated = false;
			for (i = 0, len = self.gravityDirRadioButtons.length; i < len; i += 1) {
				self.gravityDirRadioButtons[i].disabled = true;
			}
		} else {
			self.gravityActivated = true;
			for (i = 0, len = self.gravityDirRadioButtons.length; i < len; i += 1) {
				self.gravityDirRadioButtons[i].disabled = false;
			}
		}

	}, false);

	//Depending on which radiobutton is checked the gravity direction changes
	for (i = 0, len = self.gravityDirRadioButtons.length; i < len; i += 1) {

		self.gravityDirRadioButtons[i].addEventListener("mousedown", function (event) {
			self.gravityDir = parseInt(this.value, 10);
		}, false);
	}

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
	/*globals Sprite, Rectangle, Point, Vector2*/
	var self = this;

	if (self.preloading) {
		// Create a new SpriteBatch, which can be used to draw textures.
		self.spriteBatch = new SpriteBatch(self.GraphicsDevice);

		// TODO: use this.Content.Load... to load your game content here
		self.ballTexture = self.Content.LoadTexture2D("../../images/ball.png");
		self.roomImage = self.Content.LoadTexture2D("../../images/room.jpg");
		self.preloading = false;
	}

	if (self.Content.AllContentLoaded()) {
		//Create the room sprite and add it to the sprites list
		self.roomSprite = new Sprite(self.roomImage, Vector2.One(),
			new Rectangle(0, 0, self.roomImage.Width(), self.roomImage.Height()),
			Point.Zero(), true
			);

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
	var self = this,
		len = self.balls.length,
		i;

	// TODO: Add your update logic here
	if (len > 0) {
		for (i = 0; i < len; i += 1) {
			self.balls[i].Update(
				self.GraphicsDevice.PreferredBackBufferWidth(),
				self.GraphicsDevice.PreferredBackBufferHeight(),
				self.balls,
				self.gravityActivated,
				self.gravityDir,
				self.gravityForce
			);
		}
	}
};

/**
 * This is called when the game should draw itself.
 * @name Draw
 * @function
 * @memberOf Game
 */
Game.prototype.Draw = function () {
	"use strict";
	/*globals Vector2, SpriteEffects*/
	var self = this,
		len = self.balls.length,
		i,
		auxSprite = null;

	self.GraphicsDevice.Clear();

	//Draw the room
	self.spriteBatch.Draw(self.roomSprite.Texture,
		Vector2.Zero(),
		new Rectangle(0, 0, self.roomSprite.Width(), self.roomSprite.Height()), 0, self.roomSprite.Scale, SpriteEffects.None);

	//Draw the balls
	if (len > 0) {
		for (i = 0; i < len; i += 1) {
			auxSprite = self.balls[i].Sprite;
			//console.log(self.balls[i].Sprite.Scale);console.log(auxSprite.Position.Y);
			if (auxSprite.IsVisible) {
				self.spriteBatch.Draw(
					auxSprite.Texture,
					auxSprite.Position,
					new Rectangle(0, 0, auxSprite.Texture.Width(), auxSprite.Texture.Height()),
					auxSprite.Rotation,
					auxSprite.Scale,
					SpriteEffects.None
				);
			}
		}
	}
};

Game.prototype.GenerateBall = function () {
	"use strict";
	/*globals Sprite, Ball, Rectangle, Point*/

	//Create a ball with random scale
	var self = this,
		scale = (Math.floor(Math.random() * 20) + 10) / 100,
		canvasWidth = self.GraphicsDevice.PreferredBackBufferWidth(),
		canvasHeight = self.GraphicsDevice.PreferredBackBufferHeight(),
		sprite = new Sprite(
			self.ballTexture,
			new Vector2(scale, scale),
			new Rectangle(0, 0, self.ballTexture.Width(), self.ballTexture.Height()),
			Point.Zero(),
			true
		),
		position = new Point((canvasWidth / 2 - sprite.HalfWidth()), (canvasHeight / 2 - sprite.HalfHeight())),
		ball = new Ball(
			sprite,
			sprite.HalfWidth(),
			position,
			self.balls.length,
			true,
			true
		);
	
	self.balls.push(ball);
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