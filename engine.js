var stage;
var FPS = 30;

var lastTime = +new Date();
var dt = 0;

//setBackgroundMusic( mus )			Sets the looping music, automatically loops and mutes on M press
//subscribe( initFn, updateFn )		Subscribes the init function and update function to the game loop
//isKeyDown( keyId )				Returns whether a key is down taking in a key code or character
//isKeyUp( keyId )					Returns whether a key is up taking in a key code or character
//isKeyPressed( keyId )				Returns whether a key was pressed since last frame taking in a key code or character
//isKeyReleased( keyId )			Returns whether a key was released since last frame taking in a key code or character
/*
	Available keycodes
	------------------
	KEYCODE_ENTER 
	KEYCODE_LSHIFT
	KEYCODE_SPACE 


	KEYCODE_LEFT
	KEYCODE_UP
	KEYCODE_RIGHT 
	KEYCODE_DOWN
*/
//isMouseDown()						Returns whether the left mouse button is down
//isMouseUp()						Returns whether left mouse buttonis up
//isMousePressed()					Returns whether left mouse button was pressed since last frame
//isMouseReleased()					Returns whether left mouse button was released since last frame
//getMouseX()						Returns last recorded mouse x
//getMouseY()						Returns last recorded mouse y

function updateDt()
{
	var currentTime = +new Date();
	dt = Math.min( 1/10, (currentTime - lastTime)/1000 );
	lastTime = currentTime;
}

var wasMute = false;
var mute = false;
var bgm = "";
function setBackgroundMusic( mus )
{
	if( bgm != mus || mute != wasMute)
	{
		wasMute = mute;
		createjs.Sound.stop(bgm);
		if( !mute )
			createjs.Sound.play(mus, {loop:-1});
	}
	bgm = mus;
}

// function setBackgroundMusic()
// {
	// if( bgm != "" )
	// {
		// createjs.Sound.stop(bgm);
	// }
	// bgm = "";
// }

var wasPressed = new Array( 255 );
var isPressed = new Array( 255 );
var willPressed = new Array( 255 );

function handleKeyDown(evt) {
    if(!evt){ var evt = window.event; }  //browser compatibility
	if( evt.keyCode < willPressed.length && evt.keyCode >= 0 )
		willPressed[evt.keyCode] = true;
		
	console.log(evt.keyCode+" down"); 
	return true; //True lets window catch key events
}

function handleKeyUp(evt) {
    if(!evt){ var evt = window.event; }  //browser compatibility
    if( evt.keyCode < willPressed.length && evt.keyCode >= 0 )
		willPressed[evt.keyCode] = false;
		
	console.log(evt.keyCode+" up"); 
	//return false;
}

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function updateKeys()
{
	for( var i = 0; i < isPressed.length; i++ )
	{
		wasPressed[i] = isPressed[i];
		isPressed[i] = willPressed[i];
	}
}

var KEYCODE_ENTER = 13;
var KEYCODE_LSHIFT = 16;
var KEYCODE_SPACE = 32;


var KEYCODE_LEFT = 37;
var KEYCODE_UP = 38;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;

function convertKey( keyId )
{
	if( typeof keyId === typeof 'a' )
		return keyId.charCodeAt();
	return keyId;
}

var infn, updfn;

function subscribe( initFn, updateFn )
{
	infn = initFn;
	updfn = updateFn;
}

function isKeyDown( keyId )
{
	keyId = convertKey( keyId );
	return ( ( keyId >= 0 && keyId < isPressed.length ) && isPressed[keyId] );
}

function isKeyUp( keyId )
{
	return !isKeyDown( keyId );
}

function isKeyPressed( keyId )
{
	keyId = convertKey( keyId );
	return isKeyDown(keyId) && ( ( keyId >= 0 && keyId < isPressed.length ) && !wasPressed[keyId] );
}

function isKeyReleased( keyId )
{
	keyId = convertKey( keyId );
	return !isKeyDown(keyId) && ( ( keyId >= 0 && keyId < isPressed.length ) && wasPressed[keyId] );
}

var mouseX = 0, mouseY = 0;
var willMouseDown = false, isMouseDown = false, wasMouseDown = false;
function mouseInit() {
    stage.on("stagemousemove", function(evt) {
		mouseX = Math.floor(evt.stageX);
		mouseY = Math.floor(evt.stageY);
    });
	stage.on("mousedown", function(evt) {
		willMouseDown = true;
    });
	stage.on("mouseout", function(evt) {
		willMouseDown = false;
    });
	stage.on("pressmove", function(evt) {
		willMouseDown = true;
    });
	stage.on("click", function(evt) {
		willMouseDown = false;
    });
	stage.on("pressup", function(evt) {
		willMouseDown = false;
    });
}

function updateMouse()
{
	wasMouseDown = isMouseDown;
	isMouseDown = willMouseDown;
}

function isMouseDown()
{
	return isMouseDown;
}
function isMouseUp()
{
	return !isMouseDown;
}
function isMousePressed()
{
	return isMouseDown && !wasMouseDown;
}
function isMouseReleased()
{
	return !isMouseDown && wasMouseDown;
}
function getMouseX()
{
	return mouseX;
}
function getMouseY()
{
	return mouseY;
}


function loop() 
{
	updateDt();
	updateKeys();
	updateMouse();
	if( isKeyPressed('M') )
	{
		mute = !mute;
		setBackgroundMusic( bgm );
	}
	//console.log( "loop" + dt );
	updfn( dt );
	stage.update();
}

function setupCanvas() 
{
    var canvas = document.getElementById("game"); //get canvas with id='game'
    canvas.width = 800;
    canvas.height = 600;
    stage = new createjs.Stage(canvas); //makes stage object from the canvas
	stage.enableMouseOver();
}

function main() {
    setupCanvas(); //sets up the canvas
	mouseInit();
	infn();
}


createjs.Ticker.addEventListener("tick", loop);
createjs.Ticker.setFPS(FPS);

//makes sure DOM is ready then loads main()
if( !!(window.addEventListener)) {
    window.addEventListener ("DOMContentLoaded", main);
}else{ //MSIE
    window.attachEvent("onload", main);
}
