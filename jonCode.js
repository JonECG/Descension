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
	this.maxHealth = 100;
	
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
	
	this.health = Math.min( this.health, this.maxHealth );

	
	if( this.health <= 0 )
	{
		this.markedForDestroy = true;
		if( this.alignment != 0 )
			enemiesSlain++;
	}
		
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

function Pickup()
{
	GameObject.call( this );
	this.representation;
	
	this.type = TYPE_PICKUP;
	
	this.radius = 32;
	this.solid = false;
	
	this.containingStage;
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
				other.health += 20;
				this.markedForDestroy = true;
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
	var rep = new createjs.Shape();  //creates object to hold a shape
	rep.graphics.beginFill("#813").drawCircle(0, 0, 32);  //creates circle at 0,0, with radius of 40
	for( var i = 0; i < 10; i++ )
	{
		var heal = new HealthPickup();
		heal.init( gameStage, rep );
		var cell = currentFloor.getRandomEmptyCell();
		heal.x = cell.x;
		heal.y = cell.y;
		gameObjects.push(heal);
	}
}

function placeEnd()
{
	rep = new createjs.Shape();  //creates object to hold a shape
	rep.graphics.beginFill("#272").drawCircle(0, 0, 32);  //creates circle at 0,0, with radius of 40
	var end = new EndLevelPickup();
	end.init( gameStage, rep );
	var cell = currentFloor.getRandomEmptyCell();
	end.x = cell.x;
	end.y = cell.y;
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
				gameObjects[i].health = 100;
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