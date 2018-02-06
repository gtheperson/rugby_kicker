// load the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "20px impact";

// sore and text that diplays/ controls if a new goal is loaded up
var score = 0;
var scoreText = false;
var shots = 10;
var shotTaken = false;
var over = false;

// mouse coords
var mousePos = {
  x: initX,
  y: initY
};

// ball vars
var ballRadius = 10;
var ballColour = "#875430";
// ball coords
var initX = Math.floor(Math.random() * 700 + 50);
var x = initX;
var initY = Math.floor(Math.random() * 300) + 200;
var y = initY;
// ball movement
var velX = 0;
var velY = 0;
// inputed values from mouse pos on click
var velXInput = 0;
var velYInput = 0;
// for inputted values, transfered on click
var newVelX = 0;
var newVelY = 0;



// move ball in angle by reducing y velocity per frame
var grav = 0.03;

// wind that blows ball left or right
var wind = 0;// pos to slow, neg to speed
var windImg = new Image();
windImg.src = "nowind.png";

// a var to control if num of shots reduced
var kicked = false;

// ball passed through goal?
var goal = false;
// goal pos params
var goalX = 850;
var goalY = 300;

// load images
var player = new Image();
player.src = "player.png";

// load sounds, taken from freesoundproject
var kickSound = new Audio("261267__musita182__soccer-kick.wav");
var cheerSound = new Audio("410868__djnicke__crowd-cheering-and-clapping.wav");
var oohSound = new Audio("337724__schroedel__ooh-4.wav");

// functions
// functions for drawing
function drawBall() {
  // draw ball
  ctx.beginPath();
  ctx.ellipse(x, y, 15, 10, 135 * Math.PI/180, 0, 2 * Math.PI);
  ctx.fillStyle = ballColour;
  ctx.fill();
  ctx.closePath();
}

function drawGoal() {
  // draw left post
  ctx.beginPath();
  ctx.rect(goalX + 10, goalY, 30, 10);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
  // draw middle bar
  ctx.beginPath();
  ctx.rect(goalX, goalY - 70, 10, 100);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
  // draw the ball
  drawBall();
  // do this so the right post is after the ball, so the ball passes behind it
  // right post
  ctx.beginPath();
  ctx.rect(goalX + 40, goalY - 70, 10, 100);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

// draw targeting line
function drawTargeter() {
  if (mousePos.x > initX && mousePos.y < initY && shotTaken != true) {// in front of and above ball
    ctx.beginPath();
    ctx.moveTo(initX, initY);
    ctx.setLineDash([15, 15]);
    ctx.lineTo(Math.min(mousePos.x, initX + 275), Math.max(mousePos.y, initY - 275));
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#4c4a44";
    ctx.stroke();
    ctx.closePath();
  } else if (mousePos.x > initX && shotTaken != true) {
    ctx.beginPath();
    ctx.moveTo(initX, initY);
    ctx.setLineDash([15, 15]);
    ctx.lineTo(Math.min(mousePos.x, initX + 275), initY);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#4c4a44";
    ctx.stroke();
    ctx.closePath();
  } else if (mousePos.y < initY && shotTaken != true) {
    ctx.beginPath();
    ctx.moveTo(initX, initY);
    ctx.setLineDash([15, 15]);
    ctx.lineTo(Math.min(initX), Math.max(mousePos.y, initY - 275));
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#4c4a44";
    ctx.stroke();
    ctx.closePath();
  }
}

// draw everything in
function draw() {
  if (over == false) {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // put up text
    ctx.fillText("Score: " + score, 10, 20);
    ctx.drawImage(player, initX - 70, initY - 60);// put draw player image
    ctx.drawImage(windImg, 900, 400);
    // redraw ball
    //drawBall();
    // redraw goal
    drawGoal();
    drawTargeter();
    hasScored();
    moveStopScore();
    console.log(shots);
    kicked == false;
    ctx.fillText("Shots: " + (20 - shots), 900, 20);
    if (shots == 20 && (y >= goalY + 50 && velY <= 0)) {
      gameOver();
    }
  }
}

// check if ball passes through goal posts
function hasScored() {
  if ((x > goalX + 10 && x < goalX + 40) && (y > goalY - 70 && y < goalY)) {
    goal = true;
  }
}

// calc wind
function windCalc() {
  var windNum = Math.random();
  if (windNum > 0.75) {
    console.log("strong left wind");
    windImg.src = "slwind.png";
    wind = 0.02;
  } else if (windNum > 0.5) {
    console.log("weak left wind");
    windImg.src = "wlwind.png";
    wind = 0.01;
  } else if (windNum > 0.25) {
    console.log("weak right wind");
    windImg.src = "wrwind.png";
    wind = -0.01;
  } else {
    console.log("strong right wind");
    windImg.src = "srwind.png";
    wind = -0.02;
  }
}

// move the ball or check if a goal was scored and then adjust points etc
function moveStopScore() {
  // move ball and apply gravity unless ball hits 'ground'
  if (kicked == true && velY != 0) { // if ball is moving and was kicked
    velY -= grav;// reduce velY
    velX -= wind;
    x += velX;// move ball
    y -= velY;
  } 
  else { // otherwise check if a goal is scored
    if (goal == true) {
    score += 1;
    goal = false;
    scoreText = true;
    cheerSound.play();
    } else {
      oohSound.play();
    }
    if (scoreText == true) {// if score text then print goal
      ctx.fillText("Goal!", 300, 30);
    } 
  } // if the ball was kicked then reduce shots left
  if (kicked == true && y > goalY + 50 && velY < 0) {// if ball is moving downward and is below the goal turn kick off so ball stops moving and do score stuff
    shots += 1;
    console.log(shots + "shots");
    shotTaken = true;
    kicked = false;
  }
}

function kickFunc(evt) {
  // if stops repeat clicking to 'boost' ball
  if (velY == 0) {
    velX = newVelX;
    velY = newVelY;
    console.log("Kick Y " + velY + " kick x " + velX)
    kickSound.play();
  }// let it be known the ball was kicked, controls number of shots taken
  kicked = true;
}

function gameOver() {
  document.getElementsByClassName("game-over")[0].classList.add("vis");// make the game over and reset screen visible
  document.getElementById("score-span").innerHTML = score;
  over = true;// game over stops the draw function so can't keep clicking on kick etc.
}
// from clicking on new shot, realigns everything
function reset() {
  if (shotTaken == true) {
    initX = Math.floor(Math.random() * 700 + 50);
    x = initX;
    initY = Math.floor(Math.random() * 300) + 50;
    y = initY;
    velX = 0;
    velY = 0;
    shotTaken = false;
    scoreText = false;
    windCalc();
  }
}
// get mouse x and y
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
// when mouse is moved get its x and y, and assign values to velocities
canvas.addEventListener("mousemove", function(evt) {
  mousePos = getMousePos(canvas, evt);
  console.log(mousePos.x);
  console.log(mousePos.y + " mouse y");
  console.log("newvelX" + newVelX);
  console.log("newvelY " + newVelY);
});
// on click kick ball or reset with mouse params
canvas.addEventListener("click", function(evt) {
  if (shotTaken != true) {
    newVelX = (Math.min(mousePos.x - initX, 275) /30);
    newVelY = Math.min(275, initY - mousePos.y) / 30;
    kickFunc();
    console.log("kick");
  } else {
    reset();
  }
});

// performs draw func every 10milsec

setInterval(draw, 10);
