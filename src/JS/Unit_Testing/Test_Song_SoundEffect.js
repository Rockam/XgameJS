/**
 * Provides basic graphics device initialization, game logic, and rendering code.
 */
function Game() {
	"use strict";
	/*globals ContentManager, GraphicsDevice, document, SpriteBatch, GameStates, Point, Vector2, Rectangle, Keyboard, Keys, Mouse, Segment, SpriteEffects, Sprite, Texture2D, setTimeout*/
	this.Content = new ContentManager();
	this.GraphicsDevice = new GraphicsDevice(document);
	this.spriteBatch = null;
	this.gameState = GameStates.Initializing;
	this.preloading = true;
    
    //Constants
    this.FONT_LITTLE = "normal bold 15px Helvetica";
    this.FONT_BIG = "normal bold 18px Helvetica";
    this.BLACK = "#000000";
    this.GREEN = "#00FF00";
    this.RED = "#FF0000";
    this.BLUE = "#0000FF";
    
    /***** TEST VARIABLES *****/
    //Song
    this.song = null;
    
    //SoundEffects
    this.vacaSound = null;
    this.cerdoSound = null;
    this.cerberoSound = null;
    
    //Images
    this.vaca = null;
    this.cerdo = null;
    this.cerbero = null;
    
    //Sprites
    this.vacaSprite = null;
    this.cerdoSprite = null;
    this.cerberoSprite = null;
    
    //Flags
    this.playing = false;
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
		
		self.song = self.Content.LoadSong("../../sounds/test_song.mp3");
        self.vacaSound = self.Content.LoadSoundEffect("../../sounds/test_sound2.wav");
        self.cerdoSound = self.Content.LoadSoundEffect("../../sounds/test_sound3.wav");
        self.cerberoSound = self.Content.LoadSoundEffect("../../sounds/test_sound1.wav");
        self.vaca = self.Content.LoadTexture2D("../../images/vaca.jpg");
        self.cerdo = self.Content.LoadTexture2D("../../images/cerdo.png");
        self.cerbero = self.Content.LoadTexture2D("../../images/cerbero.jpg");
		
		self.preloading = false;
	}
	
	if (self.Content.AllContentLoaded()) {
        
        self.vacaSprite = new Sprite(
            self.vaca,
            new Vector2(0.75, 0.75),
            new Rectangle(0, 0, self.vaca.Width(), self.vaca.Height()),
            new Point(500, 30),
            false
        );
        
        self.cerdoSprite = new Sprite(
            self.cerdo,
            new Vector2(0.70, 0.70),
            new Rectangle(0, 0, self.cerdo.Width(), self.cerdo.Height()),
            new Point(540, 210),
            false
        );
        
        self.cerberoSprite = new Sprite(
            self.cerbero,
            new Vector2(0.75, 0.75),
            new Rectangle(0, 0, self.cerbero.Width(), self.cerbero.Height()),
            new Point(500, 380),
            false
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
	var self = this;

	//Song
    if (Keyboard.IsKeyPressed(Keys.p)) {
        if (self.playing) {
            self.song.Pause();
            self.playing = false;
        } else {
            self.song.Play();
            self.playing = true;
        }
    }
    if (Keyboard.IsKeyPressed(Keys.s)) {
        self.song.Stop();
        self.playing = false;
    }
    if (Keyboard.IsKeyPressed(Keys.m)) {
        if (self.song.IsMuted()) {
            self.song.IsMuted(false);
        } else {
            self.song.IsMuted(true);
        }
    }
    if (Keyboard.IsKeyPressed(Keys.l)) {
        if (self.song.IsRepeating()) {
            self.song.IsRepeating(false);
        } else {
            self.song.IsRepeating(true);
        }
    }
    if (Keyboard.IsKeyPressed(Keys.add)) {
        self.song.Volume(self.song.Volume() + 0.05);
    }
    if (Keyboard.IsKeyPressed(Keys.subtract)) {
        self.song.Volume(self.song.Volume() - 0.05);
    }
    
    //Sounds
    if (Keyboard.IsKeyPressed(Keys.num1) || Keyboard.IsKeyPressed(Keys.numpad_1)) {
        self.vacaSound.Play();
        self.vacaSprite.IsVisible = true;
        setTimeout(function () { self.vacaSprite.IsVisible = false; }, self.vacaSound.Duration() * 1000);
    }
    if (Keyboard.IsKeyPressed(Keys.num2) || Keyboard.IsKeyPressed(Keys.numpad_2)) {
        self.cerdoSound.Play();
        self.cerdoSprite.IsVisible = true;
        setTimeout(function () { self.cerdoSprite.IsVisible = false; }, self.cerdoSound.Duration() * 1000);
    }
    if (Keyboard.IsKeyPressed(Keys.num3) || Keyboard.IsKeyPressed(Keys.numpad_3)) {
        self.cerberoSound.Play();
        self.cerberoSprite.IsVisible = true;
        setTimeout(function () { self.cerberoSprite.IsVisible = false; }, self.cerberoSound.Duration() * 1000);
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
	var self = this;

	self.GraphicsDevice.Clear();

    //Song attributes
    self.spriteBatch.DrawString(self.FONT_BIG, "------ SONG ------", new Point(30, 20), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Duration (in seconds): " + self.song.Duration(), new Point(30, 50), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Is muted? " + self.song.IsMuted(), new Point(30, 80), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Play in loop? " + self.song.IsRepeating(), new Point(30, 110), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Current time (in seconds): " + self.song.PlayPosition(), new Point(30, 140), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Volume: " + (Math.round(self.song.Volume() * 100) / 100), new Point(30, 170), self.BLACK, Vector2.One());
    
    self.spriteBatch.DrawString(self.FONT_BIG, "Press M to mute the song", new Point(30, 350), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_BIG, "Press L to activate loop", new Point(30, 390), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_BIG, "Press + to increase volume", new Point(30, 430), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_BIG, "Press - to decrease volume", new Point(30, 470), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_BIG, "Press P to play/pause the song", new Point(30, 510), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_BIG, "Press S to stop the song", new Point(30, 550), self.BLUE, Vector2.One());
    
	//Draw the separating line
    self.spriteBatch.DrawSegment(new Segment(new Point(400, 0), new Point(400, 600)), "3", self.BLACK);
    
    //Draw the images
    if (self.vacaSprite.IsVisible) {
        self.spriteBatch.Draw(
            self.vacaSprite.Texture,
            self.vacaSprite.Position,
            self.vacaSprite.SourceRect,
            self.vacaSprite.Rotation,
            self.vacaSprite.Scale,
            SpriteEffects.None
        );
    } else {
        self.spriteBatch.DrawString(self.FONT_BIG, "Press 1 to play sound effect 1", new Point(470, 60), self.BLUE, Vector2.One());
    }
        
    if (self.cerdoSprite.IsVisible) {
        self.spriteBatch.Draw(
            self.cerdoSprite.Texture,
            self.cerdoSprite.Position,
            self.cerdoSprite.SourceRect,
            self.cerdoSprite.Rotation,
            self.cerdoSprite.Scale,
            SpriteEffects.None
        );
    } else {
        self.spriteBatch.DrawString(self.FONT_BIG, "Press 2 to play sound effect 2", new Point(470, 260), self.BLUE, Vector2.One());
    }
    
    if (self.cerberoSprite.IsVisible) {
        self.spriteBatch.Draw(
            self.cerberoSprite.Texture,
            self.cerberoSprite.Position,
            self.cerberoSprite.SourceRect,
            self.cerberoSprite.Rotation,
            self.cerberoSprite.Scale,
            SpriteEffects.None
        );
    } else {
        self.spriteBatch.DrawString(self.FONT_BIG, "Press 3 to play sound effect 3", new Point(470, 460), self.BLUE, Vector2.One());
    }

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