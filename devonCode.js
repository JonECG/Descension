//Devon's Code

var rectangleMan;
var movementSpeed=5;
var bulRep[];

function initDevon()
{
    rectangleMan=new createjs.Shape();
    rectangleMan.graphics.beginFill("#447").drawRect(0,0,20,20);
    rectangleMan.x=300;
    rectangleMan.y=100;
    stage.addChild(rectangleMan);
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
        bullet.graphics.beginFill("#447").drawCircle(0,0,40);
        var vec=new 2DVector(getMouseX()-rectangleMan.x, getMouseY-rectangleMan.y);
        bulRep.push(new Bullet(vec, bullet));
    }
    
    for(i=0; i<bulRep.length; i++)
    {
        
    }
}

function 2DVector(x,y)
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