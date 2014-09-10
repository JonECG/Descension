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
    minatuar.health=1000;
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
