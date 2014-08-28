//Dan's Code




function EnemyCharacter()
{
	CharacterObject.call( this );
	this.radius = 32;
    this.alignment=1;
    this.health=100;
    this.shoots=false;
    this.attackrate=15;
    this.wait=0;
}

EnemyCharacter.prototype = Object.create(CharacterObject.prototype);
EnemyCharacter.prototype.constructor = EnemyCharacter;
EnemyCharacter.prototype.innerUpdate = function( dt )
{
   
   
    
        this.activate();
    
}
EnemyCharacter.prototype.shoot=function(character)
{
    var bul=new Bullet();
    bul.alignment=1;
    var bulRep=new createjs.Shape();
    bulRep.graphics.beginFill("#FF0000").drawCircle(10,10,10);
    bulRep.regX=10;
    bulRep.regY=10;
    var vec=new vector2D(character.x-this.x, character.y-this.y);
    var vec2=new vector2D(this.x, this.y);
    bul.init(gameStage, bulRep, bulRep, 500, vec, vec2,1);
    gameObjects.push(bul);
}
EnemyCharacter.prototype.activate = function(dt)
{
    for(i=0;i<gameObjects.length;i++)
        {
            if(gameObjects[i].alignment!=this.alignment && gameObjects[i].type===TYPE_CHARACTER)
            {
                     if(this.shoots)
                    {
                        if(Math.sqrt( Math.pow( (gameObjects[i].x - this.x), 2 ) + Math.pow( (gameObjects[i].y - this.y), 2 ) )<350)
                        {
                            if(this.wait==this.attackrate)
                            {
                                this.shoot(gameObjects[i]);
                                 this.wait=0;
                            }
                            this.wait++;
                        }
                    }
                    else if(Math.sqrt( Math.pow( (gameObjects[i].x - this.x), 2 ) + Math.pow( (gameObjects[i].y - this.y), 2 ) )<200)
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
   
    enemy1= new EnemyCharacter();
    enemy1.shoots=true;
        enemy1.init( gameStage, AIRectangle, AIRectangle );
        enemy1.x=400;
        enemy1.y=100;
   
     gameObjects.push(enemy1);
    
//    for(i=0;i<10;i++)
//    {
//        enemy1= new EnemyCharacter();
//        enemy1.init( gameStage, AIRectangle, AIRectangle );
//        enemy1.x=500;
//        enemy1.y=300;
//        enemy1.shoots=true;
//        enemy1.x+=Math.random()*10;
//         enemy1.y+=Math.random()*10;
//        gameObjects.push(enemy1);
//    }
 
}

function runDan( dt )
{
  
    
}
