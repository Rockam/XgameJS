/**
 * Provides basic graphics device initialization, game logic, and rendering code.
 */
function Game() {
    "use strict";
    /*globals ContentManager, GraphicsDevice, document, SpriteBatch, GameStates, setInterval, clearInterval, Mouse, SpriteEffects*/
    this.Content = new ContentManager();
    this.GraphicsDevice = new GraphicsDevice(document);
    this.spriteBatch = null;
    this.gameState = GameStates.Initializing;
    this.preloading = true;

    this.level = null;
    this.sprites = [];

    this.gravityForce = 0.3;

    this.pearlsToCollect = 0;

    //The images
    this.levelTexture = null;
    this.distantBackgroundTexture = null;
    this.raymanTexture = null;
    this.enemyTexture = null;
    this.punchTexture = null;
    this.flyPowerTexture = null;
    this.punchSpeedTexture = null;
    this.pearlTexture = null;
    this.shieldTexture = null;
    this.helpTexture = null;
    this.gameOverTexture = null;
    this.winTexture = null;
    this.hudTexture = null;

    //The song
    this.song = null;

    //Sound effects
    this.soundEffects = [];

    //Create the platforms, pickable objects and enemys arrays
    this.platforms = [];
    this.pickableObjects = [];
    this.enemys = [];

    //Create the player
    this.player = null;

    //Create the game camera
    this.camera = null;

    //The win zone rectangle
    this.winRect = null;

    //The help screen sprite
    this.helpSprite = null;

    //The game over screen sprite
    this.gameOverSprite = null;

    //The win screen sprite
    this.winSprite = null;
    
    //The win screen sprite
    this.hudSprite = null;

    //Flags
    this.moveRight = false;
    this.moveLeft = false;
    this.jump = false;
    this.punch = false;
    this.showCollisions = false;

    this.interval = null;
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
    /*globals Level, Sprite, Point, Rectangle, Vector2, PickableObject, AnimationTypes, PickableObjectTypes, AnimatedSprite, Enemy, Player, Projectile, Camera*/
    var self = this,
        distantBackgroundRepeats = 0,
        i = 0,
        len = 0,
        currentPlatform = null,
        currentObject = null,
        currentEnemy = null,
        objSprite = null,
        type = null,
        aux = 0;

    if (self.preloading) {
        // Create a new SpriteBatch, which can be used to draw textures.
        self.spriteBatch = new SpriteBatch(self.GraphicsDevice);

        //Textures
        self.levelTexture = self.Content.LoadTexture2D("../../maps/level1.png");
        self.distantBackgroundTexture = self.Content.LoadTexture2D("../../images/dream_forest_background.png");
        self.raymanTexture = self.Content.LoadTexture2D("../../images/rayman_anim.png");
        self.enemyTexture = self.Content.LoadTexture2D("../../images/enemy1_anim.png");
        self.punchTexture = self.Content.LoadTexture2D("../../images/punch.png");
        self.flyPowerTexture = self.Content.LoadTexture2D("../../images/fairy_anim.png");
        self.punchSpeedTexture = self.Content.LoadTexture2D("../../images/fairy_anim2.png");
        self.pearlTexture = self.Content.LoadTexture2D("../../images/pearl_anim.png");
        self.shieldTexture = self.Content.LoadTexture2D("../../images/shield_anim.png");
        self.helpTexture = self.Content.LoadTexture2D("../../images/help.jpg");
        self.gameOverTexture = self.Content.LoadTexture2D("../../images/game_over_screen.png");
        self.winTexture = self.Content.LoadTexture2D("../../images/win_screen.png");
        self.hudTexture = self.Content.LoadTexture2D("../../images/interfaz.png");

        //The song
        self.song = self.Content.LoadSong("../../sounds/Rayman/song.mp3");

        //Sound Effects
        self.soundEffects.push(["enemy_hitted", self.Content.LoadSoundEffect("../../sounds/Rayman/enemy_hitted.wav")]);
        self.soundEffects.push(["flying", self.Content.LoadSoundEffect("../../sounds/Rayman/flying.wav")]);
        self.soundEffects.push(["game_over", self.Content.LoadSoundEffect("../../sounds/Rayman/game_over.mp3")]);
        self.soundEffects.push(["pearl_picked", self.Content.LoadSoundEffect("../../sounds/Rayman/pearl_picked.wav")]);
        self.soundEffects.push(["power_picked", self.Content.LoadSoundEffect("../../sounds/Rayman/power_picked.wav")]);
        self.soundEffects.push(["punch_thrown", self.Content.LoadSoundEffect("../../sounds/Rayman/punch_thrown.wav")]);
        self.soundEffects.push(["rayman_hitted", self.Content.LoadSoundEffect("../../sounds/Rayman/rayman_hitted.wav")]);
        self.soundEffects.push(["shield_picked", self.Content.LoadSoundEffect("../../sounds/Rayman/shield_picked.wav")]);
        self.soundEffects.push(["win_level", self.Content.LoadSoundEffect("../../sounds/Rayman/win_level.wav")]);
        self.soundEffects.push(["idle", self.Content.LoadSoundEffect("../../sounds/Rayman/idle.wav")]);
        self.soundEffects.push(["ground_hit", self.Content.LoadSoundEffect("../../sounds/Rayman/ground_hit.wav")]);

        self.preloading = false;
    }

    if (self.Content.AllContentLoaded()) {

        //Create the level
        self.level = new Level(
            new Sprite(
                self.levelTexture,
                Vector2.One(),
                new Rectangle(0, 0, self.levelTexture.Width(), self.levelTexture.Height()),
                Point.Zero(),
                true
            )
        );
        distantBackgroundRepeats = Math.ceil(self.levelTexture.Width() / self.distantBackgroundTexture.Width());

        for (i = 0; i < distantBackgroundRepeats; i += 1) {
            self.level.DistantBackgroundsSprites.push(
                new Sprite(
                    self.distantBackgroundTexture,
                    Vector2.One(),
                    new Rectangle(0, 0, self.distantBackgroundTexture.Width(), self.distantBackgroundTexture.Height()),
                    new Point(self.distantBackgroundTexture.Width() * i, 0),
                    true
                )
            );
        }

        ///////////////////////
        /// Build the level ///
        ///////////////////////
        for (i = 0, len = self.level.DistantBackgroundsSprites.length; i < len; i += 1) {
            self.sprites.push(self.level.DistantBackgroundsSprites[i]);
        }
        self.sprites.push(self.level.Sprite);

        //Create all the platforms and add them to the platforms array
        for (i = 0, len = self.level.Platforms.length; i < len; i += 1) {

            currentPlatform = self.level.Platforms[i];
            self.platforms.push(
                new Rectangle(
                    currentPlatform.x,
                    currentPlatform.y,
                    currentPlatform.width,
                    currentPlatform.height
                )
            );
        }

        //Create all the pickable objects and add them to the pickable objects array
        for (i = 0, len = self.level.PickableObjects.length; i < len; i += 1) {

            currentObject = self.level.PickableObjects[i];

            switch (currentObject.name) {
            case "PEARL":
                objSprite = new AnimatedSprite(
                    self.pearlTexture,
                    new Vector2(1.35, 1.35),
                    new Rectangle(0, 0, 24, 24),
                    new Point(currentObject.x, currentObject.y),
                    true,
                    AnimationTypes.PingPongLoop,
                    8,
                    90
                );
                type = PickableObjectTypes.PEARL;
                self.pearlsToCollect += 1;
                break;

            case "LIFE":
                objSprite = new AnimatedSprite(
                    self.flyPowerTexture,
                    Vector2.One(),
                    new Rectangle(0, 0, 64, 64),
                    new Point(currentObject.x, currentObject.y),
                    true,
                    AnimationTypes.PingPongLoop,
                    10,
                    25
                );
                type = PickableObjectTypes.LIFE;
                break;

            case "MINI_SHIELD":
                objSprite = new AnimatedSprite(
                    self.flyPowerTexture,
                    Vector2.One(),
                    new Rectangle(0, 0, 64, 64),
                    new Point(currentObject.x, currentObject.y),
                    true,
                    AnimationTypes.PingPongLoop,
                    10,
                    25
                );
                type = PickableObjectTypes.MINI_SHIELD;
                break;

            case "SHIELD":
                objSprite = new AnimatedSprite(
                    self.shieldTexture,
                    new Vector2(2.1, 1.7),
                    new Rectangle(0, 0, 24, 19),
                    new Point(currentObject.x, currentObject.y),
                    true,
                    AnimationTypes.PingPongLoop,
                    4,
                    120
                );
                type = PickableObjectTypes.SHIELD;
                break;

            case "PUNCH_SPEED":
                objSprite = new AnimatedSprite(
                    self.punchSpeedTexture,
                    new Vector2(1.2, 1.2),
                    new Rectangle(0, 0, 64, 64),
                    new Point(currentObject.x, currentObject.y),
                    true,
                    AnimationTypes.PingPongLoop,
                    10,
                    35
                );
                type = PickableObjectTypes.PUNCH_SPEED;
                break;

            case "PUNCH_POWER":
                objSprite = new AnimatedSprite(
                    self.flyPowerTexture,
                    Vector2.One(),
                    new Rectangle(0, 0, 64, 64),
                    new Point(currentObject.x, currentObject.y),
                    true,
                    AnimationTypes.PingPongLoop,
                    10,
                    25
                );
                type = PickableObjectTypes.PUNCH_POWER;
                break;

            case "ETERNAL_FLY":
                objSprite = new AnimatedSprite(
                    self.flyPowerTexture,
                    new Vector2(1.2, 1.2),
                    new Rectangle(0, 0, 64, 64),
                    new Point(currentObject.x, currentObject.y),
                    true,
                    AnimationTypes.PingPongLoop,
                    10,
                    30
                );
                type = PickableObjectTypes.ETERNAL_FLY;
                break;

            }

            if (objSprite !== null && type !== null) {
                self.sprites.push(objSprite);
                self.pickableObjects.push(new PickableObject(objSprite, type));
            }
        }

        //Create all the enemys and add them to the enemys array
        for (i = 0, len = self.level.Enemys.length; i < len; i += 1) {

            currentEnemy = self.level.Enemys[i];

            self.enemys.push(
                new Enemy(
                    new AnimatedSprite(
                        self.enemyTexture,
                        new Vector2(0.3, 0.3),
                        new Rectangle(0, 0, 80, 80),
                        new Point(currentEnemy.x, currentEnemy.y),
                        true,
                        AnimationTypes.Loop,
                        20,
                        35
                    )
                )
            );

            self.sprites.push(self.enemys[i].Sprite);
        }

        //Create the player (Rayman) and his punch
        self.player = new Player(
            new AnimatedSprite(
                self.raymanTexture,
                new Vector2(0.1, 0.1),
                new Rectangle(0, 0, 80, 80),
                new Point(self.level.Player.x, self.level.Player.y),
                true,
                AnimationTypes.Loop,
                11,
                45
            )
        );

        self.player.Punch = new Projectile(
            new Sprite(
                self.punchTexture,
                new Vector2(1.2, 1.2),
                new Rectangle(0, 0, self.punchTexture.HalfWidth(), self.punchTexture.Height()),
                Point.Zero(),
                false
            )
        );

        self.sprites.push(self.player.Sprite);
        self.sprites.push(self.player.Punch.Sprite);

        //Instanciate the game camera
        self.camera = new Camera(
            self.GraphicsDevice.DefaultBackBufferWidth(),
            self.GraphicsDevice.DefaultBackBufferHeight(),
            self.levelTexture.Width(),
            self.levelTexture.Height(),
            1.2
        );

        //Initialize the win zone rectangle
        self.winRect = new Rectangle(self.level.WinRect.x, self.level.WinRect.y, self.level.WinRect.width, self.level.WinRect.height);

        //Initialize the help screen sprite
        self.helpSprite = new Sprite(
            self.helpTexture,
            Vector2.One(),
            new Rectangle(0, 0, self.helpTexture.Width(), self.helpTexture.Height()),
            Point.Zero(),
            true
        );

        //Initialize the game over screen sprite
        self.gameOverSprite = new Sprite(
            self.gameOverTexture,
            Vector2.One(),
            new Rectangle(0, 0, self.gameOverTexture.Width(), self.gameOverTexture.Height()),
            Point.Zero(),
            true
        );

        //Initialize the win screen sprite
        self.winSprite = new Sprite(
            self.winTexture,
            Vector2.One(),
            new Rectangle(0, 0, self.winTexture.Width(), self.winTexture.Height()),
            Point.Zero(),
            true
        );

        //Initialize the hud sprite
        self.hudSprite = new Sprite(
            self.hudTexture,
            Vector2.One(),
            new Rectangle(0, 0, self.hudTexture.Width(), self.hudTexture.Height()),
            Point.Zero(),
            true
        );

        /////////////////////////

        //If mouse left button clicked enter full screen mode
        self.GraphicsDevice.canvas.addEventListener("click", self.GraphicsDevice.ToggleFullScreen.bind(self.GraphicsDevice));

        //Play the game song
        self.song.Play();

        self.interval = setInterval(function () {
            if (self.gameState === GameStates.Playing && self.player.CurrentState === self.player.IDLE) {
                self.soundEffects[9][1].Play();
            }
        }, 3500);
        
        //Change game state to "playing"
        self.gameState = GameStates.Paused;
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
    /*globals Keyboard, Keys*/
    var self = this,
        i = 0,
        len = 0,
        playerPunch = null,
        levelWidth = self.level.Sprite.Width();

    //Show help screen if 'h' key pressed
    if (Keyboard.IsKeyPressed(Keys.h)) {
        self.gameState = GameStates.Paused;
    }

    //Toggle full page mode if mouse right button pressed
    if (Mouse.IsButtonClicked(Mouse.RightButton)) {
        self.GraphicsDevice.ToggleFullPage();
    }

    //Catch the Mouse and Keyboard buttons
    self.moveLeft = Keyboard.IsKeyDown(Keys.a) || Keyboard.IsKeyDown(Keys.left_arrow);
    self.moveRight = Keyboard.IsKeyDown(Keys.d) || Keyboard.IsKeyDown(Keys.right_arrow);
    self.jump = Keyboard.IsKeyDown(Keys.w) || Keyboard.IsKeyDown(Keys.up_arrow);
    if ((!self.showCollisions && Keyboard.IsKeyPressed(Keys.c)) ||
            (self.showCollisions && !Keyboard.IsKeyPressed(Keys.c))) {
        self.showCollisions = true;
    } else {
        self.showCollisions = false;
    }
    if (!self.punch && Keyboard.IsKeyUp(Keys.space)) {
        self.punch = true;
        self.soundEffects[5][1].Play();
    }
    if (Keyboard.IsKeyPressed(Keys.add)) {
        self.camera.IncreaseZoom();
    }
    if (Keyboard.IsKeyPressed(Keys.subtract)) {
        self.camera.DecreaseZoom();
    }

    //Update the player
    self.player.Update(self.moveLeft, self.moveRight, self.jump, self.punch, self.platforms, levelWidth, self.pickableObjects, self.sprites, self.gravityForce, self.soundEffects, self.enemys);

    //Check if the player have all pearls and is in the win zone
    if (self.player.Pearls === self.pearlsToCollect && self.player.Bounds().Intersects(self.winRect) !== false) {
        self.song.Stop();
        self.soundEffects[8][1].Play();
        self.gameState = GameStates.GameWin;
        return;
    }

    //If player dies go to game over game state
    if (self.player.Shield <= 0 || self.player.Sprite.Position.Y > self.level.Sprite.Height()) {
        self.song.Stop();
        self.soundEffects[2][1].Play();
        self.gameState = GameStates.GameOver;
        return;
    }

    //Control the punch collision with Rayman
    playerPunch = self.player.Punch;
    if (self.punch &&
            playerPunch.IsReturning &&
            (self.player.Bounds().Intersects(playerPunch.Sprite.Bounds()) !== false)) {
        playerPunch.Sprite.IsVisible = false;
        playerPunch.IsReturning = false;
        self.punch = false;
    }

    //Update the camera
    self.camera.Update(self.player);

    //Update the enemys
    for (i = 0, len = self.enemys.length; i < len; i += 1) {
        self.enemys[i].Update(levelWidth, self.platforms, self.gravityForce);
    }

    //Move the distantBackground at half the speed of the camera
    for (i = 0, len = self.level.DistantBackgroundsSprites.length; i < len; i += 1) {
        self.level.DistantBackgroundsSprites[i].Position.X += self.camera.SpeedV.X / 2;
    }

    //Capture the camera's current x position so we can use it as the
    //previousX value in the next frame
    self.camera.PreviousSpeedX = self.camera.Position.X;
};

/**
 * This is called when the game should draw itself.
 * @name Draw
 * @function
 * @memberOf Game
 */
Game.prototype.Draw = function () {
    "use strict";
    var self = this,
        len = self.sprites.length,
        i = 0,
        auxSprite = null,
        hudSprite = self.hudSprite;

    self.GraphicsDevice.Clear();

    self.spriteBatch.ctx.save();

    self.spriteBatch.ctx.scale(self.camera.Zoom, self.camera.Zoom);
    self.spriteBatch.ctx.translate(-self.camera.Position.X, -self.camera.Position.Y);

    //Draw the sprites if visibles
    if (len > 0) {
        for (i = 0; i < len; i += 1) {
            auxSprite = self.sprites[i];
            if (auxSprite.IsVisible) {
                self.spriteBatch.Draw(
                    auxSprite.Texture,
                    auxSprite.Position,
                    new Rectangle(auxSprite.SourceRect.X, auxSprite.SourceRect.Y, auxSprite.SourceRect.Width, auxSprite.SourceRect.Height),
                    auxSprite.Rotation,
                    auxSprite.Scale,
                    auxSprite.SpriteEffects
                );
            }
        }
    }

    //Display the collision rectangles if requested
    if (self.showCollisions) {
        for (i = 0, len = self.platforms.length; i < len; i += 1) {
            self.spriteBatch.DrawRectangle(self.platforms[i], "2", null);
        }

        //Draw the player bounds
        self.spriteBatch.DrawRectangle(self.player.Bounds(), "2", "#00FF00");

        //Draw the Rayman's punch
        if (self.player.Punch.Sprite.IsVisible) {
            self.spriteBatch.DrawRectangle(self.player.Punch.Sprite.Bounds(), "2", "#0000FF");
        }

        //Draw the enemy bounds
        for (i = 0, len = self.enemys.length; i < len; i += 1) {
            self.spriteBatch.DrawRectangle(self.enemys[i].Bounds(), "2", "#FF0000");
        }

        //Draw the pickable objects bounds
        for (i = 0, len = self.pickableObjects.length; i < len; i += 1) {
            self.spriteBatch.DrawRectangle(self.pickableObjects[i].Bounds(), "2", "#FF00FF");
        }

        //Draw the win zone bounds
        self.spriteBatch.DrawRectangle(self.winRect, "2", "#ffee00");
    }

    self.spriteBatch.ctx.restore();
    
    //Draw the hud
    self.spriteBatch.Draw(
        hudSprite.Texture,
        hudSprite.Position,
        new Rectangle(hudSprite.SourceRect.X, hudSprite.SourceRect.Y, hudSprite.SourceRect.Width, hudSprite.SourceRect.Height),
        hudSprite.Rotation,
        hudSprite.Scale,
        hudSprite.SpriteEffects
    );
    
    self.spriteBatch.DrawString(
		"normal bold 24px Helvetica",
		self.player.Shield + " / 5",
		new Point(77, 25),
		"#000000",
		Vector2.One()
	);
    
    self.spriteBatch.DrawString(
		"normal bold 20px Helvetica",
		self.player.Pearls + " / " + self.pearlsToCollect,
		new Point(735, 28),
		"#000000",
		Vector2.One()
	);
    
    if (self.player.CanFly) {
        self.spriteBatch.Draw(
            self.flyPowerTexture,
            new Point(348, -2),
            new Rectangle(0, 0, 64, 64),
            0,
            new Vector2(1.3, 1.21),
            SpriteEffects.None
        );
    }
    
    if (self.player.PunchImproved) {
        self.spriteBatch.Draw(
            self.punchSpeedTexture,
            new Point(404, -2),
            new Rectangle(0, 0, 64, 64),
            0,
            new Vector2(1.3, 1.21),
            SpriteEffects.None
        );
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
    var self = this,
        helpSprite = self.helpSprite,
        gameOverSprite = self.gameOverSprite,
        winSprite = self.winSprite;

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

    case GameStates.Paused:
        self.spriteBatch.Draw(
            helpSprite.Texture,
            helpSprite.Position,
            new Rectangle(helpSprite.SourceRect.X, helpSprite.SourceRect.Y, helpSprite.SourceRect.Width, helpSprite.SourceRect.Height),
            helpSprite.Rotation,
            helpSprite.Scale,
            helpSprite.SpriteEffects
        );

        //Go back to game if 'h' key pressed
        if (Keyboard.IsKeyPressed(Keys.h)) {
            self.gameState = GameStates.Playing;
        }

        //Toggle full page mode if mouse right button pressed
        if (Mouse.IsButtonClicked(Mouse.RightButton)) {
            self.GraphicsDevice.ToggleFullPage();
        }
        break;

    case GameStates.GameOver:
        self.spriteBatch.Draw(
            gameOverSprite.Texture,
            gameOverSprite.Position,
            new Rectangle(gameOverSprite.SourceRect.X, gameOverSprite.SourceRect.Y, gameOverSprite.SourceRect.Width, gameOverSprite.SourceRect.Height),
            gameOverSprite.Rotation,
            gameOverSprite.Scale,
            gameOverSprite.SpriteEffects
        );

        //Go reset the game if 'r' key pressed
        if (Keyboard.IsKeyPressed(Keys.r)) {
            self.Reset();
            self.gameState = GameStates.Loading;
        }
        break;

    case GameStates.GameWin:
        self.spriteBatch.Draw(
            winSprite.Texture,
            winSprite.Position,
            new Rectangle(winSprite.SourceRect.X, winSprite.SourceRect.Y, winSprite.SourceRect.Width, winSprite.SourceRect.Height),
            winSprite.Rotation,
            winSprite.Scale,
            winSprite.SpriteEffects
        );

        //Go reset the game if 'r' key pressed
        if (Keyboard.IsKeyPressed(Keys.r)) {
            self.Reset();
            self.gameState = GameStates.Loading;
        }
        break;
    }
};

/**
 * Reset the game
 */
Game.prototype.Reset = function () {
    "use strict";
    var self = this;

    self.Content = new ContentManager();
    self.GraphicsDevice = new GraphicsDevice(document);
    self.spriteBatch = null;
    self.gameState = GameStates.Initializing;
    self.preloading = true;
    
    self.level = null;
    self.sprites = [];

    self.pearlsToCollect = 0;

    //Create the platforms, pickable objects and enemys arrays
    self.platforms = [];
    self.pickableObjects = [];
    self.enemys = [];

    //Create the player
    self.player = null;

    //Create the game camera
    self.camera = null;

    //The win zone rectangle
    self.winRect = null;

    //The help screen sprite
    self.helpSprite = null;

    //The game over screen sprite
    self.gameOverSprite = null;

    //The win screen sprite
    self.winSprite = null;

    //Flags
    self.moveRight = false;
    self.moveLeft = false;
    self.jump = false;
    self.punch = false;
    self.showCollisions = false;

    clearInterval(self.interval);
    
    /*if (self.GraphicsDevice.IsFullScreen()) {
        self.GraphicsDevice.ToggleFullScreen();
    }*/
};