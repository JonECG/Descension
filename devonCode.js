//Devon's Code

var movementSpeed=5;
var bulRep;

function Character()
{
	CharacterObject.call( this );
	this.radius = 32;
    this.alignment=0;
}

Character.prototype = Object.create(CharacterObject.prototype);
Character.prototype.constructor = Character;
Character.prototype.innerUpdate = function( dt )
{
	if(isKeyDown("W"))
       this.y-=movementSpeed;
    if(isKeyDown("S"))
        this.y+=movementSpeed;
    if(isKeyDown("A"))
        this.x-=movementSpeed;
    if(isKeyDown("D"))
        this.x+=movementSpeed;
    
    if(isMousePressed())
    {
        this.FireBullet();
    }
}
Character.prototype.FireBullet = function()
{
    var bul=new Bullet();
    var bulRep=new createjs.Shape();
    bulRep.graphics.beginFill("#1AF").drawCircle(10,10,10);
    bulRep.regX=10;
    bulRep.regY=10;
    var vec=new vector2D(getMouseXInGame()-this.x, getMouseYInGame()-this.y);
    var vec2=new vector2D(this.x, this.y);
    bul.init(gameStage, bulRep, bulRep, 500, vec, vec2);
    gameObjects.push(bul);
}
    
function Bullet()
{
    GameObject.call(this);
    this.radius=10;
    this.alignment=2;
    this.representation;
    this.speed;
    this.vector;

	this.solid=false;
	this.markedForDestroy=false;
	this.type = TYPE_BULLET;
}

Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.init = function(stage, spriteRef, shadowRef, speedRef, vecRef, posRef)
{
    this.representation=spriteRef.clone();
    this.representation.x=posRef.x;
    this.representation.y=posRef.y;
    this.shadow=shadowRef.clone();
    this.shadow.x=posRef.x;
    this.shadow.y=posRef.y;
    this.speed=speedRef;
    
    this.alignment=2;
    
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
    
    GameObject.prototype.update.call( this, dt );
    
    this.representation.x=this.x;
    this.representation.y=this.y;
}

function initDevon()
{
    bulRep=new Array();
    
    var Player = new Character();
	var charRep = new createjs.Shape();  //creates object to hold a shape
	charRep.graphics.beginFill("#1AF").drawCircle(32, 32, 32);  //creates circle at 0,0, with radius of 40
	charRep.regX = 32;
	charRep.regY = 32;
	Player.init( gameStage, charRep, charRep );
	gameObjects.push( Player );
}

function runDevon( dt )
{   

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
}