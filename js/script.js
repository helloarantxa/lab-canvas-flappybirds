const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

let gameOn = false;

let obstacleArray = [];

let animationId;
let obstacleId;

const background = new Image();
background.src = "./images/bg.png";

const fabbyImg = new Image();
fabbyImg.src = "./images/flappy.png";

const obstacleTopImg = new Image();
obstacleTopImg.src = "./images/obstacle_top.png";

const obstacleBottomImg = new Image();
obstacleBottomImg.src = "./images/obstacle_bottom.png";

const fabby = {
  x: 400,
  y: 200,
  width: 80,
  height: 56,
  speedX: 0,
  speedY: 0,
  gravity: 0.1,
  // gravitySpeed: 0,

  update() {
    if (this.y + this.height >= canvas.height) {
      this.y -= 20;
    }
    if (this.y <= 0) {
      this.y += 20;
    }
    if (this.speedY < 8) {
      this.speedY += this.gravity;
    } else {
      this.speedY = this.speedY;
    }
    this.y += this.speedY;
    ctx.drawImage(fabbyImg, this.x, this.y, this.width, this.height);
  },

  newPosition(event) {
    switch (event.code) {
      case "ArrowLeft":
        this.x -= 6;
        break;
      case "ArrowRight":
        this.x += 6;
        break;
      case "Space":
        if (this.speedY > -5) {
          this.speedY -= 5;
        }
        console.log("space");
        break;
    }
  },
};

class Obstacle {
  constructor() {
    this.x = canvas.width;
    this.gap = 150; // Decrease the gap between the top and bottom obstacles
    this.y = Math.random() * (canvas.height - this.gap);
    this.bottomY = this.y + this.gap;
  }

  update() {
    this.x -= 3;
  }

  draw() {
    ctx.drawImage(obstacleTopImg, this.x, this.y - obstacleTopImg.height);
    ctx.drawImage(obstacleBottomImg, this.x, this.bottomY);
  }
}

function generateObstacles() {
  obstacleArray.push(new Obstacle());
}

function checkCollision(obstacle) {
  const fabbyRight = fabby.x + fabby.width;
  const fabbyLeft = fabby.x;
  const fabbyTop = fabby.y;
  const fabbyBottom = fabby.y + fabby.height;

  const obstacleRight = obstacle.x + obstacleTopImg.width;
  const obstacleLeft = obstacle.x;
  const obstacleTop = obstacle.y - obstacleTopImg.height;
  const obstacleBottom = obstacle.bottomY;

  if (
    fabbyRight > obstacleLeft &&
    fabbyLeft < obstacleRight &&
    (fabbyTop < obstacleTop + obstacleTopImg.height ||
      fabbyBottom > obstacleBottom)
  ) {
    return true;
  }
  return false;
}

let frame = 0;
let score = 0;

function animationLoop() {
  ctx.clearRect(0, 0, 1200, 600);
  ctx.drawImage(background, 0, 0, 1200, 600);

  fabby.update();

  for (const obstacle of obstacleArray) {
    obstacle.update();
    obstacle.draw();

    if (checkCollision(obstacle)) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "48px serif";
      ctx.fillStyle = "white";
      ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
      clearInterval(animationId);
      clearInterval(obstacleId);
      console.log("Game Over");
      return;
    }
  }

  if (frame % 120 === 0) {
    generateObstacles();
  }

  obstacleArray.forEach((obstacle, i, arr) => {
    if (obstacle.x + obstacle.width < 0) {
      arr.splice(i, 1);
    }
    obstacle.update();
    obstacle.draw();
  });

  // Update the score and display it on the canvas
  score = Math.floor(frame / 120);
  ctx.font = "24px serif";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 20, 50);

  frame++;
  requestAnimationFrame(animationLoop);
}

function gameOver() {
  gameOn = false;

  // Clear the canvas and fill it with black color
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Display "GAME OVER" text in the center of the canvas
  ctx.font = "60px Arial";
  ctx.fillStyle = "White";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
}

function startGame() {
  gameOn = true;
  animationId = requestAnimationFrame(animationLoop);
  obstacleId = setInterval(generateObstacles, 4500); // Decrease time interval between obstacles
}

window.onload = function () {
  document.getElementById("start-button").onclick = function () {
    if (!gameOn) {
      let logo = document.getElementById("logo");
      logo.style.visibility = "hidden";
      logo.style.height = "0px";

      let container = document.getElementById("game-board");
      container.style.visibility = "visible";
      container.style.height = "600px";

      let gameBoard = document.getElementById("my-canvas");
      gameBoard.height = "600";
      gameBoard.width = "1200";

      startGame();
    }
  };

  document.addEventListener("keydown", (event) => {
    fabby.newPosition(event);
  });
};
