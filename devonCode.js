//Devon's Code

var movementSpeed=5;
var bulRep;
var SWORD=5, ROCKS=1, AXES=2, CROSSBOW=3, BOW_ARROW=4;
var currentWeapon;

function Character()
{
	CharacterObject.call( this );
	this.radius = 32;
    this.alignment=0;
    this.lastWeapon=SWORD;
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
    
    if(isKeyDown("Q"))
    {
        switch(this.lastWeapon)
        {
            case ROCKS:
                lastWeapon=SWORD;
                currentWeapon=SWORD;
                break;
            case AXES:
                lastWeapon=ROCKS;
                currentWeapon=ROCKS;
                break;
            case CROSSBOW:
                lastWeapon=AXES;
                currentWeapon=AXES;
                break;
            case BOW_ARROW:
                lastWeapon=CROSSBOW;
                currentWeapon=CROSSBOW;
                break;
            case SWORD:
                lastWeapon=BOW_ARROW;
                currentWeapon=BOW_ARROW;
                break;
        }
    }
    else if(isKeyDown("E"))
    {
        switch(this.lastWeapon)
        {
            case ROCKS:
                lastWeapon=AXES;
                currentWeapon=AXES;
                break;
            case AXES:
                lastWeapon=CROSSBOW;
                currentWeapon=CROSSBOW;
                break;
            case CROSSBOW:
                lastWeapon=BOW_ARROW;
                currentWeapon=BOW_ARROW;
                break;
            case BOW_ARROW:
                lastWeapon=SWORD;
                currentWeapon=SWORD;
                break;
            case SWORD:
                lastWeapon=ROCKS;
                currentWeapon=ROCKS;
                break;
        }
    }
}
Character.prototype.FireBullet = function()
{
    var bul=new Bullet(lastWeapon);
    var bulRep=new createjs.Shape();
    bulRep.graphics.beginFill("#1AF").drawCircle(10,10,10);
    bulRep.regX=10;
    bulRep.regY=10;
    var vec=new vector2D(getMouseXInGame()-this.x, getMouseYInGame()-this.y);
    var vec2=new vector2D(this.x, this.y);
    bul.init(gameStage, bulRep, bulRep, 500, vec, vec2, this.alignment);
    gameObjects.push(bul);
}
    
function Bullet(weaponType)
{
    GameObject.call(this);
    this.radius=10;
    this.alignment=2;
    this.representation;
    this.speed;
    this.vector;
    this.weaponType=weaponType;

	this.solid=false;
	this.markedForDestroy=false;
	this.type = TYPE_BULLET;
}

Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.collide = function( other )
{
    switch(other.type)
    {
        case TYPE_BULLET:
            break;
        case TYPE_CHARACTER:
            if(other.alignment!=this.alignment)
            {
                other.health-=10;
                this.markedForDestroy=true;
            }
            break;
        case TYPE_WALL:
            this.markedForDestroy=true;
            break;
        case TYPE_NOTHING:
            break;
    }
}

Bullet.prototype.init = function(stage, spriteRef, shadowRef, speedRef, vecRef, posRef, al)
{
    this.representation=spriteRef.clone();
    this.representation.x=posRef.x;
    this.representation.y=posRef.y;
    this.shadow=shadowRef.clone();
    this.shadow.x=posRef.x;
    this.shadow.y=posRef.y;
    this.speed=speedRef;
    
    this.alignment=al;
    
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

function overLay(h)
{
    this.height=h;
    this.width=800;
    this.offset=600-h;
    currentWeapon=0;
    
    this.container=new createjs.Container();
    
    this.background=new createjs.Shape();
    this.background.graphics.beginFill("#415454").drawRect(0, this.offset, this.width, this.height);
    
    this.weapon=weaponBow;
    this.weapon.x=600;
    this.weapon.y=this.offset;
    
    this.weaponSlot=new createjs.Shape();
    this.weaponSlot.graphics.beginStroke("#000");
    this.weaponSlot.graphics.setStrokeStyle(5);
    this.weaponSlot.graphics.beginFill("#000099").drawRoundRect(0, 0, 100,100,5);
    this.weaponSlot.x=600;
    this.weaponSlot.y=this.offset;
    
    this.HPBar=new createjs.Shape();
    this.HPBar.graphics.beginLinearGradientFill(["#23A31A","#145214"], [0,1],200,0,0,0).drawRoundRect(0, 0, 200, 50,5);
    this.HPBar.x=50;
    this.HPBar.y=this.offset+25;
    
    this.HPMaxBar=new createjs.Shape();
    this.HPMaxBar.graphics.beginLinearGradientFill(["#E62020","#800000"],[0,1],200,0,0,0).drawRoundRect(0,0,200,50,5);
    //beginLinearGradientFill([color1, color2], [0,1],50,0,0,130).drawRoundRect(0,0, 120, 120, 5);
    this.HPMaxBar.x=50;
    this.HPMaxBar.y=this.offset+25;
    
    this.container.addChild(this.background,this.weaponSlot, this.weapon, this.HPMaxBar, this.HPBar);
    
    uiStage.addChild(this.container);
    
    this.update=function(hp)
    {
        this.HPBar.scaleX=hp/100;
        
        switch(currentWeapon)
        {
            case 0:
                break;
            case SWORD:
                this.container.removeChild(this.weapon);
                this.weapon=weaponSword;
                this.weapon.x=600;
                this.weapon.y=this.offset;
                this.container.addChild(this.weapon);
                currentWeapon=0;
                break;
            case BOW_ARROW:
                this.weapon=weaponBow;
                currentWeapon=0;
                break;
            case CROSSBOW:
                this.weapon=weaponCrossbow;
                currentWeapon=0;
                break;
            case AXES:
                this.weapon=weaponAxe;
                currentWeapon=0;
                break;
            case ROCKS:
                this.weapon=weaponRock;
                currentWeapon=0;
                break;
        }
    }
}

var OL;
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
    
    OL=new overLay(100);
}

function runDevon( dt )
{   
    var playerFound=false;
    for(var i=0; i<gameObjects.length; i++)
    {
        if(gameObjects[i].type==TYPE_CHARACTER && gameObjects[i].alignment==0)
        {
            OL.update(gameObjects[i].health);
            playerFound=true;
        }
    }
    if(!playerFound)
        OL.update(0);
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