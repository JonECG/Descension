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
        var bullet=new createjs.Shape();
        bullet.graphics.beginFill("#447").drawCircle(0,0,10);
        bullet.x=this.x;
        bullet.y=this.y;
        var vec=new vector2D(getMouseX()-this.x, getMouseY()-this.y);
        bulRep.push(new Bullet(vec, bullet));
        gameStage.addChild(bulRep[bulRep.length-1].bullet);
    }
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
	gameCharacters.push( Player );
}

function runDevon( dt )
{   
    for(i=0; i<bulRep.length; i++)
    {
        bulRep[i].bullet.x+=bulRep[i].vec2.x*dt;
        bulRep[i].bullet.y+=bulRep[i].vec2.y*dt;
    }
}

function removeBullet(index)
{
    gameStage.removeChild(bulRep[index].bullet);
    bulRep.splice(index, 1);
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

function Bullet(vector, bul, spd)
{
    this.vec2=vector;
    this.vec2.x=(this.vec2.x/this.vec2.length)*500;
    this.vec2.y=(this.vec2.y/this.vec2.length)*500;
    this.bullet=bul;
    this.speed=spd;
}