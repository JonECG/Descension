//Jon's Code

function Wall( x, y, w, h )
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	this.representation;
	this.containingStage;
	
	this.corners = [ {x: this.x,y:this.y}, {x: this.x+this.w,y:this.y}, {x: this.x,y:this.y+this.h}, {x: this.x+this.w,y:this.y+this.h} ];
}

Wall.prototype.init = function( stage, spriteReference )
{
	this.representation = spriteReference.clone();
	
	stage.addChild(this.representation);
	this.containingStage = stage;
	
	this.representation.x = this.x;
	this.representation.y = this.y;
}

Wall.prototype.destroy = function()
{
	this.containingStage.removeChild( this.representation );
}

function CharacterObject()
{
	this.x = 0;
	this.y = 0;
	this.representation;
	this.shadow;
	
	this.xspeed = 0;
	this.yspeed = 0;
	this.jumpSpeed = 0;
	this.jumpHeight = 0;
	
	this.health = 100;
	
	this.radius = 32;
	this.alignment = 0;
	
	this.containingStage;
}

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
	
	// Collision with walls
	for( var i = 0; i < gameWalls.length; i++ )
	{
		var wall = gameWalls[i];
		
		//Side checks
		if( this.x > wall.x - this.radius && this.x < wall.x + wall.w + this.radius && this.y > wall.y && this.y < wall.y + wall.h )
		{
			this.x = ( this.x < wall.x + wall.w/2 ) ? wall.x - this.radius : wall.x + wall.w + this.radius;
		}
		if( this.y > wall.y - this.radius && this.y < wall.y + wall.h + this.radius && this.x > wall.x && this.x < wall.x + wall.w )
		{
			this.y = ( this.y < wall.y + wall.h/2 ) ? wall.y - this.radius : wall.y + wall.h + this.radius;
		}
		
		//Corner checks
		for( var j = 0; j < wall.corners.length; j++ )
		{
			var mag = Math.sqrt( Math.pow( (wall.corners[j].x - this.x), 2 ) + Math.pow( (wall.corners[j].y - this.y), 2 ) );
			if( mag < this.radius )
			{
				this.x = wall.corners[j].x - this.radius*(wall.corners[j].x - this.x) / mag;
				this.y = wall.corners[j].y - this.radius*(wall.corners[j].y - this.y) / mag;
			}
		}
	}
	
	// Collision with other characters
	for( var i = 0; i < gameCharacters.length; i++ )
	{
		var rad = this.radius+gameCharacters[i].radius;
		var mag = Math.sqrt( Math.pow( (gameCharacters[i].x - this.x), 2 ) + Math.pow( (gameCharacters[i].y - this.y), 2 ) );
		if( this.health > 0 && gameCharacters[i].health > 0 && mag > 0 && mag < rad )
		{
			var xDiff = this.x - (gameCharacters[i].x + rad * (this.x - gameCharacters[i].x) / mag);
			var yDiff = this.y - (gameCharacters[i].y + rad * (this.y - gameCharacters[i].y) / mag);
			this.x = this.x - xDiff/2;
			this.y = this.y - yDiff/2;
			gameCharacters[i].x = gameCharacters[i].x + xDiff/2;
			gameCharacters[i].y = gameCharacters[i].y + yDiff/2;
		}
	}
	
	//this.x = Math.min( 800, Math.max( this.x, 0 ) );
	//this.y = Math.min( 600, Math.max( this.y, 0 ) );
	
	this.representation.x = this.x;
	this.representation.y = this.y;
	this.shadow.x = this.x;
	this.shadow.y = this.y;
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
		this.x = getMouseX();
		this.y = getMouseY();
	}
}

function initJon()
{
	// var chara = new TestCharacter();
	// var charRep = new createjs.Shape();  //creates object to hold a shape
	// charRep.graphics.beginFill("#1AF").drawCircle(32, 32, 32);  //creates circle at 0,0, with radius of 40
	// charRep.regX = 32;
	// charRep.regY = 32;
	// chara.init( gameStage, charRep, charRep );
	// gameCharacters.push( chara );
	
	var wall = new Wall( 128, 128, 64, 256 );
	var wallRep = new createjs.Shape();  //creates object to hold a shape
	wallRep.graphics.beginFill("#111").drawRect(0, 0, 64, 256);  //creates circle at 0,0, with radius of 40
	wall.init( gameStage, wallRep );
	gameWalls.push( wall );
}

function runJon( dt )
{
	cameraFollowPlayer( dt );
}

function cameraFollowPlayer( dt )
{
	var count = 0;
	var avx = 0, avy = 0;
	
	for( var i = 0; i < gameCharacters.length; i++ )
	{
		if( gameCharacters[i].alignment === 0 )
		{
			count++;
			avx -= gameCharacters[i].x;
			avy -= gameCharacters[i].y;
		}
	}
	
	if( count != 0 )
	{
		avx /= count;
		avy /= count;
		
		avx += stage.canvas.width/2;
		avy += stage.canvas.height/2;
		
		var tweenAmount = 30;
		gameStage.x = ( gameStage.x * tweenAmount + avx ) / ( tweenAmount + 1 );
		gameStage.y = ( gameStage.y * tweenAmount + avy ) / ( tweenAmount + 1 );
	}
	//console.log( count );
}