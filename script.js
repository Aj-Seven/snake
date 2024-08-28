const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const score_info = document.getElementById("score-info");

const box = 20; // Size of each snake segment and food
const gap = 2; // Gap between cells
const rows = Math.floor((560 - gap) / (box + gap)); // Number of rows in the grid
const cols = Math.floor((340 - gap) / (box + gap)); // Number of columns in the grid

let snake = [{ x: 9 * (box + gap), y: 9 * (box + gap) }]; // Starting position of the snake

let food = {
  x: Math.floor(Math.random() * cols) * (box + gap),
  y: Math.floor(Math.random() * rows) * (box + gap),
};

// `foodBoost` will appear when the score is an even number (2, 4, 6, 8, etc.)
let foodBoost = null;

let score = 0;
let d; // Direction
let getHighScore = localStorage.getItem("highScore") || 0;

document.addEventListener("keydown", direction);
const upElement = document.getElementById("up");
const downElement = document.getElementById("down");
const leftElement = document.getElementById("left");
const rightElement = document.getElementById("right");

function setDirection(newDirection) {
  // Logic to change the direction of the snake
  console.log("Direction set to:", newDirection);
}

// Add touchstart and click events for touch and mouse devices
function addTouchAndClickEvents(element, direction) {
  element.addEventListener("touchstart", () => setDirection(direction));
  element.addEventListener("click", () => setDirection(direction)); // for desktop mouse click
}

// Adding event listeners for all control elements
addTouchAndClickEvents(upElement, "UP");
addTouchAndClickEvents(downElement, "DOWN");
addTouchAndClickEvents(leftElement, "LEFT");
addTouchAndClickEvents(rightElement, "RIGHT");

function direction(event) {
  if (event.keyCode == 37 && d != "RIGHT") {
    d = "LEFT";
  } else if (event.keyCode == 38 && d != "DOWN") {
    d = "UP";
  } else if (event.keyCode == 39 && d != "LEFT") {
    d = "RIGHT";
  } else if (event.keyCode == 40 && d != "UP") {
    d = "DOWN";
  }
}

function setDirection(dir) {
  if (dir == "LEFT" && d != "RIGHT") {
    d = "LEFT";
  } else if (dir == "UP" && d != "DOWN") {
    d = "UP";
  } else if (dir == "RIGHT" && d != "LEFT") {
    d = "RIGHT";
  } else if (dir == "DOWN" && d != "UP") {
    d = "DOWN";
  }
}

function collision(newHead, snake) {
  for (let i = 0; i < snake.length; i++) {
    if (newHead.x == snake[i].x && newHead.y == snake[i].y) {
      return true;
    }
  }
  return false;
}

let cellStates = Array(rows)
  .fill()
  .map(() => Array(cols).fill("lightgreen"));
let highlightedCell = { row: -1, col: -1 }; // Initially, no cell is highlighted

function getCellCoordinates(x, y) {
  const col = Math.floor(x / (box + gap));
  const row = Math.floor(y / (box + gap));
  return { row, col };
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.fillStyle = "lightgreen";

      const x = col * (box + gap);
      const y = row * (box + gap);

      ctx.fillRect(x, y, box, box);
      ctx.beginPath();
      ctx.moveTo(0, 550);
      ctx.lineTo(330, 550);
      ctx.stroke();
    }
  }
}

function draw() {
  canvas.width = 330;
  canvas.height = 600;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "darkgray" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "black";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw the normal food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Draw the foodBoost if it exists
  if (foodBoost) {
    ctx.fillStyle = "orange";
    ctx.fillRect(foodBoost.x, foodBoost.y, box, box);
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box + gap;
  if (d == "UP") snakeY -= box + gap;
  if (d == "RIGHT") snakeX += box + gap;
  if (d == "DOWN") snakeY += box + gap;

  // Check if the snake eats normal food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    if (score > getHighScore) {
      localStorage.setItem("highScore", score);
    }

    // Generate new food
    food = {
      x: Math.floor(Math.random() * cols) * (box + gap),
      y: Math.floor(Math.random() * rows) * (box + gap),
    };

    // increment the score to x5 and generate `foodBoost`
    if (score % 5 === 0 && score !== 0) {
      foodBoost = {
        x: Math.floor(Math.random() * cols) * (box + gap),
        y: Math.floor(Math.random() * rows) * (box + gap),
      };

      // Remove `foodBoost` after 10 seconds if not eaten
      setTimeout(() => {
        foodBoost = null;
      }, 10000);
    }
  } else {
    snake.pop();
  }

  // Check if the snake eats the foodBoost
  if (foodBoost && snakeX == foodBoost.x && snakeY == foodBoost.y) {
    score += 5;
    foodBoost = null; // Remove the `foodBoost` after it's eaten
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= 550 ||
    collision(newHead, snake)
  ) {
    score_info.innerText = `Game Over\nYour Score is ${score}\nHigh Score is ${getHighScore}`;
    alert(`Game Over\nYour Score is ${score}\nHigh Score is ${getHighScore}`);
    clearInterval(game);
  }

  snake.unshift(newHead);

  // Display the score
  ctx.fillStyle = "green";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 5, canvas.height - 30);
  ctx.fillText("High Score: " + getHighScore, 5, canvas.height - 5);
}

let game = setInterval(draw, 300);
