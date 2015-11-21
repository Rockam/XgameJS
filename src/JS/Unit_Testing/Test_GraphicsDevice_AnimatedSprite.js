/**
 * Provides basic graphics device initialization, game logic, and rendering code.
 */
function Game() {
    "use strict";
    /*globals ContentManager, GraphicsDevice, document, SpriteBatch, GameStates, Vector2, Point, Sprite, AnimatedSprite, Rectangle, AnimationTypes, Segment, SpriteEffects, Mouse, Keys, Keyboard*/
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
    this.SPEED = 3;

    //The animated sprite
    this.image = null;
    this.sprite = null;

    //Flags
    this.showBounds = false;
    this.animStarted = false;
    
    //Other variables
    this.animTypeIndex = 1;
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

        self.image = self.Content.LoadTexture2D("../../images/test_sprite.png");

        self.preloading = false;
    }

    if (self.Content.AllContentLoaded()) {
        //texture, scale, sourceRect, position, isVisible, animationType, numberOfFrames, millisecondsPerFrame
        self.sprite = new AnimatedSprite(
            self.image,
            new Vector2(0.5, 0.5),
            new Rectangle(0, 0, 128, 128),
            new Point(500, 200),
            true,
            AnimationTypes.Loop,
            14,
            100
        );

        self.GraphicsDevice.canvas.addEventListener("click", self.GraphicsDevice.ToggleFullScreen.bind(self.GraphicsDevice));
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

    //GraphicsDevice
    if (Mouse.IsButtonClicked(Mouse.RightButton)) {
        self.GraphicsDevice.ToggleFullPage();
    }

    //AnimatedSprite
    if (Keyboard.IsKeyDown(Keys.left_arrow)) {
        self.sprite.Position.X -= self.SPEED;
    }
    if (Keyboard.IsKeyDown(Keys.right_arrow)) {
        self.sprite.Position.X += self.SPEED;

    }
    if (Keyboard.IsKeyDown(Keys.up_arrow)) {
        self.sprite.Position.Y -= self.SPEED;

    }
    if (Keyboard.IsKeyDown(Keys.down_arrow)) {
        self.sprite.Position.Y += self.SPEED;

    }
    if (Keyboard.IsKeyPressed(Keys.a)) {
        self.animTypeIndex += 1;
        if (self.animTypeIndex > 2) {
            self.animTypeIndex = 0;
        }
        self.sprite.AnimationType = self.animTypeIndex;
        self.sprite.CurrentFrame = 0;
        self.sprite.Forward = true;
    }
    if (Keyboard.IsKeyPressed(Keys.b)) {
        if (self.showBounds) {
            self.showBounds = false;
        } else {
            self.showBounds = true;
        }
    }
    if (Keyboard.IsKeyPressed(Keys.h)) {
        if (self.sprite.SpriteEffects === SpriteEffects.FlipHorizontally) {
            self.sprite.SpriteEffects = SpriteEffects.None;
        } else {
            self.sprite.SpriteEffects = SpriteEffects.FlipHorizontally;
        }
    }
    if (Keyboard.IsKeyPressed(Keys.v)) {
        if (self.sprite.SpriteEffects === SpriteEffects.FlipVertically) {
            self.sprite.SpriteEffects = SpriteEffects.None;
        } else {
            self.sprite.SpriteEffects = SpriteEffects.FlipVertically;
        }
    }
    if (Keyboard.IsKeyPressed(Keys.s)) {
        if (self.animStarted) {
            self.sprite.StopAnimation();
            self.animStarted = false;
        } else {
            self.sprite.RunAnimation = true;
            if (self.sprite.AnimationType === AnimationTypes.PlayOneTime) {
                self.sprite.CurrentFrame = 0;
                self.sprite.Forward = true;
            }
            self.sprite.StartAnimation();
            self.animStarted = true;
        }
    }
    if (Keyboard.IsKeyPressed(Keys.m)) {
        self.sprite.MillisecondsPerFrame += 20;
        //It's compulsory to restart animation
        self.sprite.StopAnimation();
        if (self.animStarted) {
            self.sprite.StartAnimation();
        }
    }
    if (Keyboard.IsKeyPressed(Keys.l)) {
        self.sprite.MillisecondsPerFrame -= 20;
        if (self.sprite.MillisecondsPerFrame < 0) {
            self.sprite.MillisecondsPerFrame = 0;
        }
        //It's compulsory to restart animation
        self.sprite.StopAnimation();
        if (self.animStarted) {
            self.sprite.StartAnimation();
        }
    }
    if (Keyboard.IsKeyPressed(Keys.add)) {
        self.sprite.Scale.X += 0.1;
        self.sprite.Scale.Y += 0.1;
        if (self.sprite.Scale.X > 1.1 || self.sprite.Scale.Y > 1.1) {
            self.sprite.Scale.X = 1.1;
            self.sprite.Scale.Y = 1.1;
        }
    }
    if (Keyboard.IsKeyPressed(Keys.subtract)) {
        self.sprite.Scale.X -= 0.1;
        self.sprite.Scale.Y -= 0.1;
        if (self.sprite.Scale.X < 0.1 || self.sprite.Scale.Y < 0.1) {
            self.sprite.Scale.X = 0.1;
            self.sprite.Scale.Y = 0.1;
        }
    }
    
    //Map bounds
    if (self.sprite.Position.X < 335) {
        self.sprite.Position.X = 335;
    }
    if (self.sprite.Position.X + self.sprite.Width() > 800) {
        self.sprite.Position.X = 800 - self.sprite.Width();
    }
    if (self.sprite.Position.Y < 0) {
        self.sprite.Position.Y = 0;
    }
    if (self.sprite.Position.Y + self.sprite.Height() > 420) {
        self.sprite.Position.Y = 420 - self.sprite.Height();
    }

    self.sprite.Rotation = Mouse.ScrollWheelValue * 10;
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
        position = self.sprite.Position,
        scale = self.sprite.Scale,
        center = self.sprite.Center();

    self.GraphicsDevice.Clear();

    //GraphicsDevice
    self.spriteBatch.DrawString(self.FONT_BIG, "------ GraphicsDevice ------", new Point(30, 20), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "PreferredBackBufferWidth: " + self.GraphicsDevice.PreferredBackBufferWidth() + " pixels", new Point(30, 45), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "PreferredBackBufferHeight: " + self.GraphicsDevice.PreferredBackBufferHeight() + " pixels", new Point(30, 70), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Is canvas in full page mode? " + self.GraphicsDevice.IsFullPage(), new Point(30, 95), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Is canvas in full screen mode: " + self.GraphicsDevice.IsFullScreen(), new Point(30, 120), self.BLACK, Vector2.One());

    self.spriteBatch.DrawString(self.FONT_BIG, "------ AnimatedSprite ------", new Point(30, 160), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "X: " + position.X.toFixed(2) + "      Y: " + position.Y.toFixed(2), new Point(30, 185), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Scale (width): " + scale.X.toFixed(2) + "      Scale (height): " + scale.Y.toFixed(2), new Point(30, 210), self.BLACK, Vector2.One());
    switch (self.sprite.SpriteEffects) {
    case SpriteEffects.None:
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Sprite effects: None", new Point(30, 235), self.BLACK, Vector2.One());
        break;
    case SpriteEffects.FlipHorizontally:
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Sprite effects: FlipHorizontally", new Point(30, 235), self.BLACK, Vector2.One());
        break;
    case SpriteEffects.FlipVertically:
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Sprite effects: FlipVertically", new Point(30, 235), self.BLACK, Vector2.One());
        break;
    }
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Rotation: " + self.sprite.Rotation, new Point(30, 260), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Top: " + self.sprite.Top().toFixed(2), new Point(30, 285), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Bottom: " + self.sprite.Bottom().toFixed(2), new Point(30, 310), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Left: " + self.sprite.Left().toFixed(2), new Point(30, 335), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Right: " + self.sprite.Right().toFixed(2), new Point(30, 360), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Half width: " + self.sprite.HalfWidth().toFixed(2), new Point(30, 385), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Half height: " + self.sprite.HalfHeight().toFixed(2), new Point(30, 410), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Center X: " + center.X.toFixed(2) + "      Center Y: " + center.Y.toFixed(2), new Point(30, 435), self.BLACK, Vector2.One());
    switch (self.sprite.AnimationType) {
    case AnimationTypes.Loop:
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Animation type: Loop", new Point(30, 460), self.BLACK, Vector2.One());
        break;
    case AnimationTypes.PingPongLoop:
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Animation type: PingPongLoop", new Point(30, 460), self.BLACK, Vector2.One());
        break;
    case AnimationTypes.PlayOneTime:
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Animation type: PlayOneTime", new Point(30, 460), self.BLACK, Vector2.One());
        break;
    }
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Milliseconds per frame: " + self.sprite.MillisecondsPerFrame, new Point(30, 485), self.BLACK, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Current frame / Number of frames: " + self.sprite.CurrentFrame + "/" + self.sprite.NumberOfFrames, new Point(30, 510), self.BLACK, Vector2.One());

    //Draw the separating lines
    self.spriteBatch.DrawSegment(new Segment(new Point(335, 0), new Point(335, 600)), "3", self.BLACK);
    self.spriteBatch.DrawSegment(new Segment(new Point(335, 420), new Point(800, 420)), "3", self.BLACK);

    //Instructions
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Left click to enter full screen", new Point(347, 440), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Press B to show bounds", new Point(347, 465), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Press arrow keys to move it", new Point(347, 490), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Press M to increase milliseconds", new Point(347, 515), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Press L to decrease milliseconds", new Point(347, 540), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Press S to start/stop anim.", new Point(347, 565), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Right click to enter full page", new Point(592, 440), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Press A to change anim. type", new Point(592, 465), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Press H to flip horizontally", new Point(592, 490), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Press V to flip vertically", new Point(592, 515), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "+/- to incr./decr. scale", new Point(592, 540), self.BLUE, Vector2.One());
    self.spriteBatch.DrawString(self.FONT_LITTLE, "Mouse wheel to rotate sprite", new Point(592, 565), self.BLUE, Vector2.One());

    //The sprite
    self.spriteBatch.Draw(
        self.sprite.Texture,
        self.sprite.Position,
        self.sprite.SourceRect,
        self.sprite.Rotation,
        self.sprite.Scale,
        self.sprite.SpriteEffects
    );

    //Bounds
    if (self.showBounds) {
        self.spriteBatch.DrawRectangle(self.sprite.Bounds(), "3", self.GREEN);
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