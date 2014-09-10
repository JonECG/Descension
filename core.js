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
			
			if( isKeyPressed( 'G' ) )
			{
				gameState = GAMEOVER;
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
		var w = 10; 
		var h = 10;
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
	playButton.on("click", function(evt) { startGame(); setBackgroundMusic("gameMusic");});
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