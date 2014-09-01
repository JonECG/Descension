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
    this.weaponChangeRate=0;
    this.ammo=[0,0,0,0];
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
    
    if(isMousePressed() && this.lastWeapon!=SWORD && this.ammo[this.lastWeapon-1]>0)
    {
        this.FireBullet();
        this.ammo[this.lastWeapon-1]--;
    }
    else if(isMousePressed() && this.lastWeapon==SWORD)
    {
        this.FireBullet();
    }
    
    if((isKeyDown("Q") || getMouseWheelDelta()<0) && this.weaponChangeRate>0.2)
    {
        switch(this.lastWeapon)
        {
            case ROCKS:
                this.lastWeapon=SWORD;
                currentWeapon=SWORD;
                break;
            case AXES:
                this.lastWeapon=ROCKS;
                currentWeapon=ROCKS;
                break;
            case CROSSBOW:
                this.lastWeapon=AXES;
                currentWeapon=AXES;
                break;
            case BOW_ARROW:
                this.lastWeapon=CROSSBOW;
                currentWeapon=CROSSBOW;
                break;
            case SWORD:
                this.lastWeapon=BOW_ARROW;
                currentWeapon=BOW_ARROW;
                break;
        }
        this.weaponChangeRate=0;
    }
    else if((isKeyDown("E") || getMouseWheelDelta()>0) && this.weaponChangeRate>0.2)
    {
        switch(this.lastWeapon)
        {
            case ROCKS:
                this.lastWeapon=AXES;
                currentWeapon=AXES;
                break;
            case AXES:
                this.lastWeapon=CROSSBOW;
                currentWeapon=CROSSBOW;
                break;
            case CROSSBOW:
                this.lastWeapon=BOW_ARROW;
                currentWeapon=BOW_ARROW;
                break;
            case BOW_ARROW:
                this.lastWeapon=SWORD;
                currentWeapon=SWORD;
                break;
            case SWORD:
                this.lastWeapon=ROCKS;
                currentWeapon=ROCKS;
                break;
        }
        this.weaponChangeRate=0;
        console.log(this.lastWeapon);
    }
    this.weaponChangeRate+=dt;
}
Character.prototype.FireBullet = function()
{
    var bul=new Bullet(this.lastWeapon, this.x, this.y);
    var bulRep=new createjs.Shape();
    bulRep.graphics.beginFill("#1AF").drawCircle(10,10,10);
    bulRep.regX=10;
    bulRep.regY=10;
    var vec=new vector2D(getMouseXInGame()-this.x, getMouseYInGame()-this.y);
    var vec2=new vector2D(this.x, this.y);
    
    switch(this.lastWeapon)
    {
        case SWORD:
            bul.init(gameStage, bulRep, bulRep, 500, vec, vec2, this.alignment);
            break;
        case ROCKS:
            bul.init(gameStage, bulRep, bulRep, 450, vec, vec2, this.alignment);
            break;
        case AXES:
            bul.init(gameStage, bulRep, bulRep, 500, vec, vec2, this.alignment);
            break;
        case BOW_ARROW:
            bul.init(gameStage, bulRep, bulRep, 800, vec, vec2, this.alignment);
            break;
        case CROSSBOW:
            bul.init(gameStage, bulRep, bulRep, 1000, vec, vec2, this.alignment);
            break;
    }
    gameObjects.push(bul);
}
Character.prototype.getAmmo=function(weaponType)
{
    return this.ammo[weaponType-1];
}
    
function Bullet(weaponType, bX, bY)
{
    GameObject.call(this);
    this.radius=10;
    this.alignment=2;
    this.representation;
    this.speed;
    this.vector;
    this.weaponType=weaponType;
    this.beginX=bX;
    this.beginY=bY;
    
    switch(weaponType)
    {
        case SWORD:
                this.pickUp=false;
                break;
            case ROCKS:
                this.pickUp=true;
                break;
            case BOW_ARROW:
                this.pickUp=false;
                break;
            case CROSSBOW:
                this.pickUp=false;
                break;
            case AXES:
                this.pickUp=true;
                break;
    }

	this.solid=false;
	this.markedForDestroy=false;
	this.type = TYPE_BULLET;
}

Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.collide = function( other )
{
    if( !this.markedForDestroy )
    switch(other.type)
    {
        case TYPE_BULLET:
            break;
        case TYPE_CHARACTER:
            if(other.alignment!=this.alignment)
            {
                switch(this.weaponType)
                {
                    case SWORD:
                        other.health-=15;
                        this.markedForDestroy=true;
                        break;
                    case ROCKS:
                        other.health-=5;
                        this.markedForDestroy=true;
                        if(Math.random()<0.6 && this.pickUp)
                        {
                            ammo = new AmmoPickup(this.weaponType-1, 1);
                            rep = new createjs.Shape();  //creates object to hold a shape
	                        rep.graphics.beginFill("#636363").drawCircle(0, 0, 10);
		                    ammo.init( gameStage, rep );
		                    ammo.x = this.x;
		                    ammo.y = this.y;
		                    gameObjects.push(ammo);
                        }
                        break;
                    case BOW_ARROW:
                        other.health-=30;
                        this.markedForDestroy=true;
                        break;
                    case CROSSBOW:
                        other.health-=50;
                        this.markedForDestroy=true;
                        break;
                    case AXES:
                        other.health-=15;
                        this.markedForDestroy=true;
                        if(Math.random()<0.6 && this.pickUp)
                        {
                            ammo = new AmmoPickup(this.weaponType-1, 1);
                            rep = new createjs.Shape();  //creates object to hold a shape
	                        rep.graphics.beginFill("#4F2C94").drawCircle(0, 0, 10);
		                    ammo.init( gameStage, rep );
		                    ammo.x = this.x;
		                    ammo.y = this.y;
		                    gameObjects.push(ammo);
                        }
                        break;
                }
            }
            break;
        case TYPE_WALL:
            if(this.pickUp)
            {
                switch(this.weaponType)
                {
                    case ROCKS:
                        if(Math.random()<0.2 && this.pickUp)
                        {
                            ammo = new AmmoPickup(this.weaponType-1, 1);
                            rep = new createjs.Shape();  //creates object to hold a shape
	                        rep.graphics.beginFill("#636363").drawCircle(0, 0, 10);
		                    ammo.init( gameStage, rep );
		                    ammo.x = this.x;
		                    ammo.y = this.y;
		                    gameObjects.push(ammo);
                        }
                        break;
                    case AXES:
                        if(Math.random()<0.2 && this.pickUp)
                        {
                            ammo = new AmmoPickup(this.weaponType-1, 1);
                            rep = new createjs.Shape();  //creates object to hold a shape
	                        rep.graphics.beginFill("#4F2C94").drawCircle(0, 0, 10);
		                    ammo.init( gameStage, rep );
		                    ammo.x = this.x;
		                    ammo.y = this.y;
		                    gameObjects.push(ammo);
                        }
                        break;
                }
            }
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
    
    if(this.weaponType==SWORD)
    {
        var check=new vector2D(this.beginX-this.x, this.beginY-this.y);
        if(check.length>80)
        {
            this.markedForDestroy=true;
        }
    }
    
    GameObject.prototype.update.call( this, dt );
    
    this.representation.x=this.x;
    this.representation.y=this.y;
}

function AmmoPickup(type, amount)
{
	Pickup.call( this );
    this.weaponType=type;
    this.amount=amount;
}

AmmoPickup.prototype = Object.create(Pickup.prototype);
AmmoPickup.prototype.constructor = AmmoPickup;
AmmoPickup.prototype.collide = function( other )
{
    if( !this.markedForDestroy )
	switch( other.type )
	{
		case TYPE_CHARACTER:
			if( other.alignment === 0 )
			{
				other.ammo[this.weaponType] += this.amount;
                
				this.markedForDestroy=true;
			}
		break;
	}
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
    
    this.weapon=weaponSword;
    this.weapon.x=400;
    this.weapon.y=this.offset;
    
    this.weaponSlot=new createjs.Shape();
    this.weaponSlot.graphics.beginStroke("#000");
    this.weaponSlot.graphics.setStrokeStyle(5);
    this.weaponSlot.graphics.beginFill("#000099").drawRoundRect(0, 0, 100,100,5);
    this.weaponSlot.x=400;
    this.weaponSlot.y=this.offset;
    
    this.HPBar=new createjs.Shape();
    this.HPBar.graphics.beginLinearGradientFill(["#23A31A","#145214"], [0,1],200,0,0,0).drawRoundRect(0, 0, 200, 50,5);
    this.HPBar.x=50;
    this.HPBar.y=this.offset+25;
    
    this.HPMaxBar=new createjs.Shape();
    this.HPMaxBar.graphics.beginLinearGradientFill(["#E62020","#800000"],[0,1],0,0,200,0).drawRoundRect(0,0,200,50,5);
    this.HPMaxBar.x=50;
    this.HPMaxBar.y=this.offset+25;
    
    this.AmmoText=new createjs.Text(100, "100px Arial", "#000");
    this.AmmoText.x=520;
    this.AmmoText.y=this.offset;
    
    this.container.addChild(this.background,this.weaponSlot, this.weapon, this.HPMaxBar, this.HPBar, this.AmmoText);
    
    uiStage.addChild(this.container);
    
    this.init=function()
    {
        this.container.removeChild(this.weapon);
        this.weapon=weaponSword;
        this.weapon.x=400;
        this.weapon.y=this.offset;
        this.container.addChild(this.weapon);
    }
    
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
                this.weapon.x=400;
                this.weapon.y=this.offset;
                this.container.addChild(this.weapon);
                currentWeapon=0;
                break;
            case BOW_ARROW:
                this.container.removeChild(this.weapon);
                this.weapon=weaponBow;
                this.weapon.x=400;
                this.weapon.y=this.offset;
                this.container.addChild(this.weapon);
                currentWeapon=0;
                break;
            case CROSSBOW:
                this.container.removeChild(this.weapon);
                this.weapon=weaponCrossbow;
                this.weapon.x=400;
                this.weapon.y=this.offset;
                this.container.addChild(this.weapon);
                currentWeapon=0;
                break;
            case AXES:
                this.container.removeChild(this.weapon);
                this.weapon=weaponAxe;
                this.weapon.x=400;
                this.weapon.y=this.offset;
                this.container.addChild(this.weapon);
                currentWeapon=0;
                break;
            case ROCKS:
                this.container.removeChild(this.weapon);
                this.weapon=weaponRock;
                this.weapon.x=400;
                this.weapon.y=this.offset;
                this.container.addChild(this.weapon);
                currentWeapon=0;
                break;
        }
    }
}

var OL;
function initDevon()
{
    bulRep=new Array();
    OL=new overLay(100);
}

function createPlayer()
{
    player = new Character();
}

function placePlayer()
{
    player.x=currentFloor.getActualCell(currentFloor.startX, currentFloor.startY).x;
    player.y=currentFloor.getActualCell(currentFloor.startX, currentFloor.startY).y;
    
    var charRep = new createjs.Shape();  //creates object to hold a shape
	charRep.graphics.beginFill("#1AF").drawCircle(32, 32, 32);  //creates circle at 0,0, with radius of 40
	charRep.regX = 32;
	charRep.regY = 32;

    player.init( gameStage, charRep, charRep );
    
    gameObjects.push( player );
    OL.init();
}

function placeAmmo()
{
    for( var i = 0; i < 20; i++ )
	{
        var swit=Math.random();
        
        if(swit<0.4)
        {
            //5
		    var ammo = new AmmoPickup(ROCKS-1, 5);
            var rep = new createjs.Shape();  //creates object to hold a shape
	        rep.graphics.beginFill("#636363").drawCircle(0, 0, 10);
		    ammo.init( gameStage, rep );
		    var cell = currentFloor.getRandomCell();
		    ammo.x = cell.x;
		    ammo.y = cell.y;
		    gameObjects.push(ammo);
        }
        else if(swit<0.45)
        {
            //2
            ammo = new AmmoPickup(CROSSBOW-1, 2);
            rep = new createjs.Shape();  //creates object to hold a shape
	        rep.graphics.beginFill("#633A1F").drawCircle(0, 0, 10);
		    ammo.init( gameStage, rep );
		    cell = currentFloor.getRandomCell();
		    ammo.x = cell.x;
		    ammo.y = cell.y;
		    gameObjects.push(ammo);
        }
        else if(swit<0.6)
        {
            //3
            ammo = new AmmoPickup(BOW_ARROW-1, 3);
            rep = new createjs.Shape();  //creates object to hold a shape
	        rep.graphics.beginFill("#E08346").drawCircle(0, 0, 10);
		    ammo.init( gameStage, rep );
		    cell = currentFloor.getRandomCell();
		    ammo.x = cell.x;
		    ammo.y = cell.y;
		    gameObjects.push(ammo);
        }
        else if(swit<1)
        {
            //3
             ammo = new AmmoPickup(AXES-1, 3);
            rep = new createjs.Shape();  //creates object to hold a shape
	        rep.graphics.beginFill("#4F2C94").drawCircle(0, 0, 10);
		    ammo.init( gameStage, rep );
		    cell = currentFloor.getRandomCell();
		    ammo.x = cell.x;
		    ammo.y = cell.y;
		    gameObjects.push(ammo);
        }
	}
}

function runDevon( dt )
{   
    var playerFound=false;
    for(var i=0; i<gameObjects.length; i++)
    {
        if(gameObjects[i].type==TYPE_CHARACTER && gameObjects[i].alignment==0)
        {
            OL.update(gameObjects[i].health);
            OL.AmmoText.text=player.getAmmo(player.lastWeapon);
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