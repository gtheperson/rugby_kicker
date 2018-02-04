// load the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "20px impact";

// sore and text that diplays/ controls if a new goal is loaded up
var score = 0;
var scoreText = false;
var shots = 10;
var over = false;

// keep an eye on the kick button for launching the ball
var kick = document.getElementById("kick");
document.getElementById("kick").addEventListener("click", kickFunc);

// give the player the ball back, if they'd scored generate new goal pos
document.getElementById("new-shot").addEventListener("click", reset);

// ball vars
var ballRadius = 10;
var ballColour = "#875430";
// ball coords
var x = 75;
var y = 300;
// ball movement
var velX = 0;
var velY = 0;
var velXInput = document.getElementById("strength");
var velYInput = document.getElementById("angle");
var newVelX = document.getElementById("strength").value / 100;
var newVelY = document.getElementById("angle").value / 100;

// listeners for inputs
velXInput.oninput = xChanger;
velYInput.oninput = yChanger;


// move ball in angle by reducing y velocity per frame
var grav = 0.03;

var kicked = false;

// ball passed through goal?
var goal = false;
// goal params
var goalX = Math.floor(Math.random() * 500) + 200;
var goalY = Math.floor(Math.random() * 200) + 100;;

// load images
var player = new Image();
player.src = "player.png";

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
  ctx.beginPath();
  ctx.rect(goalX + 10, goalY, 30, 10);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
  
  ctx.beginPath();
  ctx.rect(goalX, goalY - 70, 10, 100);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();

  drawBall();
  // do this so the right post is after the ball, so the ball is behind it
  ctx.beginPath();
  ctx.rect(goalX + 40, goalY - 70, 10, 100);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

// draw everything in
function draw() {
  if (over == false) {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("Shots: " + (20 - shots), 800, 20);
    ctx.drawImage(player, 0, 250);
    // redraw ball
    //drawBall();
    // redraw goal
    drawGoal();
    hasScored();
    moveStopScore();
    console.log(shots);
    kicked == false;
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

// move the ball or check if a goal was scored and then adjust points etc
function moveStopScore() {
  // move ball and apply gravity unless ball hits 'ground'
  if ((y < goalY + 50 && y < 300) || velY > 0) { // if ball is above goal ground or moving up (so been kicked from bellow goal ground)
    velY -= grav;// reduce velY
    x += velX;// move ball
    y -= velY;
  } 
  else { // otherwise check if a goal is scored
    if (goal == true) {
    score += 1;
    goal = false;
    scoreText = true;
    }// if score text then print goal
    if (scoreText == true) {
      ctx.fillText("Goal!", 300, 30);
    } 
  } // if the ball was kicked then reduce shots left
  if (kicked == true) {
  shots += 1;
  kicked = false;
  }
}

// functions for controlling inputted paramters
function xChanger(evt) {
  newVelX = evt.target.value / 100;
}

function yChanger(evt) {
  newVelY = evt.target.value / 100;
}

function kickFunc(evt) {
  // if stops repeat clicking to 'boost' ball
  if (velY == 0) {
    velX = newVelX;
    velY = newVelY;
    console.log(velY, velX)
  }// let it be known the ball was kicked, controls number of shots taken
  kicked = true;
}

function gameOver() {
  document.getElementsByClassName("game-over")[0].classList.add("vis");
  document.getElementById("score-span").innerHTML = score;
  over = true;// game over stops the draw function so can't keep clicking on kick etc.
}

function reset() {
  x = 75;
  y = 300;
  velY = 0;
  velX = 0;
  if (scoreText == true) {
    goalX = Math.floor(Math.random() * 200) + 200;
    goalY = Math.floor(Math.random() * 200) + 100;
    scoreText = false;
  }
}

// performs draw func every 10milsec

setInterval(draw, 10);