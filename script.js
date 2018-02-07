// load the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "20px impact";

// sore and text that diplays/ controls if a new goal is loaded up
var score = 0;
var scoreText = false;
var shots = 10;// number of kicks
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
windImg.src = "images/nowind.png";

// a var to control if num of shots reduced
var kicked = false;

// ball passed through goal?
var goal = false;
var missed = false;
// goal pos params
var goalX = 880;
var goalY = 250;

// load images
var player = new Image();
player.src = "images/player.png";
var background = new Image();
background.src = "images/background.png";
var goalImg = new Image();
goalImg.src = "images/goal.png";

// load sounds, taken from freesoundproject
var kickSound = new Audio("sounds/musita182_soccer_kick.wav");
kickSound.volume = 0.2;
var cheerSound = new Audio("sounds/djnicke_crowd_cheering.wav");
cheerSound.volume = 0.03;
var oohSound = new Audio("sounds/schroedel_ooh.wav");
oohSound.volume = 0.03;

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
    if (shots == 20 && (y >= goalY + 50 && velY <= 0)) {
      gameOver();
    }
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // background image first
    ctx.drawImage(background, 0, 0);
    // put up text
    ctx.fillText("Score: " + score, 10, 20);
    ctx.drawImage(goalImg, goalX, goalY);
    ctx.drawImage(player, initX - 70, initY - 60);// put draw player image
    ctx.drawImage(windImg, 905, 400);
    drawBall();
    // redraw ball
    //drawBall();
    drawTargeter();
    hasScored();
    moveStopScore();
    console.log(shots);
    kicked == false;
    ctx.fillText("Shots: " + (20 - shots), 900, 20);
  }
}

// check if ball passes through goal posts
function hasScored() {
  if ((x > goalX && x < goalX + 35) && (y > goalY && y < goalY + 100)) {
    goal = true;
  }
}

// calc wind
function windCalc() {
  var windNum = Math.random();
  if (windNum > 0.75) {
    console.log("strong left wind");
    windImg.src = "images/slwind.png";
    wind = 0.02;
  } else if (windNum > 0.5) {
    console.log("weak left wind");
    windImg.src = "images/wlwind.png";
    wind = 0.01;
  } else if (windNum > 0.25) {
    console.log("weak right wind");
    windImg.src = "images/wrwind.png";
    wind = -0.01;
  } else {
    console.log("strong right wind");
    windImg.src = "images/srwind.png";
    wind = -0.02;
  }
}

// move the ball or check if a goal was scored and then adjust points etc
function moveStopScore() {
  if (kicked == true && y > goalY + 120 && velY < 0) {// if ball is moving downward and is below the goal turn kick off so ball stops moving and do score stuff
    shots += 1;
    console.log(shots + "shots");
    shotTaken = true;
    kicked = false;
    velY = 0;
    if (goal == true) {//once stopped if ball passed through goal then do score stuff
      score += 1;
      goal = false;
      scoreText = true;
      cheerSound.play();
      missed = true;
      } else if (missed == false) { //else play boo
        oohSound.play();
        missed = true;
      }
  }
  // move ball and apply gravity unless ball hits 'ground'
  else if (kicked == true && velY != 0) { // if ball is moving and was kicked
    velY -= grav;// reduce velY
    velX -= wind;
    x += velX;// move ball
    y -= velY;
  } 
  if (scoreText == true) {// if score text then print goal
      ctx.fillText("Goal!", 480, 20);
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
    initY = Math.floor(Math.random() * 300) + 200;
    y = initY;
    velX = 0;
    velY = 0;
    shotTaken = false;
    scoreText = false;
    missed = false;
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
