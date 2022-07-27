/* Sasha Willden
  14/12/2018 */


var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var flagpole;
var game_score;
var life;

var jumpSound;
var coinSound;
var walkingSound;
var life_lostSound;

//////////////// SOUND DISABLED ////////////////// 
function preload()
{
//    soundFormats("mp3","wav");
//    
//    jumpSound = loadSound("\assets\jump.wav");
//    jumpSound.setVolume(0.1);
//    
//    coinSound = loadSound("\assets\coin.wav");
//    coinSound.setVolume(0.1);
//    
//    walkingSound = loadSound("\assets\walking.wav");
//    walkingSound.setVolume(0.1);
//    
//    life_lostSound = loadSound("\assets\life_lost.wav");
//    life_lostSound.setVolume(0.1);
//}
}

function setup()
{
	createCanvas(1024, 576);
    
    floorPos_y = height * 3/4;
    
    life = 4;
    
    startgame();
}

//Startgame function and contents for startgame
function startgame()
{
//  Game Charaters x and y position on screen for width and floor
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    
    
//  Position of the scroll
	scrollPos = 0;
    

//  Charater only on the x axis in the game from scroll position
	gameChar_world_x = gameChar_x - scrollPos;
    
//  Charater does not move automatically, hence false
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

//  tree locations array
    trees_x = [500, 352, 488, 852, 1024, 1700];
    
//  clouds locations, positions, width and size
    clouds = [
        {pos_x: 200, pos_y: 200, width: 50, size: 10},
        {pos_x: 250, pos_y: 200, width: 70, size: 10},
        {pos_x: 300, pos_y: 200, width: 60, size: 10}
    ];

//   mountain locations positions
     mountains = [
        {pos_x:0, pos_y: 180},
        {pos_x:1400, pos_y: 180},
	    {pos_x:950, pos_y: 180},
	    {pos_x:1800, pos_y: 180},
    ];

//  canyon locations positions on x axis and the width 
    canyon = [
        {pos_x:1950, width:100},
        {pos_x:223, width: 100},
        {pos_x: - 400, width: 100}
    ];

//  collectable locations positions, size and isfound
    collectable = [
        {pos_x:220, pos_y:406, size: 47, isFound: false},
        {pos_x:940, pos_y:406, size: 47, isFound: false},
        {pos_x:1300, pos_y:406, size: 47, isFound: false},
        {pos_x:1543, pos_y:406, size: 47, isFound: false},
    ];
    
    
//  Game score number at the start
    game_score = 0;
    
//  Flag pole location position and isreached
    flagpole = {
        pos_x: 2500,
        isReached: false
    }
    
//  Life deducts one life   
    life -= 1;
}

function draw()
{
	background(100, 155, 255);

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4);
    push();
    translate(scrollPos,0);

    drawClouds();
    drawMountains();
    drawTrees();
    
    for(var i = 0; i < collectable.length; i++)
    {   
        if(!collectable[i].isFound)
        {
            drawCollectable(collectable[i]);
            checkCollectable(collectable[i]);
        }
    }

    for(var i = 0; i < canyon.length; i++)
    {
        {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
        }
    }
    
    if(!checkFlagpole.isReached)
    {
        checkFlagpole(flagpole);
    }
    renderFlagpole(flagpole);

    pop();
    
	drawGameChar();
    
    fill(255);
    noStroke();
    
    text("score:" + game_score, 20,20);
    
    for(var i = 0; i < life; i++)
    {
        fill(255, 0, 0);
        rect(5*[i]*5, 30, 10, 10, 10);
    }

    if(life < 1)
    {
        text("Game over. Press space to continue.", width/2 - 100, height/2);
        return;
    }
    
    if(flagpole.isReached)
    {
        text("Level complete. Press space to continue.", width/2 - 100, height/2);
        return;
    }

    if(gameChar_y > height)
    {
        if(life > 0) startgame();
        {
//            if(life -= 0) life_lostSound.play();
        }
    }

	if(isLeft)
	{
        if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
        if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5;
		}
	}

    if(gameChar_y < floorPos_y)
    {
        gameChar_y += 2;
        isFalling = true;
    }
    else
    {
        isFalling = false;
    }
    
    if(isPlummeting)
    {
        gameChar_y += 0;
        isPlummeting = false;
    }

	gameChar_world_x = gameChar_x - scrollPos;
}

function keyPressed()
{
    
    if(flagpole.isReached && key == " ")
    {
        nextLevel();
        return
    }
    else if(life == 0 && key == " ")
    {
        returnToStart();
        return
    }
    
    if(keyCode == 37)
    {
        isLeft = true;
//        walkingSound.loop();
    }
    
    if(keyCode == 39)
    {
//        walkingSound.loop();
        isRight = true;
    }
    
    if (keyCode == 32 && gameChar_y >= floorPos_y)
    {
        isFalling = true
		gameChar_y = gameChar_y - 100;
//        jumpSound.play();
	}
}

function keyReleased()
{
    if(keyCode == 37)
    {
//        walkingSound.stop();
        isLeft = false;
    }
    
    if(keyCode == 39)
    {
//        walkingSound.stop();
        isRight = false;
    }
    
    if(keyCode == 32)
    {
        isPlummeting = false;
    }
    
    if(flagpole.isReached != true)
    {
        checkFlagpole();
    }
}

function drawGameChar()
{
    if(isLeft && isFalling)
	{
        fill(153,153,153);
        arc(gameChar_x + 08, gameChar_y +0, 15, 15, PI, TWO_PI);
        fill(3,100,191);
        rect(gameChar_x + -10, gameChar_y - 40, 20,37);
        fill(255,224,189);
        ellipse(gameChar_x, gameChar_y - 50, 25,40);
        rect(gameChar_x - 20, gameChar_y - 30, 10,15);
        fill(153,153,153);
        arc(gameChar_x + -08, gameChar_y -08, 15, 15, PI, TWO_PI);
	}
	else if(isRight && isFalling)
	{
        fill(153,153,153);
        arc(gameChar_x + -08, gameChar_y +0, 15, 15, PI, TWO_PI);
        fill(3,100,191);
        rect(gameChar_x + -10, gameChar_y - 40, 20,37);
        fill(255,224,189);
        ellipse(gameChar_x, gameChar_y - 50, 25,40);
        rect(gameChar_x + 10, gameChar_y - 30, 10,15);
        fill(153,153,153);
        arc(gameChar_x + 08, gameChar_y -08, 15, 15, PI, TWO_PI);
	}
	else if(isLeft)
	{
        fill(3,100,191);
        rect(gameChar_x + -10, gameChar_y - 40, 20,40);
        fill(255,224,189);
        ellipse(gameChar_x, gameChar_y - 50, 25,40);
        rect(gameChar_x +05, gameChar_y - 25, 05,15);
        fill(153,153,153);
        arc(gameChar_x + -08, gameChar_y -0, 30, 15, PI, TWO_PI);
        fill(225);
        arc(gameChar_x + 08, gameChar_y -0, 15, 15, PI, TWO_PI);
	}
	else if(isRight)
	{
        fill(3,100,191);
        rect(gameChar_x + -10, gameChar_y - 40, 20,40);
        fill(255,224,189);
        ellipse(gameChar_x, gameChar_y - 50, 25,40);
        rect(gameChar_x - 10, gameChar_y - 25, 05,15);
        fill(153,153,153);
        arc(gameChar_x + 08, gameChar_y -0, 30, 15, PI, TWO_PI);
        fill(225);
        arc(gameChar_x + -08, gameChar_y -0, 15, 15, PI, TWO_PI);
	}
	else if(isFalling || isPlummeting)
	{
        fill(3,100,191);
        rect(gameChar_x + -15, gameChar_y - 40, 30,40);
        fill(255,224,189);
        rect(gameChar_x + 14, gameChar_y - 40, 11,20);
        rect(gameChar_x - 24, gameChar_y - 40, 10,20);
        ellipse(gameChar_x, gameChar_y - 50, 35);
        fill(153,153,153);
        arc(gameChar_x + -08, gameChar_y -05, 15, 15, PI, TWO_PI);
        arc(gameChar_x + 08, gameChar_y -05, 15, 15, PI, TWO_PI);
	}
	else
	{
        fill(3,100,191);
        rect(gameChar_x + -15, gameChar_y - 40, 30,40);
        fill(255,224,189);
        rect(gameChar_x + 14, gameChar_y - 40, 11,30);
        rect(gameChar_x - 24, gameChar_y - 40, 10,30);
        ellipse(gameChar_x, gameChar_y - 50, 35);
        fill(225);
        arc(gameChar_x + -08, gameChar_y -0, 15, 15, PI, TWO_PI);
        arc(gameChar_x + 08, gameChar_y -0, 15, 15, PI, TWO_PI);
	}
}

function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
            fill(255,255,255);
            ellipse(clouds[i].pos_x + 10, clouds[i].pos_y - 85, clouds[i].width);
            ellipse(clouds[i].pos_x + 255, clouds[i].pos_y -50, clouds[i].width);
            ellipse(clouds[i].pos_x + 450, clouds[i].pos_y - 25, clouds[i].width);
            ellipse(clouds[i].pos_x + 600, clouds[i].pos_y - 120, clouds[i].width);
    }
}

function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        fill(125,120,105);
        triangle(mountains[i].pos_x, mountains[i].pos_y, 
                 mountains[i].pos_x - 100, mountains[i].pos_y + 253, 
                 mountains[i].pos_x + 100, mountains[i].pos_y + 253);
        
        fill(105,105,105);
        triangle(mountains[i].pos_x - 100, mountains[i].pos_y - 50, 
                 mountains[i].pos_x - 250, mountains[i].pos_y + 253, 
                 mountains[i].pos_x + 50, mountains[i].pos_y + 253);
        
        fill(255,255,255);
        triangle(mountains[i].pos_x - 100, mountains[i].pos_y - 63, 
                 mountains[i].pos_x - 137, mountains[i].pos_y + 25, 
                 mountains[i].pos_x - 63, mountains[i].pos_y + 25);
    }
}

function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(139,69,19);
        rect(trees_x[i] -15, -85 +floorPos_y,30,85);
            
        fill(0,180,0);
        ellipse(trees_x[i] -15, +floorPos_y -80,100,50);
        ellipse(trees_x[i] + 10, +floorPos_y -80,70,70);
        ellipse(trees_x[i] + 10, +floorPos_y -80,100,60);
        ellipse(trees_x[i] -10, +floorPos_y -98,70,70);
    }
}

function drawCanyon(t_canyon)
{
        fill(100, 155, 255);
        noStroke();
        rect(t_canyon.pos_x, 432, t_canyon.width, 432);
}

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.pos_x && gameChar_world_x < t_canyon.pos_x + t_canyon.width)
    {
        isPlummeting = true;
        gameChar_y += 2;
    }
}

function renderFlagpole()
{
    push();
    stroke(150);
    strokeWeight(5);
    line(flagpole.pos_x, floorPos_y, flagpole.pos_x, floorPos_y - 200);
    
    if(flagpole.isReached)
    {	
	   noStroke();
	   fill(255,0,255);
	   rect(flagpole.pos_x, floorPos_y - 200, 50, 50);
    }
    else
    {
        noStroke();
        fill(255,0,255);
        rect(flagpole.pos_x, floorPos_y - 50, 50, 50);
    }
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.pos_x);
    
    if(d < 50)
    {
        flagpole.isReached = true;
    }
}

function drawCollectable(t_collectable)
{
    if(t_collectable.isFound == false)
    {
        noFill();
        strokeWeight(6);
        stroke(220,185,0);
        ellipse(t_collectable.pos_x, t_collectable.pos_y, t_collectable.size);
        
        fill(225,0,225);
        stroke(225);
        strokeWeight(1);
    }
    
}

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.pos_x, t_collectable.pos_y) < t_collectable.size)
    {
        t_collectable.isFound = true;
        game_score += 1;
//        coinSound.play();
    }
}