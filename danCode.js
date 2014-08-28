//Dan's Code




function EnemyCharacter()
{
	CharacterObject.call( this );
	this.radius = 32;
    this.alignment=1;
}

EnemyCharacter.prototype = Object.create(CharacterObject.prototype);
EnemyCharacter.prototype.constructor = EnemyCharacter;
EnemyCharacter.prototype.innerUpdate = function( dt )
{
   
    
    
        this.activate();
    
}
EnemyCharacter.prototype.activate = function()
{
    for(i=0;i<gameObjects.length;i++)
        {
            if(gameObjects[i].alignment!=this.alignment && gameObjects[i].type===TYPE_CHARACTER)
            {
                    if(Math.sqrt( Math.pow( (gameObjects[i].x - this.x), 2 ) + Math.pow( (gameObjects[i].y - this.y), 2 ) )<200)
                    {
                        this.move(gameObjects[i]);
                    }
            }
        }
}
EnemyCharacter.prototype.move=function(character)  
{
    
  var velocityX=  normalized((character.x-this.x),length((character.x-this.x), (character.y-this.y)))*4;
    var velocityY=  normalized((character.y-this.y),length((character.x-this.x), (character.y-this.y)))*4;
    
    this.x+=velocityX;
    this.y+=velocityY;
    
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
    var enemy1= new EnemyCharacter();
  var AIRectangle = new createjs.Shape();
    AIRectangle.graphics.beginFill("#99FF99").drawCircle(0,0, 32);
   
    
   enemy1.init( gameStage, AIRectangle, AIRectangle );
  enemy1.x=500;
    enemy1.y=300;
gameObjects.push(enemy1);
 
}

function runDan( dt )
{
  
    
}
