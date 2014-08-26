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
    stage.addChild(rectangleMan);
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
    
    if(isMouseDown())
    {
        console.log("BOOM");
        var bullet=new createjs.Shape();
        bullet.graphics.beginFill("#447").drawCircle(0,0,40);
        var vec=new vector2D(getMouseX()-rectangleMan.x, getMouseY-rectangleMan.y);
        bulRep.push(new Bullet(vec, bullet));
    }
    
    for(i=0; i<bulRep.length; i++)
    {
        bulRep[i].bul.x+=bulRep.vec2.x;
        bulRep[i].bul.y+=bulRep.vec2.y;
    }
}

function vector2D(x,y)
{
    this.x=x;
    this.y=y;
    this.shape=shape;
    this.getVector=function()
    {
        return "("+this.x+", "+this.y+")";
    }
}

function Bullet(vector, bul)
{
    this.vec2=vector;
    this.bullet=bul;
}