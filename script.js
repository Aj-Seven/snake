const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const score_info = document.getElementById("score-info");

const box = 20; // Size of each snake segment and food
const gap = 2; // Gap between cells
const rows = Math.floor((canvas.height - gap) / (box + gap)); // Number of rows in the grid
const cols = Math.floor((canvas.width - gap) / (box + gap)); // Number of columns in the grid

let snake = [{ x: 9 * (box + gap), y: 9 * (box + gap) }]; // Starting position of the snake

let food = {
  x: Math.floor(Math.random() * cols) * (box + gap),
  y: Math.floor(Math.random() * rows) * (box + gap),
};

let score = 0;
let d; // Direction
let getHighScore = localStorage.getItem("highScore") || 0;

document.addEventListener("keydown", direction);
document
  .getElementById("up")
  .addEventListener("click", () => setDirection("UP"));
document
  .getElementById("down")
  .addEventListener("click", () => setDirection("DOWN"));
document
  .getElementById("left")
  .addEventListener("click", () => setDirection("LEFT"));
document
  .getElementById("right")
  .addEventListener("click", () => setDirection("RIGHT"));

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
  // Clear the canvas
  ctx.clearRect(220, 0, canvas.width, canvas.height);

  // Draw the grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Set the background color based on the state
      ctx.fillStyle = cellStates[row][col];

      // Calculate the position of each cell
      const x = col * (box + gap);
      const y = row * (box + gap);

      // Draw the cell
      ctx.fillRect(x, y, box, box);
    }
  }
}

function draw() {
  canvas.width = window.innerWidth - 100;
  canvas.height = window.innerHeight - 350;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "darkgray" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "black";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box + gap;
  if (d == "UP") snakeY -= box + gap;
  if (d == "RIGHT") snakeX += box + gap;
  if (d == "DOWN") snakeY += box + gap;

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    if (score > getHighScore) {
      localStorage.setItem("highScore", score);
    }
    food = {
      x: Math.floor(Math.random() * cols) * (box + gap),
      y: Math.floor(Math.random() * rows) * (box + gap),
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    score_info.innerText = `Game Over\nYour Score is ${score}`;
    alert(`Game Over\nYour Score is ${score}`);
    clearInterval(game);
  }

  // Reset the previously highlighted cell if there is one
  if (highlightedCell.row !== -1 && highlightedCell.col !== -1) {
    cellStates[highlightedCell.row][highlightedCell.col] = "lightgreen";
  }

  // Highlight the cell where the snake's head is
  const { row, col } = getCellCoordinates(snakeX, snakeY);
  if (row >= 0 && row < rows && col >= 0 && col < cols) {
    cellStates[row][col] = "green";
    highlightedCell = { row, col };
  }

  snake.unshift(newHead);

  let highScore = localStorage.getItem("highScore") || 0;
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 5, canvas.height - 25);
  ctx.fillText("High Score: " + highScore, 5, canvas.height - 5);
}

let game = setInterval(draw, 120);
