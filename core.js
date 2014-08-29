subscribe( gameInit, gameLoop );
var debugText;
var gameStage, uiStage;
var cheating = false;

var LOADING = -1, TITLE = 0, INSTRUCT = 1, PLAY = 2, GAMEOVER = 3; 

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
			gameoverScreen.visible = true;
			mainButton.visible = true;
		break;
	}
	
}

function startGame()
{
	gameState = PLAY;
}

var titleScreen, instructionScreen, gameoverScreen;
var playButton, instrButton, mainButton;

manifest = [
    {src:"title.png", id:"title"},
    {src:"instructions.png", id:"instructions"},
    {src:"gameover.png", id:"gameover"},
    {src:"buttons.png", id:"buttons"},
	{src:"gameFloor.png", id:"gameFloor"},
	{src:"wallImage.png", id:"wallImage"}
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
	
	stage.addChildAt(titleScreen,0);
	stage.addChildAt(instructionScreen,0);
	stage.addChildAt(gameoverScreen,0);
	
	
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
            mainDown: [8, 8, "mainDown"]
            }     
        });
	
	playButton = new createjs.Sprite(buttonSheet);
	playButton.gotoAndStop("playNormal");
	playButton.x = 85;
	playButton.y = 594;
	playButton.on("click", function(evt) { startGame(); });
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
	mainButton.on("click", function(evt) { gameState = TITLE; setBackgroundMusic( "menuMusic" ); });
	mainButton.on("mouseover", function(evt) { mainButton.gotoAndStop("mainHighlight"); });
	mainButton.on("mouseout", function(evt) { mainButton.gotoAndStop("mainNormal"); });
	mainButton.on("mousedown", function(evt) { mainButton.gotoAndStop("mainDown"); });
    stage.addChild(mainButton);

	initJon();
	initDan();
	initDevon();
	
	gameState = TITLE;
}