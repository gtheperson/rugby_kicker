var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "20px impact";

var score = 0;
var scoreText = false;

var kick = document.getElementById("kick");
document.getElementById("kick").addEventListener("click", kickFunc);

document.getElementById("new-shot").addEventListener("click", reset);

// ball vars
var ballRadius = 10;
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

var ballColour = "#875430";


// move ball in angle
var grav = 0.03;

// ball passed through goal?
var goal = false;
// goal param
var goalX = Math.floor(Math.random() * 200) + 200;
var goalY = Math.floor(Math.random() * 200) + 100;;

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
  
  ctx.beginPath();
  ctx.rect(goalX + 40, goalY - 70, 10, 100);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText("Score: " + score, 10, 20);
  // redraw ball
  //drawBall();
  // redraw goal
  drawGoal();
  //move ball in arc
  if (y < 310 && velY != 0) {
    velY -= grav;
    x += velX;
    y -= velY;
  }
  if ((x > goalX + 10 && x < goalX + 40) && (y > goalY - 70 && y < goalY)) {
    goal = true;
  }
  if (y > 310) {
    if (goal == true) {
      score += 1;
      goal = false;
      scoreText = true;
    }
  }
  if (scoreText == true) {

    ctx.fillText("Goal!", 300, 30);
  }
}

function xChanger(evt) {
  newVelX = evt.target.value / 100;
}

function yChanger(evt) {
  newVelY = evt.target.value / 100;
}

function kickFunc(evt) {
  velX = newVelX;
  velY = newVelY;
      console.log(velY, velX)
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