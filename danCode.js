//Dan's Code

var AIRectangle;
var activated =false;
function initDan()
{
   AIRectangle = new createjs.Shape();
    AIRectangle.graphics.beginFill("#99FF99").drawRect(-10, -10, 20, 20);
    AIRectangle.x=500;
    AIRectangle.y=300;
    stage.addChild(AIRectangle);
}

function runDan( dt )
{
    AIRectangle.visible=true;
    if(!activated)
    {
        activate();
    }
    else
    {
        move();
    }
    
}
function activate()
{
    if(rectangleMan.x<= AIRectangle.x+65 && rectangleMan.x>= AIRectangle.x-65 &&
       rectangleMan.y<= AIRectangle.y+65 && rectangleMan.y>= AIRectangle.y-65 )
    {
        activated=true;
    }
}
function move()
{
  var velocityX=  normalized((rectangleMan.x-AIRectangle.x),length((rectangleMan.x-AIRectangle.x), (rectangleMan.y-AIRectangle.y)))*2;
    var velocityY=  normalized((rectangleMan.y-AIRectangle.y),length((rectangleMan.x-AIRectangle.x), (rectangleMan.y-AIRectangle.y)))*2;
    
    AIRectangle.x+=velocityX;
    AIRectangle.y+=velocityY;
    
}
function length(x, y)
{
  return Math.sqrt((x*x)+(y*y));
}



function normalized(data,length)
{
 return (data/length);

}