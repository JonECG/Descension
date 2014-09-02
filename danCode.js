//Dan's Code




function EnemyCharacter()
{
	CharacterObject.call( this );
	this.radius = 32;
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
    
}

EnemyCharacter.prototype = Object.create(CharacterObject.prototype);
EnemyCharacter.prototype.constructor = EnemyCharacter;
EnemyCharacter.prototype.innerUpdate = function( dt )
{
   
   
    
        this.activate();
    
}
EnemyCharacter.prototype.shoot=function(character)
{
    var bul=new Bullet(this.weaponType,this.x,this.y);
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
                        if(Math.sqrt( Math.pow( (gameObjects[i].x - this.x), 2 ) + Math.pow( (gameObjects[i].y - this.y), 2 ) )<this.range)
                        {
                            if(!segmentIntersectsFloor(gameObjects[i].x, gameObjects[i].y, this.x, this.y ))
                            {
                                this.isActive=true;
                                this.targetX=gameObjects[i].x;
                                this.targetY=gameObjects[i].y;
                                if(this.wait==this.attackrate)
                                {
                                    this.shoot(gameObjects[i]);
                                     this.wait=0;
                                }
                                this.wait++;
                            }
                           
                        }
                        if(this.isActive)
                        {
                            var distance=length(gameObjects[i].x,gameObjects[i].y)-length(this.x,this.y);
                            
                            if(segmentIntersectsFloor(gameObjects[i].x, gameObjects[i].y, this.x, this.y ))
                            {
                                this.move(this.targetX,this.targetY);
                            }
                        }
                    }
                    else if(Math.sqrt( Math.pow( (gameObjects[i].x - this.x), 2 ) + Math.pow( (gameObjects[i].y - this.y), 2 ) )<200|| this.isActive)
                    {
                        if(!segmentIntersectsFloor(gameObjects[i].x, gameObjects[i].y, this.x, this.y ))
                            {
                                this.targetX=gameObjects[i].x;
                                this.targetY=gameObjects[i].y;
                            this.isActive=true;
                            this.move(this.targetX,this.targetY);
                            }
                        
                    }
                if(this.isActive)
                {
                     this.move(this.targetX,this.targetY);
                }
                
            }
        }
}

EnemyCharacter.prototype.move=function(posX,posY)  
{
    
  var velocityX=  normalized((posX-this.x),length((posX-this.x), (posY-this.y)))*this.movement;
    var velocityY=  normalized((posY-this.y),length((posX-this.x), (posY-this.y)))*this.movement;
    var lastX=this.x;
    var lastY=this.y;
    this.x+=velocityX;
    this.y+=velocityY;
//    var d1=Math.sqrt(Math.pow(this.x-lastX,2)+Math.pow(this.Y-lastY,2));
//    var d2=Math.sqrt(Math.pow((lastX+velocityX)-lastX,2)+Math.pow((lastY+velocityY)-lastY,2));
//    if(d1!=d2)
//    {
//        var tempX=(lastX+velocityX)-this.x;
//         var tempY=(lastY+velocityY)-this.y;
//        var normalizedX=normalized(tempX,length(tempX,tempY));
//        var normalizedY=normalized(tempY,length(tempX,tempY));
//                                  
//            velocityX= normalizedX* (d1-d2);  
//            velocityY= normalizedY* (d1-d2);  
//              
//                  this.x+=velocityX;
//                this.y+=velocityY;
//                 }
//   
    
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
}
function placeEnemies()
{
      
    
    
     var enemy1= new EnemyCharacter();
  var AIRectangle = new createjs.Shape();
        AIRectangle.graphics.beginFill("#99FF99").drawCircle(0,0, 32);

  
   
    for(i=0;i<20;i++)
    {
        enemy1= new EnemyCharacter();
         enemy1.shoots=true;
        enemy1.init( gameStage, AIRectangle, AIRectangle );
        enemy1.x=currentFloor.getRandomEmptyCell().x;
        enemy1.y=currentFloor.getRandomEmptyCell().y;
        var weaponRan=Math.random()*10;
        if(weaponRan<6)
        {
            enemy1.weaponType=SWORD;
        }
        else if(weaponRan<7)
        {
            enemy1.weaponType=ROCKS;
        }
        else if(weaponRan<8)
        {
            enemy1.weaponType=AXES;
        }
        else if(weaponRan<9)
        {
            enemy1.weaponType=BOW_ARROW;
        }
        else
        {
            enemy1.weaponType=CROSSBOW;
        }
        for(j=0;j<gameObjects.length;j++)
        {
            if(gameObjects[j].alignment!=enemy1.alignment && gameObjects[j].type===TYPE_CHARACTER)
            {
               
                while(!segmentIntersectsFloor(gameObjects[j].x, gameObjects[j].y, enemy1.x, enemy1.y ))
                      {
                             enemy1.x=currentFloor.getRandomEmptyCell().x;
                            enemy1.y=currentFloor.getRandomEmptyCell().y;
                      
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
    minatuar.init( gameStage, AIRectangle, AIRectangle );
    minatuar.maxHealth=1000;
    minatuar.health=1000;
    minatuar.weaponType=AXES;
    minatuar.attackrate=20;
     minatuar.movement=4;
    minatuar.movement*=.8;
    minatuar.radius=100;
    minatuar.range=500;
    gameObjects.push(minatuar);
}
function runDan( dt )
{
  if(minatuar&&minatuar.health<=0)
      gameState = WIN;
    
}
