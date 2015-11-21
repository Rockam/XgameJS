/**
 * Represents the player, in this case, Rayman.
 * @constructor
 * @param {AnimatedSprite|Sprite} sprite - The player's sprite.
 */
function Player(sprite) {
    "use strict";
    /*globals Vector2, AnimatedSprite*/
    this.Sprite = sprite; //The player sprite

    //Physics properties
    this.SpeedV = Vector2.Zero();
    this.AccelerationV = Vector2.Zero();
    this.SpeedLimit = 3;
    this.GroundFriction = 1; //0.96
    //this.bounce = -0.7;

    //Platform game properties
    this.IsOnGround = undefined;
    this.JumpForce = -8;

    //Player States
    this.IDLE = 0;
    this.MOVING = 3;
    this.JUMPING = 4;
    this.FLYING = 10;
    this.HITTED = 5;
    //this.CROUCHED = 4;
    //[...]
    this.CurrentState = 0;

    //Player attributtes (Rayman)
    this.Pearls = 0;
    //this.Life = 3;
    this.Shield = 5;
    this.CanFly = false;
    this.PunchImproved = false;

    //The punch (Rayman)
    this.Punch = null;

    //If the sprite is animated starts the sprite animation
    if (this.Sprite instanceof AnimatedSprite) {
        this.Sprite.StartAnimation();
    }
}

/**
 * Updates de player.
 * @name Update
 * @function
 * @param {Boolean} moveLeft - Tells if the player moved left or not.
 * @param {Boolean} moveRight - Tells if the player moved right or not.
 * @param {Boolean} jump - Tells if the player jumped or not.
 * @param {Boolean} punchPressed - Tells if the player shoot the punch or not.
 * @param {Array} platforms - The platforms array.
 * @param {Number} levelWidth - The width of the level.
 * @param {Array} pickableObjects - The pickable objects array.
 * @param {Array} sprites - The sprites array.
 * @param {Number} gravityForce - The gravity force.
 * @memberOf Player
 */
Player.prototype.Update = function (moveLeft, moveRight, jump, punchPressed, platforms, levelWidth, pickableObjects, sprites, gravityForce, soundEffects, enemys) {
    "use strict";
    /*globals SpriteEffects, Keyboard, Keys*/
    var self = this,
        playerSprite = self.Sprite,
        bounds = null,
        i = 0,
        len = 0,
        overlapV = null,
        currentPlatform = null,
        currentPickableObject = null,
        currentEnemy = null,
        index = 0;

    //If rayman was hitted remove any control
    if (self.CurrentState !== self.HITTED) {
        //Left
        if (moveLeft && !moveRight) {
            self.AccelerationV.X = -2.8; //0.2
            self.GroundFriction = 1;
            self.CurrentState = self.MOVING;
            playerSprite.SpriteEffects = SpriteEffects.FlipHorizontally;
        }
        //Right
        if (moveRight && !moveLeft) {
            self.AccelerationV.X = 2.8; //0.2
            self.GroundFriction = 1;
            self.CurrentState = self.MOVING;
            playerSprite.SpriteEffects = SpriteEffects.None;
        }
        //Space
        if (jump && self.IsOnGround) {
            self.SpeedV.Y += self.JumpForce;
            self.IsOnGround = false;
            self.GroundFriction = 1;
        }

        //Set the player's acceleration, friction and gravity 
        //to zero if none of the arrow keys are being pressed
        if (!moveLeft && !moveRight) {
            self.AccelerationV.X = 0;
            self.GroundFriction = 0.1; //0.96
            gravityForce = 0.3;
            self.CurrentState = self.IDLE;
        }

        //If player is in the air set the state to "jumping"
        if (!self.IsOnGround) {
            self.CurrentState = self.JUMPING;
            self.hitGroundCounter = 0;
        }
        
        //Apply the acceleration
        self.SpeedV.X += self.AccelerationV.X;
        self.SpeedV.Y += self.AccelerationV.Y;

        //Apply friction
        if (self.IsOnGround) {
            self.SpeedV.X *= self.GroundFriction;
        }

        //If space pressed and is not on ground then fly
        //If not apply gravity
        if (self.CanFly && (Keyboard.IsKeyDown(Keys.w) || Keyboard.IsKeyDown(Keys.up_arrow)) && !self.IsOnGround && self.SpeedV.Y > 0) {
            self.CurrentState = self.FLYING;
            self.SpeedV.X /= 2;
            self.SpeedV.Y = self.SpeedLimit / 3.2;
            soundEffects[1][1].Play();
        } else {
            self.SpeedV.Y += gravityForce;
        }

        //Limit the speed
        //Don't limit the upward speed because it will choke the jump effect
        if (self.SpeedV.X > self.SpeedLimit) {
            self.SpeedV.X = self.SpeedLimit;
        }
        if (self.SpeedV.X < -self.SpeedLimit) {
            self.SpeedV.X = -self.SpeedLimit;
        }
        if (self.SpeedV.Y > self.SpeedLimit * 2) {
            self.SpeedV.Y = self.SpeedLimit * 2;
        }

    }

    //Move the player
    playerSprite.Position.X += self.SpeedV.X;
    playerSprite.Position.Y += self.SpeedV.Y;
    
    //Update the punch
    if (punchPressed) {
        self.Punch.Update(playerSprite, levelWidth, sprites, enemys, soundEffects[0][1]);
    }

    bounds = self.Bounds();

    //Check for a collision between the player and the platforms
    for (i = 0, len = platforms.length; i < len; i += 1) {

        currentPlatform = platforms[i];
        overlapV = bounds.Intersects(currentPlatform);

        if (overlapV !== false && self.SpeedV.Y >= 0) {

            if (bounds.Bottom() >= currentPlatform.Top() &&
                bounds.Bottom() <= currentPlatform.Bottom()) {

                //Move the rectangle out of the collision
                playerSprite.Position.Y -= overlapV.Y;

                //Tell the game that the player is on the ground if 
                //it's standing on top of a platform
                self.IsOnGround = true;

                //Neutralize gravity by applying its
                //exact opposite force to the character's vy
                self.SpeedV.Y = -gravityForce;
                
                //Play the hit the ground sound effect if rayman is not moving in the Y axis
                if (self.hitGroundCounter === 0) {
                    soundEffects[10][1].Play();
                    self.hitGroundCounter += 1;
                }
            }

        } else if (overlapV === false && self.SpeedV.Y > 0) {
            self.IsOnGround = false;
        }
    }

    //Check for a collision between the player and the pickable objects
    for (i = 0, len = pickableObjects.length; i < len; i += 1) {

        currentPickableObject = pickableObjects[i];

        overlapV = bounds.Intersects(currentPickableObject.Bounds());

        //If the collision occurs pick the object and delete the object from the level
        if (overlapV !== false) {

            self.PickObject(currentPickableObject, soundEffects);
            index = sprites.indexOf(currentPickableObject.Sprite);
            if (index !== -1) {
                sprites.splice(index, 1);
            }
            index = pickableObjects.indexOf(currentPickableObject);
            if (index !== -1) {
                pickableObjects.splice(index, 1);
                len -= 1;
            }
        }
    }

    //Check for a collision between the player and the enemys if the player wasn't hitted
    //in one second
    if (self.CurrentState !== self.HITTED) {
        for (i = 0, len = enemys.length; i < len; i += 1) {

            currentEnemy = enemys[i];

            overlapV = bounds.Intersects(currentEnemy.Bounds());

            //If the collision occurs throw rayman away
            if (currentEnemy.CurrentState !== currentEnemy.HITTED && overlapV !== false) {

                self.SpeedV.Y += self.JumpForce / 3;
                if (playerSprite.SpriteEffects === SpriteEffects.FlipHorizontally) {
                    self.SpeedV.X += self.SpeedLimit * 2;
                } else {
                    self.SpeedV.X -= self.SpeedLimit * 2;
                }
                self.IsOnGround = false;
                self.GroundFriction = 1;
                self.CurrentState = self.HITTED;
                //Set timeout to avoid many hits in a row
                setTimeout(function () {
                    self.CurrentState = self.IDLE;
                }, 600);
                //Play the hitted sound
                soundEffects[6][1].Play();
                //Decrement the shield by 1 point
                self.Shield -= 1;
            }
        }
    }

    //Screen boundaries
    bounds = self.Bounds();
    //Left
    if (bounds.X < 0) {
        self.SpeedV.X = 0;
        playerSprite.Position.X = playerSprite.Position.X - bounds.X;
    }
    //Up
    if (bounds.Y < 0) {
        self.SpeedV.Y = 0;
        playerSprite.Position.Y = playerSprite.Position.Y - bounds.Y;
    }
    //Right
    if (bounds.X + bounds.Width > levelWidth) {
        self.SpeedV.X = 0;
        playerSprite.Position.X = levelWidth - (playerSprite.Right() - bounds.Right()) - bounds.Width;
    }

    //If the sprite is animated change its vertical offset depending on the player's state
    if (self.Sprite instanceof AnimatedSprite) {
        self.Sprite.VerticalOffset = self.CurrentState;
    }
};

Player.prototype.PickObject = function (object, soundEffects) {
    "use strict";
    /*globals PickableObjectTypes*/
    var self = this;

    switch (object.Type) {
    case PickableObjectTypes.PEARL:
        self.Pearls += 1;
        if (self.Pearls >= 100) {
            self.Pearls = 0;
            self.Life += 1;
        }
        soundEffects[3][1].Play();
        break;

    case PickableObjectTypes.LIFE:
        self.Life += 1;
        break;

    case PickableObjectTypes.MINI_SHIELD:
        self.Shield += 1;
        if (self.Shield > 5) {
            self.Shield = 5;
        }
        break;

    case PickableObjectTypes.SHIELD:
        self.Shield = 5;
        soundEffects[7][1].Play();
        break;

    case PickableObjectTypes.PUNCH_SPEED:
        self.Punch.Speed = 8;
        self.Punch.MaxScope = 290;
        self.Punch.Sprite.SourceRect.X += 20;
        self.PunchImproved = true;
        soundEffects[4][1].Play();
        break;

    case PickableObjectTypes.PUNCH_POWER:
        self.Punch.Power = 1.5;
        break;

    case PickableObjectTypes.ETERNAL_FLY:
        self.CanFly = true;
        soundEffects[4][1].Play();
        break;
    }
};

/**
 * The player's collision rectangle.
 * @name Bounds
 * @function
 * @memberOf Player
 */
Player.prototype.Bounds = function () {
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