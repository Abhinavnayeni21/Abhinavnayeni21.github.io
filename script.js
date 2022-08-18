var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 1.5;
var ctx = canvas.getContext("2d");

var bricks = new Array(5);
for (var i = 0; i < bricks.length; i++) {
  bricks[i] = new Array(15);
  for (var j = 0; j < bricks[i].length; j++) {
    bricks[i][j] = true;
  }
}

var score = 0;
var brickWidth = canvas.width / 15;
var brickHeight = canvas.height / 30;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballRadius = canvas.width / 80;
var barWidth = canvas.width / 4;
var barHeight = canvas.height / 50;
var barX = (canvas.width - barWidth) / 2;
var barY = canvas.height / 1.15;
var ballYVelocity = (2 * canvas.height) / 620;
var ballXVelocity = 0;
var barVelocity = 0;

window.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    // Left
    barVelocity = -canvas.width / 100;
  } else if (event.keyCode == 39) {
    // Right
    barVelocity = canvas.width / 100;
  }
});
window.addEventListener("keyup", function (event) {
  barVelocity = 0;
});

function animate() {
  requestAnimationFrame(animate);
  // Clearing Screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Animations ---------------------------
  ballY += ballYVelocity;
  ballX += ballXVelocity;
  barX += barVelocity;

  // Update ---------------------------
  // Bricks
  const colours = ["blue", "green", "red", "orange"];
  var k = 0;
  for (var i = 0; i < bricks.length; i++) {
    for (var j = 0; j < bricks[i].length; j++) {
      if (bricks[i][j]) {
        ctx.fillStyle = colours[k % 4];
        ctx.fillRect(j * brickWidth, i * brickHeight, brickWidth, brickHeight);
      }
      k++;
    }
  }
  // ball
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  // Bar
  ctx.fillStyle = "red";
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // Collision Checks ---------------------------
  if (ballY + ballRadius >= canvas.height) {
    for (var i = 0; i < bricks.length; i++) {
      for (var j = 0; j < bricks[i].length; j++) {
        bricks[i][j] = false;
      }
    }
    ballYVelocity = 0;
    ballXVelocity = 0;
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You Lost...", canvas.width / 2, canvas.height / 2);
  }
  if (score == 75) {
    for (var i = 0; i < bricks.length; i++) {
      for (var j = 0; j < bricks[i].length; j++) {
        bricks[i][j] = false;
      }
    }
    ballYVelocity = 0;
    ballXVelocity = 0;
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You Won!", canvas.width / 2, canvas.height / 2);
  }
  if (barX <= 0 || barX + barWidth >= canvas.width) {
    barVelocity = 0;
  }
  if (ballX <= 0 || ballX >= canvas.width) {
    ballXVelocity *= -1;
  }
  if (ballY <= 0) {
    ballYVelocity *= -1;
  }
  if (
    ballY >= barY &&
    ballY <= barY + barHeight &&
    ballX >= barX &&
    ballX <= barX + barWidth
  ) {
    ballYVelocity *= -1;
    ballXVelocity = (ballX - (barX + barWidth / 2)) / 50;
  }

  for (var i = 0; i < bricks.length; i++) {
    for (var j = 0; j < bricks[i].length; j++) {
      if (bricks[i][j]) {
        if (ballX >= j * brickWidth && ballX <= j * brickWidth + brickWidth) {
          if (ballY <= (i + 1) * brickHeight) {
            bricks[i][j] = false;
            ballYVelocity *= -1;
            score++;
            document.getElementById("score").innerHTML = "Score: " + score;
          }
        }
      }
    }
  }
}

function reloadPage() {
  window.location.reload();
}
document.getElementById("startButton").onclick = reloadPage;

animate();
