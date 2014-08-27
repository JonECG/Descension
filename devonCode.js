//Devon's Code

var movementSpeed=5;
var bulRep;

function Player()
{
	CharacterObject.call( this );
	this.radius = 32;
}

Player.prototype = Object.create(CharacterObject.prototype);
Player.prototype.constructor = Player;
Player.prototype.innerUpdate = function( dt )
{
	if(isKeyDown("W"))
       this.y-=movementSpeed;
    if(isKeyDown("S"))
        this.y+=movementSpeed;
    if(isKeyDown("A"))
        this.x-=movementSpeed;
    if(isKeyDown("D"))
        this.x+=movementSpeed;
}

function initDevon()
{
    bulRep=new Array();
}

function runDevon( dt )
{   
    if(isMousePressed())
    {
        var bullet=new createjs.Shape();
        bullet.graphics.beginFill("#447").drawCircle(0,0,10);
        bullet.x=Player.x;
        bullet.y=Player.y;
        var vec=new vector2D(getMouseX()-Player.x, getMouseY()-Player.y);
        bulRep.push(new Bullet(vec, bullet));
        gameStage.addChild(bulRep[bulRep.length-1].bullet);
    }
    
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