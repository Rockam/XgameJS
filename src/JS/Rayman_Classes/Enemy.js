/**
 * Represents one enemy.
 * @constructor
 * @param {AnimatedSprite|Sprite} sprite - The enemys's sprite.
 */
function Enemy(sprite) {
	"use strict";
	/*globals Vector2, setInterval, AnimatedSprite, SpriteEffects*/

	this.Sprite = sprite;

	//Physics properties
	this.SpeedV = Vector2.Zero();
	this.Speed = 0;

	//Platform game properties   
	this.IsOnGround = undefined;

	//Enemy States
	this.IDLE = 0;
	this.MOVING = 1;
	this.HITTED = 2;
	//this.TURNING = 3;
	//[...]
	this.CurrentState = 0;

	//Enemy attributtes
	//this.life = 2;
	
	//If the sprite is animated starts the sprite animation
	if (this.Sprite instanceof AnimatedSprite) {
		this.Sprite.StartAnimation();
	}
	
	//Change the enemy state every 1,8 seconds
	this.interval = setInterval(this.ChangeEnemyState.bind(this), 1800);
}

/**
 * Updates de enemy.
 * @name Update
 * @function
 * @param {Number} levelWidth - The width of the level.
 * @param {Array} platforms - The platforms array.
 * @param {Number} gravityForce - The gravity force.
 * @memberOf Enemy
 */
Enemy.prototype.Update = function (levelWidth, platforms, gravityForce) {
	"use strict";
	var self = this,
		enemySprite = self.Sprite,
		bounds = null,
		i = 0,
		overlapV = null,
		currentPlatform = null,
		len = 0;

    //If the enemy was hitted stop it
    if (self.CurrentState !== self.HITTED) {
        
        switch (self.CurrentState) {
        case self.IDLE:
            //enemySprite.currentFrame = 0;
            enemySprite.NumberOfFrames = 20;
            self.Speed = 0;
            break;
        case self.MOVING:
            //enemySprite.currentFrame = 0;
            enemySprite.NumberOfFrames = 14;
            self.Speed = 1.5;
            break;
        }

        //Apply the acceleration
        self.SpeedV.X = self.Speed;
        if (enemySprite.SpriteEffects === SpriteEffects.FlipHorizontally) {
            self.SpeedV.X *= -1;
        }

        //Apply gravityForce
        self.SpeedV.Y += gravityForce;
        
        //Check for a collision between the enemy and the platforms
        bounds = self.Bounds();

        for (i = 0, len = platforms.length; i < len; i += 1) {

            currentPlatform = platforms[i];
            overlapV = bounds.Intersects(currentPlatform);

            if (overlapV !== false && self.SpeedV.Y >= 0) {

                if (bounds.Bottom() >= currentPlatform.Top() &&
                        bounds.Bottom() <= currentPlatform.Bottom()) {

                    //Move the rectangle out of the collision
                    enemySprite.Position.Y -= overlapV.Y;

                    //Tell the game that the player is on the ground if 
                    //it's standing on top of a platform
                    self.IsOnGround = true;

                    //Neutralize gravity by applying its
                    //exact opposite force to the character's vy
                    self.SpeedV.Y = -gravityForce;
                }

            } else if (overlapV === false && self.SpeedV.Y > 0) {
                self.IsOnGround = false;
            }
        }

        //Screen boundaries
        //Left
        if (bounds.X < 0) {
            self.SpeedV.X = 0;
            enemySprite.Position.X = enemySprite.Position.X - bounds.Position.X;
        }
        //Up
        if (bounds.Y < 0) {
            self.SpeedV.Y = 0;
            enemySprite.Position.Y = enemySprite.Position.Y - bounds.Position.Y;
        }
        //Right
        if (bounds.X + bounds.Width > levelWidth) {
            self.SpeedV.X = 0;
            enemySprite.Position.X = levelWidth - (enemySprite.Right() - bounds.Right()) - bounds.Width;
        }
    }
    
    //Move the enemy
    enemySprite.Position.X += self.SpeedV.X;
    enemySprite.Position.Y += self.SpeedV.Y;

	//If the sprite is animated change its vertical offset depending on the player's state
	if (self.Sprite instanceof AnimatedSprite) {
		self.Sprite.VerticalOffset = self.CurrentState;
	}
};

/**
 * Changes the enemy state randomly
 * @name ChangeEnemysState
 * @function
 * @memberOf Enemy
 */
Enemy.prototype.ChangeEnemyState = function () {
	"use strict";
	/*globals SpriteEffects*/
	var self = this,
		enemySprite = self.Sprite;

	self.CurrentState = Math.floor((Math.random() * 2));
	if (self.CurrentState === self.MOVING) {
		if (enemySprite.SpriteEffects === SpriteEffects.FlipHorizontally) {
			enemySprite.SpriteEffects = SpriteEffects.None;
		} else {
			enemySprite.SpriteEffects = SpriteEffects.FlipHorizontally;
		}
	}
	
	//Reset the current frame if is an animated sprite
	if (enemySprite instanceof AnimatedSprite) {
		enemySprite.CurrentFrame = 0;
	}
};

/**
 * The enemys's collision rectangle.
 * @name Bounds
 * @function
 * @memberOf Enemy
 */
Enemy.prototype.Bounds = function () {
	"use strict";
	/*globals Rectangle*/
	var self = this,
		spriteBounds = self.Sprite.Bounds();

	return new Rectangle(
		spriteBounds.X + spriteBounds.HalfWidth() / 2,
		spriteBounds.Y + 20,
		spriteBounds.HalfWidth(),
		spriteBounds.Height - 20
	);
};