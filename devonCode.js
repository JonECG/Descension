//Devon's Code

var rectangleMan;
var movementSpeed=5;
var bulRep;

function initDevon()
{
    rectangleMan=new createjs.Shape();
    rectangleMan.graphics.beginFill("#447").drawRect(0,0,20,20);
    rectangleMan.x=300;
    rectangleMan.y=100;
    gameStage.addChild(rectangleMan);
    bulRep=new Array();
}

function runDevon( dt )
{
    rectangleMan.visible=true;
    if(isKeyDown("W"))
       rectangleMan.y-=movementSpeed;
    if(isKeyDown("S"))
        rectangleMan.y+=movementSpeed;
    if(isKeyDown("A"))
        rectangleMan.x-=movementSpeed;
    if(isKeyDown("D"))
        rectangleMan.x+=movementSpeed;
    
    if(isMousePressed())
    {
        var bullet=new createjs.Shape();
        bullet.graphics.beginFill("#447").drawCircle(0,0,10);
        bullet.x=rectangleMan.x;
        bullet.y=rectangleMan.y;
        var vec=new vector2D(getMouseX()-rectangleMan.x, getMouseY()-rectangleMan.y);
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