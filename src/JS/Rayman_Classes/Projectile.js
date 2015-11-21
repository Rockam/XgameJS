/**
 * Represents the Rayman's punch.
 * @constructor
 * @param {Sprite} sprite - The sprite of the punch.
 */
function Projectile(sprite) {
	"use strict";
	/*globals Vector2*/
	this.Sprite = sprite;
	this.Speed = 6;
	this.MaxScope = 200;
	this.ScopeCounter = 0;
	this.IsReturning = false;
	this.Power = 1;
	this.SpeedV = Vector2.Zero();
}

/**
 * Updates de player's (Rayman) punch.
 * @name Update
 * @function
 * @param {Sprite} playerSprite - The player's sprite.
 * @param {Number} levelWidth - The width of the level.                    
 * @memberOf Projectile
 */
Projectile.prototype.Update = function (playerSprite, levelWidth, sprites, enemys, enemyHittedSound) {
	"use strict";
	/*globals SpriteEffects*/
	var self = this,
		moveDistance = 0,
		moveVector = null,
		d = null,
		punchSprite = self.Sprite,
		bounds = punchSprite.Bounds(),
        currentEnemy = null,
        i = 0,
        len = 0,
        overlapV = null,
        aux = 0,
        aux2 = null;

	//If the punch isn't visible update its position with the player position
	if (!punchSprite.IsVisible) {
		
		punchSprite.IsVisible = true;
		punchSprite.Position.X = playerSprite.Position.X + playerSprite.HalfWidth() - punchSprite.HalfWidth();
		punchSprite.Position.Y = playerSprite.Position.Y + playerSprite.HalfHeight() - punchSprite.HalfHeight();
		punchSprite.SpriteEffects = playerSprite.SpriteEffects;
	
	} else {

		//Control the scope
		if (self.ScopeCounter >= self.MaxScope ||
				bounds.X < 0 ||
				bounds.Y < 0 ||
				bounds.X + bounds.Width > levelWidth) {

			self.ScopeCounter = 0;
			self.IsReturning = true;
			if (punchSprite.SpriteEffects === SpriteEffects.FlipHorizontally) {
				punchSprite.SpriteEffects = SpriteEffects.None;
			} else {
				punchSprite.SpriteEffects = SpriteEffects.FlipHorizontally;
			}
		}

		//If the punch is returning to the player update the movement
		if (self.IsReturning) {
			
			moveVector = new Vector2(playerSprite.Center().X - punchSprite.Center().X, playerSprite.Center().Y - punchSprite.Center().Y);
			d = moveVector.Normalize();

			//Increase the punch's velocity 
			self.SpeedV.X += d.X;
			self.SpeedV.Y += d.Y;

			d = self.SpeedV.Normalize();
			
			//Apply easing
			self.SpeedV.X = self.Speed * d.X;
			self.SpeedV.Y = self.Speed * d.Y;
			punchSprite.Position.X += self.SpeedV.X;
			punchSprite.Position.Y += self.SpeedV.Y;
		
		//If not update the position with the speed
		} else {
			
			if (punchSprite.SpriteEffects === SpriteEffects.FlipHorizontally) {
				punchSprite.Position.X += self.Speed * -1;
			} else {
				punchSprite.Position.X += self.Speed;
			}
			self.ScopeCounter += self.Speed;
		}

        //Check for a collision between the punch and the enemys
        for (i = 0, len = enemys.length; i < len; i += 1) {

            currentEnemy = enemys[i];

            overlapV = self.Sprite.Bounds().Intersects(currentEnemy.Bounds());

            //If the collision occurs throw rayman away
            if (currentEnemy.CurrentState !== currentEnemy.HITTED && overlapV !== false) {

                //Set the punch returning
                self.ScopeCounter = 0;
                self.IsReturning = true;
                if (punchSprite.SpriteEffects === SpriteEffects.FlipHorizontally) {
                    punchSprite.SpriteEffects = SpriteEffects.None;
                } else {
                    punchSprite.SpriteEffects = SpriteEffects.FlipHorizontally;
                }
                
                currentEnemy.CurrentState = currentEnemy.HITTED;
                currentEnemy.SpeedV.Y = -4;
                clearInterval(currentEnemy.interval);
                
                //Set timeout to avoid many hits in a row
                aux = i;
                aux2 = currentEnemy;
                setTimeout(function () {
                    aux2.Sprite.IsVisible = false;
                    enemys.splice(aux, 1);
                }, 600);
                
                //Play the hitted sound
                enemyHittedSound.Play();
            }
        }
	}

};