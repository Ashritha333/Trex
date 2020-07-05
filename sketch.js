var trex, trex_running, ground, groundImg,trex_collided;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var count=0;
var invisibleGround;
var clouds;
var obstacle1;
var obstacle2;
var obstacle3;
var obstacle4;
var obstacle5;
var obstacle6;
var gameOver, restart, gameOverimg, restartimg


var CloudsGroup, ObstaclesGroup;

function preload() {
  trex_running= loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImg=loadImage("ground2.png")
  clouds=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  gameOverimg=loadImage("gameOver.png");
  restartimg=loadImage("restart.png");
  
  
  
}
function setup() {
  createCanvas(600, 200);
  trex= createSprite(50,180,50,50);
  trex.addAnimation("trex", trex_running);
  trex.addAnimation("trex_collided", trex_collided);
  trex.scale=0.5;
   invisibleGround = createSprite(200,185,400,5);
invisibleGround.visible = false;
  
gameOver = createSprite(300,150);
restart = createSprite(300,160);
gameOver.addImage("gameOver",gameOverimg);
gameOver.scale = 0.5;
restart.addImage("restart",restartimg);
restart.scale = 0.5;
  gameOver.visible=false;
  restart.visible=false;


  
  ground=createSprite(200,180,400,20);
  ground.addImage("ground", groundImg);
  
  CloudsGroup = new Group();
  ObstaclesGroup = new Group();
}

function draw() {
  background("white");
  //display score
  text("Score: "+ count, 250, 100);
  //console.log(gameState);
  trex.collide(invisibleGround);
  drawSprites();
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count+Math.round(World.frameRate/30);
    //console.log(World.frameRate);
    
    if (count>0 && count%100 === 0){
      //playSound("checkPoint.mp3");
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space")){
      trex.velocityY = -12 ;
      //playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      //playSound("jump.mp3");
      gameState = END;
      //playSound("die.mp3");
    }
  }
    else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("trex_collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  if(mousePressedOver(restart)) {
    reset();
  }
  
  
  // end of play state
}  // end of draw()
function reset(){
gameState=PLAY;
count=0;
ObstaclesGroup.destroyEach();
CloudsGroup.destroyEach();
gameOver.visible=false;
restart.visible=false;
trex.changeAnimation("trex");
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(80,120);
    cloud.addImage("cloud", clouds);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 210;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}
function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,170,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
switch(rand){
  case 1: obstacle.addImage(obstacle1);
  break;
  case 2: obstacle.addImage(obstacle2);
  break;
  case 3: obstacle.addImage(obstacle3);
  break;
  case 4: obstacle.addImage(obstacle4);
  break;
  case 5: obstacle.addImage(obstacle5);
  break;
  case 6: obstacle.addImage(obstacle6);
  break;
  default:break;
}
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}
