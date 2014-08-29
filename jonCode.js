//Jon's Code

var TYPE_NOTHING = 0, TYPE_CHARACTER = 1, TYPE_WALL = 2, TYPE_BULLET = 3;

function GameObject()
{
	this.x;
	this.y;
	this.radius;
	this.solid = true;
	this.markedForDestroy=false;
	this.type = TYPE_NOTHING;
}
GameObject.prototype.destroy = function()
{
}

GameObject.prototype.update = function( dt )
{
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
				var xDiff = this.x - (gameObjects[i].x + rad * (this.x - gameObjects[i].x) / mag);
				var yDiff = this.y - (gameObjects[i].y + rad * (this.y - gameObjects[i].y) / mag);
				this.x = this.x - xDiff;
				this.y = this.y - yDiff;
				gameObjects[i].x = gameObjects[i].x + xDiff;
				gameObjects[i].y = gameObjects[i].y + yDiff;
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
	
	this.representation;
	this.containingStage;
	
	this.type = TYPE_WALL;
	
	this.corners = [ {x: this.x,y:this.y}, {x: this.x+this.w,y:this.y}, {x: this.x,y:this.y+this.h}, {x: this.x+this.w,y:this.y+this.h} ];
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
	this.representation.scaleX = (this.w+0.01) / this.representation.getBounds().width;
	this.representation.scaleY = (this.h+0.01) / this.representation.getBounds().height;
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
	this.representation;
	this.shadow;
	
	this.xspeed = 0;
	this.yspeed = 0;
	this.jumpSpeed = 0;
	this.jumpHeight = 0;
	
	this.health = 100;
	
	this.type = TYPE_CHARACTER;
	
	this.radius = 32;
	this.alignment = 0;
	
	this.containingStage;
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
	
	if( this.health <= 0 )
		this.markedForDestroy = true;
		
	this.representation.x = this.x;
	this.representation.y = this.y;
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

var floorImage;
var floors;
var wallRep;

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
	
	var cellDim = 128;
	var wallFill = 0.2;
	for( var j = -1; j < h; j++ )
	{
		for( var i = -1; i < w; i++ )
		{
			if( j != -1 && ( i == -1 || i == w-1 || walls[(i+j*w)*2] ) )
				createWall( (i+1-wallFill/2-w/2)*cellDim, (j-wallFill/2-h/2)*cellDim, cellDim*wallFill, (1+wallFill)*cellDim );
			if( i != -1 && ( j == -1 || j == h-1 || walls[(i+j*w)*2+1] ) )
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
	debugText.text = st;
	
}

function createWall( x, y, w, h )
{
	var wall = new Wall( x, y, w, h );
	wall.init( gameStage, wallRep );
	gameWalls.push( wall );
}

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
	
	
	createFloor(10,10);
	//createWall( 128, 128, 64, 256 );
	//createWall( 0, 256, 256, 64 );
	//createWall( 128, 128, 64, 256 );
	
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
	cameraFollowPlayer( dt, true );
	moveFloor();
}

function cameraFollowPlayer( dt, tween )
{
	var count = 0;
	var avx = 0, avy = 0;
	
	for( var i = 0; i < gameObjects.length; i++ )
	{
		if( gameObjects[i].alignment === 0 && gameObjects[i].type == TYPE_CHARACTER )
		{
			count++;
			avx -= gameObjects[i].x;
			avy -= gameObjects[i].y;
		}
	}
	
	if( count != 0 )
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