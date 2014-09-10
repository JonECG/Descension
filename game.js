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
		
	//console.log(evt.keyCode+" down"); 
	return true; //True lets window catch key events
}

function handleKeyUp(evt) {
    if(!evt){ var evt = window.event; }  //browser compatibility
    if( evt.keyCode < willPressed.length && evt.keyCode >= 0 )
		willPressed[evt.keyCode] = false;
		
	//console.log(evt.keyCode+" up"); 
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
var willMouseDown = false, isaMouseDown = false, wasMouseDown = false;
var willMDelta = 0, mDelta = 0;
function mouseInit() {
    stage.on("stagemousemove", function(evt) {
		mouseX = Math.floor(evt.stageX);
		mouseY = Math.floor(evt.stageY);
    });
	stage.on("mousedown", function(evt) {
		willMouseDown = true;
        //console.log("down");
    });
	stage.on("mouseout", function(evt) {
		willMouseDown = false;
        //console.log("out");
    });
	stage.on("pressmove", function(evt) {
		willMouseDown = true;
        //console.log("move");
    });
	stage.on("click", function(evt) {
		willMouseDown = false;
        //console.log("click");
    });
	stage.on("pressup", function(evt) {
		willMouseDown = false;
        //console.log("up");
    });
}

function updateMouse()
{
	wasMouseDown = isaMouseDown;
	isaMouseDown = willMouseDown;
	mDelta = willMDelta;
	willMDelta = 0;
}

function isMouseDown()
{
	return isaMouseDown;
}
function isMouseUp()
{
	return !isaMouseDown;
}
function isMousePressed()
{
	return isaMouseDown && !wasMouseDown;
}
function isMouseReleased()
{
	return !isaMouseDown && wasMouseDown;
}
function getMouseX()
{
	return mouseX;
}
function getMouseY()
{
	return mouseY;
}
function getMouseWheelDelta()
{
	return mDelta;
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
	//console.log( getMouseWheelDelta() );
}

function setupCanvas() 
{
    var canvas = document.getElementById("game"); //get canvas with id='game'
    canvas.width = 800;
    canvas.height = 600;
	if (canvas.addEventListener) 
	{
		canvas.addEventListener("mousewheel", MouseWheelHandler, false);
		canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
	else
		canvas.attachEvent("onmousewheel", MouseWheelHandler);
    stage = new createjs.Stage(canvas); //makes stage object from the canvas
	stage.enableMouseOver();
}

function MouseWheelHandler(e) 
{
	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	willMDelta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
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

subscribe( gameInit, gameLoop );
var debugText;
var gameStage, uiStage;
var cheating = false;

var LOADING = -1, TITLE = 0, INSTRUCT = 1, PLAY = 2, GAMEOVER = 3, COMPLETE = 4, WIN = 5; 

var gameState = LOADING;

var gameObjects, gameWalls;

function gameInit()
{
	gameStage = new createjs.Container();
	uiStage = new createjs.Container();
	stage.addChild( gameStage );
	stage.addChild( uiStage );
	gameObjects = [];
	gameWalls = [];
	loadFiles();
	debugText = new createjs.Text("debugstuff", "24px Lucida Console", "#38c");
	debugText.x = 20;
	debugText.y = 20; 
	stage.addChild(debugText);
}

function gameLoop( dt )
{
	var count = stage.getNumChildren();
	for(var i = 0; i < count; i++) 
	{
		var shape = stage.getChildAt(i);
		shape.visible = false;
	}
	
	switch( gameState )
	{
		case LOADING:
		break;
		case TITLE:
			titleScreen.visible = true;
			playButton.visible = true;
			instrButton.visible = true;
		break;
		case INSTRUCT:
			instructionScreen.visible = true;
			mainButton.visible = true;
		break;
		case PLAY:
			//instructionScreen.visible = true;
			cheating = isKeyPressed( 'J' ) ? !cheating : cheating;
			debugText.visible = true;
			gameStage.visible = true;
			uiStage.visible = true;
			
			runJon( dt );
			runDan( dt );
			runDevon( dt );
			
			for(var i = 0; i < gameWalls.length; i++) 
			{
				gameWalls[i].update( dt );
			}
			for(var i = 0; i < gameObjects.length; i++) 
			{
				gameObjects[i].update( dt );
			}
			for(var i = 0; i < gameObjects.length; i++) 
			{
				if( gameObjects[i].markedForDestroy )
				{
					gameObjects[i].destroy();
					gameObjects.splice( i, 1 );
					i--;
				}
			}
			
		break;
		case GAMEOVER:
			slainText.text = enemiesSlain + " Enemies Slain";
			slainText.visible = true;
			gameoverScreen.visible = true;
			mainButton.visible = true;
            setBackgroundMusic("gameoverMusic");
		break;
		case COMPLETE:
			slainText.text = enemiesSlain + " Enemies Slain";
			slainText.visible = true;
			levelCompleteScreen.visible = true;
			continueButton.visible = true;
		break;
		case WIN:
			slainText.text = enemiesSlain + " Enemies Slain";
			slainText.visible = true;
			winScreen.visible = true;
			mainButton.visible = true;
            setBackgroundMusic("winMusic");
		break;
	}
	
}

var currentLevel, enemiesSlain;
var player;
function startGame()
{
	currentLevel = 0;
	enemiesSlain = 0;
	createPlayer();
	nextLevel();
}

var cellDim = 128;
var wallFill = 0.2;

function nextLevel()
{
	
	currentLevel++;
	
	for( var i = 0; i < gameObjects.length; i++ )
	{
		gameObjects[i].destroy();
	}
	for( var i = 0; i < gameWalls.length; i++ )
	{
		gameWalls[i].destroy();
	}
	gameObjects = [];
	gameWalls = [];
	
	if( currentLevel === 10 )
	{
        setBackgroundMusic("bossMusic");
		var wallyFill = 0.8;
		var w = 9; 
		var h = 9;
		currentFloor = new Floor( -cellDim*w/2, -cellDim*h/2, w, h, 5, 8, cellDim );
		
		for( var j = -1; j < h; j++ )
		{
			for( var i = -1; i < w; i++ )
			{
				if( j != -1 && ( i == -1 || i == w-1 ) )
					createWall( (i+1-wallyFill/2-w/2)*cellDim, (j-wallyFill/2-h/2)*cellDim, cellDim*wallyFill, (1+wallyFill)*cellDim );
				if( i != -1 && ( j == -1 || j == h-1 ) )
					createWall( (i-wallyFill/2-w/2)*cellDim, (j+1-wallyFill/2-h/2)*cellDim, (1+wallyFill)*cellDim, cellDim*wallyFill );
			}
		}
	
		placePlayer();
		placeMinotaur();
	}
	else
	{
		setBackgroundMusic("gameMusic");
		currentFloor = createFloor(currentLevel + 5, currentLevel + 5);
		placePlayer();
		placeEnemies();
		placeHealth();
		placeAmmo();
		placeEnd();
	}
	
	debugText.text = "Level " + currentLevel;
	
	gameState = PLAY;
}

var titleScreen, instructionScreen, gameoverScreen, continueScreen, winScreen;
var playButton, instrButton, mainButton, continueButton;
var weaponSword, weaponBow, weaponCrossbow, weaponAxe, weaponRock;
var dudeSword, dudeRock, dudeAxe, dudeBow;
var centaur, werewolf, harpie, cyclops, minotaur;
var health, goal, jamie;
var rockAmmo, axeAmmo, bowAmmo;
var swordBullet, rockBullet, axeBullet, bowBullet;
var shadowImage;
var slainText;
var theRadical;

manifest = [
    {src:"title.png", id:"title"},
    {src:"instructions.png", id:"instructions"},
    {src:"gameover.png", id:"gameover"},
	{src:"win.png", id:"win"},
	{src:"levelComplete.png", id:"levelComplete"},
    {src:"buttons.png", id:"buttons"},
	{src:"gameFloor.png", id:"gameFloor"},
	{src:"wallImage.png", id:"wallImage"},
    {src:"swordNext.png", id:"sword"},
    {src:"bowNext.png", id:"bow"},
    {src:"AxeNext.png", id:"axe"},
    {src:"RockNext.png", id:"rock"},
	{src:"shadow.png", id:"shadow"},
	{src:"dudeSword_strip4.png", id:"dudeSword"},
	{src:"dudeAxe_strip3.png", id:"dudeAxe"},
	{src:"dudeRock_strip5.png", id:"dudeRock"},
	{src:"dudeBow_strip4.png", id:"dudeBow"},
	{src:"centaur_strip3.png", id:"centaur"},
	{src:"werewolf_strip4.png", id:"werewolf"},
	{src:"harpie_strip4.png", id:"harpie"},
	{src:"minotaur_strip2.png", id:"minotaur"},
	{src:"cyclops_strip5.png", id:"cyclops"},
    {src:"rockPickup.png", id:"rockPickup"},
    {src:"axePickup.png", id:"axePickup"},
    {src:"bowPickup.png", id:"bowPickup"},
    {src:"swordBullet.png", id:"SwordBullet"},
    {src:"rockBullet.png", id:"RockBullet"},
    {src:"AxeBullet.png", id:"AxeBullet"},
    {src:"bowBullet.png", id:"BowBullet"},
	{src:"health.png", id:"health"},
	{src:"goal.png", id:"goal"},
    {src:"radical.png",id:"radical"},
	{src:"jking.png", id:"jamie"},
	
	//Sounds
	{src:"rock-fire.ogg",	id:"rockFire"},
	{src:"rock-hit.ogg",	id:"rockHit"},
	{src:"sword-fire.ogg",	id:"swordFire"},
	{src:"sword-hit.ogg",	id:"swordHit"},
	{src:"arrow-fire.ogg",	id:"arrowFire"},
	{src:"arrow-hit.ogg",	id:"arrowHit"},
	{src:"axe-fire.ogg",	id:"axeFire"},
	{src:"axe-hit.ogg",		id:"axeHit"},
	{src:"pickup-health.ogg",id:"pickupHealth"},
	{src:"pickup-ammo.ogg",	id:"pickupAmmo"},
    {src:"Title-Music.ogg", id:"titleMusic"},
    {src:"Boss-Loop.ogg", id:"bossMusic"},
    {src:"Game-Loop.ogg", id:"gameMusic"},
    {src:"win.ogg", id:"winMusic"},
    {src:"GameOver.ogg", id:"gameoverMusic"}
];

var queue;

function loadFiles() {
	createjs.Sound.alternateExtensions = ["mp3"];

    queue = new createjs.LoadQueue(true, "assets/");
	queue.installPlugin(createjs.Sound);
    queue.on("complete", loadComplete, this);
    queue.loadManifest(manifest);
}

function chooseFrom( arr )
{
	return arr[Math.floor(Math.random() * arr.length)];
}

function loadComplete(evt) 
{
    titleScreen = new createjs.Bitmap(queue.getResult("title"));
    instructionScreen = new createjs.Bitmap(queue.getResult("instructions"));
    gameoverScreen = new createjs.Bitmap(queue.getResult("gameover"));
	winScreen = new createjs.Bitmap(queue.getResult("win"));
	levelCompleteScreen = new createjs.Bitmap(queue.getResult("levelComplete"));
	shadowImage = new createjs.Bitmap(queue.getResult("shadow"));
    theRadical= new createjs.Bitmap(queue.getResult("radical"));
	jamie= new createjs.Bitmap(queue.getResult("jamie"));
	theRadical.x=-100;
    theRadical.y=-110;
    shadowImage.regX=32;
    shadowImage.regY=32;
	health = new createjs.Bitmap(queue.getResult("health"));
	health.regX = 32;
	health.regY = 23;
	goal = new createjs.Bitmap(queue.getResult("goal"));
	goal.regX = 32;
	goal.regY = 32;
    
	stage.addChildAt(titleScreen,0);
	stage.addChildAt(instructionScreen,0);
	stage.addChildAt(gameoverScreen,0);
	stage.addChildAt(winScreen,0);
	stage.addChildAt(levelCompleteScreen,0);
	
	slainText = new createjs.Text("slain", "70px Lucida Console", "#116");
	slainText.x = 40;
	slainText.y = 300;
	stage.addChild( slainText );
	
    weaponSword=new createjs.Bitmap(queue.getResult("sword"));
    weaponBow=new createjs.Bitmap(queue.getResult("bow"));
    weaponAxe=new createjs.Bitmap(queue.getResult("axe"));
    weaponRock=new createjs.Bitmap(queue.getResult("rock"));
    
    rockAmmo=new createjs.Bitmap(queue.getResult("rockPickup"));
    axeAmmo=new createjs.Bitmap(queue.getResult("axePickup"));
    bowAmmo=new createjs.Bitmap(queue.getResult("bowPickup"));
    
    swordBullet=new createjs.Bitmap(queue.getResult("SwordBullet"));
    rockBullet=new createjs.Bitmap(queue.getResult("RockBullet"));
    axeBullet=new createjs.Bitmap(queue.getResult("AxeBullet"));
    bowBullet=new createjs.Bitmap(queue.getResult("BowBullet"));
	
	var buttonSheet = new createjs.SpriteSheet({
        images: [queue.getResult("buttons")],
        frames: {
			width: 128,
			height: 64,
			regX: 64,
			regY: 64
		},
        animations: {
            playNormal: [0, 0, "playNormal"],
            playHighlight: [1, 1, "playHighlight"],
            playDown: [2, 2, "playDown"],
			instrNormal: [3, 3, "instrNormal"],
            instrHighlight: [4, 4, "instrHighlight"],
            instrDown: [5, 5, "instrDown"],
			mainNormal: [6, 6, "mainNormal"],
            mainHighlight: [7, 7, "mainHighlight"],
            mainDown: [8, 8, "mainDown"],
			continueNormal: [9, 9, "continueNormal"],
            continueHighlight: [10, 10, "continueHighlight"],
            continueDown: [11, 11, "continueDown"]
            }     
        });
		
	var speed = 0.25;
		
	var dudeSwordSheet = new createjs.SpriteSheet({
		images: [queue.getResult("dudeSword")],
		frames: {
			width: 160,
			height: 143,
			regX: 40,
			regY: 68
		},
		animations: {
			idle: [0, 0, "idle"],
			attack: [1, 3, "idle", speed],
			}     
		});
	dudeSword = new createjs.Sprite(dudeSwordSheet);
	dudeSword.gotoAndStop( "idle" );
	
	var dudeAxeSheet = new createjs.SpriteSheet({
		images: [queue.getResult("dudeAxe")],
		frames: {
			width: 160,
			height: 143,
			regX: 40,
			regY: 68
		},
		animations: {
			idle: [0, 0, "idle"],
			attack: [1, 2, "idle", speed],
			}     
		});
	dudeAxe = new createjs.Sprite(dudeAxeSheet);
	dudeAxe.gotoAndStop( "idle" );
	
	var dudeRockSheet = new createjs.SpriteSheet({
		images: [queue.getResult("dudeRock")],
		frames: {
			width: 160,
			height: 143,
			regX: 40,
			regY: 68
		},
		animations: {
			idle: [0, 0, "idle"],
			attack: [1, 4, "idle", speed],
			}     
		});
	dudeRock = new createjs.Sprite(dudeRockSheet);
	dudeRock.gotoAndStop( "idle" );
	
	var dudeBowSheet = new createjs.SpriteSheet({
		images: [queue.getResult("dudeBow")],
		frames: {
			width: 160,
			height: 143,
			regX: 40,
			regY: 68
		},
		animations: {
			idle: [0, 0, "idle"],
			attack: [1, 3, "idle", speed],
			}     
		});
	dudeBow = new createjs.Sprite(dudeBowSheet);
	dudeBow.gotoAndStop( "idle" );
	
	var centaurSheet = new createjs.SpriteSheet({
		images: [queue.getResult("centaur")],
		frames: {
			width: 130,
			height: 103,
			regX: 55,
			regY: 55
		},
		animations: {
			idle: [0, 0, "idle"],
			attack: [1, 2, "idle", speed],
			}     
		});
	centaur = new createjs.Sprite(centaurSheet);
	centaur.gotoAndStop( "idle" );
	
	
	var wereWolfSheet = new createjs.SpriteSheet({
		images: [queue.getResult("werewolf")],
		frames: {
			width: 130,
			height: 103,
			regX: 55,
			regY: 55
		},
		animations: {
			idle: [0, 0, "idle"],
			attack: [1, 3, "idle", speed],
			}     
		});
	werewolf = new createjs.Sprite(wereWolfSheet);
	werewolf.gotoAndStop( "idle" );
	
	var cyclopsSheet = new createjs.SpriteSheet({
		images: [queue.getResult("cyclops")],
		frames: {
			width: 130,
			height: 103,
			regX: 55,
			regY: 55
		},
		animations: {
			idle: [0, 0, "idle"],
			attack: [1, 4, "idle", speed],
			}     
		});
	cyclops = new createjs.Sprite(cyclopsSheet);
	cyclops.gotoAndStop( "idle" );
	
	
	var harpieSheet = new createjs.SpriteSheet({
		images: [queue.getResult("harpie")],
		frames: {
			width: 130,
			height: 103,
			regX: 55,
			regY: 55
		},
		animations: {
			idle: [0, 0, "idle"],
			attack: [1, 3, "idle", speed],
			}     
		});
	harpie = new createjs.Sprite(harpieSheet);
	harpie.gotoAndStop( "idle" );
	
	
	var minotaurSheet = new createjs.SpriteSheet({
		images: [queue.getResult("minotaur")],
		frames: {
			width: 309,
			height: 320,
			regX: 72,
			regY: 125
		},
		animations: {
			idle: [0, 0, "idle"],
			attack: [1, 1, "attack"]
			}     
		});
	minotaur = new createjs.Sprite(minotaurSheet);
	minotaur.gotoAndStop( "idle" );
	
	
	playButton = new createjs.Sprite(buttonSheet);
	playButton.gotoAndStop("playNormal");
	playButton.x = 85;
	playButton.y = 594;
	playButton.on("click", function(evt) { startGame();});
	playButton.on("mouseover", function(evt) { playButton.gotoAndStop("playHighlight"); });
	playButton.on("mouseout", function(evt) { playButton.gotoAndStop("playNormal"); });
	playButton.on("mousedown", function(evt) { playButton.gotoAndStop("playDown"); });
    stage.addChild(playButton);
	
	instrButton = new createjs.Sprite(buttonSheet);
	instrButton.gotoAndStop("instrNormal");
	instrButton.x = 250;
	instrButton.y = 594;
	instrButton.on("click", function(evt) { gameState = INSTRUCT; });
	instrButton.on("mouseover", function(evt) { instrButton.gotoAndStop("instrHighlight"); });
	instrButton.on("mouseout", function(evt) { instrButton.gotoAndStop("instrNormal"); });
	instrButton.on("mousedown", function(evt) { instrButton.gotoAndStop("instrDown"); });
    stage.addChild(instrButton);
	
	mainButton = new createjs.Sprite(buttonSheet);
	mainButton.gotoAndStop("mainNormal");
	mainButton.x = 85;
	mainButton.y = 594;
	mainButton.on("click", function(evt) { gameState = TITLE; setBackgroundMusic( "titleMusic" ); });
	mainButton.on("mouseover", function(evt) { mainButton.gotoAndStop("mainHighlight"); });
	mainButton.on("mouseout", function(evt) { mainButton.gotoAndStop("mainNormal"); });
	mainButton.on("mousedown", function(evt) { mainButton.gotoAndStop("mainDown"); });
    stage.addChild(mainButton);
	
	continueButton = new createjs.Sprite(buttonSheet);
	continueButton.gotoAndStop("continueNormal");
	continueButton.x = 85;
	continueButton.y = 594;
	continueButton.on("click", function(evt) { nextLevel(); });
	continueButton.on("mouseover", function(evt) { continueButton.gotoAndStop("continueHighlight"); });
	continueButton.on("mouseout", function(evt) { continueButton.gotoAndStop("continueNormal"); });
	continueButton.on("mousedown", function(evt) { continueButton.gotoAndStop("continueDown"); });
    stage.addChild(continueButton);

	initJon();
	initDevon();
    initDan();
    
    setBackgroundMusic("titleMusic");
	
	gameState = TITLE;
}

//Jon's Code

var TYPE_NOTHING = 0, TYPE_CHARACTER = 1, TYPE_WALL = 2, TYPE_BULLET = 3, TYPE_PICKUP = 4;

function GameObject()
{
	this.x;
	this.y;
	this.radius;
	this.solid = true;
	this.markedForDestroy=false;
	this.type = TYPE_NOTHING;
	this.representation;
	this.containingStage;
}
GameObject.prototype.destroy = function()
{
}

function sqr( n )
{
	return n*n;
}

GameObject.prototype.update = function( dt )
{
	// Visibility test
	this.representation.visible = ( Math.abs(this.x-(-this.containingStage.x+stage.canvas.width/2)) < stage.canvas.width/2 + 150 ) && ( Math.abs(this.y-(-this.containingStage.y+stage.canvas.height/2) ) < stage.canvas.height/2 + 150 );
	
	// Collision with walls
	for( var i = 0; i < gameWalls.length; i++ )
	{
		var wall = gameWalls[i];
		
		var collided = false;
		
		//Side checks
		if( this.x > wall.x - this.radius && this.x < wall.x + wall.w + this.radius && this.y > wall.y && this.y < wall.y + wall.h )
		{
			collided = true;
			if( this.solid )
				this.x = ( this.x < wall.x + wall.w/2 ) ? wall.x - this.radius : wall.x + wall.w + this.radius;
		}
		if( this.y > wall.y - this.radius && this.y < wall.y + wall.h + this.radius && this.x > wall.x && this.x < wall.x + wall.w )
		{
			collided = true;
			if( this.solid )
				this.y = ( this.y < wall.y + wall.h/2 ) ? wall.y - this.radius : wall.y + wall.h + this.radius;
		}
		
		//Corner checks
		for( var j = 0; j < wall.corners.length; j++ )
		{
			var mag = Math.sqrt( Math.pow( (wall.corners[j].x - this.x), 2 ) + Math.pow( (wall.corners[j].y - this.y), 2 ) );
			if( mag < this.radius )
			{
				collided = true;
				if( this.solid )
				{
					this.x = wall.corners[j].x - this.radius*(wall.corners[j].x - this.x) / mag;
					this.y = wall.corners[j].y - this.radius*(wall.corners[j].y - this.y) / mag
				}
			}
		}
		
		if( collided )
		{
			gameWalls[i].collide( this );
			this.collide( gameWalls[i] );
		}
	}
	
	// Collision with other characters
	for( var i = 0; i < gameObjects.length; i++ )
	{
		var rad = this.radius+gameObjects[i].radius;
		var mag = Math.sqrt( Math.pow( (gameObjects[i].x - this.x), 2 ) + Math.pow( (gameObjects[i].y - this.y), 2 ) );

		if( mag > 0 && mag < rad )
		{
			this.collide( gameObjects[i] );
			gameObjects[i].collide( this );
			if( this.solid && gameObjects[i].solid )
			{
				var thisToThatRat = this.radius*this.radius/(this.radius*this.radius+gameObjects[i].radius*gameObjects[i].radius);
				var xDiff = this.x - (gameObjects[i].x + rad * (this.x - gameObjects[i].x) / mag);
				var yDiff = this.y - (gameObjects[i].y + rad * (this.y - gameObjects[i].y) / mag);
				this.x = this.x - xDiff*(1-thisToThatRat);
				this.y = this.y - yDiff*(1-thisToThatRat);
				gameObjects[i].x = gameObjects[i].x + xDiff*thisToThatRat;
				gameObjects[i].y = gameObjects[i].y + yDiff*thisToThatRat;
			}
		}
	}
}

GameObject.prototype.collide = function( other )
{
}

function Wall( x, y, w, h )
{
	GameObject.call( this );
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	//this.representation;
	//this.containingStage;
	
	this.type = TYPE_WALL;
	
	this.corners = [ {x: this.x,y:this.y}, {x: this.x+this.w,y:this.y}, {x: this.x+this.w,y:this.y+this.h}, {x: this.x,y:this.y+this.h} ];
}

Wall.prototype = Object.create(GameObject.prototype);
Wall.prototype.constructor = Wall;

Wall.prototype.init = function( stage, spriteReference )
{
	this.representation = spriteReference.clone();
	
	stage.addChild(this.representation);
	this.containingStage = stage;
	
	this.representation.x = this.x;
	this.representation.y = this.y;
	this.representation.scaleX = this.representation.visible ? (this.w+0.01) / this.representation.getBounds().width : 1;
	this.representation.scaleY = this.representation.visible ? (this.h+0.01) / this.representation.getBounds().height : 1;
}

Wall.prototype.destroy = function()
{
	this.containingStage.removeChild( this.representation );
}

function CharacterObject()
{
	GameObject.call( this );
	this.x = 0;
	this.y = 0;
	this.direction = 0;
	//this.representation;
	this.shadow;
	
	this.xspeed = 0;
	this.yspeed = 0;
	this.jumpSpeed = 0;
	this.jumpHeight = 0;
	
	this.health = 100;
	this.maxHealth = 100;
	
	this.type = TYPE_CHARACTER;
	
	this.radius = 32;
	this.alignment = 0;
	
	//this.containingStage;
}

CharacterObject.prototype = Object.create(GameObject.prototype);
CharacterObject.prototype.constructor = CharacterObject;

CharacterObject.prototype.init = function( stage, spriteReference, shadowReference )
{
	this.representation = spriteReference.clone();
	this.shadow = shadowReference.clone();
	
	stage.addChild(this.shadow);
	stage.addChild(this.representation);
	this.containingStage = stage;
}

CharacterObject.prototype.destroy = function()
{
	this.containingStage.removeChild( this.representation );
	this.containingStage.removeChild( this.shadow );
}

CharacterObject.prototype.innerUpdate = function(dt)
{
}

CharacterObject.prototype.update = function(dt)
{
	this.innerUpdate(dt);
	
	GameObject.prototype.update.call( this, dt );
	
	this.health = Math.min( this.health, this.maxHealth );

	
	if( this.health <= 0 )
	{
		this.markedForDestroy = true;
		if( this.alignment != 0 )
			enemiesSlain++;
	}
		
	this.representation.x = this.x;
	this.representation.y = this.y;
	this.representation.rotation = this.direction;
	this.shadow.x = this.x;
	this.shadow.y = this.y;
}

CharacterObject.prototype.collide = function( other )
{
	switch( other.type )
	{
		case TYPE_CHARACTER:
			//this.x -= 10;
		break;
	}
}

function TestCharacter()
{
	CharacterObject.call( this );
	this.radius = 32;
}

TestCharacter.prototype = Object.create(CharacterObject.prototype);
TestCharacter.prototype.constructor = TestCharacter;
TestCharacter.prototype.innerUpdate = function( dt )
{
	if( isMouseDown() )
	{
		this.move( dt );
	}
}
TestCharacter.prototype.move = function( dt )
{
	this.x = getMouseX();
	this.y = getMouseY();
}

function Pickup()
{
	GameObject.call( this );
	//this.representation;
	
	this.type = TYPE_PICKUP;
	
	this.radius = 32;
	this.solid = false;
	
	//this.containingStage;
}

Pickup.prototype = Object.create(GameObject.prototype);
Pickup.prototype.constructor = Pickup;

Pickup.prototype.init = function( stage, spriteReference )
{
	this.representation = spriteReference.clone();
	stage.addChild(this.representation);
	this.containingStage = stage;
}

Pickup.prototype.destroy = function()
{
	this.containingStage.removeChild( this.representation );
}

Pickup.prototype.update = function(dt)
{
	GameObject.prototype.update.call( this, dt );
	
	this.representation.x = this.x;
	this.representation.y = this.y;
}

function HealthPickup()
{
	Pickup.call( this );
}

HealthPickup.prototype = Object.create(Pickup.prototype);
HealthPickup.prototype.constructor = HealthPickup;
HealthPickup.prototype.collide = function( other )
{
	switch( other.type )
	{
		case TYPE_CHARACTER:
			if( other.alignment === 0 )
			{
				other.health += 80;
				other.health = Math.min( other.health, other.maxHealth );
				this.markedForDestroy = true;
				createjs.Sound.play( "pickupHealth" );
			}
		break;
	}
}

function EndLevelPickup()
{
	Pickup.call( this );
}

EndLevelPickup.prototype = Object.create(Pickup.prototype);
EndLevelPickup.prototype.constructor = EndLevelPickup;
EndLevelPickup.prototype.collide = function( other )
{
	switch( other.type )
	{
		case TYPE_CHARACTER:
			if( other.alignment === 0 )
			{
				gameState = COMPLETE;
				//this.markedForDestroy = true;
			}
		break;
	}
}

var floorImage;
var floors;
var wallRep;


function Floor( x, y, w, h, startX, startY, cellDim )
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	this.startX = startX;
	this.startY = startY;
	this.cellDim = cellDim;
}

Floor.prototype.getRandomCell = function()
{
	var rx = Math.floor( Math.random() * this.w * 0.9999 );
	var ry = Math.floor( Math.random() * this.h * 0.9999 );
	return this.getActualCell( rx, ry );//rx+Math.random()*0.01, ry+Math.random()*0.01 );
}

Floor.prototype.getRandomEmptyCell = function()
{
	var search = true;
	var cell;
	while( search )
	{
		search = false;
		cell = this.getRandomCell();
		for( var i = 0; i < gameObjects.length && !search; i++ )
		{
			var mag = ( Math.pow( (gameObjects[i].x - cell.x), 2 ) + Math.pow( (gameObjects[i].y - cell.y), 2 ) );
			search = search || mag < 2;
		}
	}
	
	return cell;
}

Floor.prototype.getActualCell = function( x, y )
{
	return( { x: this.x + (x+0.5)*this.cellDim, y: this.y + (y+0.5)*this.cellDim } );
}

function createFloor(w, h)
{
	var isInMaze = new Array(w*h);
	var walls = new Array(w*h*2);
	
	var wallList = [];
	
	for( var i = 0; i < w; i ++ )
	{
		for( var j = 0; j < h; j++ )
		{
			if( i < w-1 )
				walls[(i+w*j)*2] = true;
			if( j < h-1 )
				walls[(i+w*j)*2+1] = true;
		}
	}
	
	var startX = Math.floor( Math.random()*( w-2 )+1 );
	var startY = Math.floor( Math.random()*( h-2 )+1 );
	
	
	var floor = new Floor( -cellDim*w/2, -cellDim*h/2, w, h, startX, startY, cellDim );
	
	
	isInMaze[startX+w*startY] = true;
	
	wallList.push( (startX+w*startY)*2 );
	wallList.push( (startX+w*startY)*2+1 );
	wallList.push( (startX+w*startY-1)*2 );
	wallList.push( (startX+w*(startY-1))*2+1 );
	
	////////////////
	
	while( wallList.length != 0 )
	{
		var nindex = Math.floor( Math.random()*(wallList.length-0.001) );
		
		var next = wallList[nindex];
		wallList.splice( nindex, 1 );
		
		var cx = Math.floor(next/2) % w;
		var cy = Math.floor( Math.floor(next/2) / w );
		var nx = ( next % 2 == 0 && isInMaze[cx+cy*w] ) ? cx+1 : cx;
		var ny = ( next % 2 == 1 && isInMaze[cx+cy*w] ) ? cy+1 : cy;
		
		if( !isInMaze[nx+ny*w] )
		{
			walls[next] = false;
			isInMaze[nx+ny*w] = true;
			if( walls[(nx+ny*w)*2] )
				wallList.push( (nx+ny*w)*2 );
			if( walls[(nx+ny*w)*2+1] )
				wallList.push( (nx+ny*w)*2+1 );
			if( nx > 0 && walls[(nx+ny*w-1)*2] )
				wallList.push( (nx+ny*w-1)*2 );
			if( ny > 0 && walls[(nx+(ny-1)*w)*2+1] )
				wallList.push( (nx+(ny-1)*w)*2+1 );
		}
	}
	
	
	for( var j = -1; j < h; j++ )
	{
		for( var i = -1; i < w; i++ )
		{
			if( j != -1 && ( i == -1 || i == w-1 || (Math.random() < 0.8 && walls[(i+j*w)*2] ) ) )
				createWall( (i+1-wallFill/2-w/2)*cellDim, (j-wallFill/2-h/2)*cellDim, cellDim*wallFill, (1+wallFill)*cellDim );
			if( i != -1 && ( j == -1 || j == h-1 || (Math.random() < 0.8 && walls[(i+j*w)*2+1] ) ) )
				createWall( (i-wallFill/2-w/2)*cellDim, (j+1-wallFill/2-h/2)*cellDim, (1+wallFill)*cellDim, cellDim*wallFill );
		}
	}
	
	var st = "";
	for( var j = -1; j < h; j++ )
	{
		for( var i = -1; i < w; i++ )
		{
			st += ( (i != -1 && ( j == -1 || j == h-1 || walls[(i+j*w)*2+1] )) ? '_' : ' ' );
			st += ( (j != -1 && ( i == -1 || i == w-1 || walls[(i+j*w)*2] )) ? '|' : ' ' );
		}
		st += "\r";
	}
	//debugText.text = st;
	
	return floor;
}

function segmentIntersectSegment( l1x1, l1y1, l1x2, l1y2, l2x1, l2y1, l2x2, l2y2 )
{
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = l1x2 - l1x1;     s1_y = l1y2 - l1y1;
    s2_x = l2x2 - l2x1;     s2_y = l2y2 - l2y1;

    var s, t;
    s = (-s1_y * (l1x1 - l2x1) + s1_x * (l1y1 - l2y1)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (l1y1 - l2y1) - s2_y * (l1x1 - l2x1)) / (-s2_x * s1_y + s1_x * s2_y);

    return (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    // {
        // if (i_x != NULL)
            // *i_x = p0_x + (t * s1_x);
        // if (i_y != NULL)
            // *i_y = p0_y + (t * s1_y);
        // return 1;
    // }

    // return 0; // No collision
}

function segmentIntersectsFloor( x1, y1, x2, y2 )
{
	var result = false;
	
	for( var i = 0; i < gameWalls.length; i++ )
	{
		for( var j = 0; j < gameWalls[i].corners.length; j++ )
		{
			var p1 = gameWalls[i].corners[j];
			var p2 = gameWalls[i].corners[(j+1)%gameWalls[i].corners.length];
			result = result || segmentIntersectSegment( x1, y1, x2, y2, p1.x, p1.y, p2.x, p2.y );
		}
	}
	
	return result;
}

function createWall( x, y, w, h )
{
	var wall = new Wall( x, y, w, h );
	wall.init( gameStage, wallRep );
	gameWalls.push( wall );
}

var currentFloor;

function initJon()
{
	
	floorImage = new createjs.Bitmap(queue.getResult("gameFloor"));
	floors = [];
	for( var i = -floorImage.getBounds().width; i < 800; i+= floorImage.getBounds().width )
	{
		for( var j = -floorImage.getBounds().height; j < 600; j+= floorImage.getBounds().height )
		{
			var cloning = floorImage.clone();
			floors.push( cloning );
			gameStage.addChild( cloning );
		}
	}
	
	wallRep = new createjs.Bitmap(queue.getResult("wallImage"));
	
	
	
	// var chara = new TestCharacter();
	// var charRep = new createjs.Shape();  //creates object to hold a shape
	// charRep.graphics.beginFill("#1AF").drawCircle(32, 32, 32);  //creates circle at 0,0, with radius of 40
	// charRep.regX = 32;
	// charRep.regY = 32;
	// chara.init( gameStage, charRep, charRep );
	// gameCharacters.push( chara );
	
	
	
	
	
	
	//createWall( 128, 128, 64, 256 );
	//createWall( 0, 256, 256, 64 );
	//createWall( 128, 128, 64, 256 );
	
}

function placeHealth()
{
	//var rep = new createjs.Shape();  //creates object to hold a shape
	//rep.graphics.beginFill("#813").drawCircle(0, 0, 32);  //creates circle at 0,0, with radius of 40
	for( var i = 0; i < ( currentLevel + 3 ) / 5; i++ )
	{
		var heal = new HealthPickup();
		heal.init( gameStage, health );
		var cell = currentFloor.getRandomEmptyCell();
		heal.x = cell.x;
		heal.y = cell.y;
		gameObjects.push(heal);
	}
}

function placeEnd()
{
	//rep = new createjs.Shape();  //creates object to hold a shape
	//rep.graphics.beginFill("#272").drawCircle(0, 0, 32);  //creates circle at 0,0, with radius of 40
	var end = new EndLevelPickup();
	end.init( gameStage, goal );
	var safe = false;
	var cell;
	while( !safe )
	{
		safe = true;
		cell = currentFloor.getRandomEmptyCell();
		
		for( var i = 0; i < gameObjects.length; i++ )
		{
			if( gameObjects[i].alignment === 0 && gameObjects[i].type == TYPE_CHARACTER )
			{
				safe = safe && segmentIntersectsFloor( gameObjects[i].x, gameObjects[i].y, cell.x, cell.y );
				safe = safe && ( Math.pow( gameObjects[i].x-cell.x, 2 ) + Math.pow( gameObjects[i].y-cell.y, 2 ) ) > 256*256;
			}
		}
	}
	end.x = cell.x;
	end.y = cell.y;
	gameObjects.push(end);
	
	
	
	var end = new EndLevelPickup();
	end.init( gameStage, jamie );
	end.x = currentFloor.getActualCell( 0, 0 ).x-stage.canvas.width/2 - 100;
	end.y = currentFloor.getActualCell( 0, 0 ).y-stage.canvas.height/2 - 100;
	gameObjects.push(end);
}

function getMouseXInGame()
{
	return getMouseX() - gameStage.x;
}

function getMouseYInGame()
{
	return getMouseY() - gameStage.y;
}

function runJon( dt )
{
	// var play;
	// var enem;
	// for( var i = 0; i < gameObjects.length; i++ )
	// {
		// if( gameObjects[i].type == TYPE_CHARACTER )
		// {
			// if( gameObjects[i].alignment == 0 )
				// play = gameObjects[i];
			// if( gameObjects[i].alignment == 1 )
				// enem = gameObjects[i];
		// }
	// }
	// console.log( segmentIntersectsFloor( play.x, play.y, enem.x, enem.y ) );
	cameraFollowPlayer( dt, true );
	moveFloor();
	
	if( cheating )
	{
		for( var i = 0; i < gameObjects.length; i++ )
		{
			if( gameObjects[i].alignment === 0 && gameObjects[i].type == TYPE_CHARACTER )
			{
				gameObjects[i].health = gameObjects[i].maxHealth;
				for( var j = 0; j < 4; j++ )
				{
					gameObjects[i].ammo[j]=10;
				}
			}
		}
	}
}

function cameraFollowPlayer( dt, tween )
{
	var count = 0.25;
	var avx = -getMouseXInGame()/4, avy = -getMouseYInGame()/4;
	
	for( var i = 0; i < gameObjects.length; i++ )
	{
		if( gameObjects[i].alignment === 0 && gameObjects[i].type == TYPE_CHARACTER )
		{
			count++;
			avx -= gameObjects[i].x;
			avy -= gameObjects[i].y;
		}
	}
	
	if( count > 0.25 )
	{
		avx /= count;
		avy /= count;
		
		avx += stage.canvas.width/2;
		avy += stage.canvas.height/2;
		
		if( tween )
		{
			var tweenAmount = 10;
			gameStage.x = ( gameStage.x * tweenAmount + avx ) / ( tweenAmount + 1 );
			gameStage.y = ( gameStage.y * tweenAmount + avy ) / ( tweenAmount + 1 );
		}
		else
		{
			gameStage.x = avx;
			gameStage.y = avy;
		}
	}
	else		
	{
		gameState = GAMEOVER;
	}
	//console.log( count );
}

function nmod( x, y )
{
	var modded = Math.abs( x ) % y;
	return ( x < 0 ) ? y - modded : modded;
}

function moveFloor()
{
	var index = 0;
	for( var i = -floorImage.getBounds().width; i < 800; i+= floorImage.getBounds().width )
	{
		for( var j = -floorImage.getBounds().height; j < 600; j+= floorImage.getBounds().height )
		{
			var currentTile = floors[index++];
			currentTile.x = -gameStage.x + i + nmod( gameStage.x, floorImage.getBounds().width );
			currentTile.y = -gameStage.y + j + nmod( gameStage.y, floorImage.getBounds().height );
		}
	}
}

//Devon's Code

var movementSpeed=5;
var bulRep;
var SWORD=5, ROCKS=1, AXES=2, BOW_ARROW=4;
var currentWeapon;

function Character()
{
	CharacterObject.call( this );
	this.radius = 32;
    this.alignment=0;
    this.lastWeapon=SWORD;
    this.weaponChangeRate=0;
    this.ammo=[0,0,0,0];
    this.health=200;
    this.maxHealth=200;
    this.fireRate=0;
    this.swordFireRate=0.4;
    this.rockFireRate=0.7;
    this.bowFireRate=0.8;
    this.axeFireRate=0.7;
}

Character.prototype = Object.create(CharacterObject.prototype);
Character.prototype.constructor = Character;
Character.prototype.innerUpdate = function( dt )
{
	if(isKeyDown("W"))
        if(this.fireRate<0.8)
            this.y-=movementSpeed*0.7;
        else
            this.y-=movementSpeed;
    if(isKeyDown("S"))
        if(this.fireRate<0.8)
            this.y+=movementSpeed*0.7;
        else
            this.y+=movementSpeed;
    if(isKeyDown("A"))
        if(this.fireRate<0.8)
            this.x-=movementSpeed*0.7;
        else
            this.x-=movementSpeed;
    if(isKeyDown("D"))
        if(this.fireRate<0.8)
            this.x+=movementSpeed*0.7;
        else
            this.x+=movementSpeed;
    
    if(isMousePressed() && this.lastWeapon!=SWORD && this.ammo[this.lastWeapon-1]>0)
    {
        switch(this.lastWeapon)
        {
            case ROCKS:
                if(this.fireRate>this.rockFireRate)
                {
                    createjs.Sound.play("rockFire", {loop:0});
                    this.FireBullet();
                    this.ammo[this.lastWeapon-1]--;
                    this.fireRate=0;
                }
                break;
            case BOW_ARROW:
                if(this.fireRate>this.bowFireRate)
                {
                    createjs.Sound.play("arrowFire", {loop:0});
                    this.FireBullet();
                    this.ammo[this.lastWeapon-1]--;
                    this.fireRate=0;
                }
                break;
            case AXES:
                if(this.fireRate>this.axeFireRate)
                {
                    createjs.Sound.play("axeFire",{loop:0});
                    this.FireBullet();
                    this.ammo[this.lastWeapon-1]--;
                    this.fireRate=0;
                }
                break;
        }
    }
    else if(isMousePressed() && this.lastWeapon==SWORD && this.fireRate>this.swordFireRate)
    {
        createjs.Sound.play("swordFire",{loop:0});
        this.FireBullet();
        this.fireRate=0;
    }
    
    if(this.lastWeapon!=SWORD && this.ammo[this.lastWeapon-1]==0)
    {
        this.lastWeapon=SWORD;
        currentWeapon=SWORD;
    }
    
    var dirVec=new vector2D(getMouseXInGame()-this.representation.x, getMouseYInGame()-this.representation.y);
    
    this.direction=dirVec.getAngle();
    
    if((isKeyDown("Q") || getMouseWheelDelta()<0) && this.weaponChangeRate>0.2)
    {
        switch(this.lastWeapon)
        {
            case ROCKS:
                this.lastWeapon=SWORD;
                currentWeapon=SWORD;
                break;
            case AXES:
                if(this.ammo[0]>0)
                {
                    this.lastWeapon=ROCKS;
                    currentWeapon=ROCKS;
                }
                else
                {
                    this.lastWeapon=SWORD;
                    currentWeapon=SWORD;
                }
                break;
            case BOW_ARROW:
                if(this.ammo[1]>0)
                {
                    this.lastWeapon=AXES;
                    currentWeapon=AXES;
                }
                else if(this.ammo[0]>0)
                {
                    this.lastWeapon=ROCKS;
                    currentWeapon=ROCKS;
                }
                else
                {
                    this.lastWeapon=SWORD;
                    currentWeapon=SWORD;
                }
                break;
            case SWORD:
                if(this.ammo[3]>0)
                {
                    this.lastWeapon=BOW_ARROW;
                    currentWeapon=BOW_ARROW;
                }
                break;
        }
        this.weaponChangeRate=0;
    }
    else if((isKeyDown("E") || getMouseWheelDelta()>0) && this.weaponChangeRate>0.2)
    {
        switch(this.lastWeapon)
        {
            case ROCKS:
                if(this.ammo[1]>0)
                {
                    this.lastWeapon=AXES;
                    currentWeapon=AXES;
                }
                else if(this.ammo[3]>0)
                {
                    this.lastWeapon=BOW_ARROW;
                    currentWeapon=BOW_ARROW;
                }
                else
                {
                    this.lastWeapon=SWORD;
                    currentWeapon=SWORD;
                }
                break;
            case AXES:
                if(this.ammo[3]>0)
                {
                    this.lastWeapon=BOW_ARROW;
                    currentWeapon=BOW_ARROW;
                }
                else
                {
                    this.lastWeapon=SWORD;
                    currentWeapon=SWORD;
                }
                break;
            case BOW_ARROW:
                this.lastWeapon=SWORD;
                currentWeapon=SWORD;
                break;
            case SWORD:
                if(this.ammo[0]>0)
                {
                    this.lastWeapon=ROCKS;
                    currentWeapon=ROCKS;
                }
                else if(this.ammo[1]>0)
                {
                    this.lastWeapon=AXES;
                    currentWeapon=AXES;
                }
                else if(this.ammo[3]>0)
                {
                    this.lastWeapon=BOW_ARROW;
                    currentWeapon=BOW_ARROW;
                }
                else
                {
                    this.lastWeapon=SWORD;
                    currentWeapon=SWORD;
                }
                break;
        }
        this.weaponChangeRate=0;
    }
    this.weaponChangeRate+=dt;
    this.fireRate+=dt;
}
Character.prototype.FireBullet = function()
{
    var bul=new Bullet(this.lastWeapon, this.x, this.y);
    var vec=new vector2D(getMouseXInGame()-this.x, getMouseYInGame()-this.y);
    var vec2=new vector2D(this.x, this.y);
    
    this.representation.gotoAndPlay("attack");
    
    switch(this.lastWeapon)
    {
        case SWORD:
                var bulRep=swordBullet;
                bulRep.regX=-10;
                bulRep.regY=20;
                bulRep.rotation=vec.getAngle();
                bul.init(gameStage, bulRep, bulRep, 500, vec, vec2, this.alignment);
            break;
        case ROCKS:
                var bulRep=rockBullet;
                bulRep.regX=10;
                bulRep.regY=10;
                bulRep.rotation=vec.getAngle();
                bul.init(gameStage, bulRep, bulRep, 450, vec, vec2, this.alignment);
            break;
        case AXES:
                var bulRep=axeBullet;
                bulRep.regX=25;
                bulRep.regY=10;
                bulRep.rotation=vec.getAngle();
                bul.init(gameStage, bulRep, bulRep, 500, vec, vec2, this.alignment);
            break;
        case BOW_ARROW:
                var bulRep=bowBullet;
                bulRep.regX=20;
                bulRep.regY=0;
                bulRep.rotation=vec.getAngle();
                bul.init(gameStage, bulRep, bulRep, 800, vec, vec2, this.alignment);
            break;
    }
    
    gameObjects.push(bul);
}
Character.prototype.getAmmo=function(weaponType)
{
    return this.ammo[weaponType-1];
}
    
function Bullet(weaponType, bX, bY)
{
    GameObject.call(this);
    this.radius=10;
    this.alignment=2;
    this.representation;
    this.speed;
    this.vector;
    this.weaponType=weaponType;
    this.beginX=bX;
    this.beginY=bY;
    
    switch(weaponType)
    {
        case SWORD:
                this.pickUp=false;
                this.radius=30;
                break;
            case ROCKS:
                this.pickUp=true;
                break;
            case BOW_ARROW:
                this.pickUp=false;
                break;
            case AXES:
                this.pickUp=true;
                break;
    }

	this.solid=false;
	this.markedForDestroy=false;
	this.type = TYPE_BULLET;
}

Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.collide = function( other )
{
    if( !this.markedForDestroy )
    switch(other.type)
    {
        case TYPE_BULLET:
            break;
        case TYPE_CHARACTER:
            if(other.alignment!=this.alignment)
            {
                switch(this.weaponType)
                {
                    case SWORD:
                        createjs.Sound.play("swordHit");
                        other.health-=15;
                        this.markedForDestroy=true;
                        break;
                    case ROCKS:
                        createjs.Sound.play("rockHit");
                        other.health-=15;
                        this.markedForDestroy=true;
                        if(Math.random()<0.6 && this.pickUp)
                        {
                            ammo = new AmmoPickup(this.weaponType-1, 1);
                            rep = rockBullet;
		                    ammo.init( gameStage, rep );
		                    ammo.x = this.x;
		                    ammo.y = this.y;
		                    gameObjects.push(ammo);
                        }
                        break;
                    case BOW_ARROW:
                        createjs.Sound.play("arrowHit");
                        other.health-=40;
                        this.markedForDestroy=true;
                        break;
                    case AXES:
                        createjs.Sound.play("axeHit");
                        other.health-=20;
                        this.markedForDestroy=true;
                        if(Math.random()<0.6 && this.pickUp)
                        {
                            ammo = new AmmoPickup(this.weaponType-1, 1);
                            rep = axeBullet;
		                    ammo.init( gameStage, rep );
		                    ammo.x = this.x;
		                    ammo.y = this.y;
		                    gameObjects.push(ammo);
                        }
                        break;
                }
            }
            break;
        case TYPE_WALL:
            if(this.pickUp)
            {
                switch(this.weaponType)
                {
                    case ROCKS:
                        if(Math.random()<0.2 && this.pickUp)
                        {
                            ammo = new AmmoPickup(this.weaponType-1, 1);
                            rep = rockBullet;
		                    ammo.init( gameStage, rep );
		                    ammo.x = this.x;
		                    ammo.y = this.y;
		                    gameObjects.push(ammo);
                        }
                        break;
                    case AXES:
                        if(Math.random()<0.2 && this.pickUp)
                        {
                            ammo = new AmmoPickup(this.weaponType-1, 1);
                            rep = axeBullet;
		                    ammo.init( gameStage, rep );
		                    ammo.x = this.x;
		                    ammo.y = this.y;
		                    gameObjects.push(ammo);
                        }
                        break;
                }
            }
            this.markedForDestroy=true;
            break;
        case TYPE_NOTHING:
            break;
    }
}

Bullet.prototype.init = function(stage, spriteRef, shadowRef, speedRef, vecRef, posRef, al)
{
    this.representation=spriteRef.clone();
    this.representation.x=posRef.x;
    this.representation.y=posRef.y;
    if(al==0)
    {
        this.representation.regX=0;
        this.representation.regY=-10;
    }
    this.shadow=shadowRef.clone();
    this.shadow.x=posRef.x;
    this.shadow.y=posRef.y;
    this.speed=speedRef;
    
    this.alignment=al;
    
    this.vector=new vector2D((vecRef.x/vecRef.length)*speedRef, (vecRef.y/vecRef.length)*speedRef);
    
	gameStage.addChild(this.representation);
    
    this.containingStage=stage;
}
Bullet.prototype.destroy = function()
{
    gameStage.removeChild(this.representation);
}
Bullet.prototype.update = function( dt )
{
    this.representation.x+=this.vector.x*dt;
    this.representation.y+=this.vector.y*dt;
    
    this.x=this.representation.x;
    this.y=this.representation.y;
    
    if(this.weaponType==ROCKS || this.weaponType==AXES)
    {
        this.representation.rotation+=20;   
    }
    
    if(this.weaponType==SWORD)
    {
        var check=new vector2D(this.beginX-this.x, this.beginY-this.y);
        if(check.length>80)
        {
            this.markedForDestroy=true;
        }
    }
    
    GameObject.prototype.update.call( this, dt );
    
    this.representation.x=this.x;
    this.representation.y=this.y;
}

function AmmoPickup(type, amount)
{
	Pickup.call( this );
    this.weaponType=type;
    this.amount=amount;
    this.radius=20;
}

AmmoPickup.prototype = Object.create(Pickup.prototype);
AmmoPickup.prototype.constructor = AmmoPickup;
AmmoPickup.prototype.collide = function( other )
{
    if( !this.markedForDestroy )
	switch( other.type )
	{
		case TYPE_CHARACTER:
			if( other.alignment === 0 )
			{
				other.ammo[this.weaponType] += this.amount;
                
				this.markedForDestroy=true;
			}
		break;
	}
}

function overLay(h)
{
    this.height=h;
    this.width=800;
    this.offset=600-h;
    currentWeapon=0;
    
    this.container=new createjs.Container();
    
    this.background=new createjs.Shape();
    this.background.graphics.beginFill("#415454").drawRect(0, this.offset, this.width, this.height);
    
    this.weapon=weaponSword;
    this.weapon.x=400;
    this.weapon.y=this.offset;
    
    this.weaponSlot=new createjs.Shape();
    this.weaponSlot.graphics.beginStroke("#000");
    this.weaponSlot.graphics.setStrokeStyle(5);
    this.weaponSlot.graphics.beginFill("#000099").drawRoundRect(0, 0, 100,100,5);
    this.weaponSlot.x=400;
    this.weaponSlot.y=this.offset;
    
    this.HPBar=new createjs.Shape();
    this.HPBar.graphics.beginLinearGradientFill(["#23A31A","#145214"], [0,1],200,0,0,0).drawRoundRect(0, 0, 200, 50,5);
    this.HPBar.x=50;
    this.HPBar.y=this.offset+25;
    
    this.HPMaxBar=new createjs.Shape();
    this.HPMaxBar.graphics.beginLinearGradientFill(["#E62020","#800000"],[0,1],0,0,200,0).drawRoundRect(0,0,200,50,5);
    this.HPMaxBar.x=50;
    this.HPMaxBar.y=this.offset+25;
    
    this.AmmoText=new createjs.Text(100, "100px Arial", "#000");
    this.AmmoText.x=520;
    this.AmmoText.y=this.offset;
    
    this.container.addChild(this.background,this.weaponSlot, this.weapon, this.HPMaxBar, this.HPBar, this.AmmoText);
    
    uiStage.addChild(this.container);
    
    this.init=function()
    {
        currentWeapon=SWORD;
        player.lastWeapon=SWORD;
    }
    
    this.update=function(hp)
    {
        this.HPBar.scaleX=hp/200;
        
        switch(currentWeapon)
        {
            case 0:
                break;
            case SWORD:
                this.container.removeChild(this.weapon);
                this.weapon=weaponSword;
                this.weapon.x=410;
                this.weapon.y=this.offset+10;
                player.destroy();
                player.init(gameStage, dudeSword, shadowImage);
                this.container.addChild(this.weapon);
                currentWeapon=0;
                break;
            case BOW_ARROW:
                this.container.removeChild(this.weapon);
                this.weapon=weaponBow;
                this.weapon.x=410;
                this.weapon.y=this.offset+20;
                player.destroy();
                player.init(gameStage, dudeBow, shadowImage);
                this.container.addChild(this.weapon);
                currentWeapon=0;
                break;
            case AXES:
                this.container.removeChild(this.weapon);
                this.weapon=weaponAxe;
                this.weapon.x=420;
                this.weapon.y=this.offset+10;
                player.destroy();
                player.init(gameStage, dudeAxe, shadowImage);
                this.container.addChild(this.weapon);
                currentWeapon=0;
                break;
            case ROCKS:
                this.container.removeChild(this.weapon);
                this.weapon=weaponRock;
                this.weapon.x=410;
                this.weapon.y=this.offset+20;
                player.destroy();
                player.init(gameStage, dudeRock, shadowImage);
                this.container.addChild(this.weapon);
                currentWeapon=0;
                break;
        }
    }
}

var OL;
function initDevon()
{
    bulRep=new Array();
    OL=new overLay(100);
}

function createPlayer()
{
    player = new Character();
}

function placePlayer()
{
    player.x=currentFloor.getActualCell(currentFloor.startX, currentFloor.startY).x;
    player.y=currentFloor.getActualCell(currentFloor.startX, currentFloor.startY).y;
    
    player.init( gameStage, dudeSword, shadowImage );
    
    gameObjects.push( player );
    OL.init();
}

function placeAmmo()
{
    for( var i = 0; i < currentLevel*0.75+3; i++ )
	{
        var swit=Math.random();
        
        if(swit<0.45)
        {
            //5
		    var ammo = new AmmoPickup(ROCKS-1, 6);
            var rep = rockAmmo;
		    ammo.init( gameStage, rep );
		    var cell = currentFloor.getRandomEmptyCell();
		    ammo.x = cell.x-20;
		    ammo.y = cell.y-10;
            ammo.regX=cell.x;
            ammo.regY=cell.y;
		    gameObjects.push(ammo);
        }
        else if(swit<0.6)
        {
            //3w
            ammo = new AmmoPickup(BOW_ARROW-1, 6);
            rep = bowAmmo;
		    ammo.init( gameStage, rep );
		    cell = currentFloor.getRandomEmptyCell();
		    ammo.x = cell.x-30;
		    ammo.y = cell.y-20;
            ammo.regX=cell.x;
            ammo.regY=cell.y;
		    gameObjects.push(ammo);
        }
        else if(swit<1)
        {
            //3
             ammo = new AmmoPickup(AXES-1, 6);
            rep = axeAmmo;
		    ammo.init( gameStage, rep );
		    cell = currentFloor.getRandomEmptyCell();
		    ammo.x = cell.x-20;
		    ammo.y = cell.y-20;
            ammo.regX=cell.x;
            ammo.regY=cell.y;
		    gameObjects.push(ammo);
        }
	}
}

function runDevon( dt )
{   
    var playerFound=false;
    for(var i=0; i<gameObjects.length; i++)
    {
        if(gameObjects[i].type==TYPE_CHARACTER && gameObjects[i].alignment==0)
        {
            OL.update(gameObjects[i].health);
            OL.AmmoText.text=player.getAmmo(player.lastWeapon);
            playerFound=true;
        }
    }
    if(!playerFound)
        OL.update(0);
}

function vector2D(x,y)
{
    this.length=Math.sqrt((x*x)+(y*y));
    this.x=x;
    this.y=y;
    this.getVector=function()
    {
        return "("+this.x+", "+this.y+")";
    }
    
    this.getAngle=function()
    {
        return (Math.atan2(this.y, this.x)/Math.PI)*180;
    }
}

//Dan's Code




function EnemyCharacter()
{
	CharacterObject.call( this );
	this.radius = 28;
    this.alignment=1;
    this.health=100;
    this.shoots=false;
    this.attackrate=40;
    this.isActive=false;
    this.wait=0;
    this.targetX=0;
    this.targetY=0;
    this.weaponType;
    this.movement=4;
    this.range=350;
    this.isBoss=false;
    this .bossMoveX=0;
    this .bossMoveY=0;
    this.bosschargeTime=70;
    this.BosshitWall=false;
    
}

EnemyCharacter.prototype = Object.create(CharacterObject.prototype);
EnemyCharacter.prototype.constructor = EnemyCharacter;
EnemyCharacter.prototype.innerUpdate = function( dt )
{
   
   
   
        this.activate();
    
}
EnemyCharacter.prototype.shoot=function(x,y)
{
    var bul=new Bullet(this.weaponType,this.x,this.y);
    bul.alignment=1;
    var bulRep
    
    var vec=new vector2D(x-this.x, y-this.y);
    var vec2=new vector2D(this.x, this.y);
    if(this.weaponType===SWORD)
    {
         var bulRep=swordBullet;
        bulRep.rotation=vec.getAngle();
        bul.init(gameStage, bulRep, bulRep, 500, vec, vec2,1);
    }
    else if(this.weaponType===ROCKS)
    {
        var bulRep=rockBullet;
        bulRep.rotation=vec.getAngle();
        bul.init(gameStage, bulRep, bulRep, 500, vec, vec2,1);
    }
    else if(this.weaponType===AXES)
    {
        var bulRep=axeBullet;
        bulRep.rotation=vec.getAngle();
        bul.init(gameStage, bulRep, bulRep, 500, vec, vec2,1);
    }
    else
    {
        var bulRep=bowBullet;
        bulRep.rotation=vec.getAngle();
        bul.init(gameStage, bulRep, bulRep, 500, vec, vec2,1);
      
    }
    gameObjects.push(bul);
}
EnemyCharacter.prototype.activate = function(dt)
{
  
    var wait2=0;
    var player;
    for(i=0;i<gameObjects.length;i++)
        {
            if(gameObjects[i].alignment!=this.alignment && gameObjects[i].type===TYPE_CHARACTER)
            {
                player=gameObjects[i];
            }
         }
           
                    if(!this.isBoss)
        {
                         if(this.shoots)
                        {
                            if(Math.sqrt( Math.pow( (player.x - this.x), 2 ) + Math.pow( (player.y - this.y), 2 ) )<this.range)
                            {
                                if(!segmentIntersectsFloor(player.x, player.y, this.x, this.y ))
                                {
                                    this.isActive=true;
                                    this.targetX=player.x;
                                    this.targetY=player.y;
                                    if(this.wait==this.attackrate)
                                    {
                                        this.shoot(player.x,player.y);
                                         this.wait=0;
                                        this.representation.gotoAndPlay("attack");
                                    }
                                    this.wait++;
                                }

                            }

                            if(this.isActive)
                            {
                                var distance=length(player.x,player.y)-length(this.x,this.y);

                                if(segmentIntersectsFloor(player.x, player.y, this.x, this.y ))
                                {
                                    this.move(this.targetX,this.targetY);
                                }
                            }
                        }
                        else if(Math.sqrt( Math.pow( (player.x - this.x), 2 ) + Math.pow( (player.y - this.y), 2 ) )<200|| this.isActive)
                        {
                            if(!segmentIntersectsFloor(player.x, player.y, this.x, this.y ))
                                {
                                    this.targetX=player.x;
                                    this.targetY=player.y;
                                this.isActive=true;
                                this.move(this.targetX,this.targetY);
                                }

                        }
                    if(this.isActive)
                    {
                         this.move(this.targetX,this.targetY);
                    }

                }
              
                    
                
            
          
             if(this.isBoss)
        {
             if(this.wait>=80)
                  {
         
               
                  
                 
           
                    if(this.bosschargeTime===70 )
                    {
                        this.targetX=player.x;
                            this.targetY=player.y;
                          this.bossMoveX=  normalized((this.targetX-this.x),length((this.targetX-this.x), (this.targetY-this.y)))*13;
                        this.bossMoveY=  normalized((this.targetY-this.y),length((this.targetX-this.x), (this.targetY-this.y)))*13;

                            this.BosshitWall=false;
                        this.bosschargeTime=0;
                    }
                 
                    
             
           
            this.representation.gotoAndPlay("attack");
                this.bossMove();
             }
            else{
                this.representation.gotoAndPlay("idle");
            }
           
                
            }
         
        
                
       
    if(this.isBoss)
    {
          if(this.bosschargeTime<70 )
                {
                    this.bosschargeTime++;
                   

                }
        if(this.bosschargeTime===69 )
        {
             
            this.wait=0;
        }
        this.wait++;
    }
}
EnemyCharacter.prototype.collide=function(other)
{
    if(this.isBoss)
    {
        switch(other.type)
        {
            case TYPE_CHARACTER:
                
                if( !this.BosshitWall)
                {
                    this.BosshitWall=true;
                    other.health-=33;
                }
                    break;
           
                    
        }
    }
                
                
}
EnemyCharacter.prototype.bossAttack=function(character)
{
    var velocX=character.x-this.targetX;
    var velocY=character.y-this.targetY;
    var newCharX=character.x+velocX;
    var newCharY=character.y+velocY;

    this.shoot(newCharX,newCharY);
    
}
EnemyCharacter.prototype.bossMove=function()
{
    
    this.x+=this.bossMoveX;
    this.y+=this.bossMoveY;
    //this.representation.gotoAndPlay("attack");
     this.direction=Math.atan2(this.bossMoveY,this.bossMoveX)/Math.PI*180;
}
EnemyCharacter.prototype.move=function(posX,posY)  
{
    
  var velocityX=  normalized((posX-this.x),length((posX-this.x), (posY-this.y)))*this.movement;
    var velocityY=  normalized((posY-this.y),length((posX-this.x), (posY-this.y)))*this.movement;
    var lastX=this.x;
    var lastY=this.y;
    this.x+=velocityX;
    this.y+=velocityY;
     this.direction=Math.atan2(velocityY,velocityX)/Math.PI*180;
   
    
}
function length(x, y)
{
  return Math.sqrt((x*x)+(y*y));
}



function normalized(data,length)
{
 return (data/length);

}
function initDan()
{
    theRadical.x=mouseX;
    theRadical.y=mouseY;
    uiStage.addChild(theRadical);
}
function placeEnemies()
{
      
    
    
     var enemy1= new EnemyCharacter();
  var AIRectangle = new createjs.Shape();
        AIRectangle.graphics.beginFill("#99FF99").drawCircle(0,0, 32);

  
   
    for(i=0;i<currentLevel*2;i++)
    {
        enemy1= new EnemyCharacter();
         enemy1.shoots=true;
        
       
        var weaponRan=Math.random()*10;
        if(currentLevel<=2)
        {
            enemy1.init( gameStage, werewolf, shadowImage );
            enemy1.weaponType=SWORD;
        }
        else if(currentLevel<=4)
        {
            if(weaponRan<6)
            {
                enemy1.init( gameStage, werewolf, shadowImage );
                enemy1.weaponType=SWORD;
            }
            else if(weaponRan<10)
            {
                enemy1.init( gameStage, cyclops, shadowImage );
                enemy1.weaponType=ROCKS;
            }
        }
        else if(currentLevel<=6)
        {
            if(weaponRan<6)
            {
                enemy1.init( gameStage, werewolf, shadowImage );
                enemy1.weaponType=SWORD;
            }
            else if(weaponRan<8)
            {
                enemy1.init( gameStage, cyclops, shadowImage );
                enemy1.weaponType=ROCKS;
            }
            else if(weaponRan<10)
            {
                enemy1.init( gameStage, centaur, shadowImage );
                enemy1.weaponType=AXES;
            }
        }
        else
        {
            if(weaponRan<6)
            {
                enemy1.init( gameStage, werewolf, shadowImage );
                enemy1.weaponType=SWORD;
            }
            else if(weaponRan<7)
            {
                enemy1.init( gameStage, cyclops, shadowImage );
                enemy1.weaponType=ROCKS;
            }
            else if(weaponRan<8)
            {
                enemy1.init( gameStage, centaur, shadowImage );
                enemy1.weaponType=AXES;
            }
            else if(weaponRan<10)
            {
                enemy1.init( gameStage, harpie, shadowImage );
                enemy1.weaponType=BOW_ARROW;
            }
            
        }
     var cell=currentFloor.getRandomEmptyCell();
        enemy1.x=cell.x;
        enemy1.y=cell.y;
        enemy1.direction=0;
        enemy1.movement=2;
        for(j=0;j<gameObjects.length;j++)
        {
            if(gameObjects[j].alignment!=enemy1.alignment && gameObjects[j].type===TYPE_CHARACTER)
            {
               
                while(!segmentIntersectsFloor(gameObjects[j].x, gameObjects[j].y, enemy1.x, enemy1.y ))
                      {
                          cell=currentFloor.getRandomEmptyCell();
                             enemy1.x=cell.x;
                            enemy1.y=cell.y;
                      
                      }
                
               
            }
        }
        gameObjects.push(enemy1);
    }
}
var minatuar;
function placeMinotaur()
{
    minatuar=new EnemyCharacter();
      minatuar.shoots=true;
    var AIRectangle = new createjs.Shape();
  AIRectangle.graphics.beginFill("#CC33FF").drawCircle(0,0, 100);
    minatuar.init( gameStage, minotaur, shadowImage );
    minatuar.maxHealth=1000;
    minatuar.health=700;
    minatuar.weaponType=BOW_ARROW;
    minatuar.attackrate=40;
     minatuar.movement=4;
    minatuar.wait=40;
    minatuar.movement*=.6;
    minatuar.radius=50;
    minatuar.range=500;
    minatuar.isBoss=true;
    
    gameObjects.push(minatuar);
}
function runDan( dt )
{
  if(minatuar&&minatuar.health<=0)
  {
      minatuar=0;
      gameState = WIN;
  }
    theRadical.visible=true;
    theRadical.x=mouseX-35;
    theRadical.y=mouseY-35;
}
