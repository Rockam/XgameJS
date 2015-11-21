/**
 * Defines the animation types.
 * @readonly
 * @enum {number}
 */
var AnimationTypes = Object.freeze({
	PlayOneTime: 0,
	Loop: 1,			//when the animation reaches the last frame then reset to the initial frame
	PingPongLoop: 2		//when the animation reaches the last frame then reverse the animation
});