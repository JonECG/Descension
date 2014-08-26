//Devon's Code

var rectangleMan;
var movementSpeed=5;

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
}