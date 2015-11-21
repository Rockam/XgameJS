/**
 * Provides basic graphics device initialization, game logic, and rendering code.
 */
function Game() {
	"use strict";
	/*globals ContentManager, GraphicsDevice, document, SpriteBatch, GameStates, Point, Vector2, Rectangle, Keyboard, Keys, Mouse, Segment*/
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
    this.RECT_VEL = 3;
    this.RECT_INFLATE_VALUE = 2;
    
    /***** TEST VARIABLES *****/
    this.testingRectangle = false;
    //Point
    this.pointZero_OK = false;
    this.pointOne_OK = false;
    this.pointsAreEqual = false;
    this.pointsAreDifferent = false;
    //Vector2
    this.vectorZero_OK = false;
    this.vectorOne_OK = false;
    this.vectorAdd_OK = false;
    this.vectorSubstract_OK = false;
    this.vectorDivide_OK = false;
    this.vectorMultiply_OK = false;
    this.vectorDistance_OK = false;
    this.vectorLength_OK = false;
    this.vectorsAreEqual = false;
    this.vectorsAreDifferent = false;
    //Rectangle
    this.r1 = null;
    this.r2 = null;
    
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

	self.r1 = new Rectangle(430, 315, 20, 40);
    self.r2 = new Rectangle(690, 30, 80, 50);

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
	var self = this,
        p1 = null,
        p2 = null,
        v1 = null,
        v2 = null;

    if (!self.testingRectangle && Keyboard.IsKeyPressed(Keys.r)) {
        self.testingRectangle = true;
    }
    
    if (self.testingRectangle) {
        //Rectangle
        if (Keyboard.IsKeyDown(Keys.a) || Keyboard.IsKeyDown(Keys.left_arrow)) {
            self.r1.X -= self.RECT_VEL;
        }
        if (Keyboard.IsKeyDown(Keys.d) || Keyboard.IsKeyDown(Keys.right_arrow)) {
            self.r1.X += self.RECT_VEL;
            
        }
        if (Keyboard.IsKeyDown(Keys.w) || Keyboard.IsKeyDown(Keys.up_arrow)) {
            self.r1.Y -= self.RECT_VEL;
            
        }
        if (Keyboard.IsKeyDown(Keys.s) || Keyboard.IsKeyDown(Keys.down_arrow)) {
            self.r1.Y += self.RECT_VEL;
            
        }
        if (Keyboard.IsKeyDown(Keys.add)) {
            self.r1.Inflate(self.RECT_INFLATE_VALUE, self.RECT_INFLATE_VALUE);
            if (self.r1.Width > 400) {
                self.r1.Width = 400;
            }
            if (self.r1.Height > 600) {
                self.r1.Height = 600;
            }
        }
        if (Keyboard.IsKeyDown(Keys.subtract)) {
            self.r1.Inflate(-self.RECT_INFLATE_VALUE, -self.RECT_INFLATE_VALUE);
        }
        
        //Map bounds
        if (self.r1.X < 400) {
            self.r1.X = 400;
        }
        if (self.r1.X + self.r1.Width > 800) {
            self.r1.X = 800 - self.r1.Width;
        }
        if (self.r1.Y < 0) {
            self.r1.Y = 0;
        }
        if (self.r1.Y + self.r1.Height > 600) {
            self.r1.Y = 600 - self.r1.Height;
        }
        
    } else {
    
        //Point
        p1 = Point.Zero();
        p2 = Point.One();
        if (p1.X === 0 && p1.Y === 0) {
            self.pointZero_OK = true;
        }
        if (p2.X === 1 && p2.Y === 1) {
            self.pointOne_OK = true;
        }
        p2 = new Point(25, 150);
        self.pointsAreDifferent = !Point.Equals(p1, p2);
        p2 = new Point(0, 0);
        self.pointsAreEqual = Point.Equals(p1, p2);

        //Vector2
        v1 = Vector2.Zero();
        v2 = Vector2.One();
        if (v1.X === 0 && v1.Y === 0) {
            self.vectorZero_OK = true;
        }
        if (v2.X === 1 && v2.Y === 1) {
            self.vectorOne_OK = true;
        }
        v1 = new Vector2(100, 150);
        self.vectorsAreDifferent = !Vector2.Equals(v1, v2);
        v2 = new Vector2(100, 150);
        self.vectorsAreEqual = Vector2.Equals(v1, v2);
        v2 = new Vector2(20, 25);
        self.vectorAdd_OK = Vector2.Equals(Vector2.Add(v1, v2), new Vector2(120, 175));
        self.vectorSubstract_OK = Vector2.Equals(Vector2.Substract(v1, v2), new Vector2(80, 125));
        self.vectorDivide_OK = Vector2.Equals(Vector2.Divide(v1, v2), new Vector2(5, 6));
        self.vectorMultiply_OK = Vector2.Equals(Vector2.Multiply(v1, v2), new Vector2(2000, 3750));
        self.vectorDistance_OK = Math.floor(Vector2.Distance(v1, v2)) === 148;
        self.vectorLength_OK = Math.floor(v2.Length()) === 32;
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
	var self = this,
        location = self.r1.Location(),
        center = self.r1.Center(),
        collision = (self.r2.Intersects(self.r1) !== false);

	self.GraphicsDevice.Clear();
    
    if (self.testingRectangle) {
        
        //Rectangle data
        self.spriteBatch.DrawString(self.FONT_BIG, "------ RECTANGLE ------", new Point(30, 20), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "X: " + location.X + "      Y: " + location.Y, new Point(30, 50), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Top: " + self.r1.Top(), new Point(30, 80), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Bottom: " + self.r1.Bottom(), new Point(30, 110), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Left: " + self.r1.Left(), new Point(30, 140), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Right: " + self.r1.Right(), new Point(30, 170), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Half width: " + self.r1.HalfWidth(), new Point(30, 200), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Half height: " + self.r1.HalfHeight(), new Point(30, 230), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Center X: " + center.X + "      Center Y: " + center.Y, new Point(30, 260), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Is empty? (width and height = 0): " + self.r1.IsEmpty(), new Point(30, 290), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Red rectangle contains the upper-left vertex", new Point(30, 320), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "of the green one?: " + self.r2.Contains(self.r1.Location()), new Point(30, 340), self.BLACK, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_LITTLE, "Is there a collision between the rectangles?: " + collision, new Point(30, 370), self.BLACK, Vector2.One());
        
        self.spriteBatch.DrawString(self.FONT_BIG, "Use A, W, S, D or arrow keys to move", new Point(30, 450), self.BLUE, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_BIG, "the green rectangle", new Point(30, 470), self.BLUE, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_BIG, "Use + key to inflate the rectangle", new Point(30, 510), self.BLUE, Vector2.One());
        self.spriteBatch.DrawString(self.FONT_BIG, "Use - key to deflate the rectangle", new Point(30, 540), self.BLUE, Vector2.One());
        
        //Draw the separating line
        self.spriteBatch.DrawSegment(new Segment(new Point(400, 0), new Point(400, 600)), "3", self.BLACK);
        
        //Rectangle
        self.spriteBatch.DrawRectangle(self.r1, "3", self.GREEN);
        self.spriteBatch.DrawRectangle(self.r2, "3", self.RED);
        
    } else {
        
        //Point
        self.spriteBatch.DrawString(self.FONT_BIG, "------ POINT ------", new Point(30, 20), self.BLACK, Vector2.One());

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Point.Zero()...", new Point(30, 50), self.BLACK, Vector2.One());
        if (self.pointZero_OK) {
            self.spriteBatch.DrawString(self.FONT_BIG, "OK", new Point(300, 50), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "ERROR", new Point(300, 50), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Point.One()...", new Point(30, 80), self.BLACK, Vector2.One());
        if (self.pointOne_OK) {
            self.spriteBatch.DrawString(self.FONT_BIG, "OK", new Point(300, 80), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "ERROR", new Point(300, 80), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Point.Equals(). Are p1(0,0) and p2(25,150) different?", new Point(30, 110), self.BLACK, Vector2.One());
        if (self.pointsAreDifferent) {
            self.spriteBatch.DrawString(self.FONT_BIG, "YES", new Point(570, 110), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "NO", new Point(570, 110), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Point.Equals(). Are p1(0,0) and p2(0,0) equals?", new Point(30, 140), self.BLACK, Vector2.One());
        if (self.pointsAreEqual) {
            self.spriteBatch.DrawString(self.FONT_BIG, "YES", new Point(570, 140), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "NO", new Point(570, 140), self.RED, Vector2.One());
        }

        //Vector2
        self.spriteBatch.DrawString(self.FONT_BIG, "----- VECTOR2 -----", new Point(30, 200), self.BLACK, Vector2.One());

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Vector2.Zero()...", new Point(30, 230), self.BLACK, Vector2.One());
        if (self.vectorZero_OK) {
            self.spriteBatch.DrawString(self.FONT_BIG, "OK", new Point(320, 230), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "ERROR", new Point(320, 230), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Vector2.One()...", new Point(30, 260), self.BLACK, Vector2.One());
        if (self.vectorOne_OK) {
            self.spriteBatch.DrawString(self.FONT_BIG, "OK", new Point(320, 260), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "ERROR", new Point(320, 260), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Vector2.Equals(). Are v1(100,150) and v2(1,1) different?", new Point(30, 290), self.BLACK, Vector2.One());
        if (self.vectorsAreDifferent) {
            self.spriteBatch.DrawString(self.FONT_BIG, "YES", new Point(600, 290), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "NO", new Point(600, 290), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Vector2.Equals(). Are v1(100,150) and v2(100,150) equals?", new Point(30, 320), self.BLACK, Vector2.One());
        if (self.vectorsAreEqual) {
            self.spriteBatch.DrawString(self.FONT_BIG, "YES", new Point(600, 320), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "NO", new Point(600, 320), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Vector2.Add(). v1(100,150) + v2(20,25) = v(120,175)?", new Point(30, 350), self.BLACK, Vector2.One());
        if (self.vectorAdd_OK) {
            self.spriteBatch.DrawString(self.FONT_BIG, "YES", new Point(600, 350), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "NO", new Point(600, 350), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Vector2.Substract(). v1(100,150) - v2(20,25) = v(80,125)?", new Point(30, 380), self.BLACK, Vector2.One());
        if (self.vectorSubstract_OK) {
            self.spriteBatch.DrawString(self.FONT_BIG, "YES", new Point(600, 380), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "NO", new Point(600, 380), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Vector2.Divide(). v1(100,150) / v2(20,25) = v(5,6)?", new Point(30, 410), self.BLACK, Vector2.One());
        if (self.vectorDivide_OK) {
            self.spriteBatch.DrawString(self.FONT_BIG, "YES", new Point(600, 410), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "NO", new Point(600, 410), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Vector2.Multiply(). v1(100,150) * v2(20,25) = v(2000,3750)?", new Point(30, 440), self.BLACK, Vector2.One());
        if (self.vectorMultiply_OK) {
            self.spriteBatch.DrawString(self.FONT_BIG, "YES", new Point(600, 440), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "NO", new Point(600, 440), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Vector2.Distance() between v1(100,150) and v2(20,25)...", new Point(30, 470), self.BLACK, Vector2.One());
        if (self.vectorMultiply_OK) {
            self.spriteBatch.DrawString(self.FONT_BIG, "148", new Point(600, 470), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "NOT 148", new Point(600, 470), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_LITTLE, "Testing static method Vector2.Length() of v2(20,25)...", new Point(30, 500), self.BLACK, Vector2.One());
        if (self.vectorMultiply_OK) {
            self.spriteBatch.DrawString(self.FONT_BIG, "32", new Point(600, 500), self.GREEN, Vector2.One());
        } else {
            self.spriteBatch.DrawString(self.FONT_BIG, "NOT 32", new Point(600, 500), self.RED, Vector2.One());
        }

        self.spriteBatch.DrawString(self.FONT_BIG, "Press R to test Rectangle methods...", new Point(30, 550), self.BLUE, Vector2.One());
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